#!/usr/bin/env bash
# Preview the static site — no build step, one CSS file.
set -euo pipefail
cd "$(dirname "$0")"
for PORT in 8000 8080 3000; do
  if python3 -c "import socket; s=socket.socket(); s.bind(('', $PORT)); s.close()" 2>/dev/null; then
    echo "Open http://localhost:$PORT"
    exec python3 -m http.server "$PORT" --bind 0.0.0.0
  fi
done
echo "Ports 8000–3000 busy. Try: python3 -m http.server 9000"
exit 1
