# Image assets

## Photography

| File | Used on | Notes |
|---|---|---|
| `electrical-panel-hero.*` | Homepage hero | Real photograph. |

## Placeholder artwork — replace with photography when available

These are **designed technical illustrations**, not photographs. They were
produced to fill the image slots the approved designs call for, using the
site's existing instrument-panel visual language, so the pages read as
finished rather than as broken. They are deliberately illustrative: nothing
here simulates a photograph of real people, sites or equipment.

| File | Used on | Reference calls for |
|---|---|---|
| `dg-set.*` | Services hero | Engineer with a Kirloskar DG set |
| `installation.*` | Service detail hero | Installation / panel termination work |
| `maintenance.*` | AMC hero | Service engineers on a maintenance visit |
| `schematic.*` | Homepage "About" | Engineering team / site photography |

Still outstanding — no slot exists for these yet, because the Industries page
has not been moved onto the v2 design system:

- Industries hero (aerial facility at dusk)
- Eight "Sectors We Empower" cards: manufacturing, hospitals, hotels,
  apartments, schools, commercial, government, builders

## Swapping in a real photograph

Every slot is already wired for responsive delivery, so replacement is
mechanical. For a source image named `<name>`:

1. Produce `<name>.jpg` (1400px wide) plus `-480` / `-800` / `-1400`
   derivatives in both `.jpg` and `.webp`.
2. Keep the same base filename and no markup changes are needed — the
   `<picture>` element, `srcset`, `sizes` and the `<link rel="preload">`
   already reference these paths.
3. Update the `alt` text, which currently describes an illustration.

All artwork is 1400x797 (the aspect the existing photograph uses), and every
slot crops with `object-fit: cover`, so subjects are kept clear of the edges.
