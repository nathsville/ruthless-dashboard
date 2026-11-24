# Inventaris route demo

Target: `https://demos.shadcndashboard.dev`.

75 route unik dari sidebar sudah dikunjungi dalam analisis. Status di bawah adalah **survei state awal**, bukan seluruh state/fitur telah diuji. Screenshot rute selain root bernama `.playwright-mcp/recon` + pathname dengan `/` diganti `-` + `.png`. Untuk dashboard, utamakan screenshot `settled-`.

## Dashboard (8)

- `/` — Analytics.
- `/dashboards/ecommerce`
- `/dashboards/modern`
- `/dashboards/saas-ai`
- `/dashboards/school`
- `/dashboards/health`
- `/dashboards/restaurant`
- `/dashboards/logistics`

## Aplikasi (28)

- `/apps/chat-ai` — history, starter prompt, composer dan opsi.
- `/apps/image-ai` — prompt, aspect/style/tone/lighting/camera dan recent images.
- `/apps/calendar` — Month/Week/Day/Agenda, Today/Back/Next dan event.
- `/apps/chats` — chat list, conversation, composer, media dan attachments; dicek ulang setelah API selesai.
- `/apps/email` — folder/label, daftar, reader, attachment, Reply/Forward dan compose modal; dicek ulang setelah API selesai.
- `/apps/notes` — search/list, editor, warna dan add-note dialog.
- `/apps/contacts` — kategori/list/detail, edit/delete controls dan add-contact dialog.
- `/apps/invoice/list` — summary, tabs status, search/date filters, table/pagination.
- `/apps/invoice/detail/PineappleInc` — invoice, item, tax, download/print/send controls.
- `/apps/invoice/create` — bill parties, dates, item rows, totals dan create/cancel.
- `/apps/invoice/edit/PineappleInc` — prefilled invoice editor; dicek ulang setelah API selesai.
- `/apps/user-profile/profile` — cover/stats, introduction, photos, post composer/feed/comments.
- `/apps/user-profile/followers` — 21 followers, search dan follow controls.
- `/apps/user-profile/friends` — friend cards, job labels, search.
- `/apps/user-profile/gallery` — 12 image cards, nama/tanggal, search.
- `/apps/blog/post` — featured/article cards, categories/read time/comments/views.
- `/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow` — detail, rich text, comments.
- `/apps/blog/edit` — prefilled title/content/image/category/tags/status/date.
- `/apps/blog/create` — editor toolbar, image dropzone, metadata.
- `/apps/blog/manage-blog` — category filter, table, published switch dan row actions.
- `/apps/ecommerce/shop` — category/sort/gender/price/color filters dan product grid.
- `/apps/ecommerce/detail/3` — image/detail, variant/quantity, cart/buy, description/reviews, related products.
- `/apps/ecommerce/list` — searchable product table dengan stock status dan actions.
- `/apps/ecommerce/checkout` — Cart/Billing/Payment stepper, summary dan Previous/Next; state awal cart kosong.
- `/apps/ecommerce/addproduct` — rich editor, media, variations, pricing/tax, thumbnail, status/category/template.
- `/apps/ecommerce/editproduct` — prefilled product editor dan reviews.
- `/apps/kanban` — empat board/list, priority labels, task cards, add-list dialog.
- `/apps/tickets` — summary status, search, ticket table dan create control.

## Tabel Shadcn (4)

- `/shadcn-tables/basic`
- `/shadcn-tables/striped-row`
- `/shadcn-tables/hover-table`
- `/shadcn-tables/checkbox-table`

## Tabel React/TanStack (14)

- `/react-tables/user-datatable` — roles/filter, create inline row editor, selection dan pagination.
- `/react-tables/order-datatable` — summary KPI, per-column filters/date/status, row actions/pagination.
- `/react-tables/basic`
- `/react-tables/dense` — Toggle Density.
- `/react-tables/sorting`
- `/react-tables/filtering`
- `/react-tables/pagination`
- `/react-tables/row-selection`
- `/react-tables/columnvisibility`
- `/react-tables/editable`
- `/react-tables/sticky`
- `/react-tables/drag-drop` — contoh row dan column DnD.
- `/react-tables/empty`
- `/react-tables/expanding`

## Theme pages (10)

- `/theme-pages/account-settings` — Account/Notification/Bills/Security; initial Account berisi profile/password/personal details.
- `/theme-pages/faq` — accordion dan contact CTA.
- `/theme-pages/pricing` — Monthly/Yearly, Silver/Bronze/Gold.
- `/theme-pages/casl` — Admin/Manager/Subscriber dan permission-sensitive actions.
- `/theme-pages/inetegration` — sembilan integration cards, switches, add dan details dialog. Ejaan path ini memang dari target.
- `/theme-pages/apikey` — tiga key demo, copy/status/switch/actions/generate.
- `/theme-pages/empty-page/empty-1` — No Projects Yet.
- `/theme-pages/empty-page/empty-2` — starting-point cards.
- `/theme-pages/empty-page/empty-3` — access blocked.
- `/theme-pages/empty-page/empty-4` — offline.

## Icons (1)

- `/icons/iconify`

## Auth (10)

- `/auth/error`
- `/auth/auth1/login`
- `/auth/auth2/login`
- `/auth/auth1/register`
- `/auth/auth2/register`
- `/auth/auth1/forgot-password`
- `/auth/auth2/forgot-password`
- `/auth/auth1/two-steps`
- `/auth/auth2/two-steps`
- `/auth/maintenance`

Auth1 memakai split/side composition dengan ilustrasi dan pesan Welcome Back. Auth2 memakai boxed form. Halaman error/maintenance tidak memakai shell dashboard. Social login, submission, recovery, OTP dan resend tidak dijalankan.

## Tautan eksternal yang diinventarisasi, bukan seluruhnya diaudit

Menu berikut memakai basis `https://shadcn-dashboard-com.vercel.app`; satu contoh Button redirect ke `https://shadcndashboard.dev/components/button` dan dikonfirmasi sebagai galeri komponen terpisah:

- `/components/button`, `/avatar`, `/badge`, `/tooltip`, `/input`, `/textarea`, `/switch`, `/tab`, `/select`, `/checkbox`, `/accordion`, `/card`, `/radio-group`, `/calendar` (masing-masing di bawah `/components`).
- `/components/area-chart`, `/bar-chart`, `/line-chart`, `/pie-chart`, `/radar-chart`, `/radialbar-chart` (masing-masing di bawah `/components`).
- `/ui-blocks/forms`, termasuk anchor `#forms-04`, `#forms-07`, `#forms-08`, `#forms-09`.
- `/ui-blocks/card`, `/ui-blocks/chart`.
- Footer Blog/License juga menuju website utama, bukan route demo internal.
- Tautan vendor About Us/brand dan Buy Now tidak diikuti untuk transaksi.

## Catatan hitungan

8 dashboard + 28 aplikasi + 4 tabel Shadcn + 14 tabel React + 10 theme pages + 1 icons + 10 auth = **75**. Tautan duplikat logo/Analytics/Help Center tidak dihitung dua kali. `#` dan anchor menu nesting bukan route baru. Route detail lain yang baru muncul setelah interaksi/data belum diinventarisasi seluruhnya.
