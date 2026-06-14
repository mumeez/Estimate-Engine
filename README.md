# Estimate Engine

> A construction & remodel estimating tool with an eldritch-themed UI, animated background, Home Depot pricing database, and California building code search.

![Screenshot](screenshot.png)

---

## Features

### Core
- **Materials Database** — 200+ construction items across 14 categories with realistic Home Depot prices
- **Auto-fill Materials** — search and add items from the built-in catalog
- **Edit or Remove Items** — edit any material line item after adding it, or delete it with one click
- **Hourly Rate Slider** — $15–$250/hr with fine control
- **Tax Toggle** — enable/disable tax on materials
- **Material Markup** — percentage markup on all materials
- **Discount** — apply a percentage discount to the total
- **Simple / Advanced Toggle** — hides or shows pro features

### Advanced Mode
- Overhead % and Profit Margin %
- Subcontractors with license number tracking
- Equipment rental costs
- Permits & fees
- Waste factor on materials
- Per-item markup & labor category assignment

### Quick Calculators
- **Drywall** — sheets, mud, tape, screws
- **Concrete** — volume in yards, bag count
- **Lumber** — board feet calculations
- **Paint** — gallons needed by wall area
- **Flooring** — sq ft with waste factor
- Each calculator can auto-add results to your estimate

### Change Orders
- Add, approve, reject, or delete change orders
- Each change order updates the grand total
- Track by date, description, and amount

### Project Management
- Project notes with free text
- Status dropdown (Estimating → Proposal Sent → Active → Change Order → Completed)
- Crew & timeline tracking (crew size, start/end dates)
- Save / load estimates from browser storage

### Code Search
- Search 78 California building code references across:
  - **CRC** — California Residential Code
  - **CBC** — California Building Code
  - **CALGreen** — California Green Building Standards
  - **CEBC** — California Existing Building Code
  - **CPC** — California Plumbing Code
  - **CMC** — California Mechanical Code
  - **CEC** — California Electrical Code

### Export
- **Obsidian Markdown** — full project note with YAML frontmatter, materials table, labor, timeline, code refs, change orders
- **Print / PDF** — browser-native print dialog with print-friendly formatting

---

## Getting Started

### Prerequisites

You only need two things:
1. **A modern web browser** — Chrome, Firefox, Safari, or Edge (any recent version)
2. **A way to serve static files locally** — pick one of the options below

No build tools, no npm install, no server-side runtime required.

### Option A: Python (pre-installed on macOS & most Linux)

Python comes with a built-in HTTP server — no extra install needed.

```bash
# Clone the repo
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine

# Start the server
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

> **Windows note:** Use `python -m http.server 8080` instead of `python3`. If Python isn't installed, download it from [python.org](https://python.org) or the Microsoft Store.

### Option B: Node.js / npx (macOS, Linux, Windows)

If you have Node.js installed, you can use `npx serve` — no global install needed:

```bash
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine
npx serve .
```

Then open the URL shown in the terminal (usually **http://localhost:3000** or **http://localhost:5000**).

### Option C: VS Code Live Server (Windows, macOS, Linux)

If you use Visual Studio Code:

1. Install the **Live Server** extension (by Ritwick Dey)
2. Open the `Estimate-Engine` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. A browser tab opens automatically

### Option D: PHP (macOS, Linux, Windows)

If you have PHP installed:

```bash
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine
php -S localhost:8080
```

### Quick Start (already have the files?)

If you already downloaded or cloned the project, just serve the folder:

| Platform | Command |
|----------|---------|
| **macOS / Linux** | `python3 -m http.server 8080` |
| **Windows (PowerShell)** | `python -m http.server 8080` |
| **Any (with Node.js)** | `npx serve .` |
| **Any (with PHP)** | `php -S localhost:8080` |

Then open **http://localhost:8080** in your browser.

---

## Project Structure

```
Estimate-Engine/
├── index.html             # Main application layout
├── styles.css             # Theme & styling
├── app.js                 # Application logic
├── data/
│   ├── materials.json     # 200+ construction items with HD pricing
│   └── ca-codes.json      # 78 California building code references
├── obsidian-template.md   # Obsidian export template
├── screenshot.png         # App screenshot for the README
├── README.md              # This file
└── .gitignore
```

---

## Customization

All color variables are in `styles.css` under `:root`. The app uses a customizable theme system:

| Variable | Default | Purpose |
|----------|---------|---------|
| `--bg-deep` | `#363748` | Far background |
| `--bg-surface` | `#404262` | Card surfaces |
| `--accent` | `#BC93FA` | Headers & purple accent |
| `--text-primary` | `#33ff66` | Green body text |

The UI font is **CaskaydiaCove Nerd Font** (Cascadia Code–based, Nerd Font patched). If you don't have it installed, the browser falls back to `monospace`.

---

## Tech Stack

- **HTML5** — semantic layout
- **CSS3** — custom properties, flexbox, canvas animations
- **Vanilla JavaScript** — no frameworks, no build step, no dependencies
- **Canvas API** — particle background with stars, connector lines, drifting glyphs
- **localStorage** — all estimates are saved in your browser (no server, no database)

---

## Roadmap

- [x] Core estimate engine (add/edit/remove items, summary calc)
- [x] Material auto-fill from database
- [x] Simple / Advanced mode toggle
- [x] Quick calculators (drywall, concrete, lumber, paint, flooring)
- [x] Change orders
- [x] Project notes, status, crew & timeline
- [x] California building code search
- [x] Obsidian markdown export
- [x] Canvas particle background
- [x] Custom theming (eldritch palette)
- [x] Print-friendly CSS for PDF output
- [x] Edit existing line items
- [ ] Home Depot live API pricing (requires API key)
- [ ] PWA manifest for installable app
- [ ] Settings panel (default rates, tax, markup)
- [ ] Theme picker (light / dark / custom)
- [ ] Tauri desktop app wrapper
- [ ] Cloud save / sync

---

## License

MIT
