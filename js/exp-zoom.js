// ==========================================================
// Experience: photo zoom reveal
// Each scene pins (position: sticky). The photo starts full
// screen behind a big title; scrolling shrinks it into a framed
// picture while the summary fades in beside the title.
// ==========================================================
(function () {
  const scenes = [...document.querySelectorAll(".xz-scene")];
  if (!scenes.length) return;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t;

  // final position of the photo, in % of the stage: [left, top, width, height]
  const target = () => (window.innerWidth < 760 ? [5, 4, 90, 40] : [50, 10, 46, 80]);

  function update() {
    const T = target();
    scenes.forEach((sc) => {
      const r = sc.getBoundingClientRect();
      const range = sc.offsetHeight - window.innerHeight;
      if (r.bottom < 0 || r.top > window.innerHeight) return;  // off screen: skip
      const p = clamp(-r.top / range, 0, 1);
      const t = ease(clamp(p / 0.6, 0, 1));                     // photo shrink
      const t2 = clamp((p - 0.45) / 0.35, 0, 1);                // text reveal

      const photo = sc.querySelector(".xz-photo");
      photo.style.left = lerp(0, T[0], t) + "%";
      photo.style.top = lerp(0, T[1], t) + "%";
      photo.style.width = lerp(100, T[2], t) + "%";
      photo.style.height = lerp(100, T[3], t) + "%";
      photo.style.borderRadius = lerp(0, 22, t) + "px";
      const img = photo.querySelector("img");
      if (img) img.style.transform = "scale(" + lerp(1.25, 1, t).toFixed(3) + ")";
      photo.querySelector(".xz-shade").style.opacity = (1 - t).toFixed(3);

      sc.querySelector(".xz-title").style.transform = "scale(" + lerp(1, 0.72, t).toFixed(3) + ")";
      const more = sc.querySelector(".xz-more");
      more.style.opacity = t2.toFixed(3);
      more.style.transform = "translateY(" + ((1 - t2) * 30).toFixed(1) + "px)";
      sc.classList.toggle("settled", t > 0.95);
    });
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

// ==========================================================
// "See the details": open the full experience card in a pop-up
// The card is moved into the window and moved back on close,
// so its photos keep working (they open in the image viewer).
// ==========================================================
(function () {
  const modal = document.getElementById("expModal");
  const body = document.getElementById("expBody");
  const store = document.getElementById("xzDetails");
  if (!modal || !store) return;
  let card = null, lastFocus = null;

  function open(id) {
    card = document.getElementById(id);
    if (!card) return;
    lastFocus = document.activeElement;
    card.classList.add("visible");            // make sure its reveal animation has finished
    body.innerHTML = "";
    body.appendChild(card);
    const c = card.closest("body") && getComputedStyle(card).getPropertyValue("--c");
    modal.hidden = false;
    document.body.classList.add("lb-open");
    body.scrollTop = 0;
    document.getElementById("expClose").focus();
  }
  function close() {
    if (card) store.appendChild(card);
    card = null;
    modal.hidden = true;
    document.body.classList.remove("lb-open");
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest(".xz-open");
    if (b) open(b.dataset.exp);
  });
  document.getElementById("expClose").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  // Esc closes the photo viewer first if it is open on top.
  // (Checked in the capture phase, before the photo viewer closes itself.)
  let photoWasOpen = false;
  document.addEventListener("keydown", () => {
    const lb = document.getElementById("lightbox");
    photoWasOpen = !!lb && !lb.hidden;
  }, true);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden && !photoWasOpen) close();
  });
})();
