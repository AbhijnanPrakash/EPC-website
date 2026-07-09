#!/usr/bin/env bash
# Local preview for EPC static site (no build step)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [[ ! -f index.html ]]; then
  echo "Error: index.html not found. Run this from the EPC-website folder."
  exit 1
fi

for PORT in 8000 8080 3000 5500; do
  if ! python3 -c "import socket; s=socket.socket(); s.bind(('', $PORT)); s.close()" 2>/dev/null; then
    continue
  fi
  echo ""
  echo "  EPC website — local preview"
  echo "  ───────────────────────────"
  echo "  Folder: $ROOT"
  echo "  URL:    http://localhost:$PORT"
  echo ""
  echo "  Press Ctrl+C to stop."
  echo ""
  exec python3 -m http.server "$PORT" --bind 0.0.0.0
done

echo "Error: ports 8000, 8080, 3000, 5500 are all in use."
echo "Stop the other server or run: python3 -m http.server 9000"
exit 1
