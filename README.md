# Estimate Engine

> A construction & remodel estimating tool with an animated background, inline calculators, California code search, and Obsidian export.

---

## Features

- **Materials Database** — 200+ construction items across 14 categories with realistic pricing
- **Auto-fill Materials** — search and add items from the built-in catalog
- **Edit or Remove Items** — edit any line item or delete it
- **Inline Calculators** — basic arithmetic + drywall, concrete, lumber, paint, flooring calculators in the right panel (no modals)
- **Change Orders** — track, approve, reject, with automatic grand total updates
- **Project Management** — notes, status, crew & timeline tracking
- **Code Search** — search 78 California building code references (CRC, CBC, CALGreen, CEBC, CPC, CMC, CEC)
- **Save / Load** — all estimates stored in your browser's localStorage
- **File Backup & Restore** — export all estimates as `.json` and import them later
- **Obsidian Export** — full project note with YAML frontmatter, materials table, labor, code refs, change orders
- **Print / PDF** — browser-native print with print-friendly formatting
- **5 Color Themes** — default (eldritch), rosépine, gruvbox, dracula, e-ink light
- **Animated Background** — perlin-flow particle animation (color adapts to theme)

---

## Getting Started

### What You'll Need

1. **A web browser** — Chrome, Firefox, Safari, or Edge
2. **A way to serve the files locally** — pick one option below

No build tools, no npm install, no server-side runtime required.

### Installation

#### macOS / Linux (Python — pre-installed)

```bash
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine
python3 -m http.server 8080
```

Open **http://localhost:8080** in your browser.

#### Windows

```bash
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine
python -m http.server 8080
```

> If Python isn't installed, download it from [python.org](https://python.org) or the Microsoft Store.

Open **http://localhost:8080** in your browser.

#### Any OS (backup option — Node.js)

If you have Node.js installed:

```bash
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine
npx serve .
```

Then open the URL shown in the terminal (usually **http://localhost:3000** or **http://localhost:5000**).

---

### Optional Dependencies

These aren't required to run the app, but unlock extra features:

| Dependency | Why You'd Want It | How to Install |
|------------|-------------------|----------------|
| **CaskaydiaCove Nerd Font** | The UI is designed for this font (Cascadia Code–based with Nerd Font patches). Without it, the browser falls back to `monospace` — still works, just less polished. | Download from [Nerd Fonts](https://www.nerdfonts.com/font-downloads) and install it on your system. On macOS, double-click the `.ttf` files and click "Install Font". On Linux, copy them to `~/.local/share/fonts/` and run `fc-cache`. On Windows, right-click → Install. |
| **Obsidian** | The "Export to Obsidian" button generates a markdown file you can save directly into an Obsidian vault. | Download from [obsidian.md](https://obsidian.md) |
| **VS Code + Live Server** | An alternative way to run the app if you prefer editing in VS Code and want auto-refresh. | Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (Ritwick Dey), open the project folder, right-click `index.html` → "Open with Live Server". |

---

## Project Structure

```
Estimate-Engine/
├── index.html             # Main application layout
├── styles.css             # Theme & styling (5 themes)
├── app.js                 # Application logic
├── data/
│   ├── materials.json     # 200+ construction items
│   └── ca-codes.json      # 78 California building code references
├── obsidian-template.md   # Obsidian export template
├── screenshot.png
├── README.md
└── .gitignore
```

---

## Customization

All color variables are in `styles.css` under `:root`. The app includes 5 built-in themes you can switch from the header:

| Variable | Default | Purpose |
|----------|---------|---------|
| `--bg-deep` | `#363748` | Far background |
| `--bg-surface` | `#404262` | Card surfaces |
| `--accent` | `#BC93FA` | Purple accent |
| `--text-primary` | `#33ff66` | Green body text |

---

## Tech Stack

- **HTML5 / CSS3** — semantic layout, custom properties, flexbox
- **Vanilla JavaScript** — no frameworks, no build step, no dependencies
- **Canvas API** — perlin-flow animated background
- **localStorage** — all data stays in your browser (no server, no database)

---

## Roadmap

- [x] Core estimate engine (add/edit/remove items, summary calc)
- [x] Material auto-fill from database
- [x] Simple / Advanced mode toggle
- [x] Quick calculators (drywall, concrete, lumber, paint, flooring)
- [x] Basic arithmetic calculator (inline in right panel)
- [x] Change orders
- [x] Project notes, status, crew & timeline
- [x] California building code search
- [x] Obsidian markdown export
- [x] Animated perlin-flow background
- [x] 5 color themes (eldritch / rosépine / gruvbox / dracula / e-ink)
- [x] Print-friendly CSS for PDF output
- [x] Edit existing line items
- [x] File-based backup & restore (JSON export/import)
- [ ] PWA manifest for installable app
- [ ] Settings panel (default rates, tax, markup)
- [ ] Tauri desktop app wrapper
- [ ] Cloud save / sync

---

## License

MIT
