# Eternal Power Website

Static marketing website (28 hand-authored HTML pages) for an EPC / electrical-infrastructure company. No framework, no build step, no package manager, no database — just HTML, CSS, and vanilla JS under `static/`.

See [`README.md`](README.md) and [`DESIGN.md`](DESIGN.md) for content layout and the V2 design system.

## Cursor Cloud specific instructions

- There is nothing to install or build: this is a pure static site and Python 3 is preinstalled. The update script is effectively a no-op runtime check.
- Run it by serving the repo root with a static server so `static/` paths resolve: `python3 -m http.server 8000` (see `README.md` / `DESIGN.md`), then open `http://localhost:8000`. Do NOT open pages via `file://` — the Google Maps embed, fonts, and relative asset paths need an HTTP origin.
- There are no lint, test, or build commands in this repo. "Validation" means serving the site and confirming pages return HTTP 200 and render.
- No hot reload: after editing HTML/CSS/JS, just hard-refresh the browser (assets are static). Hard-refresh after pulling to avoid stale cached `v2.css` (see DESIGN.md "Known gaps").
- The enquiry/contact form has no backend — it opens WhatsApp/email prefilled (handler at the bottom of `static/js/main.js`). The homepage also injects the "EPC Assist" chat widget from `main.js`; the LLM hook (`window.epcSendChatMessage`) is a stub, so it echoes a canned reply.
