// ==========================================================
// Skills scroll story
// The section "pins" to the screen (CSS position: sticky).
// While it is pinned, the scroll position decides which skill
// area is shown and how far its skills have flown in.
// ==========================================================
(function () {
  const root = document.getElementById("skillScroll");
  const data = window.portfolioSkills;
  if (!root || !data) return;

  const cats = data.categories;
  const N = cats.length;
  const stage = document.getElementById("ssStage");
  const numEl = document.getElementById("ssNum");
  const titleEl = document.getElementById("ssTitle");
  const descEl = document.getElementById("ssDesc");
  const iconEl = document.getElementById("ssIcon");
  const bgWord = document.getElementById("ssBgWord");
  const bar = document.getElementById("ssBar");
  const hint = document.getElementById("ssHint");
  document.getElementById("ssTotal").textContent = "/ " + String(N).padStart(2, "0");

  const SEGMENT = 0.75;
  const stars = document.getElementById("ssStars");
  const objWrap = document.getElementById("ssObjs");
  const objs = document.querySelectorAll(".ss-obj");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Starfield: small dots at random places, twinkling at random times ----------
  for (let i = 0; i < 90; i++) {
    const s = document.createElement("span");
    const size = Math.random() < 0.85 ? 1 + Math.random() * 1.5 : 2.5 + Math.random() * 2;
    s.style.cssText = "left:" + (Math.random() * 100).toFixed(2) + "%;top:" + (Math.random() * 130).toFixed(2) +
      "%;width:" + size.toFixed(1) + "px;height:" + size.toFixed(1) + "px;animation-delay:" + (Math.random() * 4).toFixed(2) + "s";
    stars.appendChild(s);
  } // each skill area gets 75% of a screen height of scrolling

  // ---------- Build one group of chips per skill area ----------
  const groups = cats.map((cat) => {
    const g = document.createElement("div");
    g.className = "ss-group";
    g.style.setProperty("--c", cat.color);
    const chips = cat.skills.map(([name]) => {
      const chip = document.createElement("span");
      chip.className = "ss-chip";
      chip.textContent = name;
      g.appendChild(chip);
      return chip;
    });
    stage.appendChild(g);
    return { g, chips };
  });

  // The pinned area must be tall enough to scroll through every skill area
  // Remember each chip's half-width so chips can be kept inside the box
  let halfW = [];
  function measure() {
    halfW = groups.map(({ chips }) => chips.map((c) => c.offsetWidth / 2));
  }
  function setHeight() {
    root.style.height = (N * SEGMENT * 100 + 100) + "vh";
  }
  setHeight();

  // ---------- Show the text for the active area ----------
  let current = -1;
  function setActive(i) {
    if (i === current) return;
    current = i;
    const cat = cats[i];
    root.style.setProperty("--c", cat.color);
    numEl.textContent = String(i + 1).padStart(2, "0");
    titleEl.textContent = cat.name;
    descEl.textContent = cat.desc;
    iconEl.innerHTML = '<svg viewBox="0 0 24 24">' + data.icons[cat.id] + "</svg>";
    bgWord.textContent = cat.name;
    // show the illustration that matches this topic
    objs.forEach((o) => o.classList.toggle("on", o.dataset.cat === cat.id));
    // replay the text entrance animation
    root.classList.remove("swap");
    void root.offsetWidth;
    root.classList.add("swap");
  }

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3); // fast start, slow finish

  // ---------- Every frame: turn the scroll position into motion ----------
  function update() {
    const rect = root.getBoundingClientRect();
    const scrollable = root.offsetHeight - window.innerHeight;
    const p = clamp(-rect.top / scrollable, 0, 1); // 0 at the start, 1 at the end
    const pos = p * N;                               // e.g. 2.4 = 40% through area 3
    const active = clamp(Math.floor(pos), 0, N - 1);
    setActive(active);

    bar.style.transform = "scaleY(" + p + ")";
    hint.style.opacity = p > 0.02 ? 0 : 1;
    bgWord.style.transform = "translate(" + (-(pos - active) * 25) + "%, -50%)";

    // Parallax: the stars drift slower than the page (depth illusion)
    stars.style.transform = "translateY(" + (-p * 25).toFixed(2) + "%)";

    // The centre illustration tilts and swells slightly as you scroll through its topic
    const local = clamp(pos - active, 0, 1);
    objWrap.style.transform = "rotate(" + ((local - 0.5) * 12).toFixed(2) + "deg) scale(" + (1 + Math.sin(local * Math.PI) * 0.06).toFixed(3) + ")";

    const size = stage.getBoundingClientRect();
    const rx = Math.min(size.width * 0.42, 300);  // orbit width
    const ry = Math.min(size.height * 0.38, 190); // orbit height

    groups.forEach(({ g, chips }, i) => {
      const phase = pos - i; // <0 not yet, 0..1 active, >1 finished
      const visible = phase > -0.4 && (phase < 1.3 || i === N - 1);
      g.style.visibility = visible ? "visible" : "hidden";
      if (!visible) return;

      chips.forEach((chip, k) => {
        const n = chips.length;
        // each chip arrives a little after the previous one
        const enter = ease(clamp((phase + 0.35 - k * 0.04) / 0.4, 0, 1));
        // ...and leaves near the end of its area (the last area stays)
        const leave = i === N - 1 ? 0 : ease(clamp((phase - 0.8) / 0.3, 0, 1));
        // positions on an ellipse that slowly turns as you scroll
        const angle = (k / n) * Math.PI * 2 + phase * 0.9;
        const maxX = size.width / 2 - halfW[i][k] - 8; // keep the whole chip visible
        const x = clamp(Math.cos(angle) * rx, -maxX, maxX);
        const y = Math.sin(angle) * ry;
        const depth = Math.sin(angle) * 160;                  // back of the orbit is behind the planet
        const z = -900 * (1 - enter) + 500 * leave + depth;    // fly in from deep, out towards you
        const lift = -160 * leave;                            // drift up as it leaves
        const opacity = enter * (1 - leave);
        chip.style.transform =
          "translate(-50%, -50%) translate3d(" + x.toFixed(1) + "px," + (y + lift).toFixed(1) + "px," + z.toFixed(0) + "px)";
        chip.style.opacity = opacity.toFixed(3);
      });
    });
  }

  // Only do the work when the section is near the screen
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { setHeight(); measure(); update(); });
  measure();
  update();
  // fonts can change chip widths once they finish loading
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); update(); });
})();
