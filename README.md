# Estimate Engine

> A construction & remodel estimating tool with an animated background, inline calculators, photo attachments, California code search, and Obsidian export.

---

## Features

- **Materials Database** — 200+ construction items across 14 categories with realistic pricing
- **Auto-fill Materials** — search and add items from the built-in catalog
- **Edit or Remove Items** — edit any line item or delete it
- **Inline Calculators** — basic arithmetic + drywall, concrete, lumber, paint, flooring calculators in the right panel (no modals)
- **Photo & File Attachments** — attach images, PDFs, and documents to project notes (stored as data URLs, included in Obsidian export)
- **Change Orders** — track, approve, reject, with automatic grand total updates
- **Project Management** — notes, status, crew & timeline tracking
- **Code Search** — search 78 California building code references (CRC, CBC, CALGreen, CEBC, CPC, CMC, CEC)
- **Save / Load** — all estimates stored in your browser's localStorage
- **File Backup & Restore** — export all estimates as `.json` and import them later
- **Obsidian Export** — full project note with YAML frontmatter, materials table, labor, code refs, change orders, and embedded attachments
- **Print / PDF** — browser-native print with print-friendly formatting
- **5 Color Themes** — default (eldritch), rosépine, gruvbox, dracula, e-ink light
- **Animated Background** — perlin-flow particle animation (color adapts to theme)

---

## Getting Started

### What You'll Need

1. **A web browser** — Chrome, Firefox, Safari, or Edge
2. **A way to serve the files locally** — pick one option below

No build tools, no npm install, no server-side runtime required.

### Run in Browser

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

#### Any OS (backup — Node.js)

```bash
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine
npx serve .
```

Then open the URL shown in the terminal (usually **http://localhost:3000** or **http://localhost:5000**).

---

### Build as Desktop App (optional)

You can wrap Estimate Engine as a standalone desktop app using [Tauri](https://v2.tauri.app/). The result is a single executable that opens in its own window — no browser, no terminal needed.

The first build compiles all of Tauri's Rust dependencies and takes roughly **2–5 minutes** on modern hardware. After that, rebuilds are about 30 seconds.

#### macOS

```bash
# 1. Install Xcode Command Line Tools
xcode-select --install

# 2. Install Rust (press Enter at the default prompt)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# 3. Clone and build
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine
npm install
npx tauri build
```

The finished app will be in `src-tauri/target/release/bundle/dmg/` as a `.dmg` file — open it and drag "Estimate Engine" to your Applications folder. Or launch it immediately from the terminal:
```bash
open src-tauri/target/release/Estimate\ Engine
```

> **Apple Silicon (M1/M2/M3/M4/M5):** Fully supported. Rust and Node.js run natively. The build output will be an `aarch64` binary — everything works the same as Intel.

#### Linux (Arch / CachyOS)

```bash
# 1. Install dependencies
sudo pacman -S webkit2gtk-4.1

# 2. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# 3. Clone and build
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine
npm install
npx tauri build
```

The finished app will be at `src-tauri/target/release/estimate-engine` — run it directly:
```bash
./src-tauri/target/release/estimate-engine
```

**NVIDIA + Wayland (Niri / Hyprland) users:** If the app crashes with `Failed to create EGL image for DMABufs`, use the launch wrapper instead:
```bash
./estimate-engine.sh
```
For a permanent fix, enable NVIDIA DRM modesetting:
```bash
echo "options nvidia_drm modeset=1" | sudo tee /etc/modprobe.d/nvidia-drm.conf
sudo mkinitcpio -P
# reboot
```

**App launcher entry:**
```bash
bash install-desktop.sh
```

#### Linux (Debian / Ubuntu)

```bash
# 1. Install dependencies
sudo apt install libwebkit2gtk-4.1-dev

# 2. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# 3. Clone and build
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine
npm install
npx tauri build
```

#### Windows

1. Install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Install [Rust](https://rustup.rs)
3. Open PowerShell and run:
```powershell
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine
npm install
npx tauri build
```

---

### Optional Dependencies

These aren't required to run the app, but unlock extra features:

| Dependency | Why You'd Want It | How to Install |
|------------|-------------------|----------------|
| **CaskaydiaCove Nerd Font** | The UI is designed for this font (Cascadia Code–based with Nerd Font patches). Without it, the browser falls back to `monospace` — still works, just less polished. | Download from [Nerd Fonts](https://www.nerdfonts.com/font-downloads) and install it on your system. On macOS, double-click the `.ttf` files and click "Install Font". On Linux, copy them to `~/.local/share/fonts/` and run `fc-cache`. On Windows, right-click → Install. |
| **Obsidian** | The "Export to Obsidian" button generates a markdown file you can save directly into an Obsidian vault. | Download from [obsidian.md](https://obsidian.md) |
| **Rust + Tauri** | Build a standalone desktop app from the web version. | See "Build as Desktop App" section above. |

---

## Project Structure

```
Estimate-Engine/
├── index.html             # Main application layout
├── styles.css             # Theme & styling (5 themes)
├── app.js                 # Application logic
├── tauri-bridge.js        # Tauri native file operations (optional)
├── data/
│   ├── materials.json     # 200+ construction items
│   └── ca-codes.json      # 78 California building code references
├── obsidian-template.md   # Obsidian export template
├── src-tauri/             # Tauri desktop app wrapper (optional)
│   ├── Cargo.toml         # Rust dependencies
│   ├── tauri.conf.json    # App configuration
│   ├── capabilities/      # Security permissions
│   ├── icons/             # App icons
│   └── src/
│       ├── main.rs        # Entry point
│       └── lib.rs         # Rust backend (file I/O commands)
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
- **Rust + Tauri** (optional) — desktop app wrapper with native file dialogs

---

## Roadmap

- [x] Core estimate engine (add/edit/remove items, summary calc)
- [x] Material auto-fill from database
- [x] Simple / Advanced mode toggle
- [x] Quick calculators (drywall, concrete, lumber, paint, flooring)
- [x] Basic arithmetic calculator (inline in right panel)
- [x] Change orders
- [x] Project notes, status, crew & timeline
- [x] Photo & file attachments
- [x] California building code search
- [x] Obsidian markdown export (with embedded attachments)
- [x] Animated perlin-flow background
- [x] 5 color themes (eldritch / rosépine / gruvbox / dracula / e-ink)
- [x] Print-friendly CSS for PDF output
- [x] Edit existing line items
- [x] File-based backup & restore (JSON export/import)
- [x] Tauri desktop app wrapper
- [ ] Settings panel (default rates, tax, markup)
- [ ] Cloud save / sync

---

## License

MIT
