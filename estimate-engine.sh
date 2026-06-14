#!/usr/bin/env bash
# Launch wrapper for Estimate Engine
#
# Fixes WebKitGTK GPU crash on NVIDIA Wayland by disabling DMA-BUF
# and compositing mode. Without this, the web process crashes with:
#   "Failed to create EGL image for DMABufs"
#
# For the permanent system-level fix, add nvidia_drm.modeset=1 to
# your kernel boot parameters (see README).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Find the binary — try several locations
if [ -f "$SCRIPT_DIR/src-tauri/target/release/estimate-engine" ]; then
  BINARY="$SCRIPT_DIR/src-tauri/target/release/estimate-engine"
elif [ -f "$SCRIPT_DIR/estimate-engine" ]; then
  BINARY="$SCRIPT_DIR/estimate-engine"
elif command -v estimate-engine &>/dev/null; then
  BINARY="$(command -v estimate-engine)"
else
  echo "Error: estimate-engine binary not found."
  echo "Run 'npx tauri build' first, then try again."
  exit 1
fi

# WebKitGTK GPU workarounds for NVIDIA Wayland:
#   WEBKIT_DISABLE_DMABUF=1           — skip DMA-BUF allocation
#   WEBKIT_DISABLE_COMPOSITING_MODE=1 — force CPU-only rendering path
export WEBKIT_DISABLE_DMABUF=1
export WEBKIT_DISABLE_COMPOSITING_MODE=1

exec "$BINARY" "$@"
