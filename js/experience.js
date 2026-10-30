// ==========================================================
// Experience mission map
// The map pins (position: sticky). Scrolling draws the route
// (stroke-dashoffset), moves a comet along it
// (getPointAtLength) and shows the panel for each stop.
// Below, a glowing line draws down beside the detail cards.
// ==========================================================
(function () {
  const root = document.getElementById("xpScroll");
  const route = document.getElementById("xpRoute");
  if (!root || !route) return;

  const comet = document.getElementById("xpComet");
  const stops = [...root.querySelectorAll(".xp-stop")];
  const items = [...root.querySelectorAll(".xp-item")];
  const numEl = document.getElementById("xpNum");
  const placeEl = document.getElementById("xpPlace");
  const bar = document.getElementById("xpBar");
  const N = stops.length;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2); // ease in-out

  const L = route.getTotalLength();
  route.style.strokeDasharray = L;

  // Where along the route is each stop? (sample the path, find the closest point)
  const stopAt = stops.map((g) => {
    const c = g.querySelector(".xp-dot");
    const x = +c.getAttribute("cx"), y = +c.getAttribute("cy");
    let best = 0, bestD = Infinity;
    for (let l = 0; l <= L; l += 2) {
      const pt = route.getPointAtLength(l);
      const d = (pt.x - x) ** 2 + (pt.y - y) ** 2;
      if (d < bestD) { bestD = d; best = l; }
    }
    return best;
  });

  root.style.height = (N * 85 + 100) + "vh";

  let current = -1;
  function setActive(i) {
    if (i === current) return;
    current = i;
    items.forEach((it, k) => it.classList.toggle("on", k === i));
    numEl.textContent = String(i + 1).padStart(2, "0");
    placeEl.textContent = stops[i].querySelector(".xp-label").textContent;
    root.style.setProperty("--c", stops[i].style.getPropertyValue("--c"));
  }

  function update() {
    const rect = root.getBoundingClientRect();
    const p = clamp(-rect.top / (root.offsetHeight - window.innerHeight), 0, 1);
    const pos = p * N;                       // 0..N
    const seg = clamp(Math.floor(pos), 0, N - 1);
    // stay at each stop for the first half of its segment, then travel to the next
    let len;
    if (seg >= N - 1) len = stopAt[N - 1];
    else len = stopAt[seg] + (stopAt[seg + 1] - stopAt[seg]) * ease(clamp((pos - seg - 0.5) / 0.5, 0, 1));
    route.style.strokeDashoffset = (L - len).toFixed(1);
    const pt = route.getPointAtLength(len);
    comet.setAttribute("transform", "translate(" + pt.x.toFixed(1) + " " + pt.y.toFixed(1) + ")");
    stops.forEach((g, k) => g.classList.toggle("reached", len >= stopAt[k] - 1));
    // the panel changes once the comet is close to the next stop
    setActive(clamp(Math.floor(pos + 0.08), 0, N - 1));
    bar.style.transform = "scaleX(" + p + ")";
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); updateLine(); });
  }, { passive: true });
  window.addEventListener("resize", () => { update(); updateLine(); });

  // ---------- Glowing line beside the detail cards ----------
  const list = document.getElementById("xpList");
  function updateLine() {
    if (!list) return;
    const r = list.getBoundingClientRect();
    const t = clamp((window.innerHeight * 0.7 - r.top) / r.height, 0, 1);
    list.style.setProperty("--line", t.toFixed(3));
  }

  update();
  updateLine();
})();
