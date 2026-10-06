/* ZEAR Studios. Plain JS, no build step. Needs vendor/gsap.min.js and vendor/ScrollTrigger.min.js. */
(() => {
  "use strict";

  // Address of the Cloudflare Worker (see ../worker), without a trailing slash,
  // e.g. "https://api.zearstudios.example". While it's empty the feedback form sends
  // nothing and the download button falls back to its plain link.
  const API_BASE = "https://zear-api.zearstudios.workers.dev";
  // Cloudflare Turnstile site key. Empty = no Turnstile, and nothing is loaded from Cloudflare.
  const TURNSTILE_SITEKEY = "";

  const TABS = ["zear", "hadal", "ohafh", "gmyy", "ouro", "about"];
  // Colour of the wipe when switching to a tab. Foil for Yoghurt, ochre for About.
  const WIPE = {
    zear: "#f7f7f5", hadal: "#000000", ohafh: "#1e100a", ouro: "#000000", about: "#D7A948",
    gmyy: "repeating-linear-gradient(0deg,rgba(255,255,255,.35) 0 1px,rgba(0,0,0,0) 1px 3px),linear-gradient(135deg,#d9dbdf,#f4f5f7 35%,#bfc3c9 60%,#e8e9ec)"
  };
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (REDUCED) document.documentElement.classList.add("static");

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ------------------------------------------------------------------ helpers */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  let refreshTimer = 0;
  const softRefresh = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150); };
  const num = n => Math.round(n).toLocaleString("en-US");

  // Canvas scenes read their picture from data-src, so it only loads when its tab opens.
  function canvasImage(canvas, onload) {
    let img = canvas._img;
    if (!img) { img = canvas._img = new Image(); img.decoding = "async"; img.src = canvas.dataset.src; }
    if (!img.complete) img.addEventListener("load", onload, { once: true });
    return img;
  }

  /* ------------------------------------------------------------------ email */
  // Put together here so the address isn't sitting in the markup for scrapers.
  $$("[data-mail]").forEach(a => {
    const addr = a.dataset.mail.replace("|", "@");
    a.textContent = addr;
    a.href = "mailto:" + addr;
  });

  /* ------------------------------------------------------------------ feedback form */
  let turnstileLoading = null;
  function loadTurnstile() {
    if (!turnstileLoading) turnstileLoading = new Promise((ok, fail) => {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
    return turnstileLoading;
  }

  const tpl = $("#feedback-tpl");
  $$(".feedback-slot").forEach(slot => {
    const wrap = document.createElement("div");
    wrap.className = "feedback-wrap";
    wrap.appendChild(tpl.content.cloneNode(true));
    const form = $("form", wrap), status = $(".f-status", wrap), send = $("button[type=submit]", wrap);
    const stars = $$(".f-stars button", wrap);
    let rating = 0, token = "", widget = null;
    form.elements.game.value = slot.dataset.game;

    const setRating = n => {
      rating = n;
      stars.forEach((b, i) => { b.setAttribute("aria-checked", i + 1 === n ? "true" : "false"); b.tabIndex = (n ? i + 1 === n : i === 0) ? 0 : -1; });
    };
    setRating(0);
    stars.forEach((b, i) => {
      b.addEventListener("click", () => setRating(i + 1));
      b.addEventListener("keydown", e => {
        const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        const n = Math.min(5, Math.max(1, (rating || (d > 0 ? 0 : 2)) + d));
        setRating(n); stars[n - 1].focus();
      });
    });

    if (API_BASE && TURNSTILE_SITEKEY) form.addEventListener("focusin", () => {
      if (widget !== null) return;
      widget = "";
      loadTurnstile().then(() => {
        widget = window.turnstile.render($(".f-turnstile", wrap), {
          sitekey: TURNSTILE_SITEKEY, theme: "auto", size: "flexible",
          callback: t => { token = t; }, "expired-callback": () => { token = ""; }
        });
      }).catch(() => { widget = null; });
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const f = form.elements;
      if (f.website.value) return;   // honeypot
      if (!f.game.value) { status.textContent = "Pick which game it's about."; return; }
      if (!f.text.value.trim()) { status.textContent = "Write something first."; return; }
      if (!API_BASE) { status.textContent = "Preview only. Feedback isn't hooked up yet, so nothing was sent."; return; }
      if (TURNSTILE_SITEKEY && !token) { status.textContent = "One moment, checking you're not a bot. Then press Send again."; return; }
      status.textContent = "Sending...";
      send.disabled = true;
      try {
        const res = await fetch(API_BASE + "/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ game: f.game.value, build: f.build.value.trim(), rating, text: f.text.value.trim(), website: f.website.value, token })
        });
        if (res.status === 429) { status.textContent = "That's a lot of feedback in a short time. Try again in a few minutes."; return; }
        if (!res.ok) throw new Error(res.status);
        form.reset();
        f.game.value = slot.dataset.game;
        setRating(0);
        status.textContent = "Got it, thanks.";
      } catch { status.textContent = "That didn't go through. Try again in a bit."; }
      finally {
        send.disabled = false;
        if (widget && window.turnstile) { token = ""; window.turnstile.reset(widget); }
      }
    });
    slot.replaceWith(wrap);
  });

  /* ------------------------------------------------------------------ downloads */
  // With the Worker set up, the button asks it which platforms have a build and shows
  // only those. Without it, the button's own link is used.
  $$("[data-builds]").forEach(box => {
    const btn = $(".get-btn", box), picker = $(".picker", box), game = box.dataset.builds;
    if (!API_BASE || !btn || !picker) return;
    let loaded = false;
    btn.addEventListener("click", async e => {
      e.preventDefault();
      if (loaded) { picker.hidden = !picker.hidden; return; }
      picker.hidden = false;
      picker.innerHTML = "<span>Looking for builds...</span>";
      try {
        const res = await fetch(API_BASE + "/builds/" + game);
        if (!res.ok) throw new Error(res.status);
        const { platforms = [] } = await res.json();
        picker.replaceChildren(...(platforms.length ? platforms.map(p => {
          const a = document.createElement("a");
          a.href = API_BASE + "/download/" + game + "/" + p.id;
          a.textContent = p.label + (p.size ? " · " + Math.round(p.size / 1048576) + " MB" : "");
          return a;
        }) : [Object.assign(document.createElement("span"), { textContent: "No playtest build is up right now." })]));
        loaded = true;
      } catch {
        picker.innerHTML = "<span>Couldn't reach the downloads. Try again in a bit.</span>";
      }
      softRefresh();
    });
  });

  /* ------------------------------------------------------------------ shared scene builders */
  function cue(sec) {
    $$(".cue-line", sec).forEach(l => gsap.fromTo(l, { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: "sine.inOut", repeat: -1, yoyo: true }));
  }
  function hscroll(sec) {
    const track = $(".track", sec);
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const skewers = $$("[data-skew]", track);
    const tw = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: sec, pin: true, scrub: 1, end: () => "+=" + dist(), invalidateOnRefresh: true,
        onUpdate: self => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / -300);
          gsap.to(skewers, { skewX: v, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        }
      }
    });
    return tw;
  }
  function counters(root) {
    $$("[data-count]", root).forEach(el => {
      const o = { v: 0 }, target = +el.dataset.count;
      el.textContent = "0";
      gsap.to(o, { v: target, duration: 1.8, ease: "power2.out", onUpdate: () => el.textContent = Math.round(o.v),
        scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    });
  }
  function rise(root, y = 50) {
    $$("[data-rise]", root).forEach(el => gsap.from(el, { y, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }));
  }
  function clips(root) {
    $$("[data-clip]", root).forEach(el => {
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      const img = $("img", el);
      if (img) gsap.fromTo(img, { scale: 1.1 }, { scale: 1, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    });
  }
  function getBtn(sec) {
    $$(".get-btn", sec).forEach(b => gsap.from(b, { scale: 0.6, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.6)", scrollTrigger: { trigger: b, start: "top 85%", once: true } }));
  }

  // One entry per tab. Each builds that tab's scenes and may return a cleanup function.
  // `still` is true under reduced motion: only do what the last frame needs, no tweens.
  const init = {};

  /* ------------------------------------------------------------------ studio */
  init.zear = (sec, still) => {
    // Diagonal bands of "ZEAR" drifting behind everything below the title page.
    const layer = document.createElement("div"), tilt = document.createElement("div");
    layer.className = "z-bands"; layer.setAttribute("aria-hidden", "true");
    const word = "ZEAR ".repeat(80);
    for (let i = 0; i < 80; i++) tilt.appendChild(Object.assign(document.createElement("span"), { textContent: word }));
    layer.appendChild(tilt);
    sec.insertBefore(layer, sec.firstChild);
    const cleanup = () => layer.remove();
    if (still) return cleanup;

    const hero = $(".z-hero", sec), L = $$(".z-word span", sec);
    gsap.to(Array.from(tilt.children), { xPercent: -50, duration: 600, ease: "none", repeat: -1 });
    ScrollTrigger.create({ trigger: hero, start: "bottom bottom", end: "bottom top",
      onEnter: () => gsap.to(layer, { opacity: 1, duration: 0.8 }), onLeaveBack: () => gsap.to(layer, { opacity: 0, duration: 0.4 }) });

    gsap.timeline({ scrollTrigger: { trigger: hero, pin: true, scrub: 1, end: "+=180%" } })
      .to(L[0], { xPercent: -280, yPercent: -40, rotate: -14, ease: "power2.in" }, 0)
      .to(L[1], { xPercent: -150, yPercent: 50, rotate: 8, ease: "power2.in" }, 0)
      .to(L[2], { xPercent: 150, yPercent: -50, rotate: -8, ease: "power2.in" }, 0)
      .to(L[3], { xPercent: 280, yPercent: 40, rotate: 14, ease: "power2.in" }, 0)
      .to($(".z-word", sec), { scale: 2.2, opacity: 0, ease: "power2.in" }, 0.15)
      .to([$(".z-sub", sec), $(".cue", sec)], { opacity: 0, y: -40, duration: 0.3 }, 0)
      .fromTo($(".z-line", sec), { opacity: 0, scale: 0.6, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", ease: "power3.out" }, 0.45);

    $$(".door", sec).forEach((d, i) => {
      const img = $(".door-img", d), txt = $(".dt", d);
      gsap.set(img, { willChange: "transform" });
      gsap.timeline({ scrollTrigger: { trigger: d, start: "top bottom", end: "top 35%", scrub: 0.6 } })
        .fromTo(d, { clipPath: "inset(18% 6% 0% 6%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 }, i % 2 ? 0.12 : 0)
        .fromTo(img, { scale: 1.22 }, { scale: 1.04, ease: "none", duration: 1 }, "<")
        .fromTo(txt, { y: 80, opacity: 0 }, { y: 0, opacity: 1, ease: "none", duration: 0.5 }, 0.5);
      gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: d, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    });

    $$(".hs", sec).forEach(hscroll);
    cue(sec); rise(sec, 40);
    gsap.to($(".fist", sec), { scale: 1.08, rotate: 4, duration: 0.9, ease: "sine.inOut", repeat: -1, yoyo: true, transformOrigin: "60% 60%" });
    return cleanup;
  };

  /* ------------------------------------------------------------------ hadal */
  init.hadal = (sec, still) => {
    if (still) return;
    const s = c => $(c, sec);
    const zoneFor = d => d < 200 ? "sunlight zone" : d < 1000 ? "twilight zone" : d < 4000 ? "midnight zone" : d < 6000 ? "abyssal zone" : "hadal zone";
    const depth = { d: 0 }, dval = s(".d-val"), dzone = s(".d-zone");

    // marine snow: drifts up on its own, rushes past with scroll speed
    const canvas = s(".snow"), cx = canvas.getContext("2d");
    let W = 0, H = 0, parts = [], vel = 0, raf = 0, alive = true;
    const size = () => {
      W = canvas.width = canvas.clientWidth; H = canvas.height = canvas.clientHeight;
      parts = Array.from({ length: Math.round(W * H / 7000) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.7 + 0.3, s: Math.random() * 0.7 + 0.15, o: Math.random() * 0.8 + 0.2 }));
    };
    const frame = () => {
      if (!alive) return;
      const a = Math.min(1, depth.d / 1200) * 0.85 + 0.15;
      cx.clearRect(0, 0, W, H); cx.fillStyle = "#e8f4f2";
      for (const p of parts) {
        p.y -= p.s * (1 + vel); p.x += Math.sin((p.y + p.o * 300) / 70) * 0.25;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        cx.globalAlpha = a * p.o; cx.beginPath(); cx.arc(p.x, p.y, p.r * (1 + vel * 0.03), 0, 6.2832); cx.fill();
      }
      vel *= 0.93; raf = requestAnimationFrame(frame);
    };
    size(); frame();
    window.addEventListener("resize", size);

    gsap.timeline({ scrollTrigger: { trigger: s(".h-dive"), pin: true, scrub: 1, end: "+=320%", onUpdate: st => { vel = Math.min(24, Math.abs(st.getVelocity()) / 160); } } })
      .to(s(".h-dive"), { backgroundColor: "#000000", ease: "power1.in", duration: 1 }, 0)
      .to(depth, { d: 11000, ease: "power1.in", duration: 1, onUpdate: () => { dval.textContent = num(depth.d); dzone.textContent = zoneFor(depth.d); } }, 0)
      .to(s(".h-title"), { scale: 10, opacity: 0, ease: "power3.in", duration: 0.4 }, 0)
      .to(s(".cue"), { opacity: 0, duration: 0.1 }, 0)
      .fromTo(s(".l1"), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.12 }, 0.32)
      .fromTo(s(".l2"), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.12 }, 0.44)
      .to([s(".l1"), s(".l2")], { opacity: 0, y: -60, stagger: 0.03, duration: 0.12 }, 0.86);

    gsap.timeline({ scrollTrigger: { trigger: s(".h-iris"), pin: true, scrub: 1, end: "+=160%" } })
      .fromTo(s(".iris"), { clipPath: "circle(10% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "power2.inOut" }, 0)
      .fromTo(s(".iris-img"), { scale: 1.5 }, { scale: 1, ease: "power2.out" }, 0)
      .fromTo(s(".iris-text"), { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, ease: "power3.out", duration: 0.4 }, 0)
      .to(s(".iris-text"), { y: -80, opacity: 0, duration: 0.3 }, 0.75);

    gsap.set([s(".e2"), s(".e3")], { opacity: 0, scale: 1.08 });
    gsap.set(s(".s1"), { opacity: 1 });
    gsap.timeline({ scrollTrigger: { trigger: s(".h-evolve"), pin: true, scrub: 1, end: "+=260%" } })
      .fromTo(s(".evo-fill"), { width: "0%" }, { width: "100%", ease: "none", duration: 4 }, 0)
      .from(s(".evo-stage"), { xPercent: 12, opacity: 0, duration: 0.6 }, 0)
      .to(s(".s1"), { opacity: 0, y: -24, duration: 0.3 }, 1)
      .fromTo(s(".s2"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3 }, 1.1)
      .to(s(".e2"), { opacity: 1, scale: 1, duration: 0.5 }, 1)
      .to(s(".s2"), { opacity: 0, y: -24, duration: 0.3 }, 2)
      .fromTo(s(".s3"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3 }, 2.1)
      .to(s(".e3"), { opacity: 1, scale: 1, duration: 0.5 }, 2)
      .to(s(".s3"), { opacity: 0, y: -24, duration: 0.3 }, 3)
      .fromTo(s(".s4"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3 }, 3.1)
      .to(s(".evo-stage"), { yPercent: 22, scale: 0.92, filter: "brightness(0.5)", duration: 0.9, ease: "power2.in" }, 3);

    counters(sec); rise(sec, 80);
    // 7 cm against a few hundred metres: the bar starts at that ratio
    const idg = s(".idgaf"); gsap.set(idg, { opacity: 0 });
    gsap.fromTo(s(".scale-fill"), { scaleX: 0.00023 }, { scaleX: 1, ease: "power2.inOut",
      scrollTrigger: { trigger: s(".scale"), start: "top 75%", end: "top 25%", scrub: 1,
        onUpdate: self => gsap.to(idg, { opacity: self.progress > 0.97 ? 1 : 0, duration: 0.3, overwrite: "auto" }) } });
    clips(sec);
    $$(".hs", sec).forEach(hscroll);
    gsap.fromTo(s(".pair-b"), { y: 140 }, { y: -140, ease: "none", scrollTrigger: { trigger: s(".h-pair"), scrub: true } });
    gsap.fromTo(s(".pair-a"), { y: 40 }, { y: -40, ease: "none", scrollTrigger: { trigger: s(".h-pair"), scrub: true } });
    getBtn(sec); cue(sec);
    return () => { alive = false; cancelAnimationFrame(raf); window.removeEventListener("resize", size); };
  };

  /* ------------------------------------------------------------------ one house */
  init.ohafh = (sec, still) => {
    if (still) return;
    const s = c => $(c, sec);
    // PSX crush: the sharp shot is drawn small, ordered-dithered to fewer colour levels, and scaled back up.
    const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => v / 16 - 0.5);
    const canvas = s(".crush"), ctx = canvas.getContext("2d");
    const small = document.createElement("canvas"), sctx = small.getContext("2d", { willReadFrequently: true });
    let W, H, last = "";
    const state = { p: 0 };
    const cover = (img, w, h) => { const iw = img.naturalWidth, ih = img.naturalHeight, sc = Math.max(w / iw, h / ih), dw = iw * sc, dh = ih * sc; return [(w - dw) / 2, (h - dh) / 2, dw, dh]; };
    const render = p => {
      if (!srcImg.complete || !srcImg.naturalWidth || !W) return;
      const px = Math.max(1, Math.round(1 + p * 8)), levels = Math.max(8, Math.round(28 - p * 20)), key = px + ":" + levels + ":" + W;
      if (key === last) return; last = key;
      const w = Math.ceil(W / px), h = Math.ceil(H / px);
      small.width = w; small.height = h;
      sctx.drawImage(srcImg, ...cover(srcImg, w, h));
      if (px > 1) {
        const im = sctx.getImageData(0, 0, w, h), d = im.data, step = 255 / (levels - 1);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4, t = BAYER[(y & 3) * 4 + (x & 3)] * step;
          d[i] = Math.round((d[i] + t) / step) * step; d[i + 1] = Math.round((d[i + 1] + t) / step) * step; d[i + 2] = Math.round((d[i + 2] + t) / step) * step;
        }
        sctx.putImageData(im, 0, 0);
      }
      ctx.imageSmoothingEnabled = false; ctx.clearRect(0, 0, W, H);
      ctx.drawImage(small, 0, 0, w, h, 0, 0, w * px, h * px);
    };
    const size = () => { W = canvas.width = canvas.clientWidth; H = canvas.height = canvas.clientHeight; last = ""; render(state.p); };
    const srcImg = canvasImage(canvas, () => size());
    size();
    window.addEventListener("resize", size);

    gsap.timeline({ scrollTrigger: { trigger: s(".o-crush"), pin: true, scrub: 1, end: "+=260%" } })
      .to(state, { p: 1, ease: "power1.in", duration: 1, onUpdate: () => render(state.p) }, 0)
      .to(canvas, { opacity: 0.45, scale: 1.08, duration: 1 }, 0)
      .fromTo(s(".crush-final"), { opacity: 0, scale: 1.08 }, { opacity: 0.5, scale: 1.08, duration: 0.25 }, 0.8)
      .to(s(".cue"), { opacity: 0, duration: 0.1 }, 0)
      .fromTo(s(".o-place"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25 }, 0.2)
      .fromTo(s(".o-title"), { opacity: 0, scale: 1.3, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.3, ease: "power3.out" }, 0.3)
      .fromTo(s(".o-line"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2 }, 0.6);

    counters(sec); rise(sec, 50);
    gsap.fromTo(s(".o-mountain"), { y: 120 }, { y: -40, ease: "none", scrollTrigger: { trigger: s(".o-mountain"), start: "top bottom", end: "bottom 30%", scrub: true } });

    const Rd = $$(".rounds i", sec);
    gsap.set(s(".a1"), { opacity: 1 });
    gsap.timeline({ scrollTrigger: { trigger: s(".o-ammo"), pin: true, scrub: 1, end: "+=200%" } })
      .from(Rd, { y: -200, opacity: 0, stagger: 0.08, duration: 0.6, ease: "bounce.out" }, 0)
      .to([Rd[5], Rd[4], Rd[3]], { y: 260, rotate: i => [55, -70, 30][i], opacity: 0, duration: 0.7, stagger: 0.12, ease: "power2.in" }, 0.9)
      .to(s(".a1"), { opacity: 0, y: -20, duration: 0.3 }, 1.8)
      .fromTo(s(".a2"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 1.9)
      .to([Rd[5], Rd[4], Rd[3]], { y: 0, rotate: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "back.out(1.6)" }, 2)
      .to(Rd, { filter: "brightness(1.4) drop-shadow(0 0 16px #c9a36a)", duration: 0.4 }, 2.6);

    const panes = $$(".hs", sec).map(h => ({ tw: hscroll(h), track: $(".track", h) }));
    // The wall moves with the content: down while scrolling, sideways while the gallery slides.
    const wallEl = s(".wall");
    const wall = () => {
      const y = window.scrollY; let raw = 0, sx = 0;
      for (const p of panes) {
        const st = p.tw.scrollTrigger; if (!st) continue;
        raw += Math.min(Math.max(y - st.start, 0), st.end - st.start);
        sx += gsap.getProperty(p.track, "x");
      }
      wallEl.style.backgroundPosition = `0 0, ${sx.toFixed(1)}px ${(-(y - raw)).toFixed(1)}px`;
    };
    gsap.ticker.add(wall);
    clips(sec); getBtn(sec); cue(sec);
    return () => { gsap.ticker.remove(wall); wallEl.style.backgroundPosition = ""; window.removeEventListener("resize", size); };
  };

  /* ------------------------------------------------------------------ give me your yoghurt */
  init.gmyy = (sec, still) => {
    if (still) return;
    const s = c => $(c, sec);

    // 1. the foil lid peels from the top-left corner
    const cv = s(".foil"), cx = cv.getContext("2d"), st = { d: 0 };
    let W = 0, H = 0, lid = null, alive = true;
    const makeLid = () => {
      const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
      const gr = g.createLinearGradient(0, 0, W, H);
      gr.addColorStop(0, "#d6d8dc"); gr.addColorStop(0.35, "#f5f6f8"); gr.addColorStop(0.62, "#bcc0c6"); gr.addColorStop(1, "#e9eaed");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      for (let y = 0; y < H; y += 2) { g.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,.18)" : "rgba(90,96,104,.07)"; g.fillRect(0, y, W, 1); }
      const fs = Math.min(W * 0.1, H * 0.16);
      g.textAlign = "center"; g.textBaseline = "middle"; g.font = fs + "px 'Bowlby One', sans-serif";
      const lines = [["GIVE ME YOUR", H / 2 - fs * 0.56], ["YOGHURT", H / 2 + fs * 0.56]];
      g.fillStyle = "rgba(31,63,168,.8)"; lines.forEach(([t, y]) => g.fillText(t, W / 2 + 3, y + 3));
      g.fillStyle = "#E0306A"; lines.forEach(([t, y]) => g.fillText(t, W / 2, y));
      const sm = Math.max(13, fs * 0.11);
      g.font = "700 " + sm + "px 'Doto', monospace"; g.fillStyle = "#1F3FA8"; g.textAlign = "left";
      g.fillText("↖ PEEL HERE", Math.max(70, W * 0.07), Math.max(110, H * 0.15));
      g.textAlign = "center"; g.fillText("BEST BEFORE: NOT YET · 150 G", W / 2, H / 2 + fs * 1.45);
      return c;
    };
    const draw = () => {
      if (!lid) return;
      const d = st.d, B = W + H + d + 10;
      cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, W, H);
      cx.save();
      // everything right of the fold line x + y = d is still stuck down
      cx.beginPath(); cx.moveTo(d, 0); cx.lineTo(B, 0); cx.lineTo(B, B); cx.lineTo(0, B); cx.lineTo(0, d); cx.closePath(); cx.clip();
      cx.drawImage(lid, 0, 0);
      // the peeled corner, mirrored across the fold, showing the foil's underside
      cx.setTransform(0, -1, -1, 0, d, d);
      cx.shadowColor = "rgba(20,24,40,.35)"; cx.shadowBlur = 40;
      const ug = cx.createLinearGradient(0, 0, d * 0.6, d * 0.6);
      ug.addColorStop(0, "#ffffff"); ug.addColorStop(0.5, "#e4e6ea"); ug.addColorStop(1, "#b9bdc4");
      cx.fillStyle = ug; cx.fillRect(0, 0, W, H);
      cx.restore();
    };
    const size = () => { W = cv.width = cv.clientWidth; H = cv.height = cv.clientHeight; lid = makeLid(); draw(); };
    const d0 = () => Math.min(W, H) * 0.14;
    W = cv.width = cv.clientWidth; H = cv.height = cv.clientHeight; st.d = d0();
    Promise.all([document.fonts.load("40px 'Bowlby One'"), document.fonts.load("700 20px 'Doto'")]).catch(() => {}).then(() => { if (alive) { size(); if (st.d < d0()) st.d = d0(); draw(); } });
    window.addEventListener("resize", size);
    gsap.timeline({ scrollTrigger: { trigger: s(".y-lid"), pin: true, scrub: 1, end: "+=220%", invalidateOnRefresh: true } })
      .fromTo(st, { d: () => d0() }, { d: () => (W + H) * 1.02, ease: "power1.in", duration: 1, onUpdate: draw }, 0)
      .fromTo(s(".y-hero-line"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.15 }, 0.9);

    // 2. the O becomes a porthole: zoom the whole stack around the O until it fills the screen
    const stack = s(".y-stack"), o = s(".y-o");
    const big = () => {
      const r = stack.getBoundingClientRect(), q = o.getBoundingClientRect(), sc = gsap.getProperty(stack, "scale") || 1;
      const ox = (q.left + q.width / 2 - r.left) / sc, oy = (q.top + q.height / 2 - r.top) / sc;
      stack.style.transformOrigin = ox + "px " + oy + "px";
      return Math.hypot(innerWidth, innerHeight) / ((q.width / sc) * 0.5);
    };
    big();
    gsap.timeline({ scrollTrigger: { trigger: s(".y-hook"), pin: true, scrub: 1, end: "+=240%", invalidateOnRefresh: true } })
      .from(Array.from(stack.children), { y: 80, opacity: 0, stagger: 0.08, duration: 0.3 }, 0)
      .to(stack, { scale: () => big(), ease: "power3.in", duration: 1 }, 0.5)
      .to(s(".y-hook-full"), { opacity: 1, duration: 0.12 }, 1.42)
      .fromTo(s(".y-hook-line"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2 }, 1.55);

    // 3. spoon steps: the cup empties as the three shots go by
    gsap.set(s(".ys1"), { opacity: 1 });
    gsap.timeline({ scrollTrigger: { trigger: s(".y-spoon"), pin: true, scrub: 1, end: "+=240%" } })
      .to(s(".y-fill"), { height: "60%", duration: 0.4 }, 0.6)
      .to(s(".ys1"), { opacity: 0, y: -24, duration: 0.3 }, 1)
      .fromTo(s(".ys2"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3 }, 1.1)
      .to(s(".y2"), { opacity: 1, duration: 0.4 }, 1)
      .to(s(".y-fill"), { height: "34%", duration: 0.4 }, 1.6)
      .to(s(".ys2"), { opacity: 0, y: -24, duration: 0.3 }, 2)
      .fromTo(s(".ys3"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3 }, 2.1)
      .to(s(".y3"), { opacity: 1, duration: 0.4 }, 2)
      .to(s(".y-fill"), { height: "8%", duration: 0.5 }, 2.6);

    counters(sec); rise(sec, 40);
    $$(".hs", sec).forEach(hscroll);
    $$(".sticker", sec).forEach((el, i) => gsap.from(el, { scale: 1.25, rotate: i ? 9 : -9, opacity: 0, duration: 0.6, ease: "back.out(2.4)", scrollTrigger: { trigger: el, start: "top 80%", once: true } }));
    gsap.from(s(".y-tag"), { rotate: -16, y: -50, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.5)", scrollTrigger: { trigger: s(".y-tag"), start: "top 85%", once: true } });
    return () => { alive = false; window.removeEventListener("resize", size); };
  };

  /* ------------------------------------------------------------------ ouroboros */
  init.ouro = (sec, still) => {
    const s = c => $(c, sec);
    const T = "OUROBOROS", S = ": OCULUS", t1 = s(".o-t1"), t2 = s(".o-t2"), tot = s(".o-total");
    if (still) { t1.textContent = T; t2.textContent = S; tot.textContent = num(1240); return; }

    let alive = true;
    const parts = k => { const el = $(`[data-eye="${k}"]`, sec); return { t: $(".lid.t", el), b: $(".lid.b", el), sc: $(".sclera", el), ir: $(".iris-dot", el) }; };
    const H = parts("hero"), C = parts("corner"), Wp = parts("weep");
    const close = p => { gsap.set(p.sc, { scaleY: 0.04 }); gsap.set(p.t, { y: 44 }); gsap.set(p.b, { y: -44 }); gsap.set(p.ir, { opacity: 0, scale: 0.4 }); };
    const open = (tl, p, at, d = 0.4) => tl.to(p.sc, { scaleY: 1, ease: "steps(8)", duration: d }, at).to([p.t, p.b], { y: 0, ease: "steps(8)", duration: d }, at).to(p.ir, { opacity: 1, scale: 1, ease: "steps(5)", duration: d * 0.6 }, at + d * 0.4);
    close(H); close(Wp);

    // the eyes follow the pointer, in steps
    const pos = s(".o-pos");
    const onMove = e => {
      [H, C, Wp].forEach(p => {
        const r = p.sc.getBoundingClientRect(); if (!r.width) return;
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), L = Math.hypot(dx, dy) || 1, k = Math.min(1, L / 400);
        gsap.to(p.ir, { x: dx / L * 50 * k, y: dy / L * 14 * k, duration: 0.25, ease: "steps(4)", overwrite: "auto" });
      });
      pos.textContent = "LOC " + String(Math.round(e.clientX)).padStart(4, "0") + " · " + String(Math.round(e.clientY + window.scrollY)).padStart(4, "0");
    };
    window.addEventListener("pointermove", onMove);

    // hero: the eye opens, then the title types itself
    const ty = { n: 0 };
    const type = () => { const n = Math.round(ty.n); t1.textContent = T.slice(0, Math.min(n, T.length)); t2.textContent = S.slice(0, Math.max(0, n - T.length)); };
    type();
    const hero = gsap.timeline({ scrollTrigger: { trigger: s(".o-hero"), pin: true, scrub: 1, end: "+=200%" } });
    open(hero, H, 0.05, 0.45);
    hero.to(ty, { n: T.length + S.length, ease: "none", duration: 0.4, onUpdate: type }, 0.5).fromTo(s(".o-says"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.95);
    ScrollTrigger.create({ trigger: s(".o-hero"), start: "bottom 20%", onEnter: () => gsap.to(s(".o-corner"), { opacity: 1, duration: 0.4 }), onLeaveBack: () => gsap.to(s(".o-corner"), { opacity: 0, duration: 0.3 }) });
    ScrollTrigger.create({ trigger: s(".o-hero"), start: "top top", end: "+=40%", onLeave: () => gsap.to(s(".o-hud"), { opacity: 1, duration: 0.4 }), onEnterBack: () => gsap.to(s(".o-hud"), { opacity: 0, duration: 0.3 }) });

    // score: the row fills, then the combo chips cascade and the total counts up
    const digs = $$(".o-dig", sec), cells = $$(".o-cell", sec), chips = $$(".chip", sec), tv = { v: 0 };
    const sc = gsap.timeline({ scrollTrigger: { trigger: s(".o-score"), pin: true, scrub: 1, end: "+=240%" } });
    digs.forEach((d, i) => sc.fromTo(d, { opacity: 0, y: -30 }, { opacity: 1, y: 0, color: "#fff", duration: 0.12 }, 0.1 + i * 0.14));
    sc.fromTo(s(".o-m1"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.2).to(s(".o-m1"), { opacity: 0, duration: 0.1 }, 0.85)
      .to(cells, { backgroundColor: "#2a2400", duration: 0.08, stagger: 0.02 }, 0.9).to(cells, { backgroundColor: "#0a0a0a", duration: 0.2 }, 1.2);
    chips.forEach((c, i) => sc.fromTo(c, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.12, ease: "back.out(2)" }, 1 + i * 0.16));
    sc.to(tv, { v: 1240, duration: 0.8, ease: "power2.out", onUpdate: () => tot.textContent = num(tv.v) }, 1).fromTo(s(".o-m2"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 1.8);
    gsap.to(chips[4], { boxShadow: "0 0 28px rgba(255,0,0,.95)", repeat: -1, yoyo: true, duration: 0.6 });

    // the weeping eye
    const tears = s(".o-tears");
    for (let i = 0; i < 7; i++) {
      const t = document.createElement("i");
      t.style.left = (44 + (i % 3 - 1) * 5 + Math.random() * 6) + "%";
      tears.appendChild(t);
      gsap.fromTo(t, { y: 0, opacity: 1 }, { y: "45vh", opacity: 0, duration: 1.6 + Math.random(), repeat: -1, delay: Math.random() * 1.6, ease: "power1.in" });
    }
    const ws = $$(".o-weep-lines p", sec), wt = gsap.timeline({ scrollTrigger: { trigger: s(".o-weep"), pin: true, scrub: 1, end: "+=240%" } });
    open(wt, Wp, 0, 0.3);
    ws.forEach((w, i) => { wt.fromTo(w, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.4 + i * 0.4); if (i < ws.length - 1) wt.to(w, { opacity: 0, duration: 0.15 }, 0.7 + i * 0.4); });

    // merchant, with a blip on hover once the visitor has clicked or tapped anywhere
    $$(".hs", sec).forEach(hscroll);
    let ac = null;
    const unlock = () => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch (_) {} };
    window.addEventListener("pointerdown", unlock);
    const blip = () => {
      if (!ac || ac.state !== "running") return;
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "square"; o.frequency.value = 660;
      g.gain.setValueAtTime(0.04, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.09);
      o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.1);
    };
    const items = $$(".item", sec);
    items.forEach(el => el.addEventListener("mouseenter", blip));

    // CRT: rolling band, flicker, ticker, REC light, running clock
    gsap.to(s(".crt-roll"), { y: "100vh", duration: 7, ease: "none", repeat: -1 });
    let flickT = 0;
    const flick = () => { if (!alive) return; gsap.to(sec, { opacity: 0.93 + Math.random() * 0.07, duration: 0.05, onComplete: () => gsap.to(sec, { opacity: 1, duration: 0.08 }) }); flickT = setTimeout(flick, 120 + Math.random() * 1400); };
    flick();
    gsap.to(s(".o-ticker"), { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
    gsap.to(s(".o-rec"), { opacity: 0.15, duration: 0.6, repeat: -1, yoyo: true, ease: "steps(1)" });
    const t0 = performance.now(), clock = s(".o-clock"), p2 = n => String(Math.floor(n)).padStart(2, "0");
    const ck = setInterval(() => { const ms = performance.now() - t0; clock.textContent = p2(ms / 3.6e6) + ":" + p2(ms / 6e4 % 60) + ":" + p2(ms / 1e3 % 60) + ":" + p2(ms / 10 % 100); }, 50);

    rise(sec, 40);
    return () => {
      alive = false; clearInterval(ck); clearTimeout(flickT);
      window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerdown", unlock);
      items.forEach(el => el.removeEventListener("mouseenter", blip));
      tears.innerHTML = ""; gsap.set(sec, { opacity: 1 });
      if (ac) ac.close();
    };
  };

  /* ------------------------------------------------------------------ about */
  // A dry-brush stroke: many thin bristle lines along a path, each starting late, lifting early and skipping.
  function bristles(ctx, pts, width, color) {
    const n = Math.max(6, Math.round(width / 1.6));
    ctx.strokeStyle = color; ctx.lineCap = "round";
    for (let b = 0; b < n; b++) {
      const off = (Math.random() - 0.5) * width, t0 = Math.random() * 0.12, t1 = 1 - Math.random() * 0.16;
      ctx.lineWidth = 1 + Math.random() * 2.6; ctx.globalAlpha = 0.45 + Math.random() * 0.55;
      ctx.beginPath(); let pen = false;
      for (let i = 0; i < pts.length - 1; i++) {
        const t = i / (pts.length - 1); if (t < t0 || t > t1 || Math.random() < 0.05) { pen = false; continue; }
        const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, j = (Math.random() - 0.5) * 1.2;
        if (!pen) { ctx.moveTo(x1 + nx * (off + j), y1 + ny * (off + j)); pen = true; }
        ctx.lineTo(x2 + nx * (off + j), y2 + ny * (off + j));
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  init.about = (sec, still) => {
    const s = c => $(c, sec);
    let alive = true, raf = 0;

    // paper grain
    const g = document.createElement("canvas"); g.width = g.height = 180;
    const gx = g.getContext("2d"), id = gx.createImageData(180, 180);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = Math.random() * 16; }
    gx.putImageData(id, 0, 0); sec.style.backgroundImage = "url(" + g.toDataURL() + ")";

    // brushstroke highlights and the "I compose" waveform
    const paintBrushes = () => $$("[data-brush]", sec).forEach(el => {
      const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const cx = c.getContext("2d"), pts = [], wave = "wave" in el.dataset;
      for (let i = 0; i <= 80; i++) { const x = 4 + (w - 8) * i / 80; const y = wave ? h / 2 + Math.sin(i * 0.9) * Math.sin(i * 0.13 + 1) * h * 0.32 * (0.4 + Math.random() * 0.6) : h / 2 + Math.sin(i / 80 * 3) * h * 0.08; pts.push([x, y]); }
      bristles(cx, pts, wave ? h * 0.22 : h * 0.62, el.dataset.brush);
      el.style.backgroundImage = "url(" + c.toDataURL() + ")";
    });
    paintBrushes();

    // the portrait is revealed through a mask that fills up with brushstrokes
    const cv = s(".pfp-cv"), ctx = cv.getContext("2d"), mask = document.createElement("canvas"), mx = mask.getContext("2d");
    const R = Math.random, strokes = [];
    const add = (count, cx0, cy0, spread, wMin, wMax, vert) => { for (let i = 0; i < count; i++) strokes.push({ x: cx0 + (R() - 0.5) * spread * 2, y: cy0 + (R() - 0.5) * spread * 2.4, a: vert ? Math.PI / 2 + (R() - 0.5) * 0.9 : (R() - 0.5) * 1.4, len: 0.15 + R() * 0.35, w: wMin + R() * (wMax - wMin) }); };
    add(40, 0.5, 0.5, 0.36, 0.1, 0.18, false); add(90, 0.5, 0.46, 0.26, 0.05, 0.1, true); add(50, 0.5, 0.28, 0.18, 0.03, 0.06, false); add(40, 0.5, 0.55, 0.3, 0.06, 0.12, true);
    let drawn = 0, W = 0, H = 0;
    const st = { p: still ? 1 : 0 };
    const size = () => { W = cv.width = cv.clientWidth; H = cv.height = cv.clientHeight; mask.width = W; mask.height = H; drawn = 0; };
    const render = p => {
      if (!img.complete || !img.naturalWidth || !W) return;
      const n = Math.floor(strokes.length * Math.min(1, p / 0.9));
      if (n < drawn) { mx.clearRect(0, 0, W, H); drawn = 0; }
      for (; drawn < n; drawn++) {
        const k = strokes[drawn], cx0 = k.x * W, cy0 = k.y * H, L = k.len * Math.min(W, H) * 1.1, pts = [];
        for (let i = 0; i <= 14; i++) { const t = i / 14 - 0.5; pts.push([cx0 + Math.cos(k.a) * L * t + Math.sin(t * 3) * 6, cy0 + Math.sin(k.a) * L * t]); }
        bristles(mx, pts, k.w * W, "#fff");
      }
      ctx.globalCompositeOperation = "source-over"; ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);
      ctx.globalCompositeOperation = "destination-in"; ctx.drawImage(mask, 0, 0); ctx.globalCompositeOperation = "source-over";
    };
    const img = canvasImage(cv, () => render(st.p));
    size(); render(st.p);
    const onResize = () => { size(); render(st.p); paintBrushes(); };
    window.addEventListener("resize", onResize);
    const cleanup = () => { alive = false; cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); sec.style.backgroundImage = ""; };
    if (still) return cleanup;

    gsap.timeline({ scrollTrigger: { trigger: s(".a-hero"), pin: true, scrub: 1, end: "+=200%" } })
      .fromTo(st, { p: 0 }, { p: 1, ease: "none", duration: 1, onUpdate: () => render(st.p) }, 0)
      .to(s(".cue"), { opacity: 0, duration: 0.1 }, 0);
    cue(sec);

    // projects bounce around the stage, slow down, then line up as a list
    const stage = s(".b-stage"), stats = $$(".b-status", sec), count = s(".b-count");
    const bodies = $$(".b-item", sec).map((el, i) => ({ el, x: 40 + i * 120, y: 140 + i * 90, vx: (i % 2 ? -1 : 1) * (160 + i * 40), vy: (i % 2 ? 1 : -1) * (120 + i * 30) }));
    let prog = 0, last = performance.now();
    const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
    const tick = now => {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const SW = stage.clientWidth, SH = stage.clientHeight, sp = 1 - ease(prog / 0.55), L = ease((prog - 0.45) / 0.35);
      bodies.forEach((b, i) => {
        const w = b.el.offsetWidth, h = b.el.offsetHeight;
        b.x += b.vx * dt * sp; b.y += b.vy * dt * sp;
        if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx); } if (b.x > SW - w) { b.x = Math.max(0, SW - w); b.vx = -Math.abs(b.vx); }
        if (b.y < 60) { b.y = 60; b.vy = Math.abs(b.vy); } if (b.y > SH - h) { b.y = Math.max(60, SH - h); b.vy = -Math.abs(b.vy); }
        const tx = Math.min(64, SW * 0.04), ty = SH * 0.26 + i * SH * 0.2;
        b.el.style.transform = "translate(" + (b.x + (tx - b.x) * L).toFixed(1) + "px," + (b.y + (ty - b.y) * L).toFixed(1) + "px)";
      });
      const so = Math.max(0, Math.min(1, (prog - 0.8) / 0.15));
      stats.forEach(e => e.style.opacity = so); count.style.opacity = so;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    ScrollTrigger.create({ trigger: stage, pin: true, start: "top top", end: "+=200%", onUpdate: self => { prog = self.progress; } });

    rise(sec, 50); clips(sec);
    $$(".hs", sec).forEach(hscroll);
    return () => { cleanup(); bodies.forEach(b => b.el.style.transform = ""); stats.forEach(e => e.style.opacity = ""); count.style.opacity = ""; };
  };

  /* ------------------------------------------------------------------ tabs */
  const wipe = $(".wipe"), ind = $(".ind"), games = $(".games"), gamesBtn = $("button", games);
  let current = null, ctx = null, cleanup = null, busy = false, queued = null;

  function moveInd(name) {
    if (!name) return;
    const a = $(`[data-link="${name === "zear" || name === "about" ? name : "games"}"]`);
    $$("[data-link]").forEach(x => { const on = x === a; x.classList.toggle("on", on); if (x.tagName === "A") on ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current"); });
    $$("[data-item]").forEach(x => { const on = x.dataset.item === name; x.classList.toggle("on", on); on ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current"); });
    ind.style.width = a.offsetWidth + "px";
    ind.style.transform = `translateX(${a.offsetLeft}px)`;
  }

  function teardown() {
    if (ctx) { ctx.revert(); ctx = null; }
    if (cleanup) { cleanup(); cleanup = null; }
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  function mount(name) {
    teardown();
    const sec = $(`.tab[data-tab="${name}"]`);
    $$(".tab").forEach(t => { t.hidden = t !== sec; });
    document.body.dataset.tab = name;
    window.scrollTo(0, 0);
    // this tab's pictures were waiting; fetch them all now so the sideways galleries don't pop in
    $$("img[loading=lazy]", sec).forEach(i => { i.loading = "eager"; if (!i.complete) i.addEventListener("load", softRefresh, { once: true }); });
    try {
      if (REDUCED) cleanup = init[name](sec, true) || null;
      else ctx = gsap.context(() => { cleanup = init[name](sec, false) || null; }, sec);
      ScrollTrigger.refresh();
    } catch (err) { console.error("[zear] init " + name + " failed:", err); }
    current = name;
    moveInd(name);
  }

  function go(name, animate = true) {
    if (!TABS.includes(name)) name = "zear";
    if (busy) { queued = name; return; }
    if (name === current) return;
    if (!animate || REDUCED || current === null) { mount(name); return; }
    busy = true;
    wipe.style.background = WIPE[name];
    const set = (clip, t) => { wipe.style.transition = t ? `clip-path ${t}` : "none"; wipe.style.clipPath = clip; };
    set("inset(100% 0% 0% 0%)");
    void wipe.offsetWidth;
    set("inset(0% 0% 0% 0%)", ".5s cubic-bezier(.7,0,.84,0)");
    setTimeout(() => {
      mount(name);
      void wipe.offsetWidth;
      set("inset(0% 0% 100% 0%)", ".6s cubic-bezier(.16,1,.3,1)");
      setTimeout(() => { busy = false; if (queued) { const q = queued; queued = null; go(q); } }, 620);
    }, 520);
  }

  /* ------------------------------------------------------------------ games menu */
  const canHover = window.matchMedia("(hover: hover)").matches;
  let menuT = 0;
  const setMenu = open => { clearTimeout(menuT); games.classList.toggle("open", open); gamesBtn.setAttribute("aria-expanded", open ? "true" : "false"); };
  if (canHover) {
    games.addEventListener("mouseenter", () => setMenu(true));
    games.addEventListener("mouseleave", () => { clearTimeout(menuT); menuT = setTimeout(() => setMenu(false), 120); });
  }
  // A mouse click on a hover device keeps it open (hover already opened it); keyboard and touch toggle.
  gamesBtn.addEventListener("click", e => setMenu(canHover && e.detail > 0 ? true : !games.classList.contains("open")));
  games.addEventListener("focusout", e => { if (!games.contains(e.relatedTarget)) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && games.classList.contains("open")) { setMenu(false); gamesBtn.focus(); } });

  /* ------------------------------------------------------------------ clicks, history, boot */
  document.addEventListener("click", e => {
    if (!games.contains(e.target)) setMenu(false);
    const q = e.target.closest("[data-request]");
    if (q) {
      // "Request access" takes you to this tab's feedback form
      e.preventDefault();
      const form = $("form", q.closest(".tab"));
      if (form) {
        window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: REDUCED ? "auto" : "smooth" });
        form.elements.text.focus({ preventScroll: true });
      }
      return;
    }
    const a = e.target.closest("[data-goto]");
    if (!a) return;
    e.preventDefault();
    setMenu(false);
    const name = a.dataset.goto;
    if (name !== current) { try { history.pushState(null, "", "#" + name); } catch (_) {} }
    go(name);
  });
  window.addEventListener("popstate", () => go(location.hash.slice(1)));
  window.addEventListener("resize", () => moveInd(current));
  if (document.fonts) document.fonts.ready.then(() => { moveInd(current); softRefresh(); });
  $$("img").forEach(i => { if (!i.complete) i.addEventListener("load", softRefresh, { once: true }); });

  go(location.hash.slice(1), false);
})();
