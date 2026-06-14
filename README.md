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

**Prerequisites:**
- Rust (install via `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`)
- Linux: `sudo pacman -S webkit2gtk-4.1` (Arch) or `sudo apt install libwebkit2gtk-4.1-dev` (Debian/Ubuntu)
- macOS: `xcode-select --install`
- Windows: Microsoft C++ Build Tools + WebView2

**Build:**
```bash
git clone https://github.com/mumeez/Estimate-Engine.git
cd Estimate-Engine
npm install
npx tauri build
```

The first build compiles all of Tauri's Rust dependencies — expect **15–30 minutes** on the first run. After that, rebuilds are seconds.

The output will be at:
- **Linux:** `src-tauri/target/release/bundle/deb/` (`.deb`) and `src-tauri/target/release/bundle/rpm/` (`.rpm`)
- **macOS:** `src-tauri/target/release/bundle/dmg/` (`.dmg`)
- **Windows:** `src-tauri/target/release/bundle/msi/` (`.msi`)

No server needed — the app is fully self-contained.

> **Niri / Hyprland users:** The title bar is enabled for stability (required on some NVIDIA+Wayland setups). Since your window manager already manages windows with keyboard shortcuts, the title bar is purely cosmetic. If it really bothers you, set `"decorations": false` in `src-tauri/tauri.conf.json` — but be aware it may crash WebKitGTK on NVIDIA Wayland.

**App launcher entry:** After building, run the install script to add it to your desktop applications:
```bash
bash install-desktop.sh
```
This copies the binary to `~/.local/bin/` and creates a `.desktop` entry so you can launch it from your app launcher. To uninstall, just delete those files.

**Launch wrapper (NVIDIA Wayland fix):** If you're on NVIDIA + Wayland (Niri, Hyprland, Sway), WebKitGTK may crash with `Failed to create EGL image for DMABufs`. Use the launch wrapper which sets the required environment variables:
```bash
./estimate-engine.sh          # from repo root
~/.local/bin/estimate-engine.sh  # after install-desktop.sh
```
For a permanent system-level fix, enable NVIDIA DRM modesetting:
```bash
# Create a modprobe config
echo "options nvidia_drm modeset=1" | sudo tee /etc/modprobe.d/nvidia-drm.conf
# Regenerate initramfs
sudo mkinitcpio -P
# Reboot
```
After rebooting, the app will work without the wrapper script.

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
