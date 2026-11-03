# Personal Portfolio — HTML + CSS + JavaScript

My personal portfolio website, which I built with plain HTML, CSS and JavaScript and deployed on GitHub Pages. By Kuenzang Lhamo.

Live: https://05250179jnec-arch.github.io/Personal-Portfolio/

```
Personal-Portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
├── js/
│   ├── network-bg.js
│   ├── terminal.js
│   ├── lab.js
│   ├── certificates.js
│   ├── druk.js
│   ├── skills-data.js
│   ├── skillscroll.js
│   ├── edu-journey.js
│   ├── training.js
│   ├── projects.js
│   ├── exp-zoom.js
│   ├── motion.js
│   └── pro.js
└── assets/
    ├── profile.jpg
    ├── certs/
    ├── druk/
    ├── experience/
    ├── iot/
    └── training/
```

## Run it


```bash
git clone https://github.com/05250179jnec-arch/Personal-Portfolio.git
cd Personal-Portfolio
```

I open `index.html` with the Live Server extension in VS Code. It also works if you open the file directly in a browser.

## Sections

| Section | What I put there |
|---------|------------------|
| Home | My name, photo, headline and a terminal you can type in |
| About | My background, interests and goals |
| Skills | A scroll story with an illustration for each of my skill areas |
| Projects | 7 of my projects with filters, case studies and live demos you can try |
| Lab | A subnet calculator and an ACL packet simulator I made |
| Education | My education journey, my training gallery (video + photos) and my achievements |
| Experience | Full-screen photos of my experiences; the details open on "See the details" |
| Certificates | My Cisco NetAcad and Coursera certificates with filters and a viewer |
| Contact | My contact details and a form that checks the input |

## JavaScript files

I split the JavaScript into one file per feature so it is easier to manage.

| File | What it does |
|------|--------------|
| `script.js` | Navigation, theme toggle, scroll effects, form validation |
| `js/network-bg.js` | My Aquarius network background (canvas) |
| `js/terminal.js` | Hero terminal commands, history and Tab completion |
| `js/lab.js` | Subnet calculator and ACL simulator |
| `js/certificates.js` | Certificate filters and image viewer |
| `js/druk.js` | DRUK SPORTS slideshow and survey counters |
| `js/skills-data.js` | My skill categories and icons |
| `js/skillscroll.js` | Skills scroll story |
| `js/edu-journey.js` | Education journey |
| `js/training.js` | Training gallery and achievement badges |
| `js/projects.js` | Project filters, case-study pop-up and live demos |
| `js/exp-zoom.js` | Experience photo zoom and detail pop-ups |
| `js/motion.js` | Counters and reveal animations |
| `js/pro.js` | Loading screen, custom cursor, magnetic buttons |

## Terminal commands

I added a terminal to the home page because I study networking and use the command line a lot.

| Command | Result |
|---------|--------|
| `help` | Lists all commands |
| `whoami` | Who I am |
| `skills` | Prints my skills |
| `projects` / `certs` / `experience` | Prints the list and scrolls to that section |
| `about` / `education` / `lab` | Scrolls to that section |
| `contact` | Shows my email and location |
| `ping <host>` | Simulated ping |
| `ipconfig` | My simulated lab interface |
| `traceroute <host>` | Simulated route |
| `theme` | Switches dark / light |
| `clear` | Clears the screen |



## Background

I wanted the background to show who I am, so it mixes networking, development and my zodiac sign, Aquarius. It is drawn on a `<canvas>`:

- The real Aquarius constellation, with its stars linked like a network.
- 0s and 1s pouring from the constellation's Water Jar stars.
- Two waves as network links, with devices (FW, R1, API, DB, WEB, PC1, GIT) and packets (HTTP, DNS, SSH, ICMP).
- Devices type a line of code when a packet arrives, and the firewall blocks red attack packets.
- A big, faint Aquarius symbol behind the terminal.

| Try this | What happens |
|----------|--------------|
| Move the mouse near the waves | The waves bend towards it |
| Hover a device or a star | It shows its name |
| Click an empty area | It sends a ping |
| Scroll | The network speeds up and glows brighter |

## What I used

| Technology | What I used it for |
|------------|--------------------|
| HTML5 | Page structure |
| CSS3 (Flexbox, Grid, media queries) | Layout, themes, animations, responsive design |
| JavaScript (ES6) | Interactivity |
| Canvas and SVG | Graphics and animations |
| Git and GitHub | Version control |
| GitHub Pages | Hosting |



## Contact

GitHub: https://github.com/05250179jnec-arch
Email: klhamo2414@gmail.com