#!/usr/bin/env bash
# Download latest homepage files from GitHub (no git required)
set -euo pipefail
BASE="https://raw.githubusercontent.com/AbhijnanPrakash/EPC-website/main"
cd "$(dirname "$0")"
echo "Downloading latest files..."
curl -fsSL "$BASE/index.html" -o index.html
curl -fsSL "$BASE/static/css/style.css" -o static/css/style.css
curl -fsSL "$BASE/static/css/home.css" -o static/css/home.css
echo "Done. Files updated."
if grep -q 'epc-hero__stats-bar' index.html; then
  echo "OK: new mockup hero is in index.html"
else
  echo "ERROR: download failed — index.html still wrong"
  exit 1
fi
if grep -q 'hero-marks' index.html; then
  echo "ERROR: old hero still present"
  exit 1
fi
echo "Run: python3 -m http.server 8000"
