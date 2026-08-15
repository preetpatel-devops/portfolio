# README 4 — Project Data Map

A reference of exactly where every piece of source data lives in the
codebase — which file, which section, and (for auto-populated content)
which original document it came from.

## Source documents used

| Source | Used for |
|---|---|
| SSC statement of marks (2015) | Education timeline — SSC node |
| HSC statement of marks (2017) | Education timeline — HSC node |
| KSV Semester I–VIII statements of marks (2018–2021) | Education timeline — B.E. node; SPI chart data |
| Certification badge URLs (prompt) | Certifications & Badges grid |
| Uploaded profile photograph | Hero photo |

---

## `index.html`

| Content | Section (`id`) | Line(s) | Status |
|---|---|---|---|
| Photo, name, tagline, location, phone, email, social row | `<header class="resume-header" id="top">` | 20–41 | ✅ Auto-populated (Ahmedabad, Gujarat · +91 704******3 · preetsai2202@gmail.com · LinkedIn/GitHub/Credly) |
| Sticky nav | `<nav class="site-nav">` | 44–58 | ✅ Fixed structure, no edits needed |
| About summary + quick facts | `#about` | 70–99 | ✅ Auto-populated |
| Experience | `#experience` | 110–139 | ⬜ Placeholder — manual entry, README 1 §3 |
| Education timeline (SSC / HSC / B.E.) | `#education` → `.edu-timeline` | 161–202 | ✅ Auto-populated from marksheets |
| SPI performance chart (SVG) | `#education` → `.spi-chart-wrap` | 204–228 | ✅ Auto-populated; live data in `script.js` |
| "Other Certificates" accordion | `#education` → `.accordion` | 230–241 | ⬜ Placeholder links — replace `REPLACE_WITH_FILE_ID`, README 1 §1 |
| Skills | `#skills` | 243–272 | ⬜ Placeholder — manual entry, README 1 §4 |
| Cloud Resume Challenge project (this site) | `#projects` | 274–309 | ✅ Auto-populated — original description of this build's actual AWS/Netlify deployment (see note below) |
| Oracle badge grid + lightbox | `#certifications` → `.badge-grid`, `#badge-modal` | 321–390 | ✅ Auto-populated from your 5 certification URLs; placeholder SVG icons — swap for real badge art per README 1 §7a |
| Interests | `#interests` | 393–417 | ⬜ Placeholder — manual entry, README 1 §6 |
| Contact details | `#contact` | 421–446 | ✅ Auto-populated (email, phone, LinkedIn, GitHub) |

---

## `styles.css`

| Content | Location | Notes |
|---|---|---|
| Color palette (accent blue, slate backgrounds) | `:root { ... }`, lines 1–33 | Change `--accent` / `--accent-strong` to retheme site-wide |
| Typography (Space Grotesk / Inter / JetBrains Mono) | `:root { ... }`, `--font-*` variables | Loaded via Google Fonts `<link>` in `index.html` `<head>` |
| Hero layout | `.hero`, `.hero-*` | Two-column grid; collapses to single column under 900px |
| Education timeline styling | `.edu-timeline`, `.edu-node*` | Vertical node/marker pattern |
| SPI chart styling | `.spi-chart*`, `.spi-line`, `.spi-point`, `.spi-legend` | Line-draw animation on scroll into view |
| Accordion styling | `.accordion*` | Height/opacity handled by `[hidden]` attribute + JS, not CSS transition, for accessibility |
| Certification card grid | `.cert-grid`, `.cert-card*` | 3-column desktop → 2 → 1 column responsive |
| Responsive breakpoints | Scattered `@media` blocks throughout | Primary breakpoints: 900px, 860px, 760px, 700px, 600px |

---

## `script.js`

| Behavior | Function / block | Notes |
|---|---|---|
| Footer year | top of file | Auto-updates, no manual edits needed |
| Mobile nav open/close | Mobile navigation toggle block | Toggles `.open` class + `aria-expanded` |
| Active nav-link highlighting | Active nav-link tracking block | `IntersectionObserver` watching each section |
| Scroll-reveal animations | Scroll-reveal block | Applies `.reveal` / `.in-view` classes to headers and cards |
| "Other Certificates" accordion logic | Accordion block | Toggles `aria-expanded` + `hidden` attribute |
| **`spiData` array** | SPI chart block | **The single source of truth for the semester chart.** Each entry is `{ sem: "Sem N", spi: X.XX }`, pulled directly from the SPI figures on each semester's Statement of Marks. Edit this array (and nowhere else) to add Semester 9, correct a value, or extend the chart in the future. |
| Chart geometry / point plotting | `xFor()`, `yFor()`, SPI chart block | Maps `spiData` values onto the SVG `<path>` coordinates already drawn in `index.html`. If you change the SVG `viewBox` or gridline positions, update `chartX0/X1/Y*` and `scaleMin/Max` here to match. |

---

## A note on the Projects section

The Cloud Resume Challenge project text was **not** copied from the
Rahul Patel reference site — that paragraph is his own original
description of his own project, and reusing it verbatim would have meant
presenting someone else's work as yours. Instead, the current copy is an
original write-up describing the actual AWS S3 + CloudFront and
GitHub + Netlify deployment paths documented in README 2 and README 3 for
*this* site. If the details don't match what you actually built (e.g. you
didn't set up both hosting paths, or used different AWS services), edit
the paragraph and tag list in `#projects` to match your real work.

## Certification badge images

The five Oracle badges use placeholder SVG medallions
(`assets/images/badges/*.svg`) rather than pulled-in images, because
Oracle and Credly don't expose a stable public image URL per badge — see
README 1, Section 7a, for how to swap in your real downloaded badge
graphics.
