// ==========================================================
// Training programs: horizontal scroll gallery
// The block pins (position: sticky) and vertical scrolling
// slides the row of panels sideways. Media inside each panel
// moves a little slower than the panel (parallax).
// Achievements: badge cards pop in one after another.
// ==========================================================
(function () {
  const root = document.getElementById("tpScroll");
  const track = document.getElementById("tpTrack");
  if (!root || !track) return;

  const panels = [...track.querySelectorAll(".tp-panel")];
  const bar = document.getElementById("tpBar");
  const numEl = document.getElementById("tpNum");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mobile = () => window.innerWidth < 760;

  // How far the track must slide = its width minus the visible width
  let distance = 0;
  function measure() {
    if (mobile()) {             // phones: normal vertical list, no pinning
      root.style.height = "";
      track.style.transform = "";
      panels.forEach((p) => { p.style.transform = ""; p.querySelector(".tp-media").style.transform = ""; });
      return;
    }
    distance = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
    // the pinned area is as tall as the sideways distance, plus one screen
    root.style.height = (distance + window.innerHeight) + "px";
    update();
  }

  function update() {
    if (mobile()) return;
    const rect = root.getBoundingClientRect();
    const p = clamp(-rect.top / (root.offsetHeight - window.innerHeight), 0, 1);
    track.style.transform = "translateX(" + (-p * distance).toFixed(1) + "px)";
    bar.style.transform = "scaleX(" + p + ")";

    const centre = window.innerWidth / 2;
    let closest = 0, best = Infinity;
    panels.forEach((panel, i) => {
      const r = panel.getBoundingClientRect();
      const off = (r.left + r.width / 2 - centre) / window.innerWidth; // -1 .. 1
      if (Math.abs(off) < best) { best = Math.abs(off); closest = i; }
      // panels away from the centre tilt and shrink slightly
      panel.style.transform = "perspective(1200px) rotateY(" + (off * -14).toFixed(2) + "deg) scale(" + (1 - Math.min(Math.abs(off), 1) * 0.08).toFixed(3) + ")";
      panel.querySelector(".tp-media").style.transform = "translateX(" + (off * 40).toFixed(1) + "px)";
      panel.classList.toggle("is-active", Math.abs(off) < 0.3);
    });
    numEl.textContent = String(closest + 1).padStart(2, "0");
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  measure();

  // ---------- Achievements pop in when scrolled to ----------
  const grid = document.getElementById("achGrid");
  if (grid && "IntersectionObserver" in window) {
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) { grid.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.15 }).observe(grid);
  } else if (grid) {
    grid.classList.add("visible");
  }
})();
