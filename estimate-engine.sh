#!/usr/bin/env bash
# Launch wrapper for Estimate Engine
# Sets WebKitGTK environment variable to fix GPU-accelerated rendering on Wayland.
# Without this, some GPU drivers cause WebKit to crash with:
#   "Failed to create EGL image for DMABufs"
#
# Usage:
#   ./estimate-engine.sh                   # run from repo root
#   ~/.local/bin/estimate-engine.sh        # after install-desktop.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BINARY="$SCRIPT_DIR/src-tauri/target/release/estimate-engine"

# If running from ~/.local/bin, the binary is right next to us
if [ ! -f "$BINARY" ]; then
  BINARY="$SCRIPT_DIR/estimate-engine"
fi

# If still not found, try the repo default
if [ ! -f "$BINARY" ]; then
  BINARY="./src-tauri/target/release/estimate-engine"
fi

export WEBKIT_DISABLE_DMABUF=1
exec "$BINARY" "$@"
