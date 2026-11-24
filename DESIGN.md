# Design notes — RUTHLESS dashboard

This document records the visual system and fidelity decisions behind the RUTHLESS
dashboard reconstruction. The measured reference specification is in
[`ANALYSIS.md`](ANALYSIS.md); the route inventory is in [`ROUTES.md`](ROUTES.md).

## Design intent

The default experience is the reference's **dark Vega** identity: near-black surfaces,
fine light borders, compact 14 px UI typography, a 256 px sidebar, a restrained card
radius, and motion that is visible but calm. The brand name and identity are replaced with
**RUTHLESS dashboard**; the layout, information density, chart language, and interaction
patterns are retained.

The primary comparison state is:

- viewport **1440 × 1000**
- `mode=dark`, theme style **Vega**
- LTR, vertical sidebar, boxed content
- sidebar expanded
- local time giving the “Good Morning” greeting in the recorded baseline

## Design tokens

### Color

| Token | Dark default | Light |
| --- | --- | --- |
| Background | `#0a0a0a` | `#ffffff` |
| Foreground | `#fafafa` | `#171717` |
| Sidebar | `#171717` | `#fafafa` |
| Card / main surface | `#0a0a0a` | `#ffffff` |
| Popover | `#171717` | `#ffffff` |
| Primary | `#e5e5e5` | `#171717` |
| Muted | `#262626` | `#f0f0f0` |
| Muted foreground | `#a1a1a1` | `#737373` |
| Border | `#ffffff1a` | `#0000001a` |
| Input border | `#ffffff26` | `#00000026` |
| Positive | `#009966` | `#009966` |
| Orange status | `#f54a00` | `#f54a00` |
| Red/pink status | `#ff0053` | `#ff0053` |

Accent-specific values used by the reference and retained in components:

- Upgrade / Buy Now / primary demo CTA: `#00d5be` background, `#022f2e` text.
- Success, running, and stopped badges: `#10b981`, `#f97316`, `#f43f5e` at low-opacity
  tinted backgrounds.
- Notification dot: `#f43f5e`, 10 × 10 px.
- Rating stars: `#f97316`, with 40% opacity empty stars.
- Chart series: primary foreground mixed at 100%, 60%, and 20% opacity.

The reference's `--card` token is `#171717`, but most Analytics cards override their
surface to the page background (`#0a0a0a`). The build follows that computed result rather
than applying the token blindly.

### Typography

- **Geist variable** is loaded locally from `/fonts/geist-latin.woff2`, with Arial and a
  sans-serif fallback. The reference font is not replaced with Inter or a system default.
- Root/UI size: **14 / 20 px**. Body copy elsewhere: 16 / 24 px.
- Greeting: 20 / 28 px, weight 500.
- Card titles: 16 / 24 px, weight 500.
- KPI values: 24 / 32 px, weight 600.
- Small labels, ticks, and captions: 12 px.
- Ring center label: about 11 px; ring total: 22 px.
- Table header around 40 px; Analytics product rows about 64.7 px.

### Geometry and density

| Property | Value / behavior |
| --- | --- |
| Card radius, Vega | 14 px |
| Form-control radius | 8 px |
| Base control height | 36 px |
| Analytics range select | 37.3 px measured |
| Header height | 56 px |
| Sidebar expanded | 256 px |
| Sidebar collapsed | 48 px |
| Page inset | 8 px |
| Content padding | 16 px |
| Grid gap | 16 px |
| Analytics hero / insight cards | 230 px tall |
| KPI cards | 141.3 px outer height |
| Campaign / product-table row area | about 442 px tall |

The main content uses a 12-column grid. At the verified desktop width the Analytics stack
is:

1. **Hero 8 + Key Insights 4**
2. **Sales Overview 8 + Sales Distribution 4**
3. **Weekly sales 4 + New users 4 + Purchase Orders 4**
4. **Campaign Performance 4 + Top Selling Products 8**

The footer sits below that stack. The Buy Now action and the customizer gear are fixed
overlays, not page-flow elements.

## Shell design

### Sidebar

- RUTHLESS logo/favicon and version chip; the reference wordmark is replaced by the
  RUTHLESS identity.
- Independently scrollable navigation. The visible first viewport intentionally ends with
  the lower Apps links clipped, as in the reference capture.
- Section labels are uppercase and muted; active navigation has a light filled pill with
  dark text and icon.
- Hover triggers the SVG stroke-draw effect only when reduced motion is not requested.
- Pinned lower region: Basic Plan card with a 70% ring/progress treatment, usage copy
  (`68/100 monthly limit used`), turquoise Upgrade CTA, Help Center, and Documentation.
- On mobile the same content becomes a 281 px left sheet with a dimmed, blurred backdrop.

### Header

Left-to-right at desktop: sidebar toggle, separator, search field, then the right-side
utility controls (theme toggle, UK flag/language menu, cart, notification bell with ping
dot, inbox, profile avatar).

- Header is sticky, 56 px tall, with a hairline bottom border.
- Search is a quiet bordered input; its dropdown uses the local search results panel.
- Icon buttons are circular/quiet, with accessible labels.
- The final reference capture used for this build had **no cart count badge**, so no badge
  is shown in the header.
- The profile/menu overlays use the same right-side sheet vocabulary as the reference:
  384 px panel, blurred overlay, 200 ms entrance.

### Footer and fixed actions

- Footer: `© 2026 by RUTHLESS dashboard, creating a better web for you.` plus About Us,
  Blog, and License links.
- Buy Now uses the turquoise CTA treatment; the customizer gear is a 58 px circular button
  whose visual center matches the reference. It rotates continuously at 1 s per turn, so
  its measured bounding box changes with the rotation angle.

## Analytics composition

### Hero and greeting

- Time-aware greeting: Good Morning (05:00–11:59), Good Afternoon (12:00–16:59),
  Good Evening (17:00–20:59), Good Night otherwise.
- Local sun/moon Lottie emoji (about 28 px) loops beside the greeting.
- The hero includes the measured two-line message and a 40 px “View Full Report” button.
- The human-at-desk illustration uses the reference light/dark assets. At 390 px it
  intentionally overlaps text and the CTA, preserving the reference's asymmetric
  light/dark image behavior.

### Key Insights

- 52 thin vertical bars, composed as 60% Asia, 25% USA, and 15% Europe, at primary,
  60%, and 20% emphasis.
- Bars grow upward from the baseline with a 500 ms entrance and a 12 ms-per-bar stagger.
- Value `$20,320`, `+40%`, comparison copy, and the three-region legend are laid out above
  and below the bar strip.

### Sales Overview

- Stacked bar chart, 12 observations on the default “Last 30 Days” range.
- Y-axis 0–30k in 5k steps; bar width 30 px; custom rounded SVG geometry rather than a
  generic border radius.
- Three series use the primary/60%/20% relationship. Recharts bars animate for 700 ms
  ease-out with series starts at 0, 120, and 240 ms.
- Range select supports 7/30/90 days. Header includes a positive `+18.0%` badge.
- Custom tooltip styling matches the dark card/popover treatment.

### Sales Distribution

- 60 radial ticks with staggered fade-in.
- Center wallet icon, “TOTAL REVENUE,” and `$284,920.00`.
- Legend rows include color mark, label, value, and positive growth percentage.
- Hover on legend rows keeps the 200 ms, 1.01 scale reference behavior.

### KPI cards

Weekly sales `714k`, New users `1.35m`, Purchase Orders `1.72m`, each with a percentage
chip, line icon, and “See Statistics” action. These cards are the reference's 141.3 px
height and use the same card padding, header rhythm, and arrow treatment as the larger
cards.

### Campaign Performance

Four rows: Instagram, Google, Facebook, and the intentionally retained **X/Twiter**. Brand
marks use the exact reference SVG paths in `src/components/BrandIcons.tsx`. Status badges:

- Completed: green tint.
- Running: orange tint.
- Stopped: pink/red tint.

The “See Report” footer button is 36 px high with a 6 px gap, matching the measured
reference geometry.

### Top Selling Products

- Four visible products with the reference names/prices and intentionally mismatched demo
  descriptions.
- 16 px row selection boxes, header select-all, 16 px muted sort icons that become white
  on the active column, orange 16 px stars, and compact status badges.
- The Action menu opens a local Add/Edit/Delete menu; the reference did not demonstrate
  fully working CRUD from that menu.
- Sorting, pagination, and the page-size select are functional. The **price sort is
  deliberately lexical** to preserve the reference ordering bug.
- The eCommerce dashboard's separate Recent Sales Orders table deliberately displays
  `1-4 of 4` while rendering five rows, another preserved reference quirk.

## Shared components

- **Cards:** 14 px Vega radius, one-pixel translucent border, flat surfaces without large
  shadows. Header/card-body padding is tuned per density rather than uniformly enlarged.
- **Buttons:** white/gray primary in dark mode, dark primary in light mode, turquoise
  special CTA, quiet ghost/secondary treatments, 8 px control radius.
- **Tables:** semantic `thead`/`tbody`, sort buttons with `aria-sort`, native checkboxes
  with accessible names, internal scroll containers on mobile, and consistent pagination.
- **Selects and menus:** custom popovers, keyboard arrow support, Escape/outside-click
  close, and staggered menu item entrances.
- **Icons:** Lucide for product UI; a custom exact-path Handbag SVG; campaign marks are
  separate exact-path SVGs.
- **Charts:** Recharts for the stacked/line charts plus local SVG for ring ticks, KPI
  spark/strip treatments, and layout-specific geometry.

## Motion system

| Motion | Implementation |
| --- | --- |
| Route fade | opacity 0→1, **350 ms**, `cubic-bezier(.22,1,.36,1)` |
| Page blocks | opacity 0→1, blur 8→0, translateY 10→0, **500 ms**, same ease, backwards; delay `min(index,10) × 60 ms` |
| Insight bars | scaleY 0→1 + opacity, **500 ms**, delay `200 + 12 × index ms` |
| Ring ticks | opacity fade, **400 ms** ease-out, delay `200 + 12 × index ms` |
| Recharts bars | **700 ms** ease-out, series starts 0/120/240 ms |
| Horizontal bars | scaleX 0→1, **600 ms** |
| Nav icon draw | dash offset 100→0, **800 ms** ease-out, hover only with motion allowed |
| Menu/dropdown items | opacity + blur 2 px + translateY −4 px, **350 ms**, staggered |
| Menu container | about **100 ms** popup |
| Drawer | opacity + 40 px translate, **200 ms** ease-in-out, full-screen blurred overlay |
| Notification ping | **1 s** infinite, scale to 2 + fade |
| Customizer gear | **1 s linear infinite** 360° rotation |
| Loader | 1 s linear spin |

Reduced-motion handling is intentionally partial, mirroring the reference rather than
claiming universal support. Page/card/table, tick, storage, notification, and menu entry
animations are disabled under `prefers-reduced-motion: reduce`; the rotating gear and
notification ping remain.

## Responsive behavior

| Range used by this build | Behavior |
| --- | --- |
| ≥ 1280 px | Desktop sidebar; 8/4 Analytics composition; horizontal sidebar remains available |
| 1024–1279 px | Desktop sidebar is replaced by the mobile sheet; content becomes full width; topbar search remains at wider end of range |
| < 1024 px | Analytics card pairs go full width; KPI trio begins stacking at the 1023 px boundary; search can collapse |
| < 768 px | Compact mobile header; hero stacks; KPI cards stack; tables retain internal horizontal scroll; footer stacks |

At 390 × 844 the verified page has no page-level horizontal overflow
(`scrollWidth` stays within the viewport), while the product table keeps its own horizontal
scroller. The intentional hero overlap remains visible.

The exact reference breakpoint between desktop and mobile sidebar was not bisected; the
build uses the measured, safe boundary of 1280 px.

## Theme customizer

The right-side customizer is 384 px wide and includes:

- Seven style presets: Vega, Nova, Maia, Lyra, Mira, Luma, Rhea.
- Light/Dark theme option.
- LTR/RTL direction.
- Two circular color pickers with pencil affordances; no visible “Primary/Secondary”
  labels, matching the reference sheet.
- Vertical/Horizontal layout.
- Boxed/Full container width.

The style presets switch card and control geometry tokens:

| Style | Card radius | Control radius | Control height |
| --- | --- | --- | --- |
| Vega | 14 px | 8 px | 36 px |
| Nova | 16.8 px | 12 px | 36 px |
| Maia | 18 px | 26 px | 40 px |
| Lyra | 0 px | 8 px | 36 px |
| Mira | 10 px | 8 px | 32 px |
| Luma | 26 px | 26 px | 40 px |
| Rhea | 24 px | 18 px | 36 px |

Vega is the re-measured target. The other presets reproduce the reference's radius/height
vocabulary but were not exhaustively pixel-audited across every component.

Horizontal layout includes the reference's brand placement, category order, icons, and
Dashboard pill styling, and keeps the same fixed actions. RTL mirrors the sidebar and
content. The customizer gear always spins, so a normal pointer click can be unstable; this
is copied from the reference and controlled with pointer-safe styling.

## Accessibility and interaction notes

- A visible-on-focus “Skip to content” link targets `#main-content`.
- Icon-only header/drawer controls have accessible labels; dialogs use `role="dialog"`,
  `aria-modal`, and a focus trap with Escape/outside-click close.
- Table sorting sets `aria-sort`; sort controls are buttons; pagination labels are explicit.
- Inputs use labels or accessible placeholder/label attributes; native validation remains
  where it is part of the form.
- Light/dark theme updates `color-scheme` and root classes; direction updates `dir`.
- Focus trapping, keyboard traversal of every app surface, and full WCAG contrast/screen
  reader verification were not part of this scope. Treat accessibility as improved demo
  quality, not a certified accessible product.

## Fidelity results and deviations

### Verified strengths

- Page height **1502 px** vs reference **1501 px** in the baseline viewport.
- Header checkbox y **1043.8** and first row checkbox y **1096.3** match the target.
- Product table columns within **0.5 px** of the reference measurements.
- KPI outer height **141.3 px** matches.
- Campaign card top **974.7 px**, See Report button **36 px** high at the verified
  coordinate; the Instagram row is within **0.7 px**.
- Sales ring legend at approximately **x 628.6 / y 428.7** vs reference
  **x 628.1 / y 429.3**; range select at **y 420 / 37.3 px** vs reference
  **y 420.7 / 37.3 px**.
- Notification dot at **x 1302 / y 20.7**, 10 × 10, `#f43f5e`, matching the capture.
- Customizer gear visual center aligns with the reference; its measured box rotates.
- eCommerce counter bug preserved: five rows, `1-4 of 4`.

### Remaining differences and intentional choices

1. **Interior routes are reconstructions, not per-page pixel matches.** All 75 route paths
   load; primary interactions were sampled on representative routes. Only Analytics was the
   primary measured visual target. Other dashboards/apps use local datasets and
   representative component choices.
2. **Search is route-aware.** The public reference's header search is component/gallery
   search and returns no internal route results for “invoice.” This build filters route
   labels and paths and shows contextual labels such as “Invoice Details.” This is a
   disclosed usability improvement.
3. **Cart starts empty.** The reference drawer contained seeded demo products. Emptying it
   makes the local add-to-cart → checkout story coherent. Checkout and invoices are local
   demonstrations, not real transactions.
4. **Non-default customizer states are approximate.** Light, RTL, horizontal, and style
   switching are functional and smoke-tested; every combination and per-style pixel
   geometry is not claimed.
5. **Horizontal dropdown menus are simpler.** Category order, icons, brand, and pill
   styling follow the reference, but the nested menu contents are a flattened local route
   menu.
6. **Assets and mark.** The RUTHLESS logo is a new replacement mark. Reference images,
   Geist font, and campaign brand marks come from the public target; licensing is the
   user's responsibility.
7. **Sub-pixel drift remains.** Some main-content blocks are about 0.6–0.7 px above the
   reference, and the page is 1 px taller. These are within the stated tolerance for a
   screenshot-based reconstruction, not a claim of mathematical pixel identity.
8. **No full cross-browser claim.** Verification used Playwright Chromium; Safari,
   Firefox, physical touch, and complete assistive-technology testing were not performed.

## Evidence

- `ANALYSIS.md` — measured tokens, layout, motion, interactions, and known reference
  uncertainties.
- `ROUTES.md` — 75-route inventory and initial-state coverage.
- `.playwright-mcp/local-top-v8.png` / `local-bottom-v8.png` — final dark Vega captures.
- `.playwright-mcp/ref-top-v7.png` / `ref-bottom-v7.png` — comparison captures.
- `.playwright-mcp/local-mobile-*.png` — 390 px mobile QA.
- `.playwright-mcp/local-light-page-v2.png`, `local-rtl.png`,
  `local-horizontal-v3.png`, `local-customizer-v3.png` — theme/layout QA.
- `.playwright-mcp/local-checkout-complete.png` — local checkout confirmation.
