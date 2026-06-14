#!/usr/bin/env bash
# install-desktop.sh
# Install Estimate Engine binary + desktop entry for your app launcher
# Run from the repo root AFTER 'npx tauri build'
#
# Usage: bash install-desktop.sh

set -euo pipefail

BINARY="src-tauri/target/release/estimate-engine"
ICON_SRC="src-tauri/icons/icon.png"
BIN_DEST="$HOME/.local/bin/estimate-engine"
ICON_DEST="$HOME/.local/share/icons/estimate-engine.png"
DESKTOP_DEST="$HOME/.local/share/applications/estimate-engine.desktop"

echo "==> Checking for built binary..."
if [ ! -f "$BINARY" ]; then
    echo "ERROR: Binary not found at $BINARY"
    echo "Run 'npx tauri build' first."
    exit 1
fi

echo "==> Installing binary to $BIN_DEST"
mkdir -p "$HOME/.local/bin"
cp "$BINARY" "$BIN_DEST"
chmod +x "$BIN_DEST"

echo "==> Installing icon to $ICON_DEST"
if [ -f "$ICON_SRC" ]; then
    mkdir -p "$HOME/.local/share/icons"
    cp "$ICON_SRC" "$ICON_DEST"
fi

echo "==> Creating desktop entry at $DESKTOP_DEST"
mkdir -p "$HOME/.local/share/applications"
cat > "$DESKTOP_DEST" << EOF
[Desktop Entry]
Type=Application
Name=Estimate Engine
Comment=Construction & Remodel Estimating Tool
Exec=$BIN_DEST
Icon=estimate-engine
Terminal=false
Categories=Office;ProjectManagement;
StartupWMClass=estimate-engine
EOF

echo ""
echo "✔ Done! Estimate Engine is installed."
echo ""
echo "Next steps:"
echo "  1. Log out and back in (or run: update-desktop-database ~/.local/share/applications 2>/dev/null)"
echo "  2. Look for 'Estimate Engine' in your app launcher"
echo ""
echo "To uninstall:"
echo "  rm -f $BIN_DEST $ICON_DEST $DESKTOP_DEST"
