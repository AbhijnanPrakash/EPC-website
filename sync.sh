#!/usr/bin/env bash
# Download latest homepage from GitHub (no git required)
set -euo pipefail
cd "$(dirname "$0")"
BASE="https://raw.githubusercontent.com/AbhijnanPrakash/EPC-website/main"
echo "Downloading..."
curl -fsSL "$BASE/index.html" -o index.html.new
curl -fsSL "$BASE/CHECK.txt" -o CHECK.txt
curl -fsSL "$BASE/static/css/style.css" -o static/css/style.css
if ! grep -q 'epc-hero__stats-bar' index.html.new; then
  echo "ERROR: download failed or wrong version"
  exit 1
fi
if grep -q 'hero-marks' index.html.new; then
  echo "ERROR: got old hero HTML"
  exit 1
fi
mv index.html.new index.html
echo "OK — new design installed."
echo "Run: python3 -m http.server 8000"
echo "Check: http://localhost:8000/CHECK.txt"
