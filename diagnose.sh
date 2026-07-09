#!/usr/bin/env bash
echo "=== EPC website diagnostic ==="
echo "Folder:  $(pwd)"
echo ""
if [[ ! -f index.html ]]; then
  echo "FAIL: no index.html here. cd into the EPC-website folder first."
  exit 1
fi
if [[ -d .git ]]; then
  echo "Git:     $(git remote get-url origin 2>/dev/null || echo 'no remote')"
  echo "Branch:  $(git branch --show-current 2>/dev/null)"
  echo "Commit:  $(git rev-parse --short HEAD 2>/dev/null)"
else
  echo "Git:     NOT a git repo (files may be an old manual copy)"
fi
echo ""
NEW=$(grep -c 'epc-hero__stats-bar' index.html || true)
OLD=$(grep -c 'hero-marks\|class="hero"' index.html || true)
V7=$(grep -c '20260708-v7' index.html || true)
echo "index.html checks:"
echo "  epc-hero__stats-bar : $NEW  (need >= 1)"
echo "  old hero markers    : $OLD  (need 0)"
echo "  build v7 stamp      : $V7  (need >= 1)"
echo ""
if [[ "$NEW" -ge 1 && "$OLD" -eq 0 && "$V7" -ge 1 ]]; then
  echo "OK: Files are correct. Run: python3 -m http.server 8000"
  echo "    Then open http://localhost:8000"
  echo "    You should see a green 'MOCKUP HERO v7' badge top-right."
  exit 0
else
  echo "FAIL: Old or wrong files. Fix with:"
  echo "  cd ~ && rm -rf EPC-website && git clone https://github.com/AbhijnanPrakash/EPC-website.git && cd EPC-website"
  exit 1
fi
