// ==========================================================
// Interactive 3D models built in code with three.js:
//   1. Laptop (About)  - its screen runs a live terminal
//   2. Edge router R1 (Network lab) - port lights and cables
//   3. Arduino Uno with PIR, HC-SR04 and servo (IoT project)
//
// Every model is made from simple shapes (boxes, cylinders,
// tubes) in layers: blockout -> structure -> details ->
// materials -> lighting -> animation. No 3D files are loaded.
// Drag a model to rotate it. Models only animate while they
// are on screen, and stay still if "reduce motion" is on.
// ==========================================================
(function () {
  if (typeof THREE === "undefined") return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Shared helpers ----------
  const mat = (color, opts = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.1 }, opts));
  const glow = (color, intensity = 1.6) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4 });

  function box(w, h, d, material, r = 0) {
    // A box with softly rounded vertical edges (extruded rounded rectangle)
    if (r <= 0) return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    const s = new THREE.Shape();
    const x = -w / 2, z = -d / 2;
    s.moveTo(x + r, z);
    s.lineTo(x + w - r, z); s.quadraticCurveTo(x + w, z, x + w, z + r);
    s.lineTo(x + w, z + d - r); s.quadraticCurveTo(x + w, z + d, x + w - r, z + d);
    s.lineTo(x + r, z + d); s.quadraticCurveTo(x, z + d, x, z + d - r);
    s.lineTo(x, z + r); s.quadraticCurveTo(x, z, x + r, z);
    const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: Math.min(0.03, h / 4), bevelSize: Math.min(0.03, r / 2), bevelSegments: 2, curveSegments: 6 });
    g.rotateX(Math.PI / 2);
    g.translate(0, h / 2, 0);
    return new THREE.Mesh(g, material);
  }

  function cyl(rt, rb, h, material, seg = 24) {
    return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
  }

  function cable(points, color, radius = 0.035) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, radius, 8, false), mat(color, { roughness: 0.6 }));
    mesh.userData.curve = curve;
    return mesh;
  }

  function labelTexture(text, { w = 256, h = 64, color = "#e9edf1", bg = null, font = "600 34px Geist, system-ui, sans-serif" } = {}) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const x = c.getContext("2d");
    if (bg) { x.fillStyle = bg; x.fillRect(0, 0, w, h); }
    x.fillStyle = color; x.font = font; x.textBaseline = "middle"; x.textAlign = "center";
    x.fillText(text, w / 2, h / 2 + 2);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }

  function decal(text, w, h, opts) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: labelTexture(text, opts), transparent: true }));
    m.rotation.x = -Math.PI / 2;
    return m;
  }

  // ---------- Viewer: renderer, camera, lights, drag-to-rotate ----------
  function createViewer(stage, build, opts = {}) {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch (e) {
      stage.innerHTML = '<p class="model-fallback">3D view needs WebGL, which this browser has turned off.</p>';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(opts.fov || 32, 1, 0.1, 100);
    const camBase = new THREE.Vector3(...(opts.camera || [0, 3.2, 7.5]));
    const camTarget = new THREE.Vector3(...(opts.target || [0, 0, 0]));
    camera.position.copy(camBase);
    camera.lookAt(camTarget);

    // Lighting: soft sky/ground fill, a warm key light and a turquoise rim
    scene.add(new THREE.HemisphereLight(0xdfe9f0, 0x1a1f26, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 7, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x5cc8bd, 2.4);
    rim.position.set(-5, 3, -4);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x9fb4c8, 0.6);
    fill.position.set(-4, 1, 6);
    scene.add(fill);

    // Soft contact shadow under the model
    const shadowTex = (() => {
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const x = c.getContext("2d");
      const g = x.createRadialGradient(64, 64, 4, 64, 64, 64);
      g.addColorStop(0, "rgba(0,0,0,0.55)"); g.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = g; x.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.scale.set(...(opts.shadow || [6, 3.5, 1]));
    shadow.position.y = opts.floor || -0.6;
    scene.add(shadow);

    const pivot = new THREE.Group();
    scene.add(pivot);
    const model = build(pivot);

    // Drag to rotate, with a little inertia; slow turn when idle
    const startYaw = opts.yaw || 0, startPitch = opts.pitch || 0;
    let yaw = startYaw, pitch = startPitch, vYaw = 0, vPitch = 0;
    let dragging = false, lastX = 0, lastY = 0, idle = 0;
    stage.addEventListener("pointerdown", (e) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      stage.classList.add("dragging");
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      vYaw = dx * 0.008; vPitch = dy * 0.004;
      yaw += vYaw; pitch = Math.max(-0.35, Math.min(0.45, pitch + vPitch));
      idle = 0;
      if (!running) renderOnce();
    });
    const endDrag = () => { dragging = false; stage.classList.remove("dragging"); };
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    // Keyboard: arrow keys rotate the model
    stage.tabIndex = 0;
    stage.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { yaw -= 0.15; idle = 0; }
      else if (e.key === "ArrowRight") { yaw += 0.15; idle = 0; }
      else return;
      e.preventDefault();
      if (!running) renderOnce();
    });

    function resize() {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // On narrow screens move the camera back so the whole model fits
      const pull = Math.max(1, Math.pow(1.5 / camera.aspect, 0.85));
      camera.position.copy(camTarget).add(camBase.clone().sub(camTarget).multiplyScalar(pull));
      camera.lookAt(camTarget);
      camera.updateProjectionMatrix();
      if (!running) renderOnce();
    }
    new ResizeObserver(resize).observe(stage);

    let running = false, last = 0, t = 0;
    function renderOnce() {
      pivot.rotation.set(pitch, yaw, 0);
      renderer.render(scene, camera);
    }
    function frame(now) {
      if (!running) return;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000 || 0.016));
      last = now; t += dt;
      if (!dragging) {
        yaw += vYaw; pitch += vPitch;
        vYaw *= 0.92; vPitch *= 0.85;
        idle += dt;
        if (idle > 2.5) yaw += dt * 0.18; // gentle idle turn
        pitch += (startPitch - pitch) * Math.min(1, dt * 0.8);
      }
      if (model && model.tick) model.tick(t, dt);
      renderOnce();
      requestAnimationFrame(frame);
    }

    resize();
    if (reduceMotion) {
      if (model && model.tick) model.tick(1.2, 0);
      renderOnce();
      return;
    }
    // Only animate while the model is on screen
    new IntersectionObserver((entries) => {
      const visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
      else if (!visible) running = false;
    }, { rootMargin: "100px" }).observe(stage);
  }

  // ==========================================================
  // 1. Laptop: base, keyboard, trackpad, hinged lid, live screen
  // ==========================================================
  function buildLaptop(root) {
    const shell = mat(0x3d434c, { metalness: 0.75, roughness: 0.32 });
    const shellDark = mat(0x22262c, { metalness: 0.6, roughness: 0.4 });
    const keyMat = mat(0x14171b, { roughness: 0.7 });
    const bezel = mat(0x0b0d10, { roughness: 0.35, metalness: 0.2 });

    const laptop = new THREE.Group();
    root.add(laptop);

    // Blockout: base slab
    const base = box(4.2, 0.16, 2.9, shell, 0.16);
    laptop.add(base);

    // Structure: keyboard well and keys (instanced), trackpad
    const well = box(3.7, 0.02, 1.35, shellDark, 0.06);
    well.position.set(0, 0.165, -0.42);
    laptop.add(well);
    const keyGeo = new THREE.BoxGeometry(0.235, 0.04, 0.2);
    const keys = new THREE.InstancedMesh(keyGeo, keyMat, 13 * 5 + 1);
    const m4 = new THREE.Matrix4();
    let k = 0;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 13; col++) {
        m4.makeTranslation(-1.6 + col * 0.267, 0.19, -0.98 + row * 0.25);
        keys.setMatrixAt(k++, m4);
      }
    }
    // space bar
    m4.compose(new THREE.Vector3(0, 0.19, 0.27), new THREE.Quaternion(), new THREE.Vector3(5.2, 1, 1));
    keys.setMatrixAt(k++, m4);
    keys.count = k;
    laptop.add(keys);
    const pad = box(1.35, 0.01, 0.82, mat(0x343a42, { metalness: 0.5, roughness: 0.28 }), 0.06);
    pad.position.set(0, 0.165, 0.86);
    laptop.add(pad);

    // Lid with hinge at the back edge
    const hinge = new THREE.Group();
    hinge.position.set(0, 0.16, -1.42);
    laptop.add(hinge);
    const lid = box(4.2, 0.1, 2.85, shell, 0.16);
    lid.rotation.x = Math.PI / 2;
    lid.position.set(0, 1.43, -0.05);
    hinge.add(lid);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(4.02, 2.7), bezel);
    glass.position.set(0, 1.43, 0.045);
    hinge.add(glass);

    // Live screen: a canvas texture running the terminal
    const sc = document.createElement("canvas");
    sc.width = 1024; sc.height = 640;
    const sx = sc.getContext("2d");
    const screenTex = new THREE.CanvasTexture(sc);
    screenTex.colorSpace = THREE.SRGBColorSpace;
    screenTex.anisotropy = 4;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.78, 2.36), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
    screen.position.set(0, 1.47, 0.05);
    hinge.add(screen);
    hinge.rotation.x = -0.32; // opened to about 108 degrees

    // A little light spill from the screen onto the keyboard
    const spill = new THREE.PointLight(0x5cc8bd, 0.9, 3.5, 2);
    spill.position.set(0, 1.4, 0.4);
    laptop.add(spill);

    laptop.position.y = -0.55;
    laptop.rotation.y = -0.05;

    // Terminal script that types on the screen
    const script = [
      ["$ ", "ssh kuenzang@r1.lab"],
      ["", "Connected to R1 (10.0.0.1)"],
      ["R1# ", "show ip bgp summary"],
      ["", "Neighbor 203.0.113.1  AS 65001  Up  12"],
      ["R1# ", "show access-lists 110"],
      ["", "10 permit tcp any host 192.168.20.10 eq 443"],
      ["", "20 deny   tcp any any eq 3306"],
      ["R1# ", "ping 192.168.10.1"],
      ["", "!!!!! Success rate is 100 percent (5/5)"],
      ["$ ", "git push origin main"]
    ];
    let line = 4, chars = 0, clock = 0, lastDraw = -1; // start with a few lines already on screen
    function drawScreen(t) {
      const W = sc.width, H = sc.height;
      sx.fillStyle = "#0d1115"; sx.fillRect(0, 0, W, H);
      // title bar
      sx.fillStyle = "#13171c"; sx.fillRect(0, 0, W, 54);
      [["#ec6a5e", 34], ["#f4bf4f", 64], ["#61c554", 94]].forEach(([c, x]) => { sx.fillStyle = c; sx.beginPath(); sx.arc(x, 27, 9, 0, 7); sx.fill(); });
      sx.fillStyle = "#8a929d"; sx.font = "500 24px 'Geist Mono', ui-monospace, monospace"; sx.fillText("kuenzang@jnec: ~", 130, 35);
      sx.font = "500 31px 'Geist Mono', ui-monospace, monospace";
      const visible = Math.max(0, line - 11);
      for (let i = visible; i <= Math.min(line, script.length - 1); i++) {
        const [prompt, text] = script[i];
        const y = 108 + (i - visible) * 47;
        const shown = i < line ? text : text.slice(0, chars);
        sx.fillStyle = "#7fd8ce"; sx.fillText(prompt, 32, y);
        const pw = sx.measureText(prompt).width;
        sx.fillStyle = prompt ? "#eef1f4" : (text.startsWith("20 deny") ? "#f38b8b" : text.startsWith("!!!!!") || text.includes("Up") ? "#7ee2a8" : "#aeb6bf");
        sx.fillText(shown, 32 + pw, y);
        if (i === line && Math.sin(t * 7) > 0) {
          sx.fillStyle = "#7fd8ce"; sx.fillRect(32 + pw + sx.measureText(shown).width + 4, y - 22, 14, 28);
        }
      }
      screenTex.needsUpdate = true;
    }

    return {
      tick(t, dt) {
        clock += dt;
        if (line < script.length) {
          const [prompt, text] = script[line];
          const speed = prompt ? 0.055 : 0.012; // commands type, output appears fast
          while (clock > speed && chars < text.length) { clock -= speed; chars++; }
          if (chars >= text.length && clock > (prompt ? 0.5 : 0.18)) { line++; chars = 0; clock = 0; }
        } else if (clock > 3) { line = 0; chars = 0; clock = 0; }
        const frameId = Math.floor(t * 20);
        if (frameId !== lastDraw || dt === 0) { lastDraw = frameId; drawScreen(t); }
      }
    };
  }

  // ==========================================================
  // 2. Edge router: 1U chassis, ports with LEDs, cables, vents
  // ==========================================================
  function buildRouter(root) {
    const chassis = mat(0x4a515c, { metalness: 0.7, roughness: 0.36 });
    const panel = mat(0x5a626e, { metalness: 0.6, roughness: 0.42 });
    const portMat = mat(0x0c0e11, { roughness: 0.8 });
    const metal = mat(0xb8bec6, { metalness: 0.9, roughness: 0.25 });

    const router = new THREE.Group();
    root.add(router);

    // Blockout: chassis
    const body = box(5.2, 0.62, 2.6, chassis, 0.08);
    router.add(body);
    // Front panel
    const front = new THREE.Mesh(new THREE.BoxGeometry(5.14, 0.56, 0.06), panel);
    front.position.set(0, 0.31, 1.31);
    router.add(front);
    // Rack ears
    [-2.72, 2.72].forEach((x) => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.62, 0.06), panel);
      ear.position.set(x, 0.31, 1.3);
      router.add(ear);
      [-0.15, 0.15].forEach((y) => {
        const hole = cyl(0.045, 0.045, 0.08, portMat, 12);
        hole.rotation.x = Math.PI / 2; hole.position.set(x, 0.31 + y, 1.33);
        router.add(hole);
      });
    });
    // Feet
    [[-2.2, -1], [2.2, -1], [-2.2, 1], [2.2, 1]].forEach(([x, z]) => {
      const f = cyl(0.12, 0.14, 0.06, portMat, 16); f.position.set(x, -0.03, z); router.add(f);
    });

    // Details: 8 RJ45 ports, each with link + activity LEDs
    const leds = [];
    const ledGreen = 0x5fe39b, ledAmber = 0xf4bf4f, ledOff = 0x1a1f24;
    for (let i = 0; i < 8; i++) {
      const x = -0.9 + (i % 4) * 0.42 + (i >= 4 ? 1.85 : 0) - 0.9;
      const port = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.08), portMat);
      port.position.set(x, 0.29, 1.34);
      router.add(port);
      const lip = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.09), metal);
      lip.position.set(x, 0.42, 1.34); router.add(lip);
      [-0.1, 0.1].forEach((dx, j) => {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, 0.03), glow(ledOff, 0));
        led.position.set(x + dx, 0.5, 1.35);
        router.add(led);
        leds.push({ mesh: led, kind: j === 0 ? "link" : "act", port: i, phase: Math.random() * 10, rate: 2 + Math.random() * 6 });
      });
    }
    // 2 SFP cages
    [1.55, 1.95].forEach((x) => {
      const sfp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.08), metal);
      sfp.position.set(x, 0.3, 1.34); router.add(sfp);
      const hole = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.09), portMat);
      hole.position.set(x, 0.3, 1.345); router.add(hole);
    });
    // Console port (light blue) and power LED
    const consolePort = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.2, 0.08), mat(0x6aa6c9, { roughness: 0.5 }));
    consolePort.position.set(2.32, 0.29, 1.34); router.add(consolePort);
    const power = new THREE.Mesh(cyl(0.035, 0.035, 0.04, glow(ledGreen, 2)).geometry, glow(ledGreen, 2));
    power.rotation.x = Math.PI / 2; power.position.set(-2.38, 0.42, 1.35); router.add(power);
    // Label on the panel
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.155), new THREE.MeshBasicMaterial({ map: labelTexture("R1 · EDGE", { w: 256, h: 64, color: "#c7cfd8", font: "600 30px Geist, system-ui, sans-serif" }), transparent: true }));
    label.position.set(-2.18, 0.2, 1.345); router.add(label);

    // Vents on the lid
    for (let i = 0; i < 14; i++) {
      const v = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 1.2), portMat);
      v.position.set(0.9 + i * 0.12, 0.63, -0.3);
      router.add(v);
    }
    const lidLabel = decal("Kuenzang Lhamo  ·  AS 65010", 2.2, 0.28, { w: 512, h: 64, color: "#7f8894", font: "500 26px Geist, system-ui, sans-serif" });
    lidLabel.position.set(-1.05, 0.632, 0.25); router.add(lidLabel);

    // Ethernet cables plugged into ports 1, 2, 5 and 6, with travelling packets
    const cableDefs = [
      { port: 0, color: 0x5cc8bd }, { port: 1, color: 0x8b95a3 },
      { port: 4, color: 0x7fa6c4 }, { port: 5, color: 0xd9dee5 }
    ];
    const pulses = [];
    cableDefs.forEach((c, n) => {
      const x = -0.9 + (c.port % 4) * 0.42 + (c.port >= 4 ? 1.85 : 0) - 0.9;
      const plug = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.3), mat(0xd4dae1, { roughness: 0.3, transparent: true, opacity: 0.85 }));
      plug.position.set(x, 0.29, 1.5); router.add(plug);
      const wire = cable([[x, 0.29, 1.62], [x, 0.22, 1.95], [x + (n - 1.5) * 0.12, -0.12, 2.25], [x + (n - 1.5) * 0.35, -0.24, 2.75]], c.color, 0.06);
      router.add(wire);
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), glow(0x9adfd6, 3));
      router.add(p);
      pulses.push({ mesh: p, curve: wire.userData.curve, t: n * 0.27, speed: 0.35 + n * 0.08, dir: n % 2 ? 1 : -1 });
      leds.filter((l) => l.port === c.port).forEach((l) => (l.connected = true));
    });

    router.position.y = -0.2;

    return {
      tick(t) {
        leds.forEach((l) => {
          let on = 0, color = ledOff;
          if (l.connected) {
            if (l.kind === "link") { on = 1.8; color = ledGreen; }
            else { on = Math.sin(t * l.rate + l.phase) > 0.2 ? 2.4 : 0; color = on ? ledAmber : ledOff; }
          }
          l.mesh.material.color.setHex(color);
          l.mesh.material.emissive.setHex(color);
          l.mesh.material.emissiveIntensity = on;
        });
        pulses.forEach((p) => {
          const u = (((t * p.speed + p.t) % 1) + 1) % 1;
          p.mesh.position.copy(p.curve.getPointAt(p.dir > 0 ? u : 1 - u));
        });
      }
    };
  }

  // ==========================================================
  // 3. Arduino Uno + PIR + HC-SR04 + servo, wired with jumpers
  // ==========================================================
  function buildArduino(root) {
    const pcb = mat(0x0f6f86, { roughness: 0.55, metalness: 0.1 });
    const black = mat(0x111316, { roughness: 0.6 });
    const silver = mat(0xc4cad1, { metalness: 0.9, roughness: 0.22 });
    const gold = mat(0xd8b25a, { metalness: 0.9, roughness: 0.3 });
    const white = mat(0xeef0f2, { roughness: 0.35 });

    const kit = new THREE.Group();
    root.add(kit);

    // --- Arduino Uno board ---
    const uno = new THREE.Group();
    kit.add(uno);
    const board = box(2.7, 0.07, 2.08, pcb, 0.08);
    uno.add(board);
    // mounting holes
    [[-1.2, -0.88], [1.15, -0.9], [-1.15, 0.92], [1.2, 0.6]].forEach(([x, z]) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.085, 20), gold);
      ring.rotation.x = -Math.PI / 2; ring.position.set(x, 0.081, z); uno.add(ring);
    });
    // USB-B port and barrel jack on the left edge
    const usb = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.5), silver);
    usb.position.set(-1.2, 0.28, -0.52); uno.add(usb);
    const jack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.36), black);
    jack.position.set(-1.24, 0.28, 0.62); uno.add(jack);
    // Female headers along the top and bottom edges (instanced pins)
    const headerTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.32, 0.12), black);
    headerTop.position.set(0.25, 0.23, -0.95); uno.add(headerTop);
    const headerBot = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.32, 0.12), black);
    headerBot.position.set(0.32, 0.23, 0.95); uno.add(headerBot);
    // ATmega328P DIP chip with legs
    const chip = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.12, 0.3), black);
    chip.position.set(0.45, 0.16, 0.45); uno.add(chip);
    const legGeo = new THREE.BoxGeometry(0.03, 0.08, 0.06);
    const legs = new THREE.InstancedMesh(legGeo, silver, 28);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < 14; i++) {
      m4.makeTranslation(-0.15 + i * 0.087 + 0.0, 0.12, 0.29); legs.setMatrixAt(i, m4);
      m4.makeTranslation(-0.15 + i * 0.087, 0.12, 0.61); legs.setMatrixAt(14 + i, m4);
    }
    legs.position.x = 0.04;
    uno.add(legs);
    // crystal, reset button, small parts
    const xtal = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.12), silver);
    xtal.position.set(-0.35, 0.12, -0.05); uno.add(xtal);
    const reset = cyl(0.07, 0.07, 0.08, mat(0xb0473e), 16);
    reset.position.set(-0.85, 0.13, -0.85); uno.add(reset);
    // LEDs: ON (green) and L (amber, blinks)
    const onLed = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.035), glow(0x5fe39b, 2));
    onLed.position.set(0.95, 0.1, 0.25); uno.add(onLed);
    const lLed = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.035), glow(0xf4bf4f, 2));
    lLed.position.set(-0.2, 0.1, -0.62); uno.add(lLed);
    // Board print
    const print = decal("UNO", 0.6, 0.2, { w: 256, h: 80, color: "#f2f5f7", font: "700 56px Geist, system-ui, sans-serif" });
    print.position.set(0.85, 0.082, -0.35); uno.add(print);
    const print2 = decal("ATmega328P", 0.95, 0.16, { w: 384, h: 64, color: "#9aa3ad", font: "500 30px 'Geist Mono', monospace" });
    print2.position.set(0.45, 0.225, 0.45); uno.add(print2);

    // --- HC-SR04 ultrasonic sensor (front right, standing up) ---
    const sonar = new THREE.Group();
    sonar.position.set(2.45, 0.05, 0.35);
    sonar.rotation.y = -0.5;
    kit.add(sonar);
    const sonarPcb = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.7, 0.05), mat(0x1d4f9a, { roughness: 0.5 }));
    sonarPcb.position.y = 0.4; sonar.add(sonarPcb);
    const transducers = [];
    [-0.42, 0.42].forEach((x) => {
      const can = cyl(0.27, 0.27, 0.3, silver, 32);
      can.rotation.x = Math.PI / 2; can.position.set(x, 0.42, 0.17); sonar.add(can);
      const mesh = new THREE.Mesh(new THREE.CircleGeometry(0.22, 32), mat(0x2b2f35, { roughness: 0.9 }));
      mesh.position.set(x, 0.42, 0.325); sonar.add(mesh);
      transducers.push(new THREE.Vector3(x, 0.42, 0.33));
    });
    // ultrasonic ping rings
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.012, 8, 48), new THREE.MeshBasicMaterial({ color: 0x9adfd6, transparent: true, opacity: 0 }));
      r.position.set(0, 0.42, 0.4); sonar.add(r);
      rings.push({ mesh: r, offset: i / 3 });
    }

    // --- PIR motion sensor (back right) ---
    const pir = new THREE.Group();
    pir.position.set(2.2, 0.05, -1.25);
    kit.add(pir);
    const pirPcb = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.05, 0.95), mat(0x2f7a43, { roughness: 0.6 }));
    pirPcb.position.y = 0.3; pir.add(pirPcb);
    const pirBase = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.62), white);
    pirBase.position.y = 0.36; pir.add(pirBase);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xf4f5f6, { roughness: 0.25, transparent: true, opacity: 0.92 }));
    dome.position.y = 0.4; pir.add(dome);
    [-0.3, 0, 0.3].forEach((x) => { const pin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.04), gold); pin.position.set(x, 0.15, 0.4); pir.add(pin); });
    const pirLight = new THREE.PointLight(0x9adfd6, 0, 1.6, 2);
    pirLight.position.set(0, 0.8, 0); pir.add(pirLight);

    // --- Servo motor (back left) with a moving horn ---
    const servo = new THREE.Group();
    servo.position.set(-2.35, 0.05, -1.1);
    kit.add(servo);
    const servoBody = box(0.9, 0.55, 0.45, mat(0x2a5bb8, { roughness: 0.45 }), 0.04);
    servoBody.position.y = 0.0; servo.add(servoBody);
    const tabs = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.05, 0.45), mat(0x2a5bb8, { roughness: 0.45 }));
    tabs.position.y = 0.42; servo.add(tabs);
    const shaft = cyl(0.1, 0.1, 0.12, white, 20); shaft.position.set(0.22, 0.62, 0); servo.add(shaft);
    const horn = new THREE.Group(); horn.position.set(0.22, 0.7, 0); servo.add(horn);
    const arm = box(0.75, 0.05, 0.13, white, 0.06); arm.position.x = 0.28; horn.add(arm);

    // --- Jumper wires from the headers to each part ---
    const wires = [
      [[0.9, 0.42, -0.95], [1.2, 1.0, -1.1], [1.9, 0.9, -1.3], [2.2, 0.32, -0.85]],   // PIR signal
      [[0.6, 0.42, -0.95], [0.9, 1.15, -1.3], [1.8, 1.1, -1.5], [1.9, 0.32, -0.85]],   // PIR power
      [[0.0, 0.42, 0.95], [0.4, 1.0, 1.5], [1.6, 0.9, 1.3], [2.15, 0.25, 0.6]],        // sonar trig
      [[0.25, 0.42, 0.95], [0.7, 1.15, 1.65], [1.9, 1.0, 1.35], [2.35, 0.25, 0.55]],    // sonar echo
      [[-0.4, 0.42, -0.95], [-0.9, 1.1, -1.3], [-1.7, 0.8, -1.2], [-1.95, 0.35, -1.1]] // servo signal
    ];
    const wireColors = [0xe2554f, 0x1d1f22, 0xf2c14e, 0xe8894a, 0xd9dee5];
    wires.forEach((pts, i) => kit.add(cable(pts, wireColors[i], 0.028)));

    kit.position.set(-0.1, -0.35, 0);

    let sweep = 0;
    // Controls for the IoT lab buttons (js/scenes.js). Until someone
    // presses a button, the board runs a short demo loop on its own.
    const ctl = { touched: false, motionUntil: 0, hand: false, blink: false, now: 0 };
    window.arduinoKit = {
      motion(seconds = 4) { ctl.touched = true; ctl.motionUntil = ctl.now + seconds; },
      hand(on) { ctl.touched = true; ctl.hand = on; },
      blink(on) { ctl.touched = true; ctl.blink = on; }
    };
    return {
      tick(t) {
        ctl.now = t;
        let detected, lidOpen, blinkOn, ringsOn;
        if (!ctl.touched) {
          const cycle = t % 6;
          detected = cycle > 1 && cycle < 3.6;
          lidOpen = detected; blinkOn = true; ringsOn = true;
        } else {
          detected = t < ctl.motionUntil;
          lidOpen = detected || ctl.hand;
          blinkOn = ctl.blink;
          ringsOn = ctl.hand;
        }
        // L LED: blinks like the Blink sketch when it is running
        lLed.material.emissiveIntensity = blinkOn && Math.sin(t * Math.PI) > 0 ? 2.4 : 0.05;
        // PIR dome glows while it sees motion
        pirLight.intensity += ((detected ? 2.5 : 0) - pirLight.intensity) * 0.1;
        dome.material.emissive.setHex(0x5cc8bd);
        dome.material.emissiveIntensity = pirLight.intensity * 0.12;
        // Servo turns 90 degrees to open the door / bin lid
        const target = lidOpen ? -Math.PI / 2 : 0;
        sweep += (target - sweep) * 0.06;
        horn.rotation.y = sweep;
        // Ultrasonic pings spread out from the sensor
        rings.forEach((r) => {
          const u = (t * (ctl.hand ? 1.4 : 0.7) + r.offset) % 1;
          r.mesh.scale.setScalar(1 + u * 1.4);
          r.mesh.position.z = 0.4 + u * 0.9;
          r.mesh.material.opacity = ringsOn ? (1 - u) * 0.45 : 0;
        });
      }
    };
  }

  // Let other pages (space.html) place these models in their own scene
  window.KLModels = { buildLaptop, buildRouter, buildArduino };

  // ---------- Start each model when its section exists ----------
  function mount(id, build, opts) {
    const el = document.getElementById(id);
    if (el) createViewer(el, build, opts);
  }
  function start() {
    mount("laptop3d", buildLaptop, { camera: [0, 3.6, 7.6], target: [0, 0.35, 0], fov: 30, yaw: -0.45, pitch: 0.05, shadow: [7, 4.5, 1], floor: -0.62 });
    mount("router3d", buildRouter, { camera: [0, 3.2, 7.2], target: [0, -0.05, 0.7], fov: 34, yaw: -0.38, pitch: 0.08, shadow: [8, 4, 1], floor: -0.25 });
    mount("arduino3d", buildArduino, { camera: [0, 4.4, 7.4], target: [0, 0, 0], fov: 34, yaw: 0.35, pitch: 0.05, shadow: [8, 5, 1], floor: -0.31 });
  }
  // Wait for the fonts so the labels on the models use Geist
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
})();
