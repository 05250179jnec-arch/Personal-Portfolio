# Personal Portfolio Website

**Author:** Kuenzang Lhamo
**Programme:** Diploma in Computer System and Network, Jigme Namgyel Engineering College
**Course:** Web Technology and Design

---

## 1. Introduction

This repository contains the source code of my personal portfolio website. The website was designed and developed using HTML, CSS and JavaScript, and is deployed using GitHub Pages. Its purpose is to present my personal information, technical skills, educational background, projects, experience, certifications and contact information in a professional and accessible manner.

## 2. Objectives

The objectives of this project are to:

1. Design a responsive, visually appealing and user-friendly website.
2. Present my skills, projects and achievements in an organised and professional format.
3. Apply core web technologies, including semantic HTML, modern CSS layout techniques and JavaScript interactivity.
4. Ensure the website functions correctly on desktop, tablet and mobile devices.
5. Host the source code on GitHub and deploy the website using GitHub Pages.

## 3. Website Sections

| Section | Description |
|---|---|
| Home | Presents my name, profile photograph, headline, a brief introduction and an interactive terminal. |
| About | Describes my background, interests and career goals. |
| Skills | Displays my technical and soft skills through an interactive skill map and a card view. |
| Projects | Showcases seven projects with descriptions, technologies used and repository links where available. |
| Network Lab | Provides two interactive networking tools developed for this website. |
| Education | Lists my educational qualifications, training programmes and achievements. |
| Experience | Describes my industry study tour, volunteering, competition and exchange experiences. |
| Certificates | Displays my Cisco Networking Academy and Coursera certificates with verification links. |
| Contact | Provides my contact details and a validated contact form. |

## 4. Features

### 4.1 Interactive Features
- **Navigation menu** with smooth scrolling, active-section highlighting and a collapsible menu for mobile devices.
- **Theme toggle** that switches between dark and light modes and stores the user's preference.
- **Interactive terminal** that responds to commands such as `help`, `whoami`, `skills`, `ping`, `ipconfig`, `traceroute` and `certs`, with command history and auto-completion.
- **Interactive skill map** that presents skills as a network diagram, links each skill to the relevant project, certificate or experience, and includes a search function.
- **IPv4 subnet calculator** that computes the network address, subnet mask, wildcard mask, broadcast address, usable host range and binary representation.
- **ACL packet simulator** that demonstrates how a router evaluates extended access control list rules from top to bottom.
- **Certificate gallery** with category filters and a full-size image viewer.
- **Project slideshow** for the DRUK SPORTS hackathon pitch.
- **Contact form validation** for the name, email address and message fields.

### 4.2 Visual Design
- Animated network background rendered with the HTML Canvas API.
- Animated SVG illustrations for individual projects.
- Scroll-triggered animations, animated counters and a start-up screen.
- A consistent colour scheme, typography and spacing throughout the website.

### 4.3 Responsive Design and Accessibility
- Layouts built with CSS Flexbox and Grid, adapted to different screen sizes using media queries.
- Semantic HTML elements such as `header`, `nav`, `main`, `section`, `article` and `footer`.
- Descriptive alternative text for images and ARIA labels for icon-only controls.
- Keyboard support for interactive components.
- Reduced animation for users who enable the "reduce motion" setting on their devices.

## 5. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and content |
| CSS3 | Styling, layout, themes, animations and responsive design |
| JavaScript (ES6) | Interactivity and dynamic behaviour |
| HTML Canvas and SVG | Graphics and animations |
| Git and GitHub | Version control and source code hosting |
| GitHub Pages | Website deployment |

## 6. Project Structure

```
Personal-Portfolio/
├── index.html          Page structure and content
├── style.css           Styles, themes and responsive layout
├── script.js           Navigation, theme toggle, scroll effects and form validation
├── js/
│   ├── network-bg.js   Animated network background
│   ├── terminal.js     Interactive terminal
│   ├── lab.js          Subnet calculator and ACL simulator
│   ├── certificates.js Certificate filters and image viewer
│   ├── druk.js         Project slideshow and survey counters
│   ├── skillmap.js     Interactive skill map
│   └── motion.js       Start-up screen, counters and animation effects
└── assets/             Images, certificates, slides and diagrams
```

## 7. Running the Project Locally

1. Clone the repository:
   ```
   git clone https://github.com/05250179jnec-arch/Personal-Portfolio.git
   ```
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using the Live Server extension, or open the file directly in a web browser.

No installation or build process is required.

## 8. Deployment

The website is deployed using GitHub Pages from the `main` branch of this repository and is available at:

https://05250179jnec-arch.github.io/Personal-Portfolio/

## 9. Contact

**Kuenzang Lhamo**
GitHub: https://github.com/05250179jnec-arch
Email: klhamo2414@gmail.com
