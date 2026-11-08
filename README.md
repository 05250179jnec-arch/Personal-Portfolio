# Personal Portfolio: A Voyage Through My Work

My personal portfolio as a web developer and network engineer. I'm an Aquarius, so I turned it into a voyage through space: you scroll, the camera flies past planets, and each stop is a part of my work. Built with HTML, CSS, JavaScript and three.js. By Kuenzang Lhamo.

Live: https://05250179jnec-arch.github.io/Personal-Portfolio/

```
Personal-Portfolio/
├── index.html          (page structure and content)
├── style.css           (all the styles: layout, cards, pop-ups, phones)
├── script.js           (the 3D voyage, pop-ups and live demos)
├── README.md
├── js/
│   └── models3d.js     (3D laptop, router and Arduino)
└── assets/
    ├── profile.jpg
    ├── vendor/         (three.js r160, MIT License)
    ├── certs/          (certificate images and PDFs)
    ├── druk/           (DRUK SPORTS pitch slides)
    ├── experience/
    ├── iot/            (circuit and flow diagrams)
    └── training/
```

## Run it

```bash
git clone https://github.com/05250179jnec-arch/Personal-Portfolio.git
cd Personal-Portfolio
```

I open `index.html` with the Live Server extension in VS Code. The 3D photos and certificates need a server, so open it through Live Server (or the live link) rather than double-clicking the file.

## The voyage

| Stop | What you see in space | What the card shows |
|------|----------------------|---------------------|
| Launch | The real Aquarius constellation behind my name | Intro |
| Introducing | A bright star, a violet moon and my 3D laptop typing router commands | My profile photo, bio and education |
| Planet Web | A ringed cyan and violet planet | My web projects: AutoConnection, Task Manager, JNEC Events Hub, DRUK SPORTS |
| Planet Network | A green wireframe planet with satellites, my 3D router and Arduino kit | Bank Network (eBGP & ACLs), DHCP Server, Smart Room IoT |
| Station ring | An asteroid ring with my photos floating in it | Experience and training |
| Hall of certificates | My certificates floating in an arc | Certificates with PDF and verify links |
| Skills nebula | A spinning spiral nebula | My skills by area |
| Signal | A beacon sending out rings | Email and GitHub |

Things to try:

- **Project cards** open a pop-up with two tabs: **Case study** (problem, what I built, features, tech, what I learned) and **Try it live** (working demos: AutoConnection roles, Task API requests, DHCP handshake, ACL checker, smart room sensors).
- **Experience rows** open a pop-up with photos, details, and Previous / Next to move through all of them.
- **Click things in space**: the floating photos and certificates open full size, the router opens the ACL demo and the Arduino opens the smart room demo.
- The header buttons jump to each stop.

If a device has "reduce motion" turned on, or can't run WebGL, the page shows the same content as a calm stacked page instead of the flight.

## How it's built

I kept HTML, CSS and JavaScript in separate files: `index.html` holds the content, `style.css` the design, and `script.js` the behaviour.


- **Scene**: one three.js scene. The camera follows a curved path (`CatmullRomCurve3`) and scroll position decides how far along it is. The cards are normal HTML on top, fading in at their stop.
- **Planets and effects**: spheres with textures I draw on a `<canvas>`, a glow shader for the atmospheres, points for stars and the nebula, an instanced mesh for the asteroids.
- **3D models**: `js/models3d.js` builds the laptop, router and Arduino from simple shapes (boxes, cylinders, tubes). No 3D files are loaded.
- **Pop-ups**: HTML `<dialog>` elements, so Esc and focus work properly.

## Tech

HTML, CSS, JavaScript, three.js r160, Google Fonts (Unbounded, Manrope, JetBrains Mono).

## Deploy

Deployed with GitHub Pages from the `main` branch.
