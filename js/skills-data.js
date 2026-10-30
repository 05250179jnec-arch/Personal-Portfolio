// ==========================================================
// Skill data used by the skills scroll story (js/skillscroll.js)
// Each area has an id, name, colour, description and a list of skills.
// ==========================================================
(function () {
  const icons = {
    network: '<path d="M12 3v6M5 15v-3h14v3"/><rect x="9" y="3" width="6" height="4" rx="1"/><rect x="2" y="15" width="6" height="5" rx="1"/><rect x="16" y="15" width="6" height="5" rx="1"/>',
    systems: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/>',
    web: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
    git: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 7v10M18 11a6 6 0 0 1-6 6H8"/>',
    iot: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    security: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M10 11V9a2 2 0 0 1 4 0v2"/>',
    tools: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>',
    lang: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    soft: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 20a4.5 4.5 0 0 1 8 0"/>'
  };

  const categories = [
    { id: "network", name: "Networking", color: "#38bdf8", desc: "Designing, configuring and troubleshooting networks, from my CCNA courses to my eBGP project.",
      skills: [["Cisco Packet Tracer", ["bank", "itn", "srwe"]], ["BGP / eBGP", ["bank", "aclLab"]], ["Access Control Lists", ["bank", "aclLab"]], ["DHCP", ["dhcp", "itn"]], ["Subnetting", ["subnetLab", "itn"]], ["Routing & Switching", ["srwe", "bank"]], ["Wireless LANs", ["srwe"]]] },
    { id: "systems", name: "Systems", color: "#22d3ee", desc: "Running and administering Linux servers and virtual machines.",
      skills: [["Ubuntu Server", ["dhcp", "linux"]], ["Linux Server Admin", ["linux"]], ["Linux Command Line", ["linux", "dhcp"]], ["VirtualBox", ["dhcp"]]] },
    { id: "web", name: "Web Development", color: "#a78bfa", desc: "Building websites and full-stack web apps, front end to database.",
      skills: [["HTML5 & CSS3", ["events", "portfolio"]], ["JavaScript", ["portfolio", "events", "task"]], ["Node.js & Express", ["task", "autoconnection"]], ["React", ["autoconnection"]], ["PHP & Laravel", ["laravel"]], ["Python (Tkinter)", ["tkinter"]], ["MySQL", ["task", "autoconnection"]], ["REST APIs", ["task", "autoconnection"]]] },
    { id: "git", name: "Version Control", color: "#f472b6", desc: "Tracking work with Git and publishing it on GitHub.",
      skills: [["Git", ["task", "portfolio"]], ["GitHub", ["task", "portfolio"]], ["GitHub Pages", ["portfolio"]]] },
    { id: "iot", name: "IoT & Electronics", color: "#facc15", desc: "Connecting sensors and actuators to microcontrollers to automate real spaces.",
      skills: [["Arduino Uno", ["iot"]], ["Arduino IDE (C++)", ["iot"]], ["PIR Sensor", ["iot"]], ["Ultrasonic Sensor", ["iot"]], ["Servo Motors", ["iot"]], ["Relay Modules", ["iot"]]] },
    { id: "security", name: "Cybersecurity", color: "#4ade80", desc: "Thinking like attackers and defenders, proven in competition.",
      skills: [["Capture the Flag", ["ctf"]], ["Attack & Defence Mindset", ["ctf", "aclLab"], "Attack & Defence"], ["Digital Forensics (basics)", ["ctf"], "Forensics"], ["Reverse Engineering (basics)", ["ctf"], "Reverse Eng."], ["Secure Auth (JWT, bcrypt)", ["autoconnection"], "Secure Auth"]] },
    { id: "tools", name: "Productivity", color: "#fb923c", desc: "The everyday tools I use for reports, data and presentations.",
      skills: [["Microsoft Word", []], ["Excel", []], ["PowerPoint", ["druk", "autoconnection"]], ["Google Workspace", []], ["Figma", ["autoconnection"]], ["Postman", ["autoconnection"]]] },
    { id: "lang", name: "Languages", color: "#2dd4bf", desc: "Languages I speak.",
      skills: [["English", []], ["Dzongkha", []], ["Nepali", []], ["Hindi", []]] },
    { id: "soft", name: "Soft Skills", color: "#f87171", desc: "How I work with people, from team competitions to international events.",
      skills: [["Leadership", ["eldp"]], ["Entrepreneurship", ["eldp", "druk"]], ["Teamwork", ["ctf", "autoconnection", "druk"]], ["Presentation", ["druk", "dhcp"]], ["Time Management", []], ["Analytical Thinking", ["ctf"]], ["Working Under Pressure", ["ctf", "prf"], "Under Pressure"]] }
  ];

  window.portfolioSkills = { categories: categories, icons: icons };
})();
