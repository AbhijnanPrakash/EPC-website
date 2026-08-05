# Eternal Power — Design System

Living guide for the EPC static site. Prefer **V2** for new homepage and migrated pages. Older product/solution pages still use the shared legacy stylesheet until migrated.

---

## Stack

| Layer | Files |
|---|---|
| Homepage (V2) | [`index.html`](index.html), [`static/css/v2.css`](static/css/v2.css), [`static/js/v2.js`](static/js/v2.js) |
| Chat (sitewide) | [`static/css/chat.css`](static/css/chat.css), injected by [`static/js/main.js`](static/js/main.js) |
| Services system | [`static/css/services.css`](static/css/services.css), [`static/css/service-detail.css`](static/css/service-detail.css), [`static/css/amc.css`](static/css/amc.css), [`static/js/services.js`](static/js/services.js) |
| Legacy pages | [`static/css/style.css`](static/css/style.css) + `main.js` (products, solutions, about, etc.) |

Opt into V2 by setting `body class="v2"`. All V2 rules are scoped under `.v2`.

---

## Brand

### Color

| Token | Value | Use |
|---|---|---|
| `--v2-green` | `#285f24` | Primary actions, accents |
| `--v2-green-dark` | `#173d19` | Hover / emphasis |
| `--v2-green-deep` | `#0d2410` | Dark bands |
| `--v2-green-bright` | `#3d8f36` | Light-surface accent text |
| `--v2-lime` | `#74c257` | Accent **on dark only** |
| `--v2-green-wash` | `#eef4eb` | Soft fills / hover wash |
| `--v2-ink` | `#161c19` | Headings |
| `--v2-body` | `#4b5550` | Body copy |
| `--v2-muted` | `#6e7873` | Secondary labels |
| `--v2-cream` | `#f6f8f3` | Alternating band |
| `--v2-sand` | `#f2f1ea` | Services / FAQ band |
| `--v2-paper` | `#ffffff` | Default page |

### Type

| Role | Family | Notes |
|---|---|---|
| UI / body | **Geist** | `--v2-sans` |
| Italic accent | **Newsreader** | `--v2-serif` — sparingly for emphasis |

Scale (classes): `.v2-h1` → `.v2-h4`, `.v2-lede`, `.v2-copy`, `.v2-small`, `.v2-eyebrow`.

**Line-height floor:** headings ≥ `1.08`. Do not use `~1.02` on multi-line display titles (causes overlap).

### Geometry

- Max width: `1240px` (`--v2-max`)
- Gutter: `clamp(20px, 4vw, 48px)`
- Radii: `6 / 10 / 16 / 22px`
- Band padding: `clamp(72px, 8vw, 116px)`
- Elevation: `--v2-sh-1` … `--v2-sh-3` (restrained; no heavy multi-layer shadows)

### Glass

One recipe for frosted surfaces:

- Blur: `blur(20px) saturate(150%)`
- Light fill: `rgba(255,255,255,0.88)`
- Fallback (no `backdrop-filter`): opaque `--v2-glass-solid`

Avoid purple glows, neon borders, or pill-cluster chrome.

---

## Components

### Buttons — `.v2-btn`

| Modifier | Role |
|---|---|
| `--primary` | Main CTA (solid green) |
| `--outline` | Secondary on light |
| `--ghost-dark` | Secondary on photo / dark |
| `--light` | On dark bands |
| `--sm` / `--lg` | Size |

Flat enterprise style: no gloss, metallic fills, or gradient buttons.

### Layout primitives

- `.v2-wrap` — centered page column
- `.v2-band` / `--tight` / `--cream` / `--sand` / `--dark` — section shells
- `.v2-head` / `--center` — section title block
- `.v2-link` — text link with underline grow

### Icons

Inline SVG sprite in the page (`<symbol id="i-…">`). Uniform stroke ~`1.6`. Reference with `<use href="#i-bolt">`.

### Chat — EPC Assist

- Launcher: fixed bottom-right FAB
- Desktop: right dock `min(25vw, 420px)`
- Mobile: full-width sheet; clear the bottom action bar
- No signup gate; greeting + quick chips
- LLM hook: `window.epcSendChatMessage` / `sendChatMessage` in `main.js`

Homepage must load **both** `v2.css` + `chat.css`, and **both** `main.js` + `v2.js`.

---

## Homepage section order (V2)

1. Topbar + header + drawer  
2. Hero (full-bleed photo + copy overlay)  
3. Statistics strip  
4. Client logos  
5. Trust features  
6. About  
7. Services grid  
8. OEM partner advantage  
9. Vertical solutions  
10. Trust metrics  
11. Process timeline (ARIA tabs)  
12. Projects  
13. Testimonials  
14. Floating CTA  
15. FAQ  
16. Consultation form  
17. Footer + mobile action bar  

---

## Imagery

Hero and section photos live under [`static/img/`](static/img/). Prefer responsive `<picture>` with webp + jpg srcsets (`480 / 800 / 1400`).

| Asset family | Notes |
|---|---|
| `electrical-panel-hero-*` | Primary hero — production quality |
| `dg-set-*`, `installation-*`, `maintenance-*`, `schematic-*` | Section art — several are low-res placeholders; replace before launch |

See [`static/img/README.md`](static/img/README.md) for naming.

---

## Accessibility & motion

- Skip link: `.v2-skip`
- Focus rings visible on light and dark
- Drawer: focus trap, Escape closes, restore trigger
- Process timeline: real tablist + arrow keys
- Honour `prefers-reduced-motion`
- Reveals gated behind `.js` so content stays visible if JS fails

---

## Breakpoints (practical)

| Width | Behavior |
|---|---|
| ≤ ~1040px | Collapse primary nav → burger; show mobile bar |
| ≤ 900px | Chat full-width; launcher clears `.v2-mbar` |
| ≤ ~720px | Stack grids / stats |

Exact media queries live in `v2.css` (and page CSS for services).

---

## Do / Don’t

**Do**

- Scope new homepage work under `.v2`
- Keep green brand tokens; reuse glass recipe
- Ship desktop + mobile screenshots for UI PRs
- Keep chat wired when editing `index.html`

**Don’t**

- Mix legacy `style.css` hero patterns (`epc-hero`) into V2
- Crush heading `line-height` below ~1.08 on wrapped titles
- Introduce purple / glow / heavy card stacks
- Ship tiny placeholder photos as final art
- Assume cloud-agent `localhost` is the user’s Mac

---

## Known gaps (as of merge `79b5f0f`)

1. **Site split:** homepage V2 vs many inner pages still legacy — migrate page-by-page using `services.css` as the pattern.
2. **Chat mobile selector:** `chat.css` still references `.page-home` in one place; homepage body is `.v2` — launcher may sit under the mobile bar until fixed.
3. **Placeholder imagery:** non-hero section photos need higher-res replacements.
4. **Design QA:** always hard-refresh after pull; confirm View Source contains `v2.css` / `v2-hero`, not old `epc-hero`.

---

## Preview

```bash
cd /path/to/EPC-website
python3 -m http.server 8000
# http://localhost:8000
```

Serve from the **repo root** so `static/` paths resolve.
