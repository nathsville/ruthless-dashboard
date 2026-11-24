# RUTHLESS dashboard

An editable React + TypeScript recreation of the public **Shadcn Dashboard** demo at
`https://demos.shadcndashboard.dev/?mode=dark`, rebranded as **RUTHLESS dashboard**.

This is a frontend reconstruction with local demo data, not the original product and
not affiliated with the reference authors. It does not ship a backend, authentication,
payments, email delivery, live integrations, or AI generation.

## At a glance

- **Primary visual target:** Analytics dashboard, dark Vega theme, LTR, vertical boxed
  layout at `1440 × 1000`.
- **Scope:** 75 internal routes: 8 dashboards, 28 apps, 4 shadcn table variants,
  14 React table variants, 10 theme pages, 1 icon gallery, and 10 auth/error pages.
- **Stack:** React 19, TypeScript, Vite 7, React Router 7, Recharts 3, Lucide,
  `lottie-react`, and a local CSS design system.
- **State:** persisted in `localStorage` under `ruthless.*` keys.
- **Build:** `npm run build` passes (see the known warnings below).

## Run locally

Requirements: Node.js `20.19+` or `22.12+` (Vite 7 requirement) and npm.

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173/` by default. To create and inspect the
production build:

```bash
npm run build
npm run preview
```

The production build emits `dist/`.

## Deployment

- **Production:** <https://ruthless-dashboard-eight.vercel.app>
- **Vercel project:** `ruthless5/ruthless-dashboard`
- **SPA routing:** `vercel.json` rewrites unmatched paths to `index.html`, so React Router
  deep links such as `/dashboards/health` and `/apps/invoice/list` load directly.

Redeploy from this linked directory with:

```bash
npx vercel@latest deploy --prod --yes
```

The generated `.vercel/` link and `.env.local` are ignored by git; the latter contains a
Vercel OIDC token and must not be committed.

> Build warnings are expected but non-fatal: `lottie-web` uses `eval` internally, the
> main JS chunk is about 1.92 MB uncompressed, and `Dashboards.tsx` is both statically
> and dynamically imported by `App.tsx`.

## Demo behavior and boundaries

- **Local only.** There are no application API calls or external data requests. Runtime
  JSON fetches are limited to the local Lottie emoji under `/animations/emoji/`.
- **Persistence.** Theme, cart, invoices, contacts, notes, kanban, blog/social posts,
  table rows, profile/notification preferences, sidebar state, and demo auth state persist
  in `localStorage` under `ruthless.*`. The auth state is a local demo marker only; it is
  not real authentication.
- **Checkout.** Adding to cart, editing quantities, reload persistence, the cart drawer,
  the three checkout steps, order confirmation, and cart clearing work locally. No payment
  is collected and the UI says so.
- **Invoices.** Creating or editing an invoice writes first to browser storage, then opens
  the detail view. “Download” produces a local text file; print actions use the browser's
  print dialog.
- **Email, AI, and integrations.** These screens are local demonstrations. Sending mail,
  generating images/AI responses, and provider credentials are simulated and never sent to
  a server.
- **Other apps.** Calendar, chats, notes, contacts, kanban, tickets, blog, shop, and table
  demos use local seed data and functional client-side controls; they are not production
  integrations.

To reset the demo to its seeded state, run this in DevTools and reload:

```js
Object.keys(localStorage)
  .filter((key) => key.startsWith("ruthless."))
  .forEach((key) => localStorage.removeItem(key));
location.reload();
```

## Routes

The complete route survey and initial-state coverage live in [`ROUTES.md`](ROUTES.md).
Highlights:

| Area | Routes |
| --- | --- |
| Dashboards | `/`, `/dashboards/ecommerce`, `/dashboards/modern`, `/dashboards/saas-ai`, `/dashboards/school`, `/dashboards/health`, `/dashboards/restaurant`, `/dashboards/logistics` |
| Commerce | `/apps/ecommerce/shop`, `/apps/ecommerce/list`, `/apps/ecommerce/detail/3`, `/apps/ecommerce/checkout`, `/apps/ecommerce/addproduct`, `/apps/ecommerce/editproduct` |
| Invoices | `/apps/invoice/list`, `/apps/invoice/create`, `/apps/invoice/detail/:key`, `/apps/invoice/edit/:key` |
| Work apps | `/apps/chat-ai`, `/apps/image-ai`, `/apps/calendar`, `/apps/chats`, `/apps/email`, `/apps/notes`, `/apps/contacts`, `/apps/kanban`, `/apps/tickets` |
| Tables | `/shadcn-tables/*`, `/react-tables/*` |
| Theme pages | `/theme-pages/account-settings`, `/faq`, `/pricing`, `/casl`, `/inetegration`, `/apikey`, empty pages |
| Auth | `/auth/auth1/*`, `/auth/auth2/*`, `/auth/error`, `/auth/maintenance` |

## Verification performed

QA was run on **2026-11-19** against the local dev server in Playwright Chromium at
`1440 × 1000` and `390 × 844`.

| Check | Result |
| --- | --- |
| Production build | **Pass** (`tsc -b && vite build`); warnings listed above |
| Route smoke test | **All 75 route paths reached** without hitting the React error boundary; interior pages were visually sampled, not pixel-matched |
| Analytics geometry | Page height **1502 px vs reference 1501 px**; header checkbox y **1043.8**, row checkbox y **1096.3** (both match target); table columns within **0.5 px**; KPI outer height **141.3 px** |
| Header/cart/notification polish | Notification dot exact at 10 × 10, `#f43f5e`; header cart badge intentionally absent; spinning customizer center matches the reference |
| Header search | Route-aware search returns the four invoice routes with contextual labels |
| Theme customizer | Light/dark, LTR/RTL, vertical/horizontal, style tiles, and color pickers switch correctly; light mode persisted across reload, while RTL and horizontal were verified in-session |
| Tables | Sorting, select-all/row selection, pagination, page size, filtering, and the preserved eCommerce counter quirk work |
| Cart/checkout | Add to cart → reload persistence → cart drawer → billing/address → payment → demo order; cart clears and a local receipt is available |
| Invoices | Create → detail → list with persisted row; dynamic invoice detail title is contextual |
| Mobile `390` | No page-level horizontal overflow; sidebar opens as a 281 px sheet; table keeps internal horizontal scrolling; hero overlap is intentionally preserved |
| Console | No app errors observed; only the Vite React DevTools development message and a browser accessibility notice about password fields |

Comparison and QA images are in `.playwright-mcp/`:

- `local-top-v8.png`, `local-bottom-v8.png` — final local Analytics, dark Vega.
- `ref-top-v7.png`, `ref-bottom-v7.png` — reference captures used for comparison.
- `local-mobile-top.png`, `local-mobile-sidebar.png`, `local-mobile-bottom.png`.
- `local-light-page-v2.png`, `local-rtl.png`, `local-horizontal-v3.png`,
  `local-customizer-v3.png`, `local-checkout-complete.png`.

This is not a claim of pixel-perfect parity for every route and every state. Interior
pages were reconstructed from the route survey and are visually sampled, not pixel-matched
page by page. See [DESIGN.md](DESIGN.md) for the design system and detailed deviations.

## Preserved reference quirks

These are deliberate, not accidental regressions:

- **Price sorting is string-based.** `$1,499.00` can sort before `$199.00`. The final order
  flips on the second click.
- **eCommerce “Recent Sales Orders” counter is broken.** The table shows five rows with
  `1-4 of 4` and a page-size value of `5`.
- **`X/Twiter`** is spelled as in the reference campaign list.
- **`/theme-pages/inetegration`** keeps the reference route typo.
- **Mobile hero overlap.** The dark hero illustration still overlaps some copy and the
  “View Full Report” button at narrow widths.
- **Component gallery links** are mapped to the local Library page instead of an external
  gallery, so the demo remains self-contained.
- **Greeting/date behavior** is dynamic: the greeting follows the local hour, while footer
  copyright is the reference's `© 2026`.

## Deliberate deviations and known limits

- **Search is intentionally more useful than the reference.** The reference search behaved
  as a component/gallery search and returned `No Components Found!` for common route
  queries. This build searches route labels and paths so all internal routes can be found;
  the empty-state copy is retained.
- **Cart seed data differs.** The reference drawer carried three demo products. This build
  starts with an empty cart so the add-to-cart → checkout flow is unambiguous and local.
- **Non-default customizer styles are approximations.** The seven style presets switch
  radius/control/density tokens, but the reference's per-style geometry was not exhaustively
  re-measured across every component. Vega is the verified target. Light, RTL, horizontal,
  and boxed/full were smoke-tested; every 7 × 2 × 2 × 2 combination was not.
- **Horizontal navigation** includes the reference's category order, icons, and brand, but
  dropdown content is a local route menu rather than the reference's full nested menu.
- **Data and copy.** Analytics values and headline data mirror the measured reference.
  Other dashboards/apps use representative local data. The reference's live dates, relative
  times, filler copy, and some seeded values can differ between captures.
- **Assets.** Public reference assets were downloaded so the demo remains visually close:
  Geist WOFF2, flags, illustrations, avatars, product/blog images, and Lottie emoji.
  The RUTHLESS wordmark/logo is a replacement; campaign brand marks (Instagram, Google,
  Facebook, X) are retained as third-party identifiers for the demo. See
  [`ASSET-PROVENANCE.json`](ASSET-PROVENANCE.json) for sources. Redistribution licensing is
  the user's responsibility.
- **No full browser/accessibility matrix.** QA used Chromium through Playwright. Safari,
  Firefox, real touch hardware, every keyboard path, and the full accessibility tree were
  not audited. Reduced-motion support is partial, like the reference: page/card/table
  animations are disabled, but the spinning customizer and notification ping remain.

## Project structure

```text
src/
  App.tsx                  routes, page titles, lazy loading, error boundary
  main.tsx                 React entry
  state.tsx                theme/cart/toast context and localStorage persistence
  data.ts                  navigation, route inventory, seed/demo data
  styles.css               design tokens, layout, responsive rules, motion
  ui.tsx                   local UI primitives, icons, dialogs, menus, tables
  components/
    Shell.tsx              sidebar, header, search, drawers, footer, floating actions
    Charts.tsx             Recharts sales chart, ring legend, mini charts
    DataTable.tsx          sorting, filtering, selection, pagination, CSV export
    BrandIcons.tsx         exact-path campaign brand SVGs
  pages/                   dashboards, work apps, commerce, invoices, tables, etc.
public/                    local images, fonts, animations, favicons
scripts/assets.mjs         reference-asset acquisition script
ANALYSIS.md                measured reference specification
ROUTES.md                  75-route inventory and coverage notes
DESIGN.md                  visual system, motion, responsive and fidelity notes
```

## Credits

Reference design and public demo: **Shadcn Dashboard / shadcnspace** (external project).
All reference-derived images, fonts, and marks remain the property of their respective
owners. This reconstruction is for the requested demo/rebranding exercise; verify asset
licensing before public redistribution.
