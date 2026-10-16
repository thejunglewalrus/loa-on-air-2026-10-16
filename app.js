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

  var syncOn = params.get("sync") !== "0";
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
    stages.forEach(function (s) { s.classList.remove("is-tight"); });
    if (root.getAttribute("data-layout") === "narrow") return;
    stages.forEach(function (s) { if (overflowing(s)) s.classList.add("is-tight"); });
    stages.forEach(function (s) {
      if (s.classList.contains("is-tight") && overflowing(s)) console.warn("overflow", s.id);
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
})();
