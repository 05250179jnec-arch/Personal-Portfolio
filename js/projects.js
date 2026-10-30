// ==========================================================
// Projects: filters, case studies and live demos
// Every demo runs in the browser with JavaScript only
// (state is kept in memory), so visitors can try the idea
// without installing anything.
// ==========================================================
(function () {
  const modal = document.getElementById("projModal");
  if (!modal) return;

  // ---------- Small helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  function h(tag, attrs = {}, ...children) {          // create an element safely
    const el = document.createElement(tag);
    for (const k in attrs) {
      if (k === "class") el.className = attrs[k];
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), attrs[k]);
      else el.setAttribute(k, attrs[k]);
    }
    children.flat().forEach((c) => el.append(c instanceof Node ? c : document.createTextNode(c)));
    return el;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------- Case study content ----------
  const PROJECTS = {
    "proj-autoconnection": {
      kicker: "Full-stack web app · Team project · In progress", title: "AutoConnection", color: "#38bdf8",
      problem: "Many small auto workshops still run on paper job cards. Customers phone to ask about progress, jobs are handed out by word of mouth, and parts run out mid-repair.",
      built: "A web system with one database and a separate dashboard for each role: customers book and track repairs, mechanics manage their assigned jobs, and admins oversee stock, suppliers and reports.",
      features: ["Role-based dashboards for Customer, Mechanic and Admin", "Live repair tracking: Pending → In progress → Complete", "Inventory with low-stock warnings and purchase orders", "Passwords hashed with bcrypt, JWT login and role checks on every request"],
      tech: ["React", "Node.js", "Express", "MySQL", "JWT", "bcrypt", "Postman", "Selenium", "JMeter", "Figma"],
      learned: "Designing role-based access control, planning work in Agile sprints, and testing APIs with Postman (for example, checking a wrong password returns 401).",
      link: "https://github.com/05240130jnec-ship-it/auto-workshop"
    },
    "proj-events": {
      kicker: "Web development", title: "JNEC Events Hub", color: "#a78bfa",
      problem: "Students at JNEC had no single place to discover upcoming college events and register for them.",
      built: "A multi-page responsive website with Home, Events, Register, Gallery and Contact pages.",
      features: ["Event listings for the college", "Registration form", "Photo gallery", "Responsive layout for phones and computers"],
      tech: ["HTML", "CSS", "JavaScript"],
      learned: "Structuring a multi-page site, building forms and making layouts responsive.",
      link: "https://github.com/05250179jnec-arch/events_hub"
    },
    "proj-task": {
      kicker: "Full-stack · REST API", title: "Task Manager (Task API)", color: "#22d3ee",
      problem: "Practise building a real backend: a REST API with a cloud database and a frontend that talks to it.",
      built: "A task-management frontend connected to an Express REST API and a cloud MySQL database on Aiven, built step by step with Git commits.",
      features: ["Create, read, update and delete tasks (CRUD)", "REST endpoints: GET, POST, PUT, DELETE /tasks", "Data stored in a cloud MySQL database", "Frontend updates from the API's responses"],
      tech: ["JavaScript", "Node.js", "Express", "MySQL (Aiven)", "REST"],
      learned: "How HTTP methods and status codes map to database operations, and how a frontend and backend communicate.",
      link: "https://github.com/05250179jnec-arch/Task_API"
    },
    "proj-bank": {
      kicker: "Network design", title: "Bank Network with eBGP & ACLs", color: "#38bdf8",
      problem: "A bank needs a reliable connection to its ISP while keeping its sensitive servers protected.",
      built: "A bank network in Cisco Packet Tracer connected to a single ISP, using eBGP to exchange routes and extended ACLs to filter traffic. Documented in a technical report and defended in a viva.",
      features: ["eBGP peering between the bank and the ISP", "Extended ACLs protecting the database server", "Only approved traffic (e.g. HTTPS to the web server) allowed in", "Technical report and viva"],
      tech: ["Cisco Packet Tracer", "eBGP", "ACL", "Subnetting"],
      learned: "How routers exchange routes with BGP, and how ACL rules are checked from top to bottom with an implicit deny at the end.",
      demoNote: "The ACL logic from this project is interactive in my Network Lab."
    },
    "proj-dhcp": {
      kicker: "Systems lab · Group 7", title: "DHCP Server Setup & Verification", color: "#4ade80",
      problem: "Configuring IP addresses by hand on every machine is slow and causes conflicts.",
      built: "In a group practical, we configured a DHCP server on Ubuntu Server virtual machines, then tested and verified that clients received IP addresses automatically, and presented our findings.",
      features: ["DHCP server on Ubuntu Server", "Address pool and lease settings", "Verified automatic IP assignment on clients", "Group presentation to the class"],
      tech: ["Ubuntu Server", "VirtualBox", "DHCP"],
      learned: "The DORA process (Discover, Offer, Request, Acknowledge) and how to verify and troubleshoot a DHCP service."
    },
    "proj-iot": {
      kicker: "IoT · Embedded systems", title: "Smart Room Automation", color: "#facc15",
      problem: "Lights left on waste electricity, and touching shared bins and doors is unhygienic.",
      built: "Three Arduino Uno systems: room lighting controlled by a PIR motion sensor and relay, a dustbin whose lid opens when a hand comes near, and a door that opens when a person approaches.",
      features: ["PIR motion sensor switches an AC bulb through a relay", "HC-SR04 ultrasonic sensor measures distance", "Servo motors open the dustbin lid and the door", "Documented circuits, system flows and Arduino code"],
      tech: ["Arduino Uno", "Arduino IDE (C++)", "PIR Sensor", "HC-SR04", "Servo Motor", "Relay Module"],
      learned: "Reading sensors, controlling actuators, and working safely with relays and AC wiring."
    },
    "proj-druk": {
      kicker: "Hackathon · Team Raven", title: "DRUK SPORTS", color: "#22c55e",
      problem: "Many young football talents in Bhutan are never discovered: there is no structured coaching system or clear pathway to higher-level football.",
      built: "With Team Raven at the JNEC Campus Hackathon, we designed and pitched a digital and physical platform connecting young players with certified coaches, training programmes and local tournaments.",
      features: ["Digital registration and smart matching of players and coaches", "Flexible, on-demand coaching sessions", "Organised local tournaments for exposure", "Business model: subscriptions, sponsorships and event fees"],
      tech: ["Market research", "Business modelling", "Pitching", "Teamwork"],
      learned: "Turning a problem into a product idea, validating demand with a survey, and presenting a business pitch."
    }
  };

  // ---------- Filters ----------
  const cards = document.querySelectorAll(".projects-grid > .project-card");
  document.querySelectorAll(".pf-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pf-btn").forEach((b) => b.classList.toggle("active", b === btn));
      const f = btn.dataset.pf;
      cards.forEach((c) => {
        const show = f === "all" || c.dataset.pf === f;
        c.classList.toggle("pf-hide", !show);
        if (show) { c.classList.remove("pf-pop"); void c.offsetWidth; c.classList.add("pf-pop"); }
      });
    });
  });

  // ---------- Modal ----------
  const body = $("#pmBody"), title = $("#pmTitle"), kicker = $("#pmKicker"), tabs = $("#pmTabs");
  let current = null, lastFocus = null, cleanup = null;

  function open(id, tab) {
    const p = PROJECTS[id]; if (!p) return;
    current = id; lastFocus = document.activeElement;
    modal.style.setProperty("--c", p.color);
    title.textContent = p.title; kicker.textContent = p.kicker;
    const hasDemo = !!DEMOS[id];
    tabs.querySelector('[data-tab="demo"]').hidden = !hasDemo;
    show(hasDemo ? tab : "cs");
    modal.hidden = false;
    document.body.classList.add("lb-open");
    $("#pmClose").focus();
  }
  function close() {
    if (cleanup) { cleanup(); cleanup = null; }
    modal.hidden = true;
    document.body.classList.remove("lb-open");
    if (lastFocus) lastFocus.focus();
  }
  function show(tab) {
    if (cleanup) { cleanup(); cleanup = null; }
    tabs.querySelectorAll(".pm-tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
    body.innerHTML = "";
    body.classList.remove("pm-anim"); void body.offsetWidth; body.classList.add("pm-anim");
    if (tab === "demo") cleanup = DEMOS[current](body) || null;
    else body.append(caseStudy(PROJECTS[current]));
  }
  tabs.addEventListener("click", (e) => { const t = e.target.closest(".pm-tab"); if (t) show(t.dataset.tab); });
  $("#pmClose").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
  document.addEventListener("click", (e) => {
    const t = e.target.closest(".try-btn, .cs-btn");
    if (!t) return;
    const id = t.dataset.demo || t.dataset.cs;
    if (id === "proj-bank" && t.classList.contains("try-btn")) {   // the bank demo lives in the Network Lab
      const lab = document.getElementById("lab-acl");
      lab.scrollIntoView({ behavior: "smooth", block: "center" });
      lab.classList.remove("flash"); void lab.offsetWidth; lab.classList.add("flash");
      return;
    }
    open(id, t.dataset.demo ? "demo" : "cs");
  });

  function caseStudy(p) {
    const wrap = h("div", { class: "cs" });
    const sec = (label, ...content) => h("section", { class: "cs-sec" }, h("h4", {}, label), ...content);
    wrap.append(
      sec("The problem", h("p", {}, p.problem)),
      sec("What I built", h("p", {}, p.built)),
      sec("Key features", h("ul", { class: "cs-list" }, p.features.map((f) => h("li", {}, f)))),
      sec("Tech", h("div", { class: "cs-tags" }, p.tech.map((t) => h("span", {}, t)))),
      sec("What I learned", h("p", {}, p.learned))
    );
    const links = h("div", { class: "cs-links" });
    if (p.link) links.append(h("a", { class: "btn btn-primary btn-sm", href: p.link, target: "_blank", rel: "noopener" }, "View on GitHub ↗"));
    if (p.demoNote) links.append(h("p", { class: "cs-note" }, p.demoNote));
    if (links.childNodes.length) wrap.append(links);
    return wrap;
  }

  // ======================================================
  // DEMOS (each returns an optional cleanup function)
  // ======================================================
  const DEMOS = {};

  // ---------- AutoConnection: three roles sharing one "database" ----------
  DEMOS["proj-autoconnection"] = (root) => {
    const db = { jobs: [{ id: 1041, car: "Toyota Hilux", issue: "Engine service", status: 2 }], next: 1042, role: "customer" };
    const STATUS = ["Pending", "In progress", "Complete"];
    const app = h("div", { class: "demo ac-demo" });
    const roleBar = h("div", { class: "demo-roles" });
    const view = h("div", { class: "demo-view" });
    const toast = h("p", { class: "demo-toast", role: "status" });
    ["customer", "mechanic", "admin"].forEach((r) => roleBar.append(h("button", { type: "button", "data-r": r, onclick: () => { db.role = r; render(); } }, r[0].toUpperCase() + r.slice(1))));
    app.append(h("p", { class: "demo-hint" }, "Switch roles to see how the same data looks to each user."), roleBar, view, toast);
    root.append(app);

    const say = (msg) => { toast.textContent = msg; toast.classList.remove("on"); void toast.offsetWidth; toast.classList.add("on"); };
    const tracker = (st) => h("div", { class: "ac-track2" }, STATUS.map((s, i) => h("span", { class: i <= st ? "done" : "" }, s)));

    function render() {
      roleBar.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.r === db.role));
      view.innerHTML = "";
      if (db.role === "customer") {
        const car = h("input", { placeholder: "Vehicle, e.g. Hyundai i10", "aria-label": "Vehicle" });
        const issue = h("input", { placeholder: "Problem, e.g. Brakes squeaking", "aria-label": "Problem" });
        const form = h("form", { class: "demo-form", onsubmit: (e) => {
          e.preventDefault();
          if (!car.value.trim() || !issue.value.trim()) { say("Please fill in both fields."); return; }
          db.jobs.unshift({ id: db.next++, car: car.value.trim(), issue: issue.value.trim(), status: 0 });
          say("Booked! Switch to Mechanic to work on it.");
          render();
        } }, car, issue, h("button", { class: "btn btn-primary btn-sm", type: "submit" }, "Book repair"));
        view.append(h("h5", {}, "Book a repair"), form, h("h5", {}, "My repairs"));
        db.jobs.forEach((j) => view.append(h("div", { class: "demo-row" }, h("div", {}, h("b", {}, "#AC-" + j.id + " · " + j.car), h("small", {}, j.issue)), tracker(j.status))));
      } else if (db.role === "mechanic") {
        view.append(h("h5", {}, "Assigned repair orders"));
        db.jobs.forEach((j) => {
          const btn = j.status < 2 ? h("button", { class: "btn btn-primary btn-sm", type: "button", onclick: () => {
            j.status++; say("#AC-" + j.id + " is now " + STATUS[j.status] + ". The customer sees it instantly."); render();
          } }, j.status === 0 ? "Start job" : "Mark complete") : h("span", { class: "demo-done" }, "✓ Complete");
          view.append(h("div", { class: "demo-row" }, h("div", {}, h("b", {}, "#AC-" + j.id + " · " + j.car), h("small", {}, j.issue + " · " + STATUS[j.status])), btn));
        });
      } else {
        const count = (s) => db.jobs.filter((j) => j.status === s).length;
        view.append(h("h5", {}, "Workshop overview"), h("div", { class: "demo-stats" },
          [["Total jobs", db.jobs.length], ["Pending", count(0)], ["In progress", count(1)], ["Complete", count(2)]].map(([l, v]) => h("div", {}, h("b", {}, String(v)), h("small", {}, l)))));
        view.append(h("p", { class: "demo-hint" }, "In the real system, admins also manage inventory, suppliers and reports."));
      }
    }
    render();
  };

  // ---------- Task API: CRUD with a request log ----------
  DEMOS["proj-task"] = (root) => {
    let tasks = [{ id: 1, title: "Set up Express server", done: true }, { id: 2, title: "Connect Aiven MySQL", done: false }];
    let nextId = 3;
    const app = h("div", { class: "demo task-demo" });
    const input = h("input", { placeholder: "New task…", "aria-label": "New task" });
    const list = h("ul", { class: "task-list" });
    const log = h("div", { class: "api-log", "aria-live": "polite" });
    const status = { GET: 200, POST: 201, PUT: 200, DELETE: 204 };
    function call(method, path, body) {
      const line = h("p", {}, h("span", { class: "m " + method.toLowerCase() }, method), " " + path + (body ? " " + JSON.stringify(body) : "") + "  ", h("span", { class: "s" }, "→ " + status[method]));
      log.prepend(line);
    }
    const form = h("form", { class: "demo-form", onsubmit: (e) => {
      e.preventDefault(); const t = input.value.trim(); if (!t) return;
      tasks.push({ id: nextId, title: t, done: false }); call("POST", "/tasks", { title: t }); nextId++; input.value = ""; render();
    } }, input, h("button", { class: "btn btn-primary btn-sm", type: "submit" }, "Add"));
    function render() {
      list.innerHTML = "";
      tasks.forEach((t) => list.append(h("li", { class: t.done ? "done" : "" },
        h("label", {}, h("input", { type: "checkbox", ...(t.done ? { checked: "" } : {}), onchange: () => { t.done = !t.done; call("PUT", "/tasks/" + t.id, { done: t.done }); render(); } }), h("span", {}, t.title)),
        h("button", { type: "button", class: "task-del", "aria-label": "Delete " + t.title, onclick: () => { tasks = tasks.filter((x) => x !== t); call("DELETE", "/tasks/" + t.id); render(); } }, "✕"))));
    }
    app.append(h("p", { class: "demo-hint" }, "Each action shows the REST request the frontend sends to the Express API."), form, list, h("h5", {}, "API requests"), log);
    root.append(app);
    call("GET", "/tasks"); render();
  };

  // ---------- DHCP: DORA handshake with a lease table ----------
  DEMOS["proj-dhcp"] = (root) => {
    let nextHost = 100, n = 0, busy = false;
    const app = h("div", { class: "demo dhcp-demo" });
    const steps = ["DISCOVER", "OFFER", "REQUEST", "ACK"];
    const lane = h("div", { class: "dora" }, h("div", { class: "dora-node" }, "Client"), h("div", { class: "dora-mid" }, steps.map((s, i) => h("div", { class: "dora-step " + (i % 2 ? "left" : "right") }, h("span", {}, s)))), h("div", { class: "dora-node srv" }, "DHCP server", h("small", {}, "Ubuntu")));
    const table = h("table", { class: "lease" }, h("thead", {}, h("tr", {}, h("th", {}, "Client"), h("th", {}, "MAC"), h("th", {}, "IP address"), h("th", {}, "Lease"))), h("tbody"));
    const btn = h("button", { class: "btn btn-primary btn-sm", type: "button", onclick: run }, "Connect a client");
    app.append(h("p", { class: "demo-hint" }, "Pool: 192.168.10.100 – 192.168.10.200 · /24 · gateway 192.168.10.1"), lane, btn, table);
    root.append(app);
    let alive = true;
    async function run() {
      if (busy) return; busy = true; btn.disabled = true; n++;
      const els = lane.querySelectorAll(".dora-step");
      els.forEach((e) => e.classList.remove("go"));
      for (const e of els) { if (!alive) return; e.classList.add("go"); await wait(650); }
      const mac = Array.from({ length: 3 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join(":");
      table.tBodies[0].prepend(h("tr", { class: "new" }, h("td", {}, "PC-" + n), h("td", {}, "08:00:27:" + mac), h("td", {}, "192.168.10." + nextHost++), h("td", {}, "24 h")));
      busy = false; btn.disabled = false;
    }
    return () => { alive = false; };
  };

  // ---------- Smart room: sensors and actuators ----------
  DEMOS["proj-iot"] = (root) => {
    const app = h("div", { class: "demo iot-demo" });
    const serial = h("div", { class: "serial", "aria-live": "polite" });
    const log = (t) => { serial.prepend(h("p", {}, "> " + t)); while (serial.children.length > 8) serial.lastChild.remove(); };

    // 1. light
    const bulb = h("div", { class: "bulb2" });
    const motionBtn = h("button", { class: "btn btn-outline btn-sm", type: "button" }, "🚶 Walk into the room");
    let lightTimer;
    motionBtn.addEventListener("click", () => {
      bulb.classList.add("on"); log("PIR: motion detected → relay ON → light ON");
      clearTimeout(lightTimer);
      lightTimer = setTimeout(() => { bulb.classList.remove("on"); log("PIR: no motion for 5 s → relay OFF"); }, 5000);
    });
    // 2. dustbin and 3. door: distance sliders
    function distanceDevice(name, threshold, cls) {
      const out = h("output", {}, "60 cm");
      const thing = h("div", { class: cls });
      let open = false;
      const slider = h("input", { type: "range", min: "2", max: "100", value: "60", "aria-label": name + " distance" });
      slider.addEventListener("input", () => {
        const d = +slider.value; out.textContent = d + " cm";
        const now = d < threshold;
        if (now !== open) { open = now; thing.classList.toggle("open", open); log("HC-SR04: " + d + " cm → servo " + (open ? "90° (" + name + " opens)" : "0° (" + name + " closes)")); }
      });
      return h("div", { class: "iot-card" }, h("h5", {}, name), thing, h("label", { class: "iot-range" }, "Distance", slider, out), h("small", {}, "Opens below " + threshold + " cm"));
    }
    app.append(
      h("p", { class: "demo-hint" }, "Try the sensors. The serial monitor shows what the Arduino would print."),
      h("div", { class: "iot-grid" },
        h("div", { class: "iot-card" }, h("h5", {}, "Smart light"), bulb, motionBtn, h("small", {}, "Turns off after 5 s without motion")),
        distanceDevice("Dustbin lid", 20, "lid"),
        distanceDevice("Door", 50, "door2")),
      h("h5", {}, "Serial monitor"), serial);
    root.append(app);
    log("System ready");
    return () => clearTimeout(lightTimer);
  };

  // the bank "demo" is the ACL simulator in the Network Lab (handled in the click handler)
  DEMOS["proj-bank"] = null;
  delete DEMOS["proj-bank"];
})();
