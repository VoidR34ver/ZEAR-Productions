/* ZEAR Studios API: one Cloudflare Worker, no dependencies.

   POST /feedback                   saves a feedback form as a text file in a GitHub repo
   GET  /builds/:game               lists which platforms have a playtest build
   GET  /download/:game/:platform   streams that build

   The site never sees a token; they live here as secrets.

   Variables (plain text):
     GITHUB_OWNER      e.g. "VoidR34ver"
     FEEDBACK_REPO     repo the feedback files are committed to (a private one is recommended)
     BUILDS_REPO       repo whose Releases hold the builds, tagged "<game>-latest"
     ALLOWED_ORIGINS   comma-separated site origins, e.g. "https://zearstudios.com,https://voidr34ver.github.io"
     ACCESS_CODES      optional JSON, e.g. {"hadal":"some-code"}: those games need ?code= to download
   Secrets:
     GITHUB_TOKEN      fine-grained token: Contents read/write on FEEDBACK_REPO, Contents read on BUILDS_REPO
     TURNSTILE_SECRET  optional; when set, every feedback post must carry a valid Turnstile token
   Bindings:
     FEEDBACK_LIMITER  optional rate-limit binding (see wrangler.toml). Without it a small
                       in-memory limiter is used, which only slows down a single burst. */

const GAMES = {
  "Hadal": "hadal",
  "One House Away From Home": "ohafh",
  "Give Me Your Yoghurt": "gmyy",
  "Ouroboros: Oculus": "ouro",
  "Once Upon a Moon": "moon",
  "About me": "about",
  "Just the website": "website"
};

const PLATFORMS = [
  { id: "windows", label: "Windows", match: /-(win|windows)(?!-lowspec)(?![a-z])/i },
  { id: "windowslow", label: "Windows (low-spec)", match: /-(win|windows)-lowspec(?![a-z])/i },
  { id: "macos", label: "macOS", match: /-(mac|macos)(?![a-z])/i },
  { id: "linux", label: "Linux", match: /-linux(?![a-z])/i }
];

const MAX_BODY = 16 * 1024;
const GH = "https://api.github.com";

/* ------------------------------------------------------------------ helpers */
function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin");
  const list = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  return origin && list.includes(origin) ? origin : null;
}

function cors(origin) {
  const h = { "Vary": "Origin" };
  if (origin) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    h["Access-Control-Allow-Headers"] = "Content-Type";
    h["Access-Control-Max-Age"] = "86400";
  }
  return h;
}

function json(data, status, origin, extra = {}) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...cors(origin), ...extra } });
}

function github(env, path, init = {}) {
  return fetch(path.startsWith("http") ? path : GH + path, {
    ...init,
    headers: {
      "Authorization": "Bearer " + env.GITHUB_TOKEN,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "zear-studios-worker",
      ...(init.headers || {})
    }
  });
}

function base64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

// Fallback limiter: 5 posts a minute per address, kept only in this isolate's memory.
const recent = new Map();
async function limited(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (env.FEEDBACK_LIMITER) return !(await env.FEEDBACK_LIMITER.limit({ key: ip })).success;
  const now = Date.now(), hits = (recent.get(ip) || []).filter(t => now - t < 60000);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > 5;
}

/* ------------------------------------------------------------------ POST /feedback */
async function feedback(request, env, origin) {
  // only the site itself may post
  if (!origin) return json({ error: "origin not allowed" }, 403, null);
  if (await limited(request, env)) return json({ error: "too many requests" }, 429, origin);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: "too long" }, 413, origin);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ error: "bad json" }, 400, origin); }
  if (!body || typeof body !== "object") return json({ error: "bad json" }, 400, origin);

  if (body.website) return json({ error: "rejected" }, 400, origin);   // honeypot
  const slug = GAMES[body.game];
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const build = typeof body.build === "string" ? body.build.trim().slice(0, 60) : "";
  const rating = Number.isInteger(body.rating) && body.rating >= 1 && body.rating <= 5 ? body.rating : 0;
  if (!slug) return json({ error: "unknown game" }, 400, origin);
  if (!text || text.length > 4000) return json({ error: "text must be 1 to 4000 characters" }, 400, origin);

  if (env.TURNSTILE_SECRET) {
    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET);
    form.append("response", typeof body.token === "string" ? body.token : "");
    const check = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const result = await check.json().catch(() => ({}));
    if (!result.success) return json({ error: "turnstile failed" }, 403, origin);
  }

  // The file holds what was typed and when. The sender's address is never written anywhere.
  const now = new Date(), iso = now.toISOString();
  const stamp = iso.slice(0, 10) + "-" + iso.slice(11, 13) + iso.slice(14, 16);
  const content = [
    "Game: " + body.game,
    "Build: " + (build || "not given"),
    "Rating: " + (rating ? rating + "/5" : "not given"),
    "Time: " + iso,
    "",
    text,
    ""
  ].join("\n");

  // Two posts in the same minute get -2, -3 and so on.
  for (let n = 1; n <= 6; n++) {
    const name = `feedback/${slug}-${stamp}${n > 1 ? "-" + n : ""}.txt`;
    const res = await github(env, `/repos/${env.GITHUB_OWNER}/${env.FEEDBACK_REPO}/contents/${name}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `Feedback: ${body.game}`, content: base64(content) })
    });
    if (res.ok) return json({ ok: true }, 201, origin);
    if (res.status !== 422 && res.status !== 409) {
      console.error("github contents", res.status, await res.text());
      return json({ error: "could not save" }, 502, origin);
    }
  }
  return json({ error: "could not save" }, 502, origin);
}

/* ------------------------------------------------------------------ builds */
async function releaseAssets(env, game) {
  const res = await github(env, `/repos/${env.GITHUB_OWNER}/${env.BUILDS_REPO}/releases/tags/${game}-latest`);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error("github releases " + res.status);
  const release = await res.json();
  const out = [];
  for (const p of PLATFORMS) {
    const asset = (release.assets || []).find(a => p.match.test(a.name));
    if (asset) out.push({ id: p.id, label: p.label, size: asset.size, name: asset.name, url: asset.url, type: asset.content_type });
  }
  return out;
}

async function builds(env, game, origin) {
  const assets = await releaseAssets(env, game);
  // only platform and size go out; file names and the repo stay here
  return json({ platforms: assets.map(({ id, label, size }) => ({ id, label, size })) }, 200, origin, { "Cache-Control": "public, max-age=60" });
}

async function download(request, env, game, platform) {
  let codes = {};
  try { codes = JSON.parse(env.ACCESS_CODES || "{}"); } catch { /* treated as no codes */ }
  if (codes[game] && new URL(request.url).searchParams.get("code") !== codes[game]) return new Response("This build needs an access code.", { status: 403 });

  const asset = (await releaseAssets(env, game)).find(a => a.id === platform);
  if (!asset) return new Response("No build for that platform.", { status: 404 });
  const file = await github(env, asset.url, { headers: { "Accept": "application/octet-stream" } });
  if (!file.ok || !file.body) return new Response("Couldn't fetch the build.", { status: 502 });
  return new Response(file.body, {
    headers: {
      "Content-Type": asset.type || "application/octet-stream",
      "Content-Length": String(asset.size),
      "Content-Disposition": `attachment; filename="${asset.name.replace(/[^\w.\-]/g, "_")}"`,
      "Cache-Control": "no-store"
    }
  });
}

/* ------------------------------------------------------------------ router */
export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env);
    const { pathname } = new URL(request.url);
    const parts = pathname.split("/").filter(Boolean);
    const slug = /^[a-z0-9]{2,20}$/;
    try {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
      if (request.method === "POST" && pathname === "/feedback") return await feedback(request, env, origin);
      if (request.method === "GET" && parts[0] === "builds" && parts.length === 2 && slug.test(parts[1])) return await builds(env, parts[1], origin);
      if (request.method === "GET" && parts[0] === "download" && parts.length === 3 && slug.test(parts[1]) && slug.test(parts[2])) return await download(request, env, parts[1], parts[2]);
      return json({ error: "not found" }, 404, origin);
    } catch (err) {
      console.error(err);
      return json({ error: "server error" }, 500, origin);
    }
  }
};
