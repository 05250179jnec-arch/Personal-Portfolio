// Kuenzang Lhamo · portfolio script: the 3D voyage (three.js), project case studies and demos, experience pop-ups
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  $("year").textContent = new Date().getFullYear();

  const panels = [...document.querySelectorAll(".panel")];
  const CH = panels.length - 1; // last chapter index
  const LABELS = ["Launch", "Introducing", "Planet Web", "Planet Network", "Station ring", "Hall of certificates", "Skills nebula", "Signal"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phone = () => window.innerWidth <= 760;

  // Copy email
  $("copyEmail").addEventListener("click", () => {
    const email = "klhamo2414@gmail.com";
    const show = (msg) => { const t = $("toast"); t.textContent = msg; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(() => show("Email copied ✓"), () => (location.href = "mailto:" + email));
    else location.href = "mailto:" + email;
  });

  // Lightbox for photos and certificates
  const lb = $("lightbox");
  function openLightbox(src, cap) {
    $("lbImg").src = src; $("lbImg").alt = cap; $("lbCap").textContent = cap;
    if (lb.showModal) lb.showModal(); else window.open(src, "_blank");
  }
  window.__openLightbox = openLightbox;
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  document.querySelectorAll("[data-img]").forEach((b) => b.addEventListener("click", () => openLightbox(b.dataset.img, b.dataset.cap)));

  // ---------- Projects: case studies and live demos (from my first site) ----------
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    attrs = attrs || {};
    for (const k in attrs) {
      if (k === "class") el.className = attrs[k];
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), attrs[k]);
      else el.setAttribute(k, attrs[k]);
    }
    children.flat().forEach((c) => el.append(c instanceof Node ? c : document.createTextNode(c)));
    return el;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const PROJECTS = {
    "proj-autoconnection": {
      kicker: "Full-stack web app · Team project · In progress", title: "AutoConnection", color: "#5cc8bd",
      problem: "Many small auto workshops still run on paper job cards. Customers phone to ask about progress, jobs are handed out by word of mouth, and parts run out mid-repair.",
      built: "A web system with one database and a separate dashboard for each role: customers book and track repairs, mechanics manage their assigned jobs, and admins oversee stock, suppliers and reports.",
      features: ["Role-based dashboards for Customer, Mechanic and Admin", "Live repair tracking: Pending → In progress → Complete", "Inventory with low-stock warnings and purchase orders", "Passwords hashed with bcrypt, JWT login and role checks on every request"],
      tech: ["React", "Node.js", "Express", "MySQL", "JWT", "bcrypt", "Postman", "Selenium", "JMeter", "Figma"],
      learned: "Designing role-based access control, planning work in Agile sprints, and testing APIs with Postman (for example, checking a wrong password returns 401).",
      link: "https://github.com/05240130jnec-ship-it/auto-workshop"
    },
    "proj-events": {
      kicker: "Web development", title: "JNEC Events Hub", color: "#5cc8bd",
      problem: "Students at JNEC had no single place to discover upcoming college events and register for them.",
      built: "A multi-page responsive website with Home, Events, Register, Gallery and Contact pages.",
      features: ["Event listings for the college", "Registration form", "Photo gallery", "Responsive layout for phones and computers"],
      tech: ["HTML", "CSS", "JavaScript"],
      learned: "Structuring a multi-page site, building forms and making layouts responsive.",
      link: "https://github.com/05250179jnec-arch/events_hub"
    },
    "proj-task": {
      kicker: "Full-stack · REST API", title: "Task Manager (Task API)", color: "#5cc8bd",
      problem: "Practise building a real backend: a REST API with a cloud database and a frontend that talks to it.",
      built: "A task-management frontend connected to an Express REST API and a cloud MySQL database on Aiven, built step by step with Git commits.",
      features: ["Create, read, update and delete tasks (CRUD)", "REST endpoints: GET, POST, PUT, DELETE /tasks", "Data stored in a cloud MySQL database", "Frontend updates from the API's responses"],
      tech: ["JavaScript", "Node.js", "Express", "MySQL (Aiven)", "REST"],
      learned: "How HTTP methods and status codes map to database operations, and how a frontend and backend communicate.",
      link: "https://github.com/05250179jnec-arch/Task_API"
    },
    "proj-bank": {
      kicker: "Network design", title: "Bank Network with eBGP & ACLs", color: "#5cc8bd",
      problem: "A bank needs a reliable connection to its ISP while keeping its sensitive servers protected.",
      built: "A bank network in Cisco Packet Tracer connected to a single ISP, using eBGP to exchange routes and extended ACLs to filter traffic. Documented in a technical report and defended in a viva.",
      features: ["eBGP peering between the bank and the ISP", "Extended ACLs protecting the database server", "Only approved traffic (e.g. HTTPS to the web server) allowed in", "Technical report and viva"],
      tech: ["Cisco Packet Tracer", "eBGP", "ACL", "Subnetting"],
      learned: "How routers exchange routes with BGP, and how ACL rules are checked from top to bottom with an implicit deny at the end.",
    },
    "proj-dhcp": {
      kicker: "Systems lab · Group 7", title: "DHCP Server Setup & Verification", color: "#5cc8bd",
      problem: "Configuring IP addresses by hand on every machine is slow and causes conflicts.",
      built: "In a group practical, we configured a DHCP server on Ubuntu Server virtual machines, then tested and verified that clients received IP addresses automatically, and presented our findings.",
      features: ["DHCP server on Ubuntu Server", "Address pool and lease settings", "Verified automatic IP assignment on clients", "Group presentation to the class"],
      tech: ["Ubuntu Server", "VirtualBox", "DHCP"],
      learned: "The DORA process (Discover, Offer, Request, Acknowledge) and how to verify and troubleshoot a DHCP service."
    },
    "proj-iot": {
      kicker: "IoT · Embedded systems", title: "Smart Room Automation", color: "#5cc8bd",
      problem: "Lights left on waste electricity, and touching shared bins and doors is unhygienic.",
      built: "Three Arduino Uno systems: room lighting controlled by a PIR motion sensor and relay, a dustbin whose lid opens when a hand comes near, and a door that opens when a person approaches.",
      features: ["PIR motion sensor switches an AC bulb through a relay", "HC-SR04 ultrasonic sensor measures distance", "Servo motors open the dustbin lid and the door", "Documented circuits, system flows and Arduino code"],
      tech: ["Arduino Uno", "Arduino IDE (C++)", "PIR Sensor", "HC-SR04", "Servo Motor", "Relay Module"],
      learned: "Reading sensors, controlling actuators, and working safely with relays and AC wiring."
    },
    "proj-druk": {
      kicker: "Hackathon · Team Raven", title: "DRUK SPORTS", color: "#5cc8bd",
      problem: "Many young football talents in Bhutan are never discovered: there is no structured coaching system or clear pathway to higher-level football.",
      built: "With Team Raven at the JNEC Campus Hackathon, we designed and pitched a digital and physical platform connecting young players with certified coaches, training programmes and local tournaments.",
      features: ["Digital registration and smart matching of players and coaches", "Flexible, on-demand coaching sessions", "Organised local tournaments for exposure", "Business model: subscriptions, sponsorships and event fees"],
      tech: ["Market research", "Business modelling", "Pitching", "Teamwork"],
      learned: "Turning a problem into a product idea, validating demand with a survey, and presenting a business pitch."
    }
  };


  PROJECTS["proj-druk"].gallery = [
    ["assets/druk/cover.jpg", "Cover"], ["assets/druk/problem.jpg", "The problem"], ["assets/druk/solution.jpg", "The solution"],
    ["assets/druk/market-demand.jpg", "Market demand"], ["assets/druk/business-model.jpg", "Business model"], ["assets/druk/timeline.jpg", "Timeline"]];
  PROJECTS["proj-iot"].gallery = [
    ["assets/iot/light-circuit.jpg", "Smart lighting circuit"], ["assets/iot/servo-circuit.jpg", "Ultrasonic sensor and servo circuit"],
    ["assets/iot/light-flow.jpg", "System flow: lighting"], ["assets/iot/dustbin-flow.jpg", "System flow: dustbin"], ["assets/iot/door-flow.jpg", "System flow: door"]];

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
        } }, car, issue, h("button", { class: "pbtn primary", type: "submit" }, "Book repair"));
        view.append(h("h5", {}, "Book a repair"), form, h("h5", {}, "My repairs"));
        db.jobs.forEach((j) => view.append(h("div", { class: "demo-row" }, h("div", {}, h("b", {}, "#AC-" + j.id + " · " + j.car), h("small", {}, j.issue)), tracker(j.status))));
      } else if (db.role === "mechanic") {
        view.append(h("h5", {}, "Assigned repair orders"));
        db.jobs.forEach((j) => {
          const btn = j.status < 2 ? h("button", { class: "pbtn primary", type: "button", onclick: () => {
            j.status++; say("#AC-" + j.id + " is now " + STATUS[j.status] + ". The customer sees it instantly."); render();
          } }, j.status === 0 ? "Start job" : "Mark complete") : h("span", { class: "demo-done" }, "Complete");
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
    } }, input, h("button", { class: "pbtn primary", type: "submit" }, "Add"));
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
    const btn = h("button", { class: "pbtn primary", type: "button", onclick: run }, "Connect a client");
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
    const motionBtn = h("button", { class: "pbtn", type: "button" }, "Walk into the room");
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


  // ---------- Bank: walk a packet through the ACL, top to bottom ----------
  DEMOS["proj-bank"] = (root) => {
    const RULES = [
      { t: "10 permit tcp any host 192.168.20.20 eq 443", m: (p) => p.dst === "web" && p.port === 443, ok: true },
      { t: "20 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.30 eq 3306", m: (p) => p.src === "lan" && p.dst === "db" && p.port === 3306, ok: true },
      { t: "30 deny   ip any any log  (implicit deny)", m: () => true, ok: false }
    ];
    const TRAFFIC = [
      { label: "Internet host → Web server, TCP 443 (HTTPS)", src: "net", dst: "web", port: 443 },
      { label: "Internet host → DB server, TCP 3306 (MySQL)", src: "net", dst: "db", port: 3306 },
      { label: "Branch LAN → DB server, TCP 3306 (MySQL)", src: "lan", dst: "db", port: 3306 },
      { label: "Internet host → Web server, TCP 23 (Telnet)", src: "net", dst: "web", port: 23 }
    ];
    const sel = h("select", { "aria-label": "Choose traffic" }, TRAFFIC.map((t, i) => h("option", { value: String(i) }, t.label)));
    const list = h("ol", { class: "acl-rules" }, RULES.map((r) => h("li", {}, r.t)));
    const out = h("p", { class: "acl-out", role: "status" }, "Choose some traffic and send it.");
    let alive = true, busy = false;
    async function send() {
      if (busy) return; busy = true;
      const p = TRAFFIC[+sel.value], lis = [...list.children];
      lis.forEach((li) => li.className = "");
      out.className = "acl-out"; out.textContent = "Checking rules from the top…";
      for (let i = 0; i < RULES.length; i++) {
        if (!alive) return;
        lis[i].className = "hit" + (RULES[i].ok ? "" : " deny");
        await wait(600);
        if (RULES[i].m(p)) {
          out.className = "acl-out " + (RULES[i].ok ? "ok" : "no");
          out.textContent = (RULES[i].ok ? "PERMITTED" : "DENIED") + " by rule " + RULES[i].t.split(" ")[0] + ". Checking stops at the first match.";
          busy = false; return;
        }
        lis[i].className = "checked";
      }
    }
    root.append(h("div", { class: "demo" },
      h("p", { class: "demo-hint" }, "The ACL on R1 protects the bank's servers. Pick some traffic and watch R1 check the rules in order."),
      h("div", { class: "demo-form" }, sel, h("button", { class: "pbtn primary", type: "button", onclick: send }, "Send packet")),
      h("h5", {}, "ip access-list extended PROTECT-SRV"), list, out));
    return () => { alive = false; };
  };

  const pd = $("projDialog"), pdBody = $("pdBody"), pdTabs = pd.querySelector(".pd-tabs");
  let pdCur = null, pdClean = null;
  function caseStudy(p) {
    const sec = (label, ...content) => h("section", {}, h("h4", {}, label), ...content);
    const wrap = h("div", { class: "cs" },
      sec("The problem", h("p", {}, p.problem)),
      sec("What I built", h("p", {}, p.built)),
      sec("Key features", h("ul", { class: "cs-list" }, p.features.map((f) => h("li", {}, f)))),
      sec("Tech", h("div", { class: "cs-tags" }, p.tech.map((t) => h("span", {}, t)))),
      sec("What I learned", h("p", {}, p.learned)));
    if (p.gallery) wrap.append(sec("Gallery", h("div", { class: "cs-gallery" }, p.gallery.map(([src, cap]) =>
      h("button", { type: "button", "aria-label": "Open: " + cap, onclick: () => openLightbox(src, p.title + ": " + cap) }, h("img", { src, alt: "", loading: "lazy" }))))));
    if (p.link) wrap.append(h("div", { class: "cs-links" }, h("a", { class: "pbtn primary", href: p.link, target: "_blank", rel: "noopener" }, "View on GitHub ↗")));
    return wrap;
  }
  function pdShow(tab) {
    if (pdClean) { pdClean(); pdClean = null; }
    pdTabs.querySelectorAll("button").forEach((b) => { const on = b.dataset.tab === tab; b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on)); });
    pdBody.innerHTML = "";
    pdBody.style.animation = "none"; void pdBody.offsetWidth; pdBody.style.animation = "";
    if (tab === "demo") pdClean = DEMOS[pdCur](pdBody) || null;
    else pdBody.append(caseStudy(PROJECTS[pdCur]));
    pdBody.scrollTop = 0;
  }
  function openProject(id, tab) {
    const p = PROJECTS[id]; if (!p) return;
    pdCur = id;
    $("pdKicker").textContent = p.kicker; $("pdTitle").textContent = p.title;
    const hasDemo = !!DEMOS[id];
    pdTabs.querySelector('[data-tab="demo"]').hidden = !hasDemo;
    pdShow(hasDemo && tab === "demo" ? "demo" : "cs");
    if (!pd.open) { if (pd.showModal) pd.showModal(); else pd.setAttribute("open", ""); }
  }
  pdTabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) pdShow(b.dataset.tab); });
  pd.addEventListener("close", () => { if (pdClean) { pdClean(); pdClean = null; } });
  pd.addEventListener("click", (e) => { if (e.target === pd) pd.close(); });
  document.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => openProject(b.dataset.open, b.dataset.tab)));
  document.querySelectorAll(".proj").forEach((panel) => {
    const row = panel.querySelector(".prow");
    panel.querySelectorAll(".pn").forEach((b) => b.addEventListener("click", () => row.scrollBy({ left: +b.dataset.dir * (row.clientWidth * 0.8), behavior: "smooth" })));
  });

  // Experience details
  const EXP = {
    ctf: { badge: "1st place", when: "2026 · 2-day event", title: "Winner, National CTF 2026 (Capture the Flag)",
      org: "Organised by GovTech Agency · representing Jigme Namgyel Engineering College",
      text: "Competed in a two-day cybersecurity Capture the Flag challenge against teams from GCIT, JNEC and the College of Science and Technology (CST). The challenges tested our technical skills, problem-solving and our ability to think like both attackers and defenders. My team won first place representing JNEC.",
      points: ["Worked as a team to solve a series of cybersecurity challenges", "Approached problems from both the attacker's and the defender's point of view", "Built on my CTF practice with CyLab Security Academy and TryHackMe"],
      tags: ["Cybersecurity", "CTF", "Problem solving", "Teamwork"],
      photos: [["assets/experience/ctf-winners.jpg", "JNEC team with their first-place certificates"], ["assets/experience/ctf-group.jpg", "All CTF teams together"]] },
    prf: { badge: "Volunteer", when: "15–17 Sep 2026", title: "Student Volunteer: 26th APT Policy and Regulatory Forum (PRF-26)",
      org: "Asia-Pacific Telecommunity · hosted at Le Méridien, Paro, Bhutan",
      text: "Selected as a student volunteer for PRF-26, an international forum on policy and regulation in the ICT and telecommunications sector. I worked alongside the Protocol Team of the GovTech Agency, supervised by GovTech officials, to help the three-day event run smoothly.",
      points: ["Supported the GovTech protocol team throughout the forum's sessions and events", "Gained hands-on exposure to organising and facilitating an international event", "Learned about current developments and emerging issues in ICT and telecommunications", "Networked with delegates, officials and fellow volunteers"],
      tags: ["Event coordination", "Protocol", "Teamwork", "ICT policy"],
      photos: [["assets/experience/prf26-volunteers.jpg", "Student volunteers at PRF-26"], ["assets/experience/prf26-networking.jpg", "Networking at the forum"]] },
    tour: { badge: "Study tour", when: "6 organisations · 1 tour", title: "Industry Study Tour: Bhutan's ICT Sector",
      org: "Organised through Jigme Namgyel Engineering College",
      text: "Visited GovTech, the IT Park, aBIT, NUK9, Dragon Coders and Selise to see how government agencies and private software companies work. Walking into real offices and hearing how teams solve problems made what we study in class feel real.",
      points: ["Learned how organisations manage their networks, servers and data security", "Saw why reliable systems and cybersecurity matter, from government services to software companies", "Saw how young Bhutanese developers build real products as professional teams", "Realised communication, teamwork and continuous learning matter as much as technical skills"],
      tags: ["Industry exposure", "Networking & servers", "Cybersecurity", "Teamwork"],
      photos: [["assets/experience/tour-techpark.jpg", "Study tour group at Thimphu TechPark"], ["assets/experience/tour-company-visit.jpg", "Visiting a software company"]] },
    jst: { badge: "International exchange", when: "Japan", title: "Participant: Science & Technology Exchange Program in Japan",
      org: "Administered by the Japan Science and Technology Agency (JST)",
      text: "Selected to take part in an international initiative that invites outstanding youth, students and young professionals to Japan for short-term science and technology exchanges. Bhutanese students take part through bilateral nominations and dedicated application tracks.",
      points: ["Represented Bhutan in an international science and technology exchange", "Gained exposure to Japan's science and technology"],
      tags: ["International exchange", "Science & technology", "Cross-cultural communication"],
      photos: [["assets/experience/jst-campus.jpg", "University campus in Japan"]] },
    digital: { badge: "Training", when: "12-day course · 19–31 May 2025", title: "Digital Training Program",
      org: "Funded by GovTech Agency · delivered by Athang Training Academy",
      text: "A twelve-day digital skills program funded by GovTech Agency and delivered by Athang Training Academy, finishing with a certificate of participation.",
      points: ["Completed the full 12-day course", "Received a certificate of participation"],
      tags: ["Digital skills", "Training"],
      photos: [["assets/training/digital-certificate.jpg", "Receiving my certificate of participation"], ["assets/training/digital-group.jpg", "Participants with their certificates"]] },
    career: { badge: "Training", when: "7-day course · 22–28 Mar 2025", title: "Advanced Career Strategy: Gaining a Competitive Edge",
      org: "Career development course",
      text: "A career development course on building a competitive edge for the job market.",
      points: ["Completed the 7-day course and closing ceremony"],
      tags: ["Career development", "Professional skills"],
      video: "assets/training/career-strategy.mp4",
      photos: [["assets/training/career-strategy-poster.jpg", "Advanced Career Strategy course"]] },
    eldp: { badge: "Training", when: "Leadership & entrepreneurship · 2026", title: "Entrepreneurial Leadership Development Program (ELDP)",
      org: "Organised by Yangbum Cooperative",
      text: "Built an entrepreneurial mindset and learned the skills and tools to plan and grow sustainable businesses.",
      points: ["Learned how to plan and grow a sustainable business", "Worked with mentors during the program"],
      tags: ["Leadership", "Entrepreneurship"],
      photos: [["assets/experience/eldp-session.jpg", "An ELDP session"], ["assets/experience/eldp-mentors.jpg", "With the ELDP mentors"]] }
  };
  const EXP_ORDER = Object.keys(EXP);
  const xd = $("expDialog");
  let xdCur = 0;
  function showPhoto(src, alt) { $("xdImg").src = src; $("xdImg").alt = alt; }
  function openExp(id) {
    const d = EXP[id]; if (!d) return;
    xdCur = EXP_ORDER.indexOf(id);
    $("xdBadge").textContent = d.badge; $("xdWhen").textContent = d.when;
    $("xdTitle").textContent = d.title; $("xdOrg").textContent = d.org; $("xdText").textContent = d.text;
    $("xdPoints").innerHTML = ""; d.points.forEach((p) => { const li = document.createElement("li"); li.textContent = p; $("xdPoints").appendChild(li); });
    $("xdTags").innerHTML = ""; d.tags.forEach((t) => { const li = document.createElement("li"); li.textContent = t; $("xdTags").appendChild(li); });
    showPhoto(d.photos[0][0], d.photos[0][1]);
    const vid = $("xdVid");
    vid.pause();
    if (d.video) { vid.poster = d.photos[0][0]; vid.src = d.video; vid.hidden = false; $("xdImg").hidden = true; }
    else { vid.removeAttribute("src"); vid.load(); vid.hidden = true; $("xdImg").hidden = false; }
    const th = $("xdThumbs"); th.innerHTML = "";
    th.hidden = d.photos.length < 2;
    d.photos.forEach(([src, alt], i) => {
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Show photo: " + alt);
      b.className = i === 0 ? "on" : "";
      b.innerHTML = '<img alt="" src="' + src + '">';
      b.addEventListener("click", () => { showPhoto(src, alt); th.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); });
      th.appendChild(b);
    });
    $("xdCount").textContent = (xdCur + 1) + " / " + EXP_ORDER.length;
    if (!xd.open) { if (xd.showModal) xd.showModal(); else xd.setAttribute("open", ""); }
    xd.querySelector(".xd-body").scrollTop = 0; xd.querySelector(".xd").scrollTop = 0;
  }
  window.__openExp = openExp;
  $("xdPrev").addEventListener("click", () => openExp(EXP_ORDER[(xdCur - 1 + EXP_ORDER.length) % EXP_ORDER.length]));
  $("xdNext").addEventListener("click", () => openExp(EXP_ORDER[(xdCur + 1) % EXP_ORDER.length]));
  xd.addEventListener("click", (e) => { if (e.target === xd) xd.close(); });
  xd.addEventListener("close", () => $("xdVid").pause());
  xd.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") $("xdNext").click();
    if (e.key === "ArrowLeft") $("xdPrev").click();
  });
  $("xdImg").addEventListener("click", () => openLightbox($("xdImg").src, $("xdImg").alt));
  document.querySelectorAll(".exp-row").forEach((row) => row.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    openExp(row.dataset.exp);
  }));

  // Calm mode: no WebGL or reduced motion -> stacked page over a still starfield
  function webglOK() {
    try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); }
    catch (e) { return false; }
  }
  const calm = reduceMotion || !window.THREE || !webglOK();
  if (calm) document.documentElement.classList.add("calm");

  // Chapter buttons scroll to that point of the voyage
  function maxScroll() { return document.documentElement.scrollHeight - window.innerHeight; }
  document.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", (e) => {
    e.preventDefault();
    const i = +b.dataset.go;
    if (calm) { panels[i].scrollIntoView({ behavior: "auto", block: "start" }); return; }
    window.scrollTo({ top: (i / CH) * maxScroll(), behavior: "smooth" });
  }));

  /* ===================================================================
     THE SCENE
     =================================================================== */
  const T = window.THREE;
  if (!T) { $("loader").classList.add("done"); return; }
  let loaded = 0;
  const bump = (n) => { loaded = Math.min(100, loaded + n); $("ldBar").style.width = loaded + "%"; };

  const canvas = $("scene");
  let renderer;
  try { renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" }); }
  catch (e) { document.documentElement.classList.add("calm"); $("loader").classList.add("done"); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = T.SRGBColorSpace;

  const scene = new T.Scene();
  scene.background = new T.Color(0x030614);
  scene.fog = new T.FogExp2(0x030614, 0.0022);
  const camera = new T.PerspectiveCamera(phone() ? 70 : 58, window.innerWidth / window.innerHeight, 0.1, 3000);
  scene.add(camera);
  scene.add(new T.AmbientLight(0x6070a0, 0.55));
  const sun = new T.DirectionalLight(0xffffff, 2.2);
  sun.position.set(-1, 0.6, 0.8);
  scene.add(sun);
  bump(10);

  // ---------- helpers ----------
  function glowTexture(inner, outer) {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, inner || "rgba(255,255,255,1)");
    grad.addColorStop(0.25, outer || "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; return tex;
  }
  const GLOW = glowTexture();
  function sprite(color, size, opacity) {
    const m = new T.SpriteMaterial({ map: GLOW, color, transparent: true, opacity: opacity == null ? 1 : opacity, blending: T.AdditiveBlending, depthWrite: false });
    const s = new T.Sprite(m); s.scale.setScalar(size); return s;
  }
  const rand = (a, b) => a + Math.random() * (b - a);

  // ---------- the voyage path ----------
  const path = new T.CatmullRomCurve3([
    new T.Vector3(0, 0, 60),
    new T.Vector3(0, 2, -160),
    new T.Vector3(-8, 0, -380),
    new T.Vector3(8, -2, -620),
    new T.Vector3(0, 0, -860),
    new T.Vector3(-6, 3, -1080),
    new T.Vector3(6, -2, -1300),
    new T.Vector3(0, 0, -1520)
  ], false, "centripetal");
  const at = (u) => path.getPointAt(Math.min(1, Math.max(0, u)));
  const stop = (i) => at(i / CH);

  // ---------- starfield ----------
  const STAR_N = phone() ? 2600 : 5200;
  function starLayer(n, size, spread, opacity) {
    const g = new T.BufferGeometry(), pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    const palette = [new T.Color(0xffffff), new T.Color(0xa5b4fc), new T.Color(0x67e8f9), new T.Color(0xc4b5fd), new T.Color(0xfde68a)];
    for (let i = 0; i < n; i++) {
      pos[i * 3] = rand(-spread, spread);
      pos[i * 3 + 1] = rand(-spread * 0.7, spread * 0.7);
      pos[i * 3 + 2] = rand(120, -1700);
      const c = palette[Math.random() < 0.7 ? 0 : 1 + ((Math.random() * 4) | 0)];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute("position", new T.BufferAttribute(pos, 3));
    g.setAttribute("color", new T.BufferAttribute(col, 3));
    const m = new T.PointsMaterial({ size, map: GLOW, vertexColors: true, transparent: true, opacity, depthWrite: false, blending: T.AdditiveBlending, sizeAttenuation: true });
    const p = new T.Points(g, m); scene.add(p); return p;
  }
  const starsFar = starLayer(STAR_N, 1.4, 420, 0.9);
  const starsBig = starLayer(Math.round(STAR_N / 12), 3.2, 300, 0.85);
  bump(15);

  // ---------- 0 · the Aquarius constellation ----------
  const AQR = {
    alpha: [22.10, -0.32, 2.9], beta: [21.53, -5.57, 2.9], gamma: [22.36, -1.39, 3.8], zeta: [22.48, -0.02, 3.6],
    eta: [22.59, -0.12, 4.0], pi: [22.42, 1.38, 4.7], eps: [20.79, -9.50, 3.8], mu: [20.88, -8.98, 4.7],
    iota: [22.11, -13.87, 4.3], theta: [22.28, -7.78, 4.2], lambda: [22.88, -7.58, 3.7], tau: [22.83, -13.59, 4.0],
    delta: [22.91, -15.82, 3.3], phi: [23.24, -6.05, 4.2], psi: [23.27, -9.09, 4.4], s98: [23.38, -20.10, 4.0], s88: [23.16, -21.17, 3.7]
  };
  const AQR_LINES = [["eps", "mu"], ["mu", "beta"], ["beta", "alpha"], ["beta", "iota"], ["alpha", "gamma"], ["gamma", "zeta"], ["zeta", "eta"], ["zeta", "pi"],
    ["alpha", "theta"], ["theta", "lambda"], ["lambda", "phi"], ["phi", "psi"], ["psi", "s98"], ["s98", "s88"], ["lambda", "tau"], ["tau", "delta"]];
  const constellation = new T.Group();
  const cPos = {};
  Object.entries(AQR).forEach(([id, [ra, dec, mag]]) => {
    const v = new T.Vector3(-(ra - 22.08) * 15 * 1.55, (dec + 9.6) * 1.55, 0);
    cPos[id] = v;
    const s = sprite(0xdff6ff, (6.2 - mag) * 1.25, 1);
    s.position.copy(v); s.userData.tw = Math.random() * 6; constellation.add(s);
  });
  const lg = new T.BufferGeometry().setFromPoints(AQR_LINES.flatMap(([a, b]) => [cPos[a], cPos[b]]));
  const cLines = new T.LineSegments(lg, new T.LineBasicMaterial({ color: 0x7ef0b5, transparent: true, opacity: 0.35, blending: T.AdditiveBlending }));
  constellation.add(cLines);
  constellation.position.copy(stop(0)).add(new T.Vector3(0, 9, -135));
  scene.add(constellation);

  // ---------- 1 · "Introducing": a bright home star with a beam and a violet moon ----------
  const home = new T.Group();
  const homeCore = sprite(0xffffff, 6, 1); home.add(homeCore);
  home.add(sprite(0x9fb4ff, 30, 0.35));
  const beamGeo = new T.PlaneGeometry(0.35, 120);
  const beamMat = new T.MeshBasicMaterial({ color: 0xdfe8ff, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false });
  const beam = new T.Mesh(beamGeo, beamMat); beam.position.y = 60; home.add(beam);
  home.position.copy(stop(1)).add(new T.Vector3(16, 4, -95));
  scene.add(home);
  const moon = new T.Mesh(new T.SphereGeometry(7, 48, 48), new T.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.9, emissive: 0x2a0f55, emissiveIntensity: 0.6 }));
  moon.position.copy(stop(1)).add(new T.Vector3(-30, -10, -120));
  scene.add(moon);
  const moonGlow = sprite(0xa78bfa, 34, 0.35); moonGlow.position.copy(moon.position); scene.add(moonGlow);

  // shooting star that crosses the view now and then (rides with the camera)
  const comet = new T.Group();
  const cometHead = sprite(0xffffff, 1.6, 1); comet.add(cometHead);
  const trailGeo = new T.BufferGeometry().setFromPoints([new T.Vector3(0, 0, 0), new T.Vector3(6, 3, 0)]);
  const trail = new T.Line(trailGeo, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }));
  comet.add(trail); comet.visible = false; camera.add(comet);
  bump(10);

  // ---------- 2 · Planet Web ----------
  function planetTexture(stops, dots) {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, 512);
    stops.forEach(([o, col]) => grad.addColorStop(o, col));
    g.fillStyle = grad; g.fillRect(0, 0, 1024, 512);
    // soft swirls
    for (let i = 0; i < 70; i++) {
      g.globalAlpha = rand(0.04, 0.14);
      g.fillStyle = Math.random() < 0.5 ? "#ffffff" : "#1e1b4b";
      g.beginPath(); g.ellipse(rand(0, 1024), rand(0, 512), rand(40, 220), rand(6, 26), 0, 0, Math.PI * 2); g.fill();
    }
    // city lights / code sparks
    g.globalAlpha = 1;
    for (let i = 0; i < (dots || 0); i++) {
      g.fillStyle = ["#fef3c7", "#a5f3fc", "#f0abfc", "#ffffff"][(Math.random() * 4) | 0];
      const r = rand(1, 3.2); g.beginPath(); g.arc(rand(0, 1024), rand(60, 452), r, 0, Math.PI * 2); g.fill();
    }
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4; return tex;
  }
  function atmosphere(radius, color, power) {
    return new T.Mesh(new T.SphereGeometry(radius, 48, 48), new T.ShaderMaterial({
      uniforms: { c: { value: new T.Color(color) }, p: { value: power || 2.5 } },
      vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }",
      fragmentShader: "uniform vec3 c; uniform float p; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), p); gl_FragColor = vec4(c, f); }",
      side: T.BackSide, blending: T.AdditiveBlending, transparent: true, depthWrite: false
    }));
  }
  const webPlanet = new T.Group();
  const webSphere = new T.Mesh(new T.SphereGeometry(26, 96, 96), new T.MeshStandardMaterial({
    map: planetTexture([[0, "#0e7490"], [0.3, "#22d3ee"], [0.55, "#6366f1"], [0.8, "#7c3aed"], [1, "#312e81"]], 260),
    roughness: 0.55, metalness: 0.1, emissive: 0x1e1b4b, emissiveIntensity: 0.35
  }));
  webPlanet.add(webSphere);
  webPlanet.add(atmosphere(30, 0x67e8f9, 2.2));
  // ring of "code"
  const ringCanvas = document.createElement("canvas"); ringCanvas.width = 512; ringCanvas.height = 32;
  (function () {
    const g = ringCanvas.getContext("2d");
    for (let x = 0; x < 512; x += 2) { g.fillStyle = "rgba(196,181,253," + rand(0.05, 0.55) + ")"; g.fillRect(x, 0, 2, 32); }
  })();
  const ringTex = new T.CanvasTexture(ringCanvas);
  const ringGeo = new T.RingGeometry(34, 50, 128, 1);
  // map the ring texture radially
  const rp = ringGeo.attributes.position, ruv = ringGeo.attributes.uv, v3 = new T.Vector3();
  for (let i = 0; i < rp.count; i++) { v3.fromBufferAttribute(rp, i); ruv.setXY(i, (v3.length() - 34) / 16, 0.5); }
  const ring = new T.Mesh(ringGeo, new T.MeshBasicMaterial({ map: ringTex, side: T.DoubleSide, transparent: true, opacity: 0.85, depthWrite: false, blending: T.AdditiveBlending }));
  ring.rotation.x = Math.PI * 0.42; ring.rotation.y = 0.25;
  webPlanet.add(ring);
  webPlanet.position.copy(stop(2)).add(phone() ? new T.Vector3(4, 30, -120) : new T.Vector3(34, -6, -92));
  scene.add(webPlanet);
  bump(20);

  // ---------- 3 · Planet Network ----------
  const netPlanet = new T.Group();
  netPlanet.add(new T.Mesh(new T.SphereGeometry(22, 64, 64), new T.MeshStandardMaterial({ color: 0x03140b, roughness: 0.8, emissive: 0x022c16, emissiveIntensity: 0.6 })));
  const wire = new T.LineSegments(new T.EdgesGeometry(new T.IcosahedronGeometry(23, 3)), new T.LineBasicMaterial({ color: 0x34ff9a, transparent: true, opacity: 0.5, blending: T.AdditiveBlending }));
  netPlanet.add(wire);
  netPlanet.add(atmosphere(26, 0x34ff9a, 2.6));
  // node points on the surface
  const nodeGeo = new T.IcosahedronGeometry(23.2, 2);
  const nodes = new T.Points(nodeGeo, new T.PointsMaterial({ size: 1.4, map: GLOW, color: 0x9dffcf, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
  netPlanet.add(nodes);
  // satellites on tilted orbits, each linked to the planet
  const sats = [];
  for (let i = 0; i < 7; i++) {
    const pivot = new T.Group();
    pivot.rotation.set(rand(-1.2, 1.2), rand(0, Math.PI * 2), rand(-0.6, 0.6));
    const s = sprite(i % 3 === 0 ? 0xfbbf24 : 0x7ef0b5, 3.2, 1);
    s.position.x = rand(34, 44);
    pivot.add(s); netPlanet.add(pivot);
    const linkGeo = new T.BufferGeometry().setFromPoints([new T.Vector3(), new T.Vector3()]);
    const link = new T.Line(linkGeo, new T.LineBasicMaterial({ color: 0x7ef0b5, transparent: true, opacity: 0.35, blending: T.AdditiveBlending }));
    netPlanet.add(link);
    const pkt = sprite(0xffffff, 1.6, 1); netPlanet.add(pkt);
    sats.push({ pivot, s, link, pkt, speed: rand(0.12, 0.3) * (Math.random() < 0.5 ? -1 : 1), phase: Math.random() });
  }
  netPlanet.position.copy(stop(3)).add(phone() ? new T.Vector3(-4, 28, -110) : new T.Vector3(-32, 2, -88));
  scene.add(netPlanet);
  bump(15);

  // ---------- 4 · Achievement belt: an asteroid ring the camera flies through ----------
  const beltCenter = stop(4).clone().add(new T.Vector3(0, 0, -30));
  const ROCKS = phone() ? 260 : 520;
  const rockGeo = new T.DodecahedronGeometry(1, 0);
  const rocks = new T.InstancedMesh(rockGeo, new T.MeshStandardMaterial({ color: 0x8a90b8, roughness: 1, flatShading: true }), ROCKS);
  const dummy = new T.Object3D(), rockData = [];
  for (let i = 0; i < ROCKS; i++) {
    const a = Math.random() * Math.PI * 2, r = rand(34, 62), z = rand(-12, 12);
    rockData.push({ a, r, z, s: rand(0.25, 1.6), rx: Math.random() * 6, ry: Math.random() * 6, sp: rand(0.02, 0.06) });
  }
  rocks.position.copy(beltCenter);
  scene.add(rocks);
  // photo frames floating in the ring, and the certificate hall
  const loader = new T.TextureLoader();
  const clickable = [];
  function photoFrame(src, cap, width, color) {
    const g = new T.Group();
    const frame = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }));
    const pic = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ color: 0x223355 }));
    pic.position.z = 0.05;
    const halo = sprite(color, width * 2.2, 0.35); halo.position.z = -0.4;
    g.add(halo, frame, pic);
    g.scale.set(width, width * 0.66, 1);
    halo.scale.set(2.2, 3.3, 1);
    loader.load(src, (tex) => {
      tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4;
      pic.material = new T.MeshBasicMaterial({ map: tex });
      const r = tex.image.height / tex.image.width;
      g.scale.set(width, width * r, 1);
      frame.scale.set(1 + 0.06, 1 + 0.06 * (1 / r), 1);
    });
    pic.userData = { src, cap };
    clickable.push(pic);
    return g;
  }
  const EXP_PHOTOS = [
    ["assets/experience/ctf-winners.jpg", "Winners of the National CTF 2026, team JNEC", 0xfbbf24, "ctf"],
    ["assets/experience/prf26-volunteers.jpg", "Student volunteers at PRF-26, Paro", 0x67e8f9, "prf"],
    ["assets/experience/tour-techpark.jpg", "Industry study tour at Thimphu TechPark", 0xa78bfa, "tour"],
    ["assets/experience/jst-campus.jpg", "Science and technology exchange in Japan", 0xf472b6, "jst"],
    ["assets/training/digital-certificate.jpg", "Digital Training Program certificate", 0x7ef0b5, "digital"],
    ["assets/experience/eldp-session.jpg", "ELDP session, Yangbum Cooperative", 0xfde68a, "eldp"]
  ];
  const expFrames = EXP_PHOTOS.map(([src, cap, col, id], i) => {
    const f = photoFrame(src, cap, phone() ? 14 : 17, col);
    f.children[2].userData.exp = id;
    const a = (i / EXP_PHOTOS.length) * Math.PI * 2 + 0.5;
    f.userData.base = new T.Vector3(Math.cos(a) * 30 + (phone() ? 0 : 26), Math.sin(a) * 20 + (phone() ? 14 : 0), -20 - (i % 2) * 14).add(beltCenter);
    f.userData.k = i;
    f.position.copy(f.userData.base);
    scene.add(f); return f;
  });

  // ---------- 5 · Hall of certificates ----------
  const CERTS = [
    ["assets/certs/ccna-itn.jpg", "CCNA: Introduction to Networks"],
    ["assets/certs/ccna-srwe.jpg", "CCNA: Switching, Routing, and Wireless Essentials"],
    ["assets/certs/linux-admin.jpg", "Becoming a Linux Server Admin"],
    ["assets/certs/laravel-php.jpg", "Full-Stack Web Development with Laravel & PHP"],
    ["assets/certs/python-tkinter.jpg", "Python Tkinter: Design, Build & Integrate GUIs"]
  ];
  const certHall = new T.Group();
  const certFrames = CERTS.map(([src, cap], i) => {
    const f = photoFrame(src, cap, phone() ? 15 : 18, [0x7ef0b5, 0x7ef0b5, 0x67e8f9, 0xa78bfa, 0xf472b6][i]);
    // an arc that wraps around the left side of the view
    const a = -0.9 + i * 0.42;
    f.userData.base = new T.Vector3(Math.sin(a) * 46, (i % 2 ? 9 : -7), -Math.cos(a) * 46);
    f.userData.k = i;
    f.position.copy(f.userData.base);
    f.lookAt(0, 0, 0);
    certHall.add(f); return f;
  });
  const certCore = sprite(0x7ef0b5, 30, 0.25); certHall.add(certCore);
  certHall.position.copy(stop(5)).add(phone() ? new T.Vector3(0, 20, -60) : new T.Vector3(-22, 2, -40));
  scene.add(certHall);

  // ---------- 5 · Skills nebula ----------
  const NEB = phone() ? 2200 : 4200;
  const nebGeo = new T.BufferGeometry(), nPos = new Float32Array(NEB * 3), nCol = new Float32Array(NEB * 3);
  const nebCols = [new T.Color(0xa78bfa), new T.Color(0xf472b6), new T.Color(0x67e8f9), new T.Color(0x6366f1)];
  for (let i = 0; i < NEB; i++) {
    // a lumpy spiral cloud
    const arm = i % 3, t = Math.random(), ang = t * 6.5 + arm * 2.1, rad = 4 + t * 34;
    nPos[i * 3] = Math.cos(ang) * rad + rand(-5, 5);
    nPos[i * 3 + 1] = rand(-5, 5) * (1 - t * 0.5);
    nPos[i * 3 + 2] = Math.sin(ang) * rad + rand(-5, 5);
    const c = nebCols[(arm + (Math.random() < 0.3 ? 1 : 0)) % 4];
    nCol[i * 3] = c.r; nCol[i * 3 + 1] = c.g; nCol[i * 3 + 2] = c.b;
  }
  nebGeo.setAttribute("position", new T.BufferAttribute(nPos, 3));
  nebGeo.setAttribute("color", new T.BufferAttribute(nCol, 3));
  const nebula = new T.Points(nebGeo, new T.PointsMaterial({ size: 2.4, map: GLOW, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false, blending: T.AdditiveBlending }));
  const nebulaWrap = new T.Group(); nebulaWrap.add(nebula);
  nebulaWrap.add(sprite(0xc4b5fd, 46, 0.35));
  nebulaWrap.rotation.x = 0.5;
  nebulaWrap.position.copy(stop(6)).add(phone() ? new T.Vector3(0, 26, -110) : new T.Vector3(30, 0, -95));
  scene.add(nebulaWrap);
  bump(15);

  // ---------- 3D models from my first site, floating in space ----------
  // laptop (live terminal) at "Introducing", router R1 and the Arduino kit at Planet Network
  scene.add(new T.HemisphereLight(0xdfe9f0, 0x1a1f26, 0.9));
  const rim = new T.DirectionalLight(0x5cc8bd, 1.6); rim.position.set(-1, 0.4, -1); scene.add(rim);
  const models = [];
  function placeModel(build, at, scale, yaw, project) {
    if (!window.KLModels) return null;
    const holder = new T.Group(), inner = new T.Group();
    holder.add(inner);
    let api = null;
    try { api = build(inner); } catch (e) { return null; }
    inner.rotation.x = 0.42;
    holder.scale.setScalar(scale);
    holder.position.copy(at);
    const halo = sprite(0x67e8f9, 9, 0.18); halo.position.set(0, 0, -2); holder.add(halo);
    const lamp = new T.PointLight(0xffffff, 4, 16, 1.1); lamp.position.set(2, 5, 5); holder.add(lamp);
    scene.add(holder);
    const m = { holder, inner, api, base: at.clone(), yaw, project, k: models.length };
    inner.traverse((o) => { if (o.isMesh) o.userData.model = m; });
    models.push(m);
    return m;
  }
  const K = window.KLModels || {};
  // a point in front of the camera as it will be at stop i (x right, y up, d ahead)
  function camSpace(i, x, y, d) {
    const o = new T.Object3D();
    o.position.copy(stop(i)); o.lookAt(at(i / CH + 0.035));
    o.updateMatrixWorld(true);
    // Object3D.lookAt points +z at the target, so "ahead" is +z and "right" is -x
    return new T.Vector3(-x, y, d).applyMatrix4(o.matrixWorld);
  }
  placeModel(K.buildLaptop, phone() ? camSpace(1, 0, 11, 46) : camSpace(1, 12, -3, 40), phone() ? 2.2 : 4.4, -0.45, null);
  placeModel(K.buildRouter, phone() ? camSpace(3, -5, 7, 40) : camSpace(3, -16, -9, 27), phone() ? 1.7 : 2.5, 0.35, "proj-bank");
  placeModel(K.buildArduino, phone() ? camSpace(3, 6, 15, 48) : camSpace(3, -17, 7, 31), phone() ? 1.6 : 2.4, -0.4, "proj-iot");

  // ---------- 6 · Signal beacon ----------
  const signal = new T.Group();
  signal.add(sprite(0xffffff, 9, 1));
  signal.add(sprite(0x7ef0b5, 40, 0.45));
  const waves = [];
  for (let i = 0; i < 4; i++) {
    const w = new T.Mesh(new T.RingGeometry(0.96, 1, 96), new T.MeshBasicMaterial({ color: 0x7ef0b5, transparent: true, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false }));
    w.userData.o = i / 4; signal.add(w); waves.push(w);
  }
  signal.position.copy(stop(7)).add(new T.Vector3(0, -22, -90));
  scene.add(signal);
  bump(15);

  /* ===================================================================
     SCROLL + LOOP
     =================================================================== */
  let target = 0, prog = 0, mx = 0, my = 0, cmx = 0, cmy = 0;
  const lookTmp = new T.Vector3();
  function readScroll() { const m = maxScroll(); target = m > 0 ? window.scrollY / m : 0; }
  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("pointermove", (e) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; }, { passive: true });
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight; camera.fov = phone() ? 70 : 58; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); readScroll();
  });

  // click a floating photo or certificate in space to open it
  const ray = new T.Raycaster(), ndc = new T.Vector2();
  function pick(e) {
    ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(clickable.concat(models.map((m) => m.holder)), true)[0];
    if (!hit || hit.distance > 220) return null;
    if (hit.object.userData.model) return hit.object.userData.model.project ? hit.object : null;
    return clickable.includes(hit.object) ? hit.object : null;
  }
  window.addEventListener("click", (e) => {
    if (e.target.closest(".card, header, button, a, dialog")) return;
    const o = pick(e); if (!o) return;
    if (o.userData.model) { openProject(o.userData.model.project, "demo"); return; }
    if (o.userData.exp) window.__openExp(o.userData.exp); else openLightbox(o.userData.src, o.userData.cap);
  });
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    canvas.classList.toggle("pointing", !e.target.closest(".card, header") && !!pick(e));
  }, { passive: true });

  const navBtns = [...document.querySelectorAll("nav.chapters button")];
  let lastCh = -1;
  function updatePanels(p) {
    const x = p * CH;
    panels.forEach((el, i) => {
      // fade in around its chapter point; the first stays until you leave, the last stays at the end
      let d = Math.abs(x - i);
      if (i === 0 && x < 0) d = 0;
      if (i === CH && x > CH) d = 0;
      const o = Math.max(0, Math.min(1, (0.42 - d) / 0.2));
      el.style.opacity = o.toFixed(3);
      const shift = (x - i) * -40;
      if (!el.classList.contains("center") && !phone()) el.style.transform = "translateY(calc(-50% + " + shift.toFixed(1) + "px))";
      else if (el.classList.contains("center")) el.style.transform = "translate(" + (phone() ? "0" : "-50%") + ", calc(-50% + " + shift.toFixed(1) + "px))";
      el.classList.toggle("live", o > 0.05);
      el.setAttribute("aria-hidden", o > 0.05 ? "false" : "true");
    });
    const ch = Math.round(x);
    if (ch !== lastCh) {
      lastCh = ch;
      $("meterLabel").textContent = LABELS[ch] || "";
      navBtns.forEach((b) => b.classList.toggle("on", +b.dataset.go === ch));
    }
    $("meterBar").style.transform = "scaleX(" + p.toFixed(4) + ")";
    $("dist").textContent = (p * 4.2).toFixed(2);
  }

  const clock = new T.Clock();
  let cometT = -3;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    prog += (target - prog) * Math.min(1, dt * 3.2);
    cmx += (mx - cmx) * 0.05; cmy += (my - cmy) * 0.05;

    // camera rides the path, looking a little ahead, nudged by the mouse
    const p = at(prog);
    camera.position.set(p.x + cmx * 6, p.y - cmy * 4, p.z);
    lookTmp.copy(at(prog + 0.035));
    lookTmp.x += cmx * 14; lookTmp.y -= cmy * 9;
    camera.lookAt(lookTmp);

    // constellation twinkle
    constellation.children.forEach((s) => { if (s.isSprite) s.material.opacity = 0.65 + 0.35 * Math.sin(t * 2 + s.userData.tw); });
    cLines.material.opacity = 0.25 + 0.15 * Math.sin(t * 1.3);
    starsBig.material.opacity = 0.7 + 0.2 * Math.sin(t * 1.7);

    // home star + beam
    homeCore.scale.setScalar(6 + Math.sin(t * 3) * 0.6);
    beamMat.opacity = 0.4 + 0.15 * Math.sin(t * 2);

    // comet, every few seconds
    cometT += dt;
    if (cometT > 5.5) cometT = -rand(2, 5);
    if (cometT >= 0 && cometT < 1.4) {
      comet.visible = true;
      const k = cometT / 1.4;
      comet.position.set(18 - k * 34, 10 - k * 15, -30);
      trail.material.opacity = Math.sin(k * Math.PI) * 0.8;
      cometHead.material.opacity = Math.sin(k * Math.PI);
    } else comet.visible = false;

    // planets
    webSphere.rotation.y += dt * 0.08;
    ring.rotation.z += dt * 0.05;
    wire.rotation.y += dt * 0.06; nodes.rotation.y = wire.rotation.y;
    sats.forEach((o) => {
      o.pivot.rotation.y += dt * o.speed;
      const sp = o.s.getWorldPosition(new T.Vector3());
      const local = netPlanet.worldToLocal(sp.clone());
      const surf = local.clone().setLength(23);
      const arr = o.link.geometry.attributes.position;
      arr.setXYZ(0, local.x, local.y, local.z); arr.setXYZ(1, surf.x, surf.y, surf.z); arr.needsUpdate = true;
      const k = (t * 0.6 + o.phase) % 1;
      o.pkt.position.lerpVectors(local, surf, k);
    });

    // asteroid belt
    for (let i = 0; i < ROCKS; i++) {
      const r = rockData[i];
      const a = r.a + t * r.sp;
      dummy.position.set(Math.cos(a) * r.r, Math.sin(a) * r.r, r.z);
      dummy.rotation.set(r.rx + t * 0.3, r.ry + t * 0.2, 0);
      dummy.scale.setScalar(r.s);
      dummy.updateMatrix();
      rocks.setMatrixAt(i, dummy.matrix);
    }
    rocks.instanceMatrix.needsUpdate = true;
    expFrames.forEach((f) => {
      const k = f.userData.k;
      f.position.copy(f.userData.base);
      f.position.y += Math.sin(t * 0.8 + k) * 1.2;
      f.lookAt(camera.position);
    });
    certFrames.forEach((f) => {
      const k = f.userData.k;
      f.position.y = f.userData.base.y + Math.sin(t * 0.9 + k * 1.3) * 1.1;
      f.lookAt(camera.position);
    });
    certHall.rotation.y = Math.sin(t * 0.15) * 0.08;

    // floating 3D models
    models.forEach((m) => {
      m.holder.position.set(m.base.x, m.base.y + Math.sin(t * 0.7 + m.k * 2) * 0.8, m.base.z);
      m.inner.rotation.y = m.yaw + Math.sin(t * 0.25 + m.k) * 0.35 + cmx * 0.6 + (m.hover ? Math.sin(t * 2) * 0.05 : 0);
      if (m.api && m.api.tick) m.api.tick(t, dt);
    });

    // nebula
    nebula.rotation.y += dt * 0.05;

    // signal waves
    waves.forEach((w) => {
      const k = (t * 0.35 + w.userData.o) % 1;
      w.scale.setScalar(4 + k * 40);
      w.material.opacity = (1 - k) * 0.4;
      w.lookAt(camera.position);
    });

    updatePanels(prog);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  // finish loading
  readScroll(); prog = target;
  bump(100);
  setTimeout(() => $("loader").classList.add("done"), reduceMotion ? 0 : 700);

  if (calm) {
    // one still frame as a backdrop
    camera.position.set(0, 0, 60); camera.lookAt(0, 0, -100);
    renderer.render(scene, camera);
    window.addEventListener("resize", () => renderer.render(scene, camera));
  } else {
    requestAnimationFrame(frame);
  }
})();
