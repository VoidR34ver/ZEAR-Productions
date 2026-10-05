/* ZEAR Productions site: tabs, screenshot slots, feedback, scroll scenes. */
(() => {
  "use strict";

  // Feedback endpoint: set once the owner picks a service (Formspree, Web3Forms, a Worker, ...).
  // While empty the form checks input but sends nothing anywhere.
  const FEEDBACK_ENDPOINT = "";

  // Lamp colour of each building, in the order of the list on the page (from the game, 2026-10-05).
  const LAMPS = ["#FFDBA8", "#FF994D", "#FFAD61", "#FFD69E", "#F2BD80", "#9EB8FA", "#B8E6BD", "#FFC780",
                 "#FF7033", "#FFDBA8", "#FF853D", "#FFC26B", "#FFB370", "#FFDBAD", "#FFEBC7"];

  // TODO(owner): names for Hadal depth zones 2 to 4, if you want them shown.
  const ZONE_NAMES = { 2: null, 3: null, 4: null };

  // Which wing each One House gallery shot shows.
  const WING_NAMES = { "O-03": "Great hall · Gothic", "O-04": "Old chapel · Romanesque", "O-05": "Greenhouse · moonlit glasshouse",
                       "O-06": "West gallery · burial galleries in the rock", "O-07": "Cloister ward · the cloister walk",
                       "O-08": "Guest wing · 1920s lounge" };

  const TABS = ["zear", "hadal", "ohafh"];
  const THEME_BG = { zear: "#f1ebe0", hadal: "#031014", ohafh: "#1d0c09" };
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (REDUCED) document.documentElement.classList.add("static");

  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------ helpers */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  let refreshTimer = 0;
  const softRefresh = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150); };

  /* ------------------------------------------------------------------ screenshot slots */
  const EXTS = [".jpg", ".webp", ".png"];
  function tryLoad(base, done, fail, i = 0) {
    if (i >= EXTS.length) return fail();
    const img = new Image();
    img.onload = () => done(img);
    img.onerror = () => tryLoad(base, done, fail, i + 1);
    img.src = base + EXTS[i];
  }
  $$(".shot").forEach(fig => {
    tryLoad(fig.dataset.src, img => {
      img.alt = fig.dataset.note || "";
      img.decoding = "async";
      fig.classList.remove("ph");
      fig.replaceChildren(img);
      softRefresh();
    }, () => {
      fig.classList.add("ph");
      fig.innerHTML = `<span class="ph-id">${fig.dataset.id}</span><span class="ph-note">${fig.dataset.note || ""}</span>`;
    });
  });

  Object.entries(ZONE_NAMES).forEach(([n, name]) => { if (name) $$(`[data-zone-name="${n}"]`).forEach(e => e.textContent = name); });
  Object.entries(WING_NAMES).forEach(([id, name]) => { const e = $(`[data-wing="${id}"]`); if (e) e.textContent = name || "Wing"; });
  $$(".o-wings li").forEach((li, i) => li.style.setProperty("--lamp", LAMPS[i % LAMPS.length]));

  /* ------------------------------------------------------------------ feedback forms */
  let fbCount = 0;
  $$(".fb-slot").forEach(slot => {
    const node = $("#fb-tpl").content.cloneNode(true);
    const id = "fb" + (++fbCount);
    const form = $("form", node);
    // unique ids for labels
    $$(".field", node).forEach((f, i) => {
      const ctl = $("select, input, textarea", f), lab = $("label", f);
      if (ctl && lab && !f.querySelector(".rate")) { ctl.id = `${id}-f${i}`; lab.htmlFor = ctl.id; }
    });
    const rate = $(".rate", node);
    rate.setAttribute("aria-label", "Rating from 1 to 5");
    for (let n = 1; n <= 5; n++) {
      rate.insertAdjacentHTML("beforeend",
        `<input type="radio" id="${id}-r${n}" name="rating" value="${n}"><label for="${id}-r${n}">${n}</label>`);
    }
    if (slot.dataset.game) form.elements.game.value = slot.dataset.game;
    const status = $(".status", node);
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (data.website) return;                 // honeypot: bots fill it, people never see it
      if (!data.game) { status.textContent = "Pick which game it's about."; return; }
      if (!data.text || !data.text.trim()) { status.textContent = "Write something first."; return; }
      delete data.website;
      if (!FEEDBACK_ENDPOINT) { status.textContent = "Preview only. Feedback isn't hooked up yet, so nothing was sent."; return; }
      status.textContent = "Sending...";
      try {
        const res = await fetch(FEEDBACK_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        if (slot.dataset.game) form.elements.game.value = slot.dataset.game;
        status.textContent = "Got it, thanks.";
      } catch { status.textContent = "That didn't go through. Try again in a bit."; }
    });
    slot.replaceWith(node);
  });

  /* ------------------------------------------------------------------ copy buttons */
  $$("[data-copy]").forEach(btn => btn.addEventListener("click", async () => {
    const text = document.getElementById(btn.dataset.copy).textContent;
    try { await navigator.clipboard.writeText(text); btn.textContent = "Copied"; }
    catch { btn.textContent = "Select it by hand"; }
    setTimeout(() => btn.textContent = "Copy", 1500);
  }));

  /* ------------------------------------------------------------------ shared scene builders */
  function hscroll(sec) {
    const track = $(".track", sec);
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const skewers = $$(".big, .shot", track);
    gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: sec, pin: true, scrub: 1, end: () => "+=" + dist(), invalidateOnRefresh: true,
        onUpdate: self => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / -300);
          gsap.to(skewers, { skewX: v, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        }
      }
    });
    // each panel drifts up a little as it passes centre
    $$(".panel", track).forEach((p, i) => {
      if (i === 0) return;
      gsap.fromTo(p, { y: i % 2 ? 60 : -60 }, { y: i % 2 ? -60 : 60, ease: "none",
        scrollTrigger: { trigger: sec, start: "top top", end: () => "+=" + dist(), scrub: true, invalidateOnRefresh: true } });
    });
  }

  function counters(root) {
    $$("[data-count]", root).forEach(el => {
      const target = +el.dataset.count;
      const o = { v: 0 };
      gsap.to(o, { v: target, duration: 1.8, ease: "power2.out",
        onUpdate: () => el.textContent = Math.round(o.v),
        scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      el.textContent = "0";
    });
  }

  function rise(targets, opts = {}) {
    $$(targets.selector, targets.root).forEach(el => {
      gsap.from(el, { y: opts.y ?? 60, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });
  }

  function clipReveal(root, sel) {
    $$(sel, root).forEach(el => {
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      gsap.fromTo(el, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    });
  }

  function feedbackIn(root) { rise({ selector: ".fb-head, .fb .field, .fb button", root }, { y: 40 }); }

  /* ------------------------------------------------------------------ ZEAR */
  function initZear(root) {
    const L = $$(".z-word span", root);
    gsap.timeline({ scrollTrigger: { trigger: $(".z-hero", root), pin: true, scrub: 1, end: "+=180%" } })
      .to(L[0], { xPercent: -280, yPercent: -40, rotate: -14, ease: "power2.in" }, 0)
      .to(L[1], { xPercent: -150, yPercent: 50, rotate: 8, ease: "power2.in" }, 0)
      .to(L[2], { xPercent: 150, yPercent: -50, rotate: -8, ease: "power2.in" }, 0)
      .to(L[3], { xPercent: 280, yPercent: 40, rotate: 14, ease: "power2.in" }, 0)
      .to($(".z-word", root), { scale: 2.2, opacity: 0, ease: "power2.in" }, 0.15)
      .to([$(".z-sub", root), $(".z-hero .scroll-cue", root)], { opacity: 0, y: -40, duration: 0.3 }, 0)
      .fromTo($(".z-line", root), { opacity: 0, scale: 0.6, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", ease: "power3.out" }, 0.45);

    gsap.timeline({ scrollTrigger: { trigger: $(".z-doors", root), pin: true, scrub: 1, end: "+=130%" } })
      .from($(".door-hadal", root), { xPercent: -100, ease: "power3.out" }, 0)
      .from($(".door-ohafh", root), { xPercent: 100, ease: "power3.out" }, 0)
      .from($$(".door .shot", root), { scale: 1.35, ease: "power2.out" }, 0)
      .from($$(".door-text > *", root), { y: 70, opacity: 0, stagger: 0.04, ease: "power3.out" }, 0.45);

    hscroll($(".z-strip", root));
    feedbackIn(root);
  }

  /* ------------------------------------------------------------------ HADAL */
  function zoneFor(d) {
    return d < 200 ? "sunlight zone" : d < 1000 ? "twilight zone" : d < 4000 ? "midnight zone" : d < 6000 ? "abyssal zone" : "hadal zone";
  }

  function marineSnow(canvas, depthRef) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, parts = [], vel = 0, raf = 0, alive = true;
    function size() {
      W = canvas.width = canvas.clientWidth; H = canvas.height = canvas.clientHeight;
      parts = Array.from({ length: Math.round(W * H / 7000) }, () => ({
        x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.7 + 0.3, s: Math.random() * 0.7 + 0.15, o: Math.random() * 0.8 + 0.2 }));
    }
    function frame() {
      if (!alive) return;
      const a = Math.min(1, depthRef.d / 1200) * 0.85 + 0.15;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#e8f4f2";
      for (const p of parts) {
        p.y -= p.s * (1 + vel);
        p.x += Math.sin((p.y + p.o * 300) / 70) * 0.25;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        ctx.globalAlpha = a * p.o;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + vel * 0.03), 0, 6.2832); ctx.fill();
      }
      vel *= 0.93;
      raf = requestAnimationFrame(frame);
    }
    size(); frame();
    return { kick: v => { vel = Math.min(24, Math.abs(v) / 160); }, size, stop: () => { alive = false; cancelAnimationFrame(raf); } };
  }

  function initHadal(root) {
    const depth = { d: 0 };
    const dval = $(".d-val", root), dzone = $(".d-zone", root);
    const snow = marineSnow($(".snow", root), depth);
    const onResize = () => snow.size();
    window.addEventListener("resize", onResize);

    const dive = gsap.timeline({ scrollTrigger: { trigger: $(".h-dive", root), pin: true, scrub: 1, end: "+=320%",
      onUpdate: self => snow.kick(self.getVelocity()) } });
    dive
      .to($(".h-dive", root), { backgroundColor: "#010508", ease: "power1.in", duration: 1 }, 0)
      .to(depth, { d: 6200, ease: "power1.in", duration: 1,
        onUpdate: () => { dval.textContent = Math.round(depth.d).toLocaleString("en-US"); dzone.textContent = zoneFor(depth.d); } }, 0)
      .to($(".h-title", root), { scale: 10, opacity: 0, ease: "power3.in", duration: 0.4 }, 0)
      .to($(".h-dive .scroll-cue", root), { opacity: 0, duration: 0.1 }, 0)
      .fromTo($(".l1", root), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.12 }, 0.32)
      .fromTo($(".l2", root), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.12 }, 0.44)
      .fromTo($(".l3", root), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0.58)
      .to($$(".h-dive-copy p", root), { opacity: 0, y: -60, stagger: 0.03, duration: 0.12 }, 0.86);

    gsap.timeline({ scrollTrigger: { trigger: $(".h-iris", root), pin: true, scrub: 1, end: "+=160%" } })
      .fromTo($(".iris", root), { clipPath: "circle(10% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "power2.inOut" }, 0)
      .fromTo($(".iris .shot", root), { scale: 1.5 }, { scale: 1, ease: "power2.out" }, 0)
      .fromTo($(".iris-text", root), { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, ease: "power3.out", duration: 0.4 }, 0)
      .to($(".iris-text", root), { y: -80, opacity: 0, duration: 0.3 }, 0.75);

    gsap.set($$(".e2, .e3", root), { opacity: 0, scale: 1.08 });
    gsap.set($(".s1", root), { opacity: 1 });
    gsap.timeline({ scrollTrigger: { trigger: $(".h-evolve", root), pin: true, scrub: 1, end: "+=260%" } })
      .fromTo($(".evo-bar i", root), { width: "0%" }, { width: "100%", ease: "none", duration: 3 }, 0)
      .from($(".evo-stage", root), { xPercent: 12, opacity: 0, duration: 0.6 }, 0)
      .to($(".s1", root), { opacity: 0, y: -24, duration: 0.3 }, 1)
      .fromTo($(".s2", root), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3 }, 1.1)
      .to($(".e2", root), { opacity: 1, scale: 1, duration: 0.5 }, 1)
      .to($(".s2", root), { opacity: 0, y: -24, duration: 0.3 }, 2)
      .fromTo($(".s3", root), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3 }, 2.1)
      .to($(".e3", root), { opacity: 1, scale: 1, duration: 0.5 }, 2);

    counters(root);
    rise({ selector: ".h-stats .stat", root }, { y: 100 });
    // 7 cm against 20 m is a real ratio: 0.0035
    gsap.fromTo($(".scale-bar i", root), { scaleX: 0.0035 }, { scaleX: 1, ease: "power2.inOut",
      scrollTrigger: { trigger: $(".scale", root), start: "top 75%", end: "top 25%", scrub: 1 } });

    hscroll($(".h-zones", root));

    clipReveal(root, ".h-pair .shot");
    gsap.fromTo($(".pair-b", root), { y: 140 }, { y: -140, ease: "none", scrollTrigger: { trigger: $(".h-pair", root), scrub: true } });
    gsap.fromTo($(".pair-a", root), { y: 40 }, { y: -40, ease: "none", scrollTrigger: { trigger: $(".h-pair", root), scrub: true } });

    gsap.from($(".get-btn", root), { scale: 0.6, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.6)", scrollTrigger: { trigger: $(".h-get", root), start: "top 75%", once: true } });
    rise({ selector: ".get-pre, .get-post", root }, { y: 30 });
    feedbackIn(root);

    return () => { snow.stop(); window.removeEventListener("resize", onResize); };
  }

  /* ------------------------------------------------------------------ OHAfH: PSX crush */
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => v / 16 - 0.5);

  function proceduralCastle(W, H) {
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#1a0f0a"); bg.addColorStop(0.55, "#2c1a10"); bg.addColorStop(1, "#0a0605");
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    // floor
    const horizon = H * 0.62;
    g.strokeStyle = "rgba(201,121,63,.18)"; g.lineWidth = 1;
    for (let i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(W / 2, horizon); g.lineTo(W / 2 + i * W * 0.12, H); g.stroke(); }
    for (let j = 1; j < 9; j++) { const y = horizon + (H - horizon) * Math.pow(j / 9, 1.8); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    // arcade of pointed arches receding
    for (let k = 6; k >= 0; k--) {
      const s = Math.pow(0.72, k), aw = W * 0.34 * s, ah = H * 0.78 * s, cx = W / 2, base = horizon + (H - horizon) * (s * 0.9 - 0.05);
      const shade = 40 + (6 - k) * 18;
      g.fillStyle = `rgb(${shade + 20},${shade},${shade - 12})`;
      g.fillRect(cx - aw / 2 - aw * 0.18, base - ah, aw * 0.18, ah);
      g.fillRect(cx + aw / 2, base - ah, aw * 0.18, ah);
      g.beginPath();
      g.moveTo(cx - aw / 2 - aw * 0.18, base - ah * 0.62);
      g.quadraticCurveTo(cx - aw / 2 - aw * 0.18, base - ah * 1.08, cx, base - ah * 1.12);
      g.quadraticCurveTo(cx + aw / 2 + aw * 0.18, base - ah * 1.08, cx + aw / 2 + aw * 0.18, base - ah * 0.62);
      g.lineTo(cx + aw / 2, base - ah * 0.62);
      g.quadraticCurveTo(cx + aw / 2, base - ah * 0.98, cx, base - ah * 1.0);
      g.quadraticCurveTo(cx - aw / 2, base - ah * 0.98, cx - aw / 2, base - ah * 0.62);
      g.closePath(); g.fill();
      // lamp on each pillar
      for (const side of [-1, 1]) {
        const lx = cx + side * (aw / 2 + aw * 0.09), ly = base - ah * 0.55;
        const rg = g.createRadialGradient(lx, ly, 0, lx, ly, aw * 0.5);
        rg.addColorStop(0, "rgba(255,190,110,.85)"); rg.addColorStop(0.15, "rgba(230,130,60,.35)"); rg.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = rg; g.fillRect(lx - aw * 0.5, ly - aw * 0.5, aw, aw);
      }
    }
    return c;
  }

  function psxCrusher(canvas, srcImg) {
    const ctx = canvas.getContext("2d");
    const small = document.createElement("canvas"), sctx = small.getContext("2d", { willReadFrequently: true });
    let W, H, source = null, last = "";
    function cover(img, w, h) {
      const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
      const s = Math.max(w / iw, h / ih), dw = iw * s, dh = ih * s;
      return [(w - dw) / 2, (h - dh) / 2, dw, dh];
    }
    function size() {
      W = canvas.width = canvas.clientWidth; H = canvas.height = canvas.clientHeight;
      source = srcImg && srcImg.complete && srcImg.naturalWidth ? srcImg : proceduralCastle(W, H);
      last = "";
    }
    function render(p) {
      const px = Math.max(1, Math.round(1 + p * 8));
      const levels = Math.max(8, Math.round(28 - p * 20));
      const key = px + ":" + levels;
      if (key === last) return; last = key;
      const w = Math.ceil(W / px), h = Math.ceil(H / px);
      small.width = w; small.height = h;
      sctx.imageSmoothingEnabled = true;
      sctx.drawImage(source, ...cover(source, w, h));
      if (px > 1) {
        const im = sctx.getImageData(0, 0, w, h), d = im.data, step = 255 / (levels - 1);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4, t = BAYER[(y & 3) * 4 + (x & 3)] * step;
          d[i] = Math.round((d[i] + t) / step) * step;
          d[i + 1] = Math.round((d[i + 1] + t) / step) * step;
          d[i + 2] = Math.round((d[i + 2] + t) / step) * step;
        }
        sctx.putImageData(im, 0, 0);
      }
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(small, 0, 0, w, h, 0, 0, w * px, h * px);
    }
    size();
    return { render, size };
  }

  function initOhafh(root) {
    const srcEl = $(".crush-src", root);
    const crush = psxCrusher($(".crush", root), srcEl);
    const state = { p: 0 };
    crush.render(0);
    const onResize = () => { crush.size(); crush.render(state.p); };
    window.addEventListener("resize", onResize);
    const fin = $(".crush-final", root);
    tryLoad(fin.dataset.src, img => { fin.style.backgroundImage = `url("${img.src}")`; }, () => {});
    if (!srcEl.naturalWidth && srcEl.dataset.src) {
      tryLoad(srcEl.dataset.src, img => { srcEl.onload = onResize; srcEl.src = img.src; }, () => {});
    }

    gsap.timeline({ scrollTrigger: { trigger: $(".o-crush", root), pin: true, scrub: 1, end: "+=260%" } })
      .to(state, { p: 1, ease: "power1.in", duration: 1, onUpdate: () => crush.render(state.p) }, 0)
      .to($(".crush", root), { opacity: 0.45, scale: 1.08, duration: 1 }, 0)
      .fromTo($(".crush-final", root), { opacity: 0, scale: 1.08 }, { opacity: 0.5, scale: 1.08, duration: 0.25 }, 0.8)
      .to($(".o-crush .scroll-cue", root), { opacity: 0, duration: 0.1 }, 0)
      .fromTo($(".o-place", root), { opacity: 0, letterSpacing: "1em" }, { opacity: 1, letterSpacing: "0.2em", duration: 0.25 }, 0.2)
      .fromTo($(".o-title", root), { opacity: 0, scale: 1.3, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.3, ease: "power3.out" }, 0.3)
      .fromTo($(".o-crush-line", root), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2 }, 0.6);

    counters(root);
    rise({ selector: ".o-counts .stat, .o-castle-copy", root }, { y: 80 });
    gsap.from($$(".o-wings li", root), { x: -40, opacity: 0, stagger: 0.06, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: $(".o-wings", root), start: "top 80%", once: true } });

    const R = $$(".rounds i", root);
    gsap.set($(".a1", root), { opacity: 1 });
    gsap.timeline({ scrollTrigger: { trigger: $(".o-ammo", root), pin: true, scrub: 1, end: "+=260%" } })
      .from(R, { y: -200, opacity: 0, stagger: 0.08, duration: 0.6, ease: "bounce.out" }, 0)
      .to($(".a1", root), { opacity: 0, y: -20, duration: 0.3 }, 1)
      .fromTo($(".a2", root), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 1.1)
      .to([R[5], R[4]], { y: 260, rotate: (i) => i ? -70 : 55, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power2.in" }, 1.2)
      .to($(".a2", root), { opacity: 0, y: -20, duration: 0.3 }, 2)
      .fromTo($(".a3", root), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 2.1)
      .to(R[3], { y: -24, filter: "brightness(1.6) drop-shadow(0 0 14px #c9793f)", duration: 0.4 }, 2.2)
      .to($(".a3", root), { opacity: 0, y: -20, duration: 0.3 }, 3)
      .fromTo($(".a4", root), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 3.1)
      .to(R.slice(0, 4), { scale: 1.15, filter: "brightness(1.4) drop-shadow(0 0 18px #c9793f)", y: 0, duration: 0.4 }, 3.1);

    hscroll($(".o-gallery", root));
    clipReveal(root, ".feat .shot");
    rise({ selector: ".feat p", root }, { y: 30 });
    rise({ selector: ".o-warn, .o-play h2, .o-play-sub, .cmd, .keys", root }, { y: 40 });
    feedbackIn(root);

    return () => window.removeEventListener("resize", onResize);
  }

  /* ------------------------------------------------------------------ static fallbacks (reduced motion) */
  function staticExtras(name, root) {
    if (name === "ohafh") {
      const src = $(".crush-src", root), c = psxCrusher($(".crush", root), src);
      c.render(0.6);
      tryLoad(src.dataset.src, img => { src.onload = () => { c.size(); c.render(0.6); }; src.src = img.src; }, () => {});
    }
  }

  /* ------------------------------------------------------------------ tabs */
  const INIT = { zear: initZear, hadal: initHadal, ohafh: initOhafh };
  let current = null, ctx = null, busy = false;

  function moveIndicator(name) {
    const a = $(`.tabbar nav a[data-goto="${name}"]`), ind = $(".indicator");
    $$(".tabbar nav a").forEach(x => x.setAttribute("aria-selected", x === a ? "true" : "false"));
    if (!a) return;
    ind.style.width = a.offsetWidth + "px";
    ind.style.transform = `translateX(${a.offsetLeft}px)`;
  }

  function mount(name) {
    if (ctx) { ctx.revert(); ctx = null; }
    ScrollTrigger.getAll().forEach(t => t.kill());
    TABS.forEach(t => { $("#tab-" + t).hidden = t !== name; });
    document.body.dataset.tab = name;
    window.scrollTo(0, 0);
    const root = $("#tab-" + name);
    if (REDUCED) { staticExtras(name, root); }
    else { ctx = gsap.context(() => INIT[name](root), root); }
    ScrollTrigger.refresh();
    moveIndicator(name);
    current = name;
    document.title = name === "zear" ? "ZEAR Productions" : name === "hadal" ? "Hadal | ZEAR Productions" : "One House Away From Home | ZEAR Productions";
  }

  function go(name, animate = true) {
    if (!TABS.includes(name)) name = "zear";
    if (name === current || busy) return;
    if (!animate || REDUCED || current === null) { mount(name); return; }
    busy = true;
    const wipe = $(".wipe");
    wipe.style.background = THEME_BG[name];
    gsap.timeline({ onComplete: () => { busy = false; } })
      .fromTo(wipe, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power3.in" })
      .add(() => mount(name))
      .fromTo(wipe, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "power3.out" });
  }

  window.addEventListener("hashchange", () => go(location.hash.slice(1)));
  window.addEventListener("resize", () => moveIndicator(current));
  document.fonts && document.fonts.ready.then(() => { moveIndicator(current); softRefresh(); });
  go(location.hash.slice(1) || "zear", false);
})();
