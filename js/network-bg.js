// ==========================================================
// Background: "Aquarius × Network × Developer" (HTML Canvas)
//
// - The real Aquarius constellation shines at the top. Its stars
//   are linked like a network, and from its Water Jar stars the
//   Water Bearer pours 0s and 1s down into the network below.
// - Two glowing Aquarius waves are the network links. Devices
//   sit on them and coloured packets (HTTP, DNS, SSH, ICMP)
//   travel between them.
// - When a packet arrives, the device types out a line of code.
// - Aquarius is ruled by Uranus, the planet of electricity, so
//   lightning sometimes jumps between the two waves.
// - A red attack packet sometimes comes in and the firewall
//   blocks it.
//
// Interactive:
// - The waves bend towards the mouse.
// - Hover a device or a star to see what it is.
// - Click any empty space to send a ping into the network.
// - Scrolling gives the network more energy (faster, brighter).
// ==========================================================
(function () {
  const canvas = document.getElementById("netCanvas");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const BLUE = "#38bdf8", VIOLET = "#a78bfa", TEAL = "#2dd4bf", RED = "#f87171";
  const WAVE_COLORS = [BLUE, VIOLET];

  // f = position across the screen (0–1), w = which wave it sits on
  const DESKTOP_NODES = [
    { f: 0.05, w: 0, name: "FW",  ip: "ACL 110",       role: "Firewall · blocks attacks" },
    { f: 0.20, w: 1, name: "R1",  ip: "10.0.0.1",      role: "Router · OSPF area 0" },
    { f: 0.36, w: 0, name: "API", ip: ":3000",         role: "Express REST API" },
    { f: 0.52, w: 1, name: "DB",  ip: ":3306",         role: "MySQL database" },
    { f: 0.68, w: 0, name: "WEB", ip: ":443",          role: "Web server · HTTPS" },
    { f: 0.82, w: 1, name: "PC1", ip: "192.168.10.11", role: "Client · DHCP lease" },
    { f: 0.95, w: 0, name: "GIT", ip: "origin/main",   role: "GitHub repository" }
  ];
  const PHONE_NODES = [
    { f: 0.10, w: 0, name: "FW",  ip: "ACL 110",  role: "Firewall" },
    { f: 0.37, w: 1, name: "R1",  ip: "10.0.0.1", role: "Router" },
    { f: 0.63, w: 0, name: "API", ip: ":3000",    role: "REST API" },
    { f: 0.90, w: 1, name: "WEB", ip: ":443",     role: "Web server" }
  ];

  const PROTOCOLS = [
    { name: "HTTP", color: "#4ade80" },
    { name: "DNS",  color: "#f472b6" },
    { name: "SSH",  color: "#facc15" },
    { name: "ICMP", color: "#ffffff" }
  ];

  // ---------- The Aquarius constellation ----------
  // Real star positions: ra = right ascension (hours), dec = declination (degrees),
  // mag = brightness (smaller number = brighter star).
  const STARS = {
    alpha: { ra: 22.10, dec: -0.32,  mag: 2.9, name: "Sadalmelik · α Aquarii" },
    beta:  { ra: 21.53, dec: -5.57,  mag: 2.9, name: "Sadalsuud · β Aquarii" },
    gamma: { ra: 22.36, dec: -1.39,  mag: 3.8, name: "Sadachbia · γ Aquarii" },
    zeta:  { ra: 22.48, dec: -0.02,  mag: 3.6, name: "ζ Aquarii · Water Jar" },
    eta:   { ra: 22.59, dec: -0.12,  mag: 4.0, name: "η Aquarii · Water Jar" },
    pi:    { ra: 22.42, dec: 1.38,   mag: 4.7, name: "Seat · π Aquarii" },
    eps:   { ra: 20.79, dec: -9.50,  mag: 3.8, name: "Albali · ε Aquarii" },
    mu:    { ra: 20.88, dec: -8.98,  mag: 4.7, name: "μ Aquarii" },
    iota:  { ra: 22.11, dec: -13.87, mag: 4.3, name: "ι Aquarii" },
    theta: { ra: 22.28, dec: -7.78,  mag: 4.2, name: "Ancha · θ Aquarii" },
    lambda:{ ra: 22.88, dec: -7.58,  mag: 3.7, name: "λ Aquarii" },
    tau:   { ra: 22.83, dec: -13.59, mag: 4.0, name: "τ Aquarii" },
    delta: { ra: 22.91, dec: -15.82, mag: 3.3, name: "Skat · δ Aquarii" },
    phi:   { ra: 23.24, dec: -6.05,  mag: 4.2, name: "φ Aquarii" },
    psi:   { ra: 23.27, dec: -9.09,  mag: 4.4, name: "ψ¹ Aquarii" },
    s98:   { ra: 23.38, dec: -20.10, mag: 4.0, name: "98 Aquarii" },
    s88:   { ra: 23.16, dec: -21.17, mag: 3.7, name: "88 Aquarii" }
  };
  const STAR_LINES = [
    ["eps", "mu"], ["mu", "beta"], ["beta", "alpha"], ["beta", "iota"], ["alpha", "gamma"],
    ["gamma", "zeta"], ["zeta", "eta"], ["zeta", "pi"],          // the Water Jar
    ["alpha", "theta"], ["theta", "lambda"], ["lambda", "phi"], ["phi", "psi"],
    ["psi", "s98"], ["s98", "s88"], ["lambda", "tau"], ["tau", "delta"]
  ];
  let stars = [], starLinks = [], starPulses = [], hoveredStar = null, box = null, bigSign = null;

  // Fit the constellation into a box at the top of the screen
  function layoutStars() {
    if (phone) {
      box = { x: W * 0.60, y: 84, w: W * 0.36 };                              // small, top right
    } else {
      // Fit it in the gap between the name and the photo
      box = { x: W * 0.35, y: Math.max(90, H * 0.12), w: Math.min(W * 0.26, H * 0.38) };
      const nameEl = document.querySelector(".hero-name");
      const photoEl = document.querySelector(".hero-visual");
      if (nameEl && photoEl) {
        const left = nameEl.getBoundingClientRect().right + window.scrollX + 20;
        const right = photoEl.getBoundingClientRect().left + window.scrollX + 40;
        if (right - left > 200) {
          box.w = Math.min(right - left, H * 0.38);
          box.x = left + (right - left - box.w) / 2;
        }
      }
    }
    const sc = box.w / 40; // pixels per degree
    stars = Object.entries(STARS).map(([id, st]) => ({
      ...st, id,
      x: box.x + (23.45 - st.ra) * 15 * sc,   // east is on the left, like the real sky
      y: box.y + (1.6 - st.dec) * sc,
      r: Math.max(1.2, (5 - st.mag) * 1.25),
      phase: Math.random() * 6
    }));
    const byId = Object.fromEntries(stars.map((st) => [st.id, st]));
    starLinks = STAR_LINES.map(([a, b]) => [byId[a], byId[b]]);
    box.h = 23 * sc;
    box.jar = byId.zeta;

    // Big faint Aquarius symbol behind the hero terminal
    const term = document.querySelector(".hero .terminal") || document.querySelector(".terminal");
    if (term && !phone) {
      const r = term.getBoundingClientRect();
      bigSign = { x: r.left + r.width / 2, y: r.top + window.scrollY + r.height * 0.05, size: r.width * 1.5 };
    } else {
      bigSign = { x: W * 0.5, y: H * 0.3, size: W * 0.8 };
    }
  }

  // Lines of code / network commands the devices type out
  const CODE = [
    "git push origin main", "fetch('/api/tasks')", "SELECT * FROM users;", "ping 10.0.0.1",
    "res.json({ status: 200 })", "SYN → SYN-ACK → ACK", "<h1>Hello, world</h1>", "ssh kuenzang@server",
    "const app = express();", "DHCPDISCOVER → OFFER", "access-list 110 deny any", "HTTP/1.1 200 OK",
    "router ospf 1", "ip route 0.0.0.0 0.0.0.0", "npm start", "sudo systemctl restart nginx",
    "nslookup jnec.edu.bt", "show ip interface brief"
  ];

  let W = 0, H = 0, t = 0, phone = false, nodes = DESKTOP_NODES;
  let packets = [], pops = [], drops = [], bolts = [];
  let energy = 0, lastScroll = window.scrollY;
  let boltTimer = 2, attackTimer = 6;
  const mouse = { x: -9999, y: -9999, pull: 0 };
  let hovered = null;
  let bgColor = "#0b1120", muted = "#94a3b8";
  const rnd = (n) => Math.floor(Math.random() * n);

  function readTheme() {
    const css = getComputedStyle(document.documentElement);
    bgColor = css.getPropertyValue("--bg").trim() || bgColor;
    muted = css.getPropertyValue("--text-muted").trim() || muted;
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    phone = W < 760;
    nodes = (phone ? PHONE_NODES : DESKTOP_NODES).map((n) => ({ ...n, hit: 0, hitColor: BLUE }));
    packets = []; pops = []; drops = []; bolts = []; starPulses = [];
    layoutStars();
    readTheme();
  }

  // ---------- Wave shape ----------
  // Height of wave i at position x: two sines (the ♒ waves)
  // plus a bend towards the mouse.
  function waveY(i, x) {
    const base = H * (0.76 + i * 0.11);
    const amp = H * 0.045 * (1 + energy * 0.6);
    let y = base + Math.sin(x * 0.0065 + t * 0.6 + i * 0.9) * amp
                 + Math.sin(x * 0.015 + t * 0.9 + i) * amp * 0.25;
    if (mouse.pull > 0) {
      const dx = x - mouse.x;
      const pull = Math.max(-70, Math.min(70, (mouse.y - base) * 0.35));
      y += pull * Math.exp(-(dx * dx) / (2 * 130 * 130)) * mouse.pull;
    }
    return y;
  }

  // The Aquarius symbol drawn as two zigzag lines
  function aquariusGlyph(cx, cy, size, alpha, glow, lineWidth = 3) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = TEAL;
    ctx.shadowColor = TEAL;
    ctx.shadowBlur = glow;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    [-0.18, 0.18].forEach((off) => {
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const x = cx - size / 2 + (size / 6) * i;
        const y = cy + off * size + (i % 2 ? -1 : 1) * size * 0.1;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    });
    ctx.restore();
  }

  // The water pours from the Water Jar stars of the constellation
  function jarPos() {
    return { x: box.jar.x, y: box.jar.y };
  }

  // A device "types" a line of code above itself
  function say(x, y, text, color) {
    const texts = pops.filter((q) => q.text);
    if (texts.length >= 3 || texts.some((q) => Math.abs(q.x - x) < 170)) return;
    pops.push({ x: Math.min(W - 100, Math.max(100, x)), y, text, chars: 0, life: 1, c: color });
  }

  // ---------- Update ----------
  function update(dt) {
    // Scrolling adds energy, which slowly fades away
    const sy = window.scrollY;
    energy = Math.min(1, energy + Math.abs(sy - lastScroll) * 0.002);
    lastScroll = sy;
    energy = Math.max(0, energy - dt * 0.5);
    t += dt * (1 + energy * 2);

    // Mouse bend fades in when the mouse is near the waves
    const nearWaves = mouse.y > H * 0.55;
    mouse.pull += ((nearWaves ? 1 : 0) - mouse.pull) * Math.min(1, dt * 4);

    // 0s and 1s pouring from the Water Jar
    const jar = jarPos();
    if (Math.random() < dt * (phone ? 4 : 10) * (1 + energy * 2)) {
      drops.push({
        x: jar.x - 4 + Math.random() * 8, y: jar.y + 6, bit: rnd(2), vy: 10,
        vx: phone ? 8 + Math.random() * 18 : 15 + Math.random() * 35
      });
    }
    drops.forEach((d) => {
      d.vy += 220 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
      if (d.y > waveY(0, d.x)) {
        d.dead = true;
        pops.push({ ring: true, x: d.x, y: waveY(0, d.x), r: 2, max: 40, c: TEAL });
      }
    });
    drops = drops.filter((d) => !d.dead);

    // Normal packets enter from either side
    if (Math.random() < dt * (1.8 + energy * 3) && packets.length < 10) {
      const dir = Math.random() < 0.5 ? 1 : -1;
      packets.push({ i: rnd(2), x: dir > 0 ? -10 : W + 10, dir, v: 140 + Math.random() * 80,
                     proto: PROTOCOLS[rnd(PROTOCOLS.length)] });
    }

    // Now and then an attack comes in from the left and hits the firewall
    attackTimer -= dt;
    if (attackTimer <= 0) {
      attackTimer = 7 + Math.random() * 6;
      packets.push({ i: 0, x: -10, dir: 1, v: 200, attack: true, proto: { name: "BRUTE-FORCE", color: RED } });
    }

    packets.forEach((p) => {
      const before = p.x;
      p.x += p.dir * p.v * (1 + energy) * dt;
      nodes.forEach((n) => {
        const nx = n.f * W;
        if (n.w !== p.i || (before - nx) * (p.x - nx) > 0) return;
        if (p.attack) {
          if (n.name === "FW") {
            p.dead = true;
            n.hit = 1; n.hitColor = RED;
            pops.push({ ring: true, x: nx, y: waveY(n.w, nx), r: 4, max: 60, c: RED });
            say(nx, waveY(n.w, nx) - 30, "✕ BLOCKED · ssh brute-force", RED);
          }
          return;
        }
        n.hit = 1; n.hitColor = p.proto.color;
        say(nx, waveY(n.w, nx) - 30, CODE[rnd(CODE.length)], WAVE_COLORS[n.w]);
      });
      if (p.x < -40 || p.x > W + 40) p.dead = true;
    });
    packets = packets.filter((p) => !p.dead);

    // Lightning between the two waves (Uranus, the electric planet)
    boltTimer -= dt * (1 + energy * 3);
    if (boltTimer <= 0) {
      boltTimer = 2.5 + Math.random() * 3;
      const x = W * (0.1 + Math.random() * 0.8);
      const pts = [];
      const y0 = waveY(0, x), y1 = waveY(1, x);
      for (let k = 0; k <= 8; k++) {
        const f = k / 8;
        pts.push([x + (k === 0 || k === 8 ? 0 : (Math.random() - 0.5) * 26), y0 + (y1 - y0) * f]);
      }
      bolts.push({ pts, life: 1 });
      pops.push({ ring: true, x, y: y1, r: 3, max: 50, c: TEAL });
    }
    bolts.forEach((b) => (b.life -= dt * 3.5));
    bolts = bolts.filter((b) => b.life > 0);

    nodes.forEach((n) => (n.hit = Math.max(0, n.hit - dt * 1.5)));
    pops.forEach((q) => {
      if (q.ring) {
        q.r += 45 * dt;
        if (q.r > q.max) q.dead = true;
      } else {
        // Typewriter: type the text, hold it, then fade and float up
        q.chars = Math.min(q.text.length, q.chars + dt * 28);
        if (q.chars >= q.text.length) q.life -= dt * 0.45;
        q.y -= 10 * dt;
        if (q.life <= 0) q.dead = true;
      }
    });
    pops = pops.filter((q) => !q.dead);

    // Light pulses travelling along the constellation lines
    if (Math.random() < dt * 1.5 && starPulses.length < 4) {
      const [a, b] = starLinks[rnd(starLinks.length)];
      starPulses.push(Math.random() < 0.5 ? { a, b, f: 0 } : { a: b, b: a, f: 0 });
    }
    starPulses.forEach((sp) => {
      sp.f += dt * 0.9;
      if (sp.f >= 1) { sp.dead = true; sp.b.flash = 1; }
    });
    starPulses = starPulses.filter((sp) => !sp.dead);
    stars.forEach((st) => (st.flash = Math.max(0, (st.flash || 0) - dt * 1.5)));

    // Which star is the mouse over?
    hoveredStar = null;
    stars.forEach((st) => { if (Math.hypot(mouse.x - st.x, mouse.y - st.y) < 14) hoveredStar = st; });

    // Which device is the mouse over?
    hovered = null;
    nodes.forEach((n) => {
      const x = n.f * W;
      if (Math.hypot(mouse.x - x, mouse.y - waveY(n.w, x)) < 26) hovered = n;
    });
  }

  // ---------- Draw ----------
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Soft turquoise aurora behind the waves (Aquarius is an air sign)
    for (let x = 0; x < W; x += 6) {
      const y = H * 0.72 + Math.sin(x * 0.004 + t * 0.3) * H * 0.06;
      const hgt = 120 + Math.sin(x * 0.006 + t) * 50;
      const g = ctx.createLinearGradient(0, y - hgt, 0, y);
      g.addColorStop(0, "rgba(45,212,191,0)");
      g.addColorStop(1, "rgba(45,212,191,0.6)");
      ctx.globalAlpha = 0.06 + energy * 0.06;
      ctx.fillStyle = g;
      ctx.fillRect(x, y - hgt, 6, hgt);
    }

    // Big faint Aquarius symbol in the background (it slowly breathes)
    if (bigSign) {
      aquariusGlyph(bigSign.x, bigSign.y, bigSign.size, (0.1 + 0.03 * Math.sin(t * 0.8) + energy * 0.05) * (phone ? 0.6 : 1),
                    20, Math.max(10, bigSign.size * 0.045));
    }

    // The Aquarius constellation: links, pulses, stars
    ctx.setLineDash([2, 5]);
    ctx.strokeStyle = TEAL;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35 + energy * 0.2;
    starLinks.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
    ctx.setLineDash([]);
    starPulses.forEach((sp) => {
      const x = sp.a.x + (sp.b.x - sp.a.x) * sp.f, y = sp.a.y + (sp.b.y - sp.a.y) * sp.f;
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#e0fffa";
      ctx.shadowColor = TEAL; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    });
    stars.forEach((st) => {
      const tw = 0.65 + 0.35 * Math.sin(t * 2.2 + st.phase);   // twinkle
      const glow = st === hoveredStar ? 1 : st.flash;
      ctx.globalAlpha = Math.min(1, tw + glow);
      ctx.fillStyle = "#f0fdfa";
      ctx.shadowColor = st.id === "zeta" || st.id === "eta" || st.id === "gamma" || st.id === "pi" ? TEAL : BLUE;
      ctx.shadowBlur = 8 + glow * 16 + (st.mag < 3 ? 6 : 0);
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r * (1 + glow * 0.5), 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    });

    // The falling 0s / 1s
    ctx.font = "600 12px Consolas, monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = TEAL;
    ctx.globalAlpha = phone ? 0.35 : 0.55;
    drops.forEach((d) => ctx.fillText(d.bit, d.x, d.y));

    // The two waves (network links): one bright line + two faint echoes
    WAVE_COLORS.forEach((c, i) => {
      for (let layer = 0; layer < 3; layer++) {
        ctx.globalAlpha = layer ? 0.1 : 0.5 + energy * 0.3;
        ctx.strokeStyle = c;
        ctx.lineWidth = layer ? 1 : 2;
        ctx.shadowColor = c;
        ctx.shadowBlur = layer ? 0 : 12 + energy * 10;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 6) {
          const y = waveY(i, x) + layer * 7;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });

    // Dashed "patch cables" joining the two waves at each device
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = TEAL;
    ctx.globalAlpha = 0.18;
    nodes.forEach((n) => {
      const x = n.f * W;
      ctx.beginPath(); ctx.moveTo(x, waveY(0, x)); ctx.lineTo(x, waveY(1, x)); ctx.stroke();
    });
    ctx.setLineDash([]);

    // Lightning bolts
    bolts.forEach((b) => {
      ctx.globalAlpha = b.life;
      ctx.strokeStyle = "#e0fffa";
      ctx.shadowColor = TEAL;
      ctx.shadowBlur = 18;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      b.pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Packets with a small protocol label
    ctx.font = "600 9px Consolas, monospace";
    ctx.textAlign = "center";
    packets.forEach((p) => {
      const y = waveY(p.i, p.x);
      const c = p.proto.color;
      ctx.globalAlpha = 1;
      ctx.fillStyle = c;
      ctx.shadowColor = p.attack ? RED : WAVE_COLORS[p.i];
      ctx.shadowBlur = p.attack ? 22 : 16;
      ctx.beginPath(); ctx.arc(p.x, y, p.attack ? 4 : 3, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      if (!phone || p.attack) {
        ctx.globalAlpha = p.attack ? 0.95 : 0.6;
        ctx.fillText(p.proto.name, p.x, y - 9);
      }
    });

    // Devices
    ctx.font = "600 11px Consolas, monospace";
    nodes.forEach((n) => {
      const x = n.f * W, y = waveY(n.w, x), c = WAVE_COLORS[n.w];
      const big = n === hovered ? 1.3 : 1;
      const s = 9 * big;
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = bgColor;
      ctx.strokeStyle = n.hit > 0.05 ? n.hitColor : c;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = n.hit > 0.05 ? n.hitColor : c;
      ctx.shadowBlur = 8 + n.hit * 22 + (n === hovered ? 14 : 0);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x - s, y - s, s * 2, s * 2, 5); else ctx.rect(x - s, y - s, s * 2, s * 2);
      ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = c;
      ctx.globalAlpha = 0.6 + n.hit * 0.4;
      ctx.fillRect(x - 3, y - 3, 6, 6);
      ctx.fillStyle = muted;
      ctx.globalAlpha = 0.55; ctx.fillText(n.name, x, y + 26);
      ctx.globalAlpha = 0.35; ctx.fillText(n.ip, x, y + 40);
    });

    // Typed code and ripples
    ctx.font = "600 11px Consolas, monospace";
    pops.forEach((q) => {
      if (q.ring) {
        ctx.globalAlpha = Math.max(0, 0.45 * (1 - q.r / q.max));
        ctx.strokeStyle = q.c;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(q.x, q.y, q.r, q.r * 0.35, 0, 0, Math.PI * 2); ctx.stroke();
      } else {
        const typing = q.chars < q.text.length;
        const shown = q.text.slice(0, Math.floor(q.chars)) + (typing || Math.sin(t * 8) > 0 ? "▌" : " ");
        ctx.globalAlpha = Math.max(0, Math.min(1, q.life * 1.5)) * 0.9;
        ctx.fillStyle = q.c;
        ctx.fillText(shown, q.x, q.y);
      }
    });

    // Tooltip for the hovered device or star
    let tip = null;
    if (hovered) {
      const x = hovered.f * W;
      tip = { x, y: waveY(hovered.w, x) - 46, text: `${hovered.name} · ${hovered.role}`, c: WAVE_COLORS[hovered.w] };
    } else if (hoveredStar) {
      tip = { x: hoveredStar.x, y: hoveredStar.y - 16, text: "★ " + hoveredStar.name, c: TEAL };
    }
    if (tip) {
      const { x, y, text } = tip;
      ctx.font = "600 12px Consolas, monospace";
      const w = ctx.measureText(text).width + 20;
      const bx = Math.min(W - w - 8, Math.max(8, x - w / 2));
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = bgColor;
      ctx.strokeStyle = tip.c;
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(bx, y - 18, w, 26, 6); else ctx.rect(bx, y - 18, w, 26);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = tip.c;
      ctx.textAlign = "left";
      ctx.fillText(text, bx + 10, y);
    }

    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  // ---------- Interaction ----------
  // The canvas sits behind the page, so listen on the window.
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; });

  // Click on empty space → send a ping into the network
  window.addEventListener("click", (e) => {
    if (reduceMotion) return;
    if (e.target.closest("a, button, input, textarea, select, label, .terminal, .card, img, video")) return;
    const x = e.clientX;
    pops.push({ ring: true, x, y: e.clientY, r: 4, max: 70, c: BLUE });
    [0, 1].forEach((i) => {
      packets.push({ i, x, dir: 1, v: 260, proto: { name: "ICMP", color: "#ffffff" } });
      packets.push({ i, x, dir: -1, v: 260, proto: { name: "ICMP", color: "#ffffff" } });
    });
    say(x, e.clientY - 14, "ping 10.0.0.1 -c 4", BLUE);
    energy = Math.min(1, energy + 0.5);
  });

  // Re-read colours when the dark / light theme changes
  new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", () => { resize(); if (reduceMotion) draw(); });

  resize();
  if (reduceMotion) {
    draw(); // one still frame, no animation
  } else {
    requestAnimationFrame(loop);
  }
})();