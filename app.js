(function () {
  "use strict";

  var VOD = "https://www.youtube.com/watch?v=wZ0rwJWBLec&t=";
  var KEY = "loa-on-air:state";
  var MAX_AGE = 10 * 60 * 1000;

  var root = document.documentElement;
  var params = new URLSearchParams(window.location.search);
  var stagesEl = document.getElementById("stages");
  var stages = Array.prototype.slice.call(document.querySelectorAll(".stage"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".dot"));
  var counter = document.getElementById("counter");
  var timecode = document.getElementById("timecode");
  var lamp = document.querySelector(".lamp");
  var tpBtn = document.getElementById("tp-toggle");
  var total = stages.length;

  var reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  function dur(ms) { return reducedMq.matches ? 0 : ms; }

  var controlMode = params.get("control") === "1";
  var syncOn = params.get("sync") !== "0" && !controlMode; /* the control view reads and writes the state itself */
  var autoOn = params.get("auto") === "1";

  /* ---------- Easing: cubic-bezier(.2,.7,.2,1) ---------- */

  function bezier(x1, y1, x2, y2) {
    function at(t, p1, p2) {
      var u = 1 - t;
      return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
    }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 24; i++) {
        t = (lo + hi) / 2;
        if (at(t, x1, x2) < x) lo = t; else hi = t;
      }
      return at(t, y1, y2);
    };
  }
  var ease = bezier(0.2, 0.7, 0.2, 1);

  /* ---------- Storage (sync) ---------- */

  function readRaw() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function parse(raw) {
    if (!raw) return null;
    try {
      var st = JSON.parse(raw);
      return st && typeof st === "object" ? st : null;
    } catch (e) { return null; }
  }
  var lastRaw = readRaw();

  /* ---------- Layout ---------- */

  function baseLayout() {
    var p = params.get("layout");
    if (p === "vertical" || p === "landscape") return p;
    return window.matchMedia("(orientation: portrait)").matches ? "vertical" : "landscape";
  }
  function chooseLayout() {
    if (controlMode) return "control";
    var mode = baseLayout();
    var w = window.innerWidth, h = window.innerHeight;
    var scale = mode === "vertical"
      ? Math.min(w / 1080, h / 1920) * 16
      : Math.min(w / 1920, h / 1080) * 16;
    return scale < 10 ? "narrow" : mode;
  }
  root.setAttribute("data-layout", chooseLayout());

  /* ---------- State ---------- */

  var current = -1;
  var navTarget = null;
  var navTimer = 0;
  var loaded = false;
  var tpOn;
  var tpSeq = 0;      /* bumped only by an explicit T press; followers apply tp only when it changes */
  var lastRemoteAt = 0;
  var rasIdx = 0;

  var rasStage = stages.indexOf(document.getElementById("s16"));
  var rasBox = document.getElementById("rasamoa");
  var rasImgs = rasBox ? Array.prototype.slice.call(rasBox.querySelectorAll("img")) : [];
  var rasCap = document.getElementById("rasamoa-cap");
  var rasLink = document.getElementById("rasamoa-link");
  var rasSwap = 0;
  var rasAuto = 0;

  function writeState() {
    if (!syncOn) return;
    var st = {
      stage: navTarget !== null ? navTarget : current,
      tp: tpOn,
      tpSeq: tpSeq,
      rasamoa: rasIdx,
      at: Date.now()
    };
    var raw = JSON.stringify(st);
    try {
      window.localStorage.setItem(KEY, raw);
      lastRaw = raw;
    } catch (e) { /* storage blocked */ }
  }

  /* ---------- Timecode ---------- */

  var tcSec = 0;
  var tcRaf = 0;
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmt(s) {
    s = Math.max(0, Math.round(s));
    return pad(Math.floor(s / 3600)) + ":" + pad(Math.floor((s % 3600) / 60)) + ":" + pad(s % 60);
  }
  function tweenTo(target, ms) {
    if (tcRaf) window.cancelAnimationFrame(tcRaf);
    tcRaf = 0;
    var d = dur(ms);
    var from = tcSec;
    if (!d || from === target) {
      tcSec = target;
      timecode.textContent = fmt(target);
      return;
    }
    var t0 = null;
    function step(now) {
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / d);
      tcSec = from + (target - from) * ease(p);
      timecode.textContent = fmt(tcSec);
      if (p < 1) {
        tcRaf = window.requestAnimationFrame(step);
      } else {
        tcSec = target;
        timecode.textContent = fmt(target);
        tcRaf = 0;
      }
    }
    tcRaf = window.requestAnimationFrame(step);
  }
  timecode.textContent = fmt(0);

  /* ---------- Talking points ---------- */

  function setTp(on) {
    tpOn = !!on;
    root.setAttribute("data-tp", tpOn ? "on" : "off");
    if (tpBtn) tpBtn.setAttribute("aria-pressed", tpOn ? "true" : "false");
  }

  /* ---------- Rasamoa ---------- */

  function setRasamoa(k) {
    if (!rasImgs.length) return;
    var n = rasImgs.length;
    k = ((k % n) + n) % n;
    if (k === rasIdx && rasImgs[k].classList.contains("is-shown")) return;
    rasIdx = k;
    rasImgs.forEach(function (img, i) {
      img.classList.toggle("is-shown", i === k);
      if (i === k) img.removeAttribute("aria-hidden"); else img.setAttribute("aria-hidden", "true");
    });
    var img = rasImgs[k];
    if (rasSwap) window.clearTimeout(rasSwap);
    var swap = function () {
      rasSwap = 0;
      rasCap.textContent = img.getAttribute("data-caption");
      rasLink.textContent = img.getAttribute("data-tc");
      rasLink.setAttribute("href", VOD + img.getAttribute("data-sec") + "s");
    };
    var d = dur(200);
    if (d) rasSwap = window.setTimeout(swap, d); else swap();
  }

  function updateAutoplay() {
    if (!autoOn) return;
    if (current === rasStage) {
      if (!rasAuto) {
        rasAuto = window.setInterval(function () {
          if (syncOn && Date.now() - lastRemoteAt < 5500) return;
          setRasamoa(rasIdx + 1);
          writeState();
        }, 6000);
      }
    } else if (rasAuto) {
      window.clearInterval(rasAuto);
      rasAuto = 0;
    }
  }

  /* ---------- Active stage ---------- */

  function setActive(i, fromRemote) {
    if (i < 0 || i >= total || i === current) return;
    current = i;
    var stage = stages[i];
    var sec = parseInt(stage.getAttribute("data-sec"), 10) || 0;

    stages.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
    dots.forEach(function (d, k) {
      var on = k === i;
      d.classList.toggle("is-active", on);
      if (on) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
    counter.textContent = pad(i + 1) + " / " + pad(total);
    timecode.setAttribute("href", VOD + sec + "s");
    if (loaded) tweenTo(sec, 420);
    try { window.history.replaceState(null, "", "#s" + i); } catch (e) { /* ignore */ }
    updateAutoplay();

    if (fromRemote) return;
    if (navTarget !== null) {
      if (i === navTarget) clearNav();
      return;
    }
    writeState();
  }

  function clearNav() {
    navTarget = null;
    if (navTimer) window.clearTimeout(navTimer);
    navTimer = 0;
  }

  function scrollToStage(i, smooth) {
    stages[i].scrollIntoView({
      behavior: smooth && !reducedMq.matches ? "smooth" : "auto",
      block: "start"
    });
  }

  function goTo(i) {
    i = Math.max(0, Math.min(total - 1, i));
    if (i === current) {
      var wasMoving = navTarget !== null;
      clearNav();
      if (wasMoving) {
        scrollToStage(current, true); /* pull a scroll already under way back to this stage */
        writeState();                 /* and tell the other instance we stayed */
      }
      return;
    }
    clearNav();
    navTarget = i;
    navTimer = window.setTimeout(clearNav, 1500);
    writeState();
    scrollToStage(i, true);
  }

  /* ---------- Active-stage detection ---------- */

  var observer = null;
  function onNarrowScroll() {
    var line = window.innerHeight * 0.4;
    var idx = 0;
    for (var k = 0; k < total; k++) {
      if (stages[k].getBoundingClientRect().top <= line) idx = k;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) idx = total - 1;
    if (navTarget !== null && idx === navTarget) clearNav();
    setActive(idx, true); /* scroll-derived: never written back to the synced state */
  }
  function setupDetection() {
    if (observer) { observer.disconnect(); observer = null; }
    window.removeEventListener("scroll", onNarrowScroll);
    if (controlMode) return;
    if (root.getAttribute("data-layout") === "narrow") {
      window.addEventListener("scroll", onNarrowScroll, { passive: true });
      return;
    }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= 0.6) {
          setActive(stages.indexOf(e.target), false);
        }
      });
    }, { root: stagesEl, threshold: 0.6 });
    stages.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Overflow guard ---------- */

  function overflowing(s) { return s.scrollHeight > s.clientHeight + 1; }
  function fitCheck() {
    stages.forEach(function (s) { s.classList.remove("is-tight"); s.classList.remove("is-tighter"); });
    if (root.getAttribute("data-layout") === "narrow" || controlMode) return;
    stages.forEach(function (s) { if (overflowing(s)) s.classList.add("is-tight"); });
    stages.forEach(function (s) { if (s.classList.contains("is-tight") && overflowing(s)) s.classList.add("is-tighter"); });
    stages.forEach(function (s) {
      if (s.classList.contains("is-tighter") && overflowing(s)) console.warn("overflow", s.id);
    });
  }

  /* ---------- Apply synced state ---------- */

  var lastAppliedAt = 0;
  function isIndex(v, n) { return typeof v === "number" && isFinite(v) && Math.floor(v) === v && v >= 0 && v < n; }
  function applyState(st) {
    if (!st) return;
    if (typeof st.at === "number") {
      if (st.at < lastAppliedAt) return; /* a delayed storage event must not overwrite newer state */
      lastAppliedAt = st.at;
    }
    lastRemoteAt = Date.now();
    if (typeof st.tpSeq === "number" && st.tpSeq !== tpSeq) {
      tpSeq = st.tpSeq;
      if (typeof st.tp === "boolean" && st.tp !== tpOn) {
        setTp(st.tp);
        fitCheck();
      }
    }
    if (isIndex(st.rasamoa, rasImgs.length || 1)) setRasamoa(st.rasamoa);
    if (isIndex(st.stage, total) && st.stage !== current) {
      clearNav();
      scrollToStage(st.stage, false);
      setActive(st.stage, true);
    }
  }

  function onRaw(raw) {
    if (!syncOn || !raw || raw === lastRaw) return;
    lastRaw = raw;
    applyState(parse(raw));
  }

  /* ---------- Initial state ---------- */

  var startStage = 0;
  var pStage = params.get("stage");
  var hashMatch = /^#s(\d+)$/.exec(window.location.hash);
  if (pStage !== null && /^\d+$/.test(pStage)) startStage = parseInt(pStage, 10);
  else if (hashMatch) startStage = parseInt(hashMatch[1], 10);

  var pTp = params.get("tp");
  var startTp = pTp === "1" ? true : pTp === "0" ? false : baseLayout() !== "vertical";

  var synced = syncOn ? parse(lastRaw) : null;
  if (synced && typeof synced.at === "number" && Date.now() - synced.at <= MAX_AGE) {
    if (isIndex(synced.stage, total)) startStage = synced.stage;
    if (typeof synced.at === "number") lastAppliedAt = synced.at;
    if (typeof synced.tpSeq === "number") tpSeq = synced.tpSeq; /* adopt the sequence, keep this layout's own tp default */
    if (isIndex(synced.rasamoa, rasImgs.length || 1)) setRasamoa(synced.rasamoa);
  }
  startStage = Math.max(0, Math.min(total - 1, startStage));

  setTp(startTp);
  if (params.get("presenter") === "1") root.setAttribute("data-presenter", "on");
  if (params.get("stream") === "1") root.setAttribute("data-stream", "on");

  scrollToStage(startStage, false);
  setActive(startStage, true);
  setupDetection();
  fitCheck();

  /* Load motion: lamp, then the timecode rolls from 00:00:00. */
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      lamp.classList.add("is-on");
      window.setTimeout(function () {
        loaded = true;
        var sec = parseInt(stages[current].getAttribute("data-sec"), 10) || 0;
        tweenTo(sec, 700);
      }, dur(180));
    });
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitCheck);
  }

  /* ---------- Resize ---------- */

  var resizeRaf = 0;
  window.addEventListener("resize", function () {
    if (resizeRaf) return;
    resizeRaf = window.requestAnimationFrame(function () {
      resizeRaf = 0;
      var mode = chooseLayout();
      if (mode !== root.getAttribute("data-layout")) {
        root.setAttribute("data-layout", mode);
        setupDetection();
        if (current >= 0) scrollToStage(current, false);
      }
      fitCheck();
    });
  });

  /* ---------- Sync listeners ---------- */

  if (syncOn) {
    window.addEventListener("storage", function (e) {
      if (e.key === KEY) onRaw(e.newValue);
    });
    window.setInterval(function () { onRaw(readRaw()); }, 250);
  }

  /* ---------- Input ---------- */

  function toggleTp() {
    setTp(!tpOn);
    tpSeq += 1;
    fitCheck();
    writeState();
  }

  dots.forEach(function (d) {
    d.addEventListener("click", function () {
      goTo(parseInt(d.getAttribute("data-stage"), 10));
    });
  });

  if (tpBtn) tpBtn.addEventListener("click", toggleTp);

  function isTyping(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
  }

  document.addEventListener("keydown", function (e) {
    if (controlMode) return;
    if (isTyping(e.target)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var base = navTarget !== null ? navTarget : current;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
      case "PageDown":
      case " ":
      case "Spacebar":
        e.preventDefault();
        goTo(base + 1);
        return;
      case "ArrowUp":
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault();
        goTo(base - 1);
        return;
      case "Home":
        e.preventDefault();
        goTo(0);
        return;
      case "End":
        e.preventDefault();
        goTo(total - 1);
        return;
    }
    var k = e.key.length === 1 ? e.key.toLowerCase() : "";
    if (k === "t") {
      toggleTp();
    } else if (k === "n" || k === "b") {
      if (current !== rasStage) return;
      setRasamoa(rasIdx + (k === "n" ? 1 : -1));
      writeState();
    } else if (k === "p") {
      var on = root.getAttribute("data-presenter") === "on";
      if (on) root.removeAttribute("data-presenter"); else root.setAttribute("data-presenter", "on");
    }
  });
  /* ---------- OBS hook: obs-browser "emit_event" custom events ----------
     obs-eval.mjs CallVendorRequest '{"vendorName":"obs-browser","requestType":"emit_event",
       "requestData":{"event_name":"loa-control","event_data":{"op":"next"}}}' --write
     ops: next, prev, home, end, goto (stage), tp, rasamoaNext, rasamoaPrev. Every browser source
     receives the event; each instance applies it and the shared state keeps them identical. */
  if (!controlMode) {
    window.addEventListener("loa-control", function (e) {
      var d = (e && e.detail) || {};
      var base = navTarget !== null ? navTarget : current;
      switch (d.op) {
        case "next": goTo(base + 1); break;
        case "prev": goTo(base - 1); break;
        case "home": goTo(0); break;
        case "end": goTo(total - 1); break;
        case "goto": if (isIndex(d.stage, total)) goTo(d.stage); break;
        case "tp": toggleTp(); break;
        case "rasamoaNext": if (current === rasStage) { setRasamoa(rasIdx + 1); writeState(); } break;
        case "rasamoaPrev": if (current === rasStage) { setRasamoa(rasIdx - 1); writeState(); } break;
      }
    });
  }

  /* ---------- Remote control view (?control=1): meant for an OBS custom browser dock ----------
     The dock shares the browser sources' storage, so clicking here moves both canvases. */
  if (controlMode) {
    var st = parse(readRaw()) || {};
    var ctl = {
      stage: isIndex(st.stage, total) ? st.stage : 0,
      tp: typeof st.tp === "boolean" ? st.tp : false,
      tpSeq: typeof st.tpSeq === "number" ? st.tpSeq : 0,
      rasamoa: isIndex(st.rasamoa, rasImgs.length || 1) ? st.rasamoa : 0
    };
    function ctlWrite() {
      var raw = JSON.stringify({ stage: ctl.stage, tp: ctl.tp, tpSeq: ctl.tpSeq, rasamoa: ctl.rasamoa, at: Date.now() });
      try { window.localStorage.setItem(KEY, raw); lastRaw = raw; } catch (e) { /* storage blocked */ }
      ctlRender();
    }
    function ctlGo(i) { ctl.stage = Math.max(0, Math.min(total - 1, i)); ctlWrite(); }
    function ctlTp() { ctl.tp = !ctl.tp; ctl.tpSeq += 1; ctlWrite(); }
    function ctlRas(d) { var n = rasImgs.length || 1; ctl.rasamoa = ((ctl.rasamoa + d) % n + n) % n; ctlWrite(); }

    var panel = document.createElement("section");
    panel.className = "ctl";
    panel.setAttribute("aria-label", "Stage control");
    var titles = stages.map(function (s) {
      var h = s.querySelector("h1, h2");
      return h ? h.textContent.trim() : s.id;
    });
    panel.innerHTML =
      '<div class="ctl__now"><span class="ctl__counter" id="ctl-counter"></span><a class="ctl__tc" id="ctl-tc" target="_blank" rel="noopener"></a></div>' +
      '<div class="ctl__row">' +
        '<button type="button" class="ctl__btn" data-op="prev">Prev</button>' +
        '<button type="button" class="ctl__btn ctl__btn--main" data-op="next">Next</button>' +
        '<button type="button" class="ctl__btn" data-op="home">Home</button>' +
        '<button type="button" class="ctl__btn" data-op="end">End</button>' +
      '</div>' +
      '<div class="ctl__row">' +
        '<button type="button" class="ctl__btn" data-op="tp" id="ctl-tp">Talking points</button>' +
        '<button type="button" class="ctl__btn" data-op="rasPrev">Rasamoa &#8249;</button>' +
        '<button type="button" class="ctl__btn" data-op="rasNext">Rasamoa &#8250;</button>' +
      '</div>' +
      '<div class="ctl__body">' +
      '<article class="ctl__prompt" id="ctl-prompt" aria-live="polite"></article>' +
      '<ol class="ctl__list" id="ctl-list">' +
        titles.map(function (t, i) {
          return '<li><button type="button" class="ctl__stage" data-stage="' + i + '"><span class="ctl__num">' + pad(i + 1) + '</span>' + t.replace(/&/g, "&amp;").replace(/</g, "&lt;") + '</button></li>';
        }).join("") +
      '</ol>' +
      '</div>' +
      '<p class="ctl__hint">Keys here: arrows, Home, End, T, N, B. The OBS sources follow. Float this dock onto another monitor and enlarge it for bigger text.</p>';
    document.body.appendChild(panel);
    var sizeParam = parseInt(params.get("size"), 10);
    if (sizeParam >= 12 && sizeParam <= 80) document.getElementById("ctl-prompt").style.fontSize = sizeParam + "px";

    function ctlRender() {
      var s = stages[ctl.stage];
      var sec = parseInt(s.getAttribute("data-sec"), 10) || 0;
      document.getElementById("ctl-counter").textContent = pad(ctl.stage + 1) + " / " + pad(total) + "  " + titles[ctl.stage];
      var tc = document.getElementById("ctl-tc");
      tc.textContent = s.getAttribute("data-tc");
      tc.setAttribute("href", VOD + sec + "s");
      /* prompter: the stage's card (title, bullets, stat tile or glossary) and its talking points */
      var card = s.querySelector(".card");
      var tp = s.querySelector(".tp");
      var html = card ? card.innerHTML : "";
      html = html.replace(/<p class="title__keys">[\s\S]*?<\/p>/, "");
      if (tp) html += '<aside class="ctl__tp">' + tp.innerHTML + "</aside>";
      if (ctl.stage === rasStage && rasImgs.length) html += '<p class="ctl__ras">Rasamoa image ' + (ctl.rasamoa + 1) + " / " + rasImgs.length + ": " + (rasImgs[ctl.rasamoa].getAttribute("data-caption") || "") + "</p>";
      document.getElementById("ctl-prompt").innerHTML = html;
      var tpBtnC = document.getElementById("ctl-tp");
      tpBtnC.setAttribute("aria-pressed", ctl.tp ? "true" : "false");
      tpBtnC.classList.toggle("is-on", ctl.tp);
      Array.prototype.forEach.call(panel.querySelectorAll(".ctl__stage"), function (b, i) {
        b.classList.toggle("is-active", i === ctl.stage);
        if (i === ctl.stage) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
      });
    }
    panel.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-stage")) { ctlGo(parseInt(b.getAttribute("data-stage"), 10)); return; }
      switch (b.getAttribute("data-op")) {
        case "prev": ctlGo(ctl.stage - 1); break;
        case "next": ctlGo(ctl.stage + 1); break;
        case "home": ctlGo(0); break;
        case "end": ctlGo(total - 1); break;
        case "tp": ctlTp(); break;
        case "rasPrev": ctlRas(-1); break;
        case "rasNext": ctlRas(1); break;
      }
    });
    document.addEventListener("keydown", function (e) {
      if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
      switch (e.key) {
        case "ArrowDown": case "ArrowRight": case "PageDown": case " ": case "Spacebar": e.preventDefault(); ctlGo(ctl.stage + 1); return;
        case "ArrowUp": case "ArrowLeft": case "PageUp": e.preventDefault(); ctlGo(ctl.stage - 1); return;
        case "Home": e.preventDefault(); ctlGo(0); return;
        case "End": e.preventDefault(); ctlGo(total - 1); return;
      }
      var k = e.key.length === 1 ? e.key.toLowerCase() : "";
      if (k === "t") ctlTp(); else if (k === "n") ctlRas(1); else if (k === "b") ctlRas(-1);
    });
    /* follow the sources too (someone may press keys in an Interact window) */
    window.setInterval(function () {
      var raw = readRaw();
      if (!raw || raw === lastRaw) return;
      lastRaw = raw;
      var x = parse(raw); if (!x) return;
      if (isIndex(x.stage, total)) ctl.stage = x.stage;
      if (typeof x.tp === "boolean") ctl.tp = x.tp;
      if (typeof x.tpSeq === "number") ctl.tpSeq = x.tpSeq;
      if (isIndex(x.rasamoa, rasImgs.length || 1)) ctl.rasamoa = x.rasamoa;
      ctlRender();
    }, 250);
    ctlRender();
  }
})();
