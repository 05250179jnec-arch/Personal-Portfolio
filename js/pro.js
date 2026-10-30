// ==========================================================
// Professional effects (inspired by Awwwards-style sites)
// 1. Loading screen percentage counter
// 2. Custom cursor (dot + ring)
// 3. Magnetic buttons
// ==========================================================
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---------- 1. Loading percentage: counts 0 → 100 while the boot screen shows ----------
  const pct = document.getElementById("bootPct");
  const loader = document.getElementById("loader");
  if (pct && loader && !loader.classList.contains("done")) {
    const start = performance.now();
    const duration = 1800; // a little shorter than the 2s boot screen
    (function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      pct.textContent = Math.round(100 * (1 - Math.pow(1 - t, 2)));
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  // ---------- 2. Custom cursor (computers only) ----------
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (finePointer && !reduceMotion && dot && ring) {
    document.body.classList.add("has-cursor");
    let mx = -100, my = -100; // mouse position
    let rx = -100, ry = -100; // ring position (follows smoothly)

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
    }, { passive: true });

    // The ring eases towards the mouse every frame (linear interpolation)
    (function follow() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(follow);
    })();

    // Grow the ring over anything clickable
    const clickable = "a, button, [role='button'], input, textarea, select, .photo-thumb";
    document.addEventListener("mouseover", (e) => {
      ring.classList.toggle("hover", !!e.target.closest(clickable));
    });
    document.addEventListener("mousedown", () => ring.classList.add("press"));
    document.addEventListener("mouseup", () => ring.classList.remove("press"));
    document.addEventListener("mouseleave", () => document.body.classList.add("cursor-out"));
    document.addEventListener("mouseenter", () => document.body.classList.remove("cursor-out"));
  }

  // ---------- 3. Magnetic buttons: pulled slightly towards the mouse ----------
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".btn, .icon-btn, .logo, .back-top").forEach((el) => {
      const strength = el.classList.contains("btn") ? 0.25 : 0.35;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + x * strength + "px," + y * strength + "px)";
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }
})();

// ==========================================================
// 4. Section headings slide up word by word
// Each word is wrapped in two spans: the outer one hides
// anything outside it (overflow: hidden), the inner one starts
// below and slides up when the heading scrolls into view.
// ==========================================================
(function () {
  document.querySelectorAll(".section-head h2").forEach((h2) => {
    const words = h2.textContent.trim().split(/\s+/);
    h2.setAttribute("aria-label", h2.textContent.trim()); // screen readers read the whole heading
    h2.textContent = "";
    words.forEach((word, i) => {
      const outer = document.createElement("span");
      outer.className = "w";
      outer.setAttribute("aria-hidden", "true");
      const inner = document.createElement("span");
      inner.textContent = word;
      inner.style.setProperty("--i", i);
      outer.appendChild(inner);
      h2.appendChild(outer);
      if (i < words.length - 1) h2.appendChild(document.createTextNode(" "));
    });
  });
})();
