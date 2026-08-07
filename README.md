# Eternal Power website

Static HTML site for Eternal Power & Cooling Services (Bangalore).

Homepage uses the **V2 dark hero** design (`static/css/v2.css`).
Inner pages still use the legacy stylesheet (`static/css/style.css`) until migrated.

## Correct homepage check

You have the **current** site if:

1. The hero headline says: **Reliable backup power for critical operations**
2. The top nav shows **Products ▾ · Services ▾ · Solutions ▾ · Locations ▾ · Resources � says: **Reliable backup power for critical operations**
2. The top nav shows **Products ▾ · Services ▾ · Solutions ▾ · Locations ▾ · Resources ▾**
3. Hovering **Products** opens a white dropdown (UPS systems, Batteries, …)

You have an **old / wrong folder** if you see:

- “Critical power infrastructure for *serious* operations”, or
- A flat nav with no � an **old / wrong folder** if you see:

- “Critical power infrastructure for *serious* operations”, or
- A flat nav with no ▾ dropdowns (Home About Products Services AMC …)

That old UI is not on this PR branch. Delete the stale folder and clone fresh.
**https://www.eternalpower.co.in** is still the old Wix site — it will not show these menus until you deploy this repo.

## Preview locally (do this)

Do **not** double-click `index.html` as your main preview method — CSS/image
paths break easily and you can end up looking at a cached old copy.

```bash
# Fresh clone (recommended if the page looks wrong)
git clone https://github.com/AbhijnanPrakash/EPC-website.git
cd EPC-website

# Current redesign work
git fetch origin
git checkout cursor/strip-ai-design-tells-bab9
git pull origin cursor/strip-ai-design-tells-bab9

# Serve from the repo root so /static/* resolves
python3 -m http.server 8000
```

Open **http://127.0.0.1:8000** and hard-refresh (Ctrl/Cmd+Shift+R).

PR: https://github.com/AbhijnanPrakash/EPC-website/pull/9

## File layout

```
index.html              V2 homepage (dark hero)
about.html              company story
products/               product pages + index
services/               service pages + index (several on V2)
solutions/              industry pages + index
projects.html           project gallery
clients.html            clients + testimonials
faqs.html               FAQ hub
contact.html            enquiry form + map
privacy.html            privacy policy

static/css/v2.css       homepage / migrated V2 pages
static/css/style.css    legacy inner pages
static/css/chat.css     EPC Assist chat
static/js/v2.js         homepage interactions
static/js/main.js       shared (clock, drawer, forms, chat)
static/img/             photos / artwork
```

## Deploy

Upload the **whole repo root** (including `static/`) to any static host:
Netlify Drop, Vercel, Cloudflare Pages, Hostinger, cPanel, etc.

Production tip: if DNS still points at the old Wix site
(`eternalpower.co.in`), visitors will not see this repo until you publish
these files to hosting and switch DNS.

## Enquiry forms

Forms open WhatsApp / email with a pre-filled message (no backend).
To use Formspree/Basin later, edit the submit handler in `static/js/main.js`.

## Pre-launch checklist

- [ ] Add real logo at `static/img/logo.svg` and use it in header/footer
- [ ] Replace sample projects / testimonials / Client A–L placeholders
- [ ] Confirm OEM partner names on About
- [ ] Have privacy policy reviewed (DPDP)
- [ ] Migrate remaining legacy pages to V2 (darker system)
- [ ] Publish this build to hosting and cut DNS over from Wix
