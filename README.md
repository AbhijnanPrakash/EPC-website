# Eternal Power — Website (Modern Redesign)

28 fully-built HTML pages. Dark, live-NOC aesthetic — designed to
feel like a modern control-room dashboard, not a template.

## To preview locally

Double-click `index.html`. Every page links correctly.

For 100% fidelity (Google Maps embed, Google Fonts, form actions),
run a local server:
```
python3 -m http.server 8000
```
then open http://localhost:8000

## File layout

```
index.html              home (bento products, editorial services list)
about.html              company story, leadership, credentials
products/               6 product pages + index (bento grid)
services/               7 service pages + index (editorial list)
solutions/              5 industry pages + index
projects.html           filterable project gallery
clients.html            client marquee + testimonials
faqs.html               grouped FAQ hub
contact.html            enquiry form + dark-themed map + directions
privacy.html            DPDP-aware privacy policy

static/css/style.css    design system (all colors + fonts as variables at top)
static/js/main.js       live clock, drawer, filters, form handler
static/img/             (for real logos + photos when supplied)

sitemap.xml · robots.txt · README.md
```

## Design system

**Palette** — dark-first, one primary accent:
- `--void` `#080B12` (page bg — deep near-black)
- `--slate` `#111624` (surfaces)
- `--live` `#3DE1CB` (electric teal — the "healthy uptime" LED signature)
- Phase colors used sparingly on power-quality graphics: R/Y/B `#FF6B5B` / `#FFC547` / `#4A9EFF` (Indian 3-phase electrical vernacular)

**Fonts** — variable weights, all from Google Fonts (loaded automatically):
- Geist (display + body)
- Geist Mono (specs, labels, live clock)
- Instrument Serif (italic accent — used ONLY in the founder statement and headline pull-quotes)

**Signature elements**
- The "uptime rail" — scrolling live-metric strip under the home hero
- Live IST clock in the header top bar
- Live-instrument dashboard in the hero (animated bars)
- Custom product SVG "instruments" — each product's card carries its own diagrammatic illustration (UPS load bars, battery bank, data-center racks, R/Y/B phase waveforms, IBMS zones, monitoring wall)

## To edit content

1. Open any `.html` file in a text editor (VS Code recommended for beginners — free from code.visualstudio.com).
2. Text sits directly inside the tags. Change, save, refresh browser.
3. Colors and fonts are CSS variables at the top of `static/css/style.css` — change one place, whole site updates.

For repeatable changes (adding a new product or service that should appear in the header, footer, sitemap and homepage cards at once), ask for the Python generator source — you'd edit one `data.py` file and run one command. The current package is the finished HTML for direct editing.

## To deploy

Drag the folder into Netlify Drop: https://app.netlify.com/drop

You're live in about 30 seconds. Also works on Vercel, Cloudflare
Pages, Hostinger, cPanel, or any static host. No server, no database.

## Enquiry forms

Open WhatsApp or the visitor's email app with the enquiry pre-filled — no backend needed.

To switch to a hosted endpoint (Formspree/Basin) later, edit the form
submit handler at the bottom of `static/js/main.js` — one function.

## Pre-launch checklist

- [ ] Replace the 4 sample projects (they display an amber "SAMPLE" tag)
- [ ] Replace the 2 sample testimonials (same "SAMPLE" tag)
- [ ] Add real client names/logos on `clients.html` (currently shows placeholder tiles Client A–L)
- [ ] Add a real logo image at `static/img/logo.svg` and swap out the wordmark SVG in each HTML file's header (or ask me to script this)
- [ ] Confirm OEM partner names on About page
- [ ] Have privacy policy reviewed for DPDP Act compliance
- [ ] After DNS cutover, submit `sitemap.xml` in Google Search Console
- [ ] The current Wix site has `meta robots: noindex` — the new site does NOT, so simply going live should be a significant visibility improvement

## SEO built-in

- Unique title, meta description, canonical URL, Open Graph and Twitter tags per page
- Schema.org: LocalBusiness (home, contact), Product + FAQPage (product pages), Service + FAQPage (service pages), BreadcrumbList (all inner pages), FAQPage (FAQ hub)
- `sitemap.xml`, `robots.txt`
- Semantic HTML, internal linking between products ↔ services ↔ solutions, lazy-loaded map embed, minimal payload (no framework)
