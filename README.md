# Estimate Engine

> A construction & remodel estimating tool with an eldritch-themed UI, animated background, Home Depot pricing database, and California building code search.

![Screenshot](screenshot.png)

## Features

### Core
- **Materials Database** — 200+ construction items across 14 categories with realistic Home Depot prices
- **Auto-fill Materials** — search and add items from the built-in catalog
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
- Status dropdown (Estimating → In Progress → Completed → On Hold)
- Crew & timeline tracking (crew size, start/end dates)
- Save / load estimates from localStorage

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
- **Print / PDF** — browser-native print dialog

## Getting Started

### Run Locally

```bash
cd estimate-app
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

### Run on Another Computer

Clone the repo and serve with any static file server:

```bash
git clone https://github.com/mumeez/estimate-engine.git
cd estimate-engine
python3 -m http.server 8080
# or: npx serve .
# or: php -S localhost:8080
```

### System Requirements
- Any modern browser (Chrome, Firefox, Safari, Edge)
- No build tools, no dependencies, no server-side requirements

## Customization

All color variables are in `styles.css` under `:root`. The app uses a customizable theme system:

| Variable | Default | Purpose |
|----------|---------|---------|
| `--bg-deep` | `#363748` | Far background |
| `--bg-surface` | `#404262` | Card surfaces |
| `--accent` | `#BC93FA` | Headers & purple accent |
| `--text-primary` | `#33ff66` | Green body text |

Font is **CaskaydiaCove Nerd Font** (Cascadia Code–based, Nerd Font patched).

## Tech Stack

- **HTML5** — semantic layout
- **CSS3** — custom properties, flexbox, canvas animations
- **Vanilla JavaScript** — no frameworks, no build step
- **Canvas API** — particle background with stars, connector lines, drifting glyphs

## Project Structure

```
estimate-app/
├── index.html             # Main application layout
├── styles.css             # Theme & styling
├── app.js                 # Application logic
├── data/
│   ├── materials.json     # 200+ construction items with HD pricing
│   └── ca-codes.json      # 78 California building code references
├── obsidian-template.md   # Obsidian export template
├── README.md              # This file
└── .gitignore
```

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
- [ ] Home Depot live API pricing (requires API key)
- [ ] PWA manifest for installable app
- [ ] Settings panel (default rates, tax, markup)
- [ ] Theme picker (light / dark / custom)
- [ ] Tauri desktop app wrapper
- [ ] Print-friendly CSS for PDF output
- [ ] Cloud save / sync

## License

MIT
