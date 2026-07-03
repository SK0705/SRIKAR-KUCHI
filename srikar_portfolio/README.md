# 3D Spatial Interactive Portfolio

A premium, interactive, 3D-scrolling portfolio website built using HTML, Tailwind CSS, and Vanilla JavaScript. It features a responsive full-screen canvas background that animates through 300 sequential high-fidelity renders of a futuristic chassis syncing rotation to the global scroll position.

## 🚀 Live Reference
* **Original Portfolio URL:** [srikar-kuchi.vercel.app](https://srikar-kuchi.vercel.app/)

## ✨ Key Features
* **3D Scroll Canvas Background**: Uses custom canvas rendering with `Math.max(cw/iw, ch/ih)` scaling formulas to achieve cover-fit framing on any viewport. Employs optimized `requestAnimationFrame` scroll handlers to prevent frame lag and layout thrashing.
* **Responsive Bento Grid Projects**: Displays your work in a structured multi-column bento configuration featuring distinct neon borders, custom hovers, and Material Symbols icons:
  * **FinMatrix** — Wide flagship AI financial platform.
  * **Maverick** — Tall side preview of your desktop assistant workspace.
  * **INDRA** — Business metrics ROI database.
  * **SJ Creative Labs** — Corporate/software startup hub.
  * **Murthy & Co.** — Legal consulting platform.
* **Google Forms Integration**: Submits contact form data directly to Google Forms sheet endpoints (`https://docs.google.com/forms/d/e/.../formResponse`) via asynchronous `fetch()` API with `mode: 'no-cors'`. Avoids cross-origin redirection failures.
* **Mobile-First Responsiveness**: Stacks layout columns and collapses grids dynamically on mobile screens. Built with an overlay side-drawer navigation menu toggled by a custom hamburger icon.
* **Advanced SEO Setup**: Complete meta tagging, index crawlers, og-meta properties, and Twitter Card configurations for discoverability.

## 📂 Project Directory
```
srikar_portfolio/
├── index.html        # Main static page holding all layouts, styles, and scripting
├── favicon.ico       # Website favicon
├── profile.jpg       # Profile picture (displayed in the About section)
├── README.md         # Documentation
└── frames/           # 300 sequential JPG renders (000-299)
```

## ⚙️ Running Locally
Because the canvas loads frame assets dynamically, browsers may warn about cross-origin resource sharing (CORS) when loading directly from the filesystem (`file://`). Run the project using a simple static web server:

**Using Python:**
```bash
python -m http.server 8001
```

**Using Node.js (http-server):**
```bash
npx http-server -p 8001
```

Once running, navigate to [http://localhost:8001](http://localhost:8001) in your browser.
