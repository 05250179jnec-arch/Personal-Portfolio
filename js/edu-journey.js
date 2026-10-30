// ==========================================================
// Education journey
// The section pins (position: sticky). Scrolling flies you
// forward through space: stars streak past, a portal ring
// grows, and each education milestone flies in from the
// distance, then you zoom past it to the next one.
// ==========================================================
(function () {
  const root = document.getElementById("eduJourney");
  if (!root) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stops = [...root.querySelectorAll(".ej-data li")].map((li) => li.dataset);
  const objs = root.querySelectorAll(".ej-obj");
  const N = stops.length;
  const rings = [...document.querySelectorAll("#ejRings span")];
  const bar = document.getElementById("ejBar");
  const hint = document.getElementById("ejHint");
  const numEl = document.getElementById("ejNum");
  const yearEl = document.getElementById("ejYear");
  const titleEl = document.getElementById("ejTitle");
  const placeEl = document.getElementById("ejPlace");
  root.querySelector(".ej-total").textContent = "/ " + String(N).padStart(2, "0");

  const SEGMENT = 0.9; // screen heights of scrolling per milestone
  const setHeight = () => { root.style.height = (N * SEGMENT * 100 + 100) + "vh"; };
  setHeight();

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  // ---------- Text for the current milestone ----------
  let current = -1;
  function setActive(i) {
    if (i === current) return;
    current = i;
    numEl.textContent = String(i + 1).padStart(2, "0");
    yearEl.textContent = stops[i].year;
    titleEl.textContent = stops[i].title;
    placeEl.textContent = stops[i].place;
    root.style.setProperty("--c", objs[i].style.getPropertyValue("--c"));
    root.classList.remove("swap");
    void root.offsetWidth; // restart the CSS entrance animation
    root.classList.add("swap");
  }

  // ---------- Scroll → position of everything ----------
  let progress = 0;
  function update() {
    const rect = root.getBoundingClientRect();
    const p = clamp(-rect.top / (root.offsetHeight - window.innerHeight), 0, 1);
    progress = p;
    const pos = p * N;
    // switch the caption just as the previous island starts to leave and the next one rises
    setActive(clamp(Math.floor(pos + 0.45), 0, N - 1));

    bar.style.transform = "scaleX(" + p + ")";
    hint.style.opacity = p > 0.02 ? 0 : 1;
    // Ring tunnel: each ring grows from the centre and loops, like flying through hoops.
    // The tunnel is brightest between milestones and faint while an island is shown.
    const between = Math.abs(((pos + 0.5) % 1) - 0.5) * 2; // 0 at an island, 1 halfway between
    rings.forEach((r, k) => {
      const t = (pos * 0.9 + k / rings.length) % 1;          // 0..1 position along the tunnel
      const scale = 0.15 + t * t * 3.2;                       // speeds up as it comes closer
      const fade = Math.min(t / 0.15, (1 - t) / 0.25, 1);
      r.style.transform = "translate(-50%, -50%) scale(" + scale.toFixed(3) + ")";
      r.style.opacity = (fade * (0.25 + between * 0.75)).toFixed(3);
    });

    objs.forEach((o, i) => {
      const phase = pos - i + 0.5;   // 0 = far below, ~0.6 = arrived, >1.05 = leaving
      const last = i === N - 1;
      let scale, y, op;
      if (phase < 0.6) {              // rises up from the distance
        const t = ease(clamp(phase / 0.6, 0, 1));
        scale = 0.12 + t * 0.88;
        y = (1 - t) * 160;
        op = clamp(phase / 0.2, 0, 1);
      } else if (last || phase < 1.05) { // floats in front of us
        scale = 1 + (phase - 0.6) * 0.12;
        y = 0;
        op = 1;
      } else {                        // we fly past it into the ring tunnel
        const t = clamp((phase - 1.05) / 0.35, 0, 1);
        scale = 1.05 + t * t * 3;
        y = -t * 60;
        op = 1 - t;
      }
      o.style.transform = "translate(-50%, calc(-50% + " + y.toFixed(1) + "px)) scale(" + scale.toFixed(3) + ")";
      o.style.opacity = op.toFixed(3);
    });
  }

  // ---------- Warp-speed stars (HTML canvas) ----------
  const canvas = document.getElementById("ejWarp");
  const ctx = canvas.getContext("2d");
  const DEPTH = 1000;
  let W = 0, H = 0, stars = [];
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = W < 600 ? 140 : 260;
    stars = Array.from({ length: count }, () => newStar(Math.random() * DEPTH));
  }
  function newStar(z) {
    return { x: (Math.random() - 0.5) * 2000, y: (Math.random() - 0.5) * 2000, z: z };
  }

  let lastY = window.scrollY, boost = 0, running = false;
  function frame() {
    if (!running) return;
    // scrolling faster = flying faster
    const dy = Math.abs(window.scrollY - lastY);
    lastY = window.scrollY;
    boost = boost * 0.9 + Math.min(dy, 120) * 0.25;
    const speed = 0.8 + boost; // calm drift, faster while scrolling

    const cx = W * 0.5, cy = H * 0.42, f = Math.min(W, H) * 0.9;
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round";
    for (const s of stars) {
      const prevZ = s.z + speed * 4;
      s.z -= speed;
      if (s.z < 1) Object.assign(s, newStar(DEPTH));
      const x1 = cx + (s.x / prevZ) * f * 0.5, y1 = cy + (s.y / prevZ) * f * 0.5;
      const x2 = cx + (s.x / s.z) * f * 0.5, y2 = cy + (s.y / s.z) * f * 0.5;
      const a = 1 - s.z / DEPTH;
      ctx.strokeStyle = "rgba(200, 225, 255," + (a * 0.9).toFixed(3) + ")";
      ctx.lineWidth = 0.4 + a * 1.6;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    requestAnimationFrame(frame);
  }

  // Only animate the stars while the section is on screen
  if (!reduceMotion && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      const on = entries[0].isIntersecting;
      if (on && !running) { running = true; lastY = window.scrollY; requestAnimationFrame(frame); }
      if (!on) running = false;
    }).observe(root);
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener("resize", () => { setHeight(); resize(); update(); });
  resize();
  update();
})();
