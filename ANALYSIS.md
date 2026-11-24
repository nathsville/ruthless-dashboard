# Analisis referensi Shadcn Dashboard — belum diimplementasikan

Target: https://demos.shadcndashboard.dev/?mode=dark

Status: **ANALISIS SAJA. Implementasi menunggu instruksi pengguna.**

## 1. Cakupan dan batas kepastian

- REA dipakai untuk observasi CDP, inventaris halaman/script/resource, dan controlled browser scenario.
- Playwright dipakai untuk navigasi, screenshot, pengukuran computed style, pembacaan CSS/JavaScript publik yang dikirim situs, pengujian state, dan pencatatan animasi runtime.
- Ditemukan dan dikunjungi **75 route internal unik**, termasuk `/`. Ini inventaris tautan sidebar, bukan bukti bahwa tidak ada route lain yang tidak ditautkan.
- Semua 8 dashboard sudah diambil ulang setelah animasi pembuka selesai. Screenshot dengan awalan `settled-` adalah referensi dashboard yang lebih tepat daripada screenshot survei awal `recon-`, yang sebagian tertangkap saat animasi masih berjalan.
- Halaman internal lain disurvei pada state awal. Beberapa modal dan interaksi representatif diuji lebih lanjut. **Tidak semua kombinasi state seluruh aplikasi sudah diuji.**
- Halaman chat, email, dan edit invoice dicek ulang dengan waktu tunggu lebih lama; state kosong pada survei awal ternyata loading, bukan hasil akhir.
- Tautan komponen/form/chart tertentu mengarah ke domain lain. Satu tautan Button dikonfirmasi redirect ke `https://shadcndashboard.dev/components/button`, yaitu galeri komponen terpisah. Seluruh galeri itu belum diaudit.
- Backend produksi, pengiriman email, OAuth, pembayaran, unggah file, generasi AI, serta persistensi CRUD lintas sesi belum diverifikasi. Tidak dilakukan submit, pembelian, penghapusan data, atau pengiriman pesan.
- Tidak ada klaim bahwa hasil analisis ini sudah membuktikan kesamaan 100% semua route/state/browser. Target kesamaan perlu diuji nanti terhadap implementasi yang disetujui.

## 2. Bukti yang disimpan

Semua artefak penelitian ada di `.playwright-mcp/`.

| Artefak | Isi |
| --- | --- |
| `rea-evidence-bundle.json` | Ekspor 5 record REA, sekitar 3 MB; termasuk percobaan scenario yang gagal/parsial agar batas bukti tetap terlihat |
| `analysis-shipped-assets.json` | Tiga stylesheet first-party lengkap yang dimuat Analytics, chunk JavaScript Analytics publik, URL gambar dan font |
| `analysis-design-tokens.json` | Atribut root, token warna, font, ukuran teks/tombol/tabel hasil computed style |
| `analysis-motion-runtime.json` | Log animationstart dan pemanggilan Web Animations API saat Analytics dimuat |
| `analysis-motion-css.json` | Inventaris aturan terkait motion/sidebar yang terbaca melalui CSSOM |
| `analysis-bundle-signatures.json` | Cuplikan penanda library/perilaku pada script publik |
| `settled-analytics.png` | Analytics desktop setelah selesai animasi |
| `settled-dashboards-*.png` | Tujuh dashboard lainnya setelah selesai animasi |
| `recon-*.png` | Screenshot survei 74 route selain root; beberapa merupakan state transisi |
| `analytics-responsive-{1440,768,390}.png` | Analytics pada beberapa lebar viewport |
| `modal-*.png` | State dialog/perubahan setelah tombol yang diuji |
| `analysis-layout-horizontal.png` | Eksperimen layout horizontal dengan customizer masih terbuka |

Evidence REA yang penting:

- `ev_e0d822cf2187d25fbfdc9e252cfaff5c46739d2518abdd956ae55e89630a78f8`: identitas target CDP dan browser.
- `ev_1374a1173af1cf80af5105ee273eee64461fd6787708032406b2a389e45f89a9`: inspeksi pasif Analytics, termasuk DOM, accessibility, script sources, resource dan key penyimpanan. Status policy-filtered/attach-limited; bukan capture semua aktivitas sejak peluncuran.
- `ev_392bec78cdbe6e5a95cf428e151250d4389063b2350b940efa05ee313008c110`: baseline plus percobaan select; gagal karena selector combobox cocok ke dua elemen. Tidak dipakai sebagai bukti sukses interaksi.
- `ev_9a65ccb92e2ee1a2045727632e7c603875909ca72f893ffe666b2d42909b1d83`: pergantian range berhasil sampai state mingguan; langkah collapse gagal karena selector tidak unik. Capture keseluruhan parsial.
- `ev_8588240ce2dbe9e1169b6e58b33daa3b6642ba2f9c6df21041d22bba6260d8c1`: seluruh action range berhasil; accessibility akhir berisi `Last 7 Days` dan `Mon Tue Wed Thu Fri Sat Sun`. Metadata completeness masih menandai event coverage tidak lengkap; tidak digunakan untuk klaim equality.

MCP browser launch awal bermasalah dengan path executable. Penelitian REA dilanjutkan lewat Chrome lokal headless dengan CDP loopback, tanpa mengubah konfigurasi REA/OpenCode. Browser tersebut memakai profil analisis terpisah di direktori temporary OpenCode.

## 3. Struktur teknis yang teramati

- Next.js, React, dan bundel Turbopack terlihat dari `_next/static/chunks`, runtime script dan request RSC.
- CSS menggunakan utilitas Tailwind serta kelas `cn-*`, `data-slot` dan token tema.
- Primitive yang terlihat adalah **Base UI**, bukan asumsi bahwa seluruh komponen memakai Radix: ID `base-ui-*`, atribut dan markup select/menu/dialog mengonfirmasinya.
- Grafik utama menggunakan **Recharts**. Beberapa grafik ring/progress dibuat sebagai SVG kustom; jangan menggantinya dengan donut chart standar.
- Ada SVG Lucide untuk banyak ikon UI dan Iconify untuk ikon brand/social. Request Iconify yang terlihat: Instagram, Google, Facebook, Twitter/X.
- Scroller sidebar dan beberapa panel menggunakan SimpleBar.
- Emoji sapaan menggunakan data animasi Lottie JSON yang dimuat dinamis.
- Wrapper halaman memakai Web Animations API untuk fade; API ini tidak dengan sendirinya membuktikan paket motion tertentu. Jangan mengunci dependensi Framer Motion tanpa bukti lanjutan.
- API yang dikonfirmasi dalam pengecekan ulang: `GET /api/chat`, `GET /api/email`, `GET /api/invoice`, semuanya memberi 200. Data tampilan lain tidak otomatis berarti backend produksi tersedia.
- Request RSC dan prefetch tautan tidak boleh dianggap interaksi pengguna atau endpoint bisnis.

## 4. Identitas visual default

Default yang teramati: `style-vega dark`, `dir=ltr`, tema `CUSTOM_THEME`, layout vertikal, container boxed, card shadow false. Query `mode=dark` menentukan mode referensi. Sebagian pengaturan juga disimpan di localStorage dan query URL.

### Warna

| Token | Nilai tampilan/default |
| --- | --- |
| Background | `#0a0a0a` |
| Foreground | `#fafafa` |
| Sidebar / token card | `#171717` |
| Primary | `#e5e5e5` |
| Muted / accent | `#262626` |
| Muted foreground | `#a1a1a1` |
| Ring | `#737373` |
| Border | putih dengan alpha 10% |
| Input border | putih dengan alpha 15% |

Penting: token `--card` bernilai `#171717`, tetapi kartu dashboard yang diukur mendapat override background `#0a0a0a`. Mengisi semua card dengan token card saja akan membuat replika berbeda.

Warna aksen positif hijau/emerald, status berjalan oranye, stop/destructive merah-pink. Tombol Upgrade dan Buy Now berwarna turquoise, berbeda dari tombol primary tema yang putih keabu-abuan. Rating bintang oranye.

### Tipografi dan ukuran

- Font **Geist variable**, dengan fallback Geist Fallback/Arial. Jangan menggantinya dengan Inter atau font sistem jika mengejar kesamaan.
- Body dasar 16/24 px; sebagian besar konten UI 14/20 px.
- Sapaan Analytics: 20/28 px, weight 500.
- Judul kartu: 16/24 px, weight 500.
- Angka KPI kecil: 24/32 px, weight 600.
- Label/tick/caption kecil umumnya 12 px; label tengah ring sekitar 11 px dan angka 22 px.
- Tombol View Full Report: tinggi 40 px, radius 8 px, teks 14/20 weight 500.
- Header tabel Analytics sekitar 40 px; baris produk sekitar 64.7 px pada lingkungan pengukuran.

### Komposisi desktop

- Sidebar expanded sekitar **256 px**, collapsed sekitar **48 px**; konten utama bergeser dan melebar.
- Header sticky di atas main, tinggi sekitar 56 px, dengan border bawah.
- Inset main sekitar 8 px; content padding 16 px; grid gap **16 px**.
- Main grid 12 kolom. Desktop lebar: hero 8 + insight 4; sales chart 8 + ring 4; KPI 4 + 4 + 4; campaign 4 + tabel 8.
- Radius kartu Vega efektif **14 px**, border sangat tipis, tanpa shadow besar.
- Tinggi kartu Analytics pada viewport desktop yang diukur: hero/insight 230 px; pasangan sales sekitar 474 px; KPI sekitar 141 px; pasangan campaign/tabel sekitar 442 px. Angka ini tergantung font, viewport dan scrollbar, bukan konstanta universal.
- Main boxed membatasi lebar konten; pada 1920 px lebarnya tidak terus membesar sebanding viewport.
- Sidebar punya bagian logo/version, scroller navigasi independen, blok Basic Plan 70%, progress usage `68/100`, Upgrade, Help Center dan Documentation.
- Tombol Buy Now dan gear customizer fixed di kanan bawah; jangan ditempatkan sebagai bagian flow/footer.

## 5. Halaman Analytics: seluruh blok utama

1. **Sapaan**: teks berdasarkan waktu lokal browser, nama Cameron, paragraf dua baris, tombol View Full Report, ilustrasi orang di meja dan animasi emoji.
2. **Key Insights**: `$20,320`, `+40%`, teks pembanding; **52 garis vertikal** dengan komposisi Asia 60%, USA 25%, Europe 15%, warna primary/60%/20%.
3. **Sales Overview**: header dan badge `+18.0%`, Revenue Overview `$640,000`, legend Team A/B/C, select range dan stacked bars.
4. **Sales Distribution**: ring **60 tick SVG**, ikon wallet dan total `$284,920.00`, legend Website `$4,385`, Marketplace `$4,590`, Affiliate `$18,356` beserta growth.
5. **Weekly sales** `714k` / `40%`, ikon shopping bag dan See Statistics.
6. **New users** `1.35m` / `20%`, ikon users dan See Statistics.
7. **Purchase Orders** `1.72m` / `40%`, ikon box dan See Statistics.
8. **Campaign Performance**: Instagram 8.49k Completed; Google 9.12k Running; Facebook 6.98k Stopped; X/Twiter 8.92k Stopped; pemisah baris dan See Report.
9. **Top Selling Products**: checkbox header/baris, kolom Item/Rating/Price/Status/Action, empat produk, bintang rating, badge demand, action ellipsis dan pagination.
10. Footer copyright 2026, tautan brand/About Us/Blog/License.

Produk awal: AeroBeat X9 Earbuds — High resolution drone — $1,499.00; DataDrive Secure X — External SSD 2TB — $199.00; FlexBook Infinity — Convertible laptop — $1,499.00; PulseFit Tracker 2 — Advanced fitness watch — $1,499.00. Label/deskripsi demo yang tidak cocok jangan diperbaiki tanpa keputusan pengguna.

### Grafik sales

- Rentang tersedia: Last 7 Days, Last 30 Days, Last 90 Days.
- Default 30 hari memiliki 12 bar, sumbu Jan 1 sampai Feb 8; Y 0–30k dengan step 5k.
- Lebar bar 30 px, tiga seri bertumpuk. Shape SVG kustom mempertahankan radius ujung tertentu; bukan sekadar `border-radius` untuk semua segmen.
- Chart container tinggi 260 px. Ada custom tooltip dengan date dan nilai tiap team, bukan tooltip bawaan yang tampil beda.
- Data 30 hari, urutan `date: TeamA / TeamB / TeamC`:
  - Jan 1: 7500 / 4700 / 4700
  - Jan 4: 7500 / 4300 / 4300
  - Jan 6: 9200 / 5500 / 5500
  - Jan 8: 8300 / 5000 / 5000
  - Jan 12: 10200 / 6300 / 6300
  - Jan 16: 7100 / 4300 / 4300
  - Jan 20: 8700 / 5400 / 5400
  - Jan 24: 11000 / 6800 / 6800
  - Jan 28: 10300 / 6200 / 6200
  - Feb 1: 9000 / 5500 / 5500
  - Feb 5: 10200 / 6700 / 5500
  - Feb 8: 12000 / 8000 / 6300
- Seluruh dataset 7/30/90 hari tersimpan di teks chunk dalam `analysis-shipped-assets.json`.

### Interaksi yang diuji dan batasnya

- Select range bisa dibuka dan dipilih. State 7 hari diverifikasi REA sebagai label Mon–Sun.
- Checkbox header memilih semua empat row; klik ulang membatalkannya.
- Klik Price mengubah urutan row. Hasil awal menempatkan `$1,499.00` sebelum `$199.00`, lalu terbalik saat klik lagi; kemungkinan sort berdasarkan string, bukan nominal numerik. Simpan perilaku aktual, jangan berasumsi sort uang sudah benar.
- Action menu berisi Add, Edit, Delete. Klik Edit tidak menampilkan dialog pada observasi singkat; tidak cukup untuk menyimpulkan seluruh CRUD berfungsi.
- Rows per page Analytics punya pilihan **4, 5, 6**, default 5 dan counter 1–4 of 4.
- Legend distribusi punya state hover skala 1.01; kode publik menunjukkan ring/tooltip mengikuti hover. Semua koordinat/variasi tooltip belum diukur menyeluruh.
- Tooltip Key Insights ditemukan dalam kode publik; probe hover awal belum menghasilkan capture tooltip yang bisa dikonfirmasi. Jangan menandai seluruh tooltip sudah tervalidasi runtime.
- See Statistics/See Report/Upgrade perlu dipastikan satu per satu sebelum dianggap fitur navigasi sungguhan. Tombol yang terlihat tidak otomatis memiliki efek bisnis.

## 6. Header, sidebar dan overlay

### Header

Urutan: sidebar toggle, separator, search, light/dark toggle, bahasa, cart count 11, notification bell dengan ping, inbox/envelope, avatar profile.

- Bahasa: menu English (UK), Chinese, French, Arabic. Perubahan bahasa seluruh aplikasi belum diuji.
- Search `button` menghasilkan tautan Button ke galeri eksternal. Search `invoice` menghasilkan `No Components Found!`; ini tampaknya pencarian komponen, bukan pencarian universal semua route.
- Toggle tema benar-benar mengubah root ke light, background putih; dikembalikan ke dark.
- Cart: drawer kanan sekitar 320 px, tiga produk Supreme toys cooker, quantity awal 5/2/4, subtotal $2750 dan total $2850, Go to shopping cart. Mutasi quantity/checkout tidak diuji.
- Notifications: menu sekitar 360 px lebar dan 464 px tinggi, badge 5 new, daftar event/settings/launch, footer See All Notifications.
- Inbox: menu serupa, badge 3 new, daftar pesan dan See All Messages.
- Profile: drawer kanan sekitar 384 px, Cameron, email demo, Home/Profile/Invoice (4)/Subscription/Account Settings, promo dan Log Out. Log Out tidak ditekan.

### Sidebar

- Menu group memakai elemen `details/summary`; daftar submenu tidak selalu muncul sebelum dibuka.
- Active route memakai fill abu terang dengan teks/ikon gelap, bukan stripe warna.
- Ikon stroke mempunyai efek draw saat hover.
- Collapse desktop terkonfirmasi, cookie `sidebar_state=false` terlihat setelah collapse; persistensi reload cookie belum diuji secara terpisah.
- Pada mobile toggle membuka sheet kiri, sekitar 281 px pada viewport 390, dengan backdrop dan scroller.
- Menu Level punya nesting tambahan; ada tautan `#`, bukan semua leaf route sungguhan.

### Dialog representatif

- Add New Contact: centered dialog sekitar 448 px; firstname/lastname/department/company/phone/email/address/notes, Submit dan Cancel.
- Kanban Add List: centered dialog sekitar 448 px, input nama dan tombol Cancel/Add List.
- Notes Add Note: centered dialog sekitar 448 px, textarea dan pemilihan warna.
- Email Compose: centered dialog sekitar 448 px, To/Subject/Message/Attachment, Send/Cancel; tidak dikirim.
- Integration Details: dialog berisi **data kredensial contoh** generik, bukan bukti integrasi provider benar-benar tersambung. Nilai contoh sensitif tidak perlu disalin ke implementasi.
- Create User tidak membuka modal: observasi menampilkan row editor inline baru di atas tabel. Tidak disimpan.
- Create Ticket tidak menunjukkan dialog pada probe singkat; hasil tidak boleh dipaksakan menjadi modal buatan.

## 7. Inventaris motion — parameter yang ditemukan

| Efek | Mekanisme dan parameter |
| --- | --- |
| Fade wrapper route | WAAPI opacity 0→1; **350 ms**, easing `cubic-bezier(.22,1,.36,1)`, fill both |
| Masuk blok halaman | `page-enter`: opacity 0→1, blur 8→0 px, translateY 10→0 px; **500 ms**, easing sama, fill backwards |
| Stagger blok | Delay `min(index,10) * 60ms`; Analytics sembilan blok memakai 0…480 ms |
| Key Insights | `chart-bar-grow`: scaleY 0→1 + opacity, origin bottom, **500 ms**, delay **200 + 12*index ms** |
| Tick ring | `chart-tick-in`: fade, **400 ms ease-out**, delay bertahap 200 + 12*index ms |
| Bar horizontal | `chart-bar-grow-x`: scaleX + opacity, **600 ms**, origin kiri, berpindah kanan pada RTL; teramati juga pada Logistics |
| Recharts stacked bars | Ketiga seri memakai **700 ms ease-out**, begin **0 / 120 / 240 ms** |
| Draw ikon nav | `icon-draw`: dasharray 100, dashoffset 100→0; **800 ms ease-out**, dipicu hover, hanya saat no-preference |
| Masuk item dropdown | CSS `dropdown-item-enter`: opacity + blur 2px + translateY -4px; **350 ms**, delay **40 + min(index,8)*35 ms** untuk `.dropdown-stagger > *` |
| Kontainer menu | Enter sekitar **100 ms**, slide dari sisi berlawanan anchor, transform-origin sesuai posisi |
| Sheet/drawer | Transisi **200 ms ease-in-out**, opacity dan translate **40 px**, arah sesuai sisi; bukan slide sejauh seluruh lebar drawer |
| Backdrop sheet | Overlay dengan blur latar teramati; matching harus mencakup backdrop, scroll lock dan z-index, bukan panel saja |
| Hover legend distribusi | Transition **200 ms**, scale 1.01; tick SVG transition 300 ms dan kontainer SVG 500 ms |
| Gear customizer | Seluruh button berputar **360° / 1 s linear infinite**; Playwright normal click dapat timeout karena target tidak stabil |
| Notification dot | `ping` **1 s**, cubic-bezier(0,0,.2,1), scale sampai 2 + fade pada akhir |
| Loader | Spinner melingkar saat hydration/lazy load, 1 s linear |
| Pulse | Keyframe opacity 50% di tengah, default 2 s; teramati pada Logistics |
| Accordion/collapsible | Height 0↔content-height tersedia di CSS; perlu pengukuran pada masing-masing pemakaian untuk durasi efektif |
| Progress navigasi | CSS NProgress tersedia; keberadaan keyframe tidak membuktikan semua navigasi menampilkannya |

**Reduced motion tidak mematikan semuanya.** Dalam pengujian `prefers-reduced-motion: reduce`, stagger page-enter serta animasi bar/tick berhenti. Fade wrapper WAAPI 350 ms masih tercatat, ping dan spin tetap aktif. Jangan mengklaim dukungan reduced-motion menyeluruh.

### Emoji dan jam

Aturan dari chunk publik: 05:00–11:59 Good Morning, 12:00–16:59 Good Afternoon, 17:00–20:59 Good Evening, sisanya Good Night. Morning/Afternoon memuat sun; Evening/Night memuat moon.

- `/animations/emoji/sun.json`: Lottie v5.8.1, 60 fps, 112 frame, sekitar **1.867 s**, 1024×1024, loop.
- `/animations/emoji/moon.json`: Lottie v5.8.1, 60 fps, 246 frame, **4.1 s**, 1024×1024, loop.
- Render emoji sekitar 28 px. Perbedaan sapaan antara Playwright dan REA berasal dari lingkungan jam/timezone; bukan dua desain yang berbeda.

## 8. Responsivitas

Viewport yang diukur: 1920, 1440, 1280, 1024, 1023, 768, 767 dan 390 px.

- Pada 1280 px sidebar desktop masih ada; pada 1024 px sidebar desktop tidak dirender. Batas persis di antara keduanya belum dibisect. Jangan memakai breakpoint sidebar 768 hanya karena ada kelas `md:block` di markup.
- Pasangan 8/4 Analytics menjadi full-width pada viewport lebih kecil dari xl.
- Tiga KPI masih sejajar pada 1024, tetapi bertumpuk pada 1023 dan lebih kecil, konsisten dengan breakpoint lg 1024.
- Pada 390 seluruh blok bertumpuk; tabel memiliki konten lebih lebar dari card dan perlu mempertahankan scroller/clipping internal yang teramati.
- Chart sales pada mobile tidak otomatis menjadi versi sederhana; bagian data bisa terpotong pada area tersedia.
- **Bug visual asli teramati:** ilustrasi dark hero tetap tampil di mobile dan menutupi sebagian teks. Kelas gambar light/dark tidak simetris. Keputusan mereplikasi bug atau memperbaiki harus ditetapkan pengguna, bukan diasumsikan.
- Footer berpindah susunan pada layar kecil. Header menampilkan versi ringkas dengan logo/toggle/ikon; search desktop tidak menjadi field lebar pada mobile.
- Screenshot/pengukuran memiliki fractional CSS pixels dan scrollbar vertikal; perbandingan pixel harus memakai viewport, device scale, font, mode dan waktu animasi yang sama.

## 9. Customizer

Drawer kanan sekitar 384 px, dapat discroll, dengan backdrop blur. Opsi yang terlihat dan diuji pergantiannya: 7 Theme Style, Light/Dark, LTR/RTL, Vertical/Horizontal, Boxed/Full. Ada dua kontrol warna; seluruh state color picker belum diinspeksi.

| Style | Radius card terukur | Tinggi tombol report terukur |
| --- | --- | --- |
| Vega | 14 px | 40 px |
| Nova | 16.8 px | 36 px |
| Maia | 18 px | sekitar 40 px, lebih pill |
| Lyra | 0 px | 36 px |
| Mira | 10 px | 32 px, teks lebih kecil |
| Luma | 26 px | 40 px, pill |
| Rhea | 24 px | 36 px, radius tombol 18 px |

Ini bukan hanya mengganti warna: spacing, border radius, tinggi kontrol dan beberapa perlakuan komponen berubah. Default final dikembalikan ke Vega/dark/LTR/vertical/boxed.

RTL memindahkan sidebar ke kanan dan membalik arah. Horizontal menambahkan navigasi kategori Dashboard/Apps/UI/Widgets/Pages/Forms/Charts/Tables. Pilihan Full pernah menghasilkan query `container=full`; state URL dan localStorage harus direkonsiliasi saat implementasi nanti.

Key penyimpanan yang teramati mencakup `theme`, `activeStyle`, `activeTheme`, `activeDir`, `activeLayout`, `isLayout`, `isCollapse`, `isCardShadow`, `isBorderRadius`, `isLanguage` dan varian `_default`. Nilai `isBorderRadius=12` bukan alasan mengasumsikan semua radius final 12 px: computed style membuktikan variasi.

## 10. Delapan dashboard bukan satu layout dengan angka diganti

| Dashboard | Komposisi pembeda |
| --- | --- |
| Analytics | Hero ilustrasi, 52 batang insight, stacked sales, 60-tick revenue ring, 3 KPI, campaign dan produk |
| eCommerce | Total/monthly sales, matrix sparkline, customer segmentation ring, order line chart, user activity, 4 KPI, sales order table, latest products, asset distribution, promo carousel dengan 3 gambar |
| Modern | Greeting toolbar, update banner, sales chart, grid 2×2 total assets, 3 KPI, Projects & Orders |
| SaaS + AI | Welcome David, periode + date range, 4 KPI dalam strip, sales range 7D/30D/90D/1Y, ARR ring, Ask AI provider selector dan tabel produk AI |
| School | Academic year/term, 4 KPI, attendance chart, grade distribution, fees paid/pending/salary charts, enrollment table dan events |
| Health | Patient metrics, weekly appointments, patient flow, recent patients, doctor performance, department stats, upcoming appointments, recovery rate |
| Restaurant | POS terminal/status badges, taste picks, gross sales/orders/occupancy/check, dining revenue, channel breakdown, dishes, payment transactions, satisfaction dan kitchen queue |
| Logistics | Fleet/SLA/freight/fuel KPIs, volume+SLA chart, expenses distribution, shipment ring, warehouse storage, drivers, telemetry dan active freight table |

Sumber gambar tambahan eCommerce/Restaurant/Logistics berasal dari `images.shadcnspace.com`, bukan seluruhnya `/images` lokal.

## 11. Aset yang perlu dipertahankan

Analytics/global:

- `/images/logos/whitelogo.svg` dan `/images/logos/darklogo.svg`.
- `/images/profile/user-2.png`.
- `/images/flag/icon-flag-en.svg` dan flag bahasa lain pada menu.
- `/images/backgrounds/analytic-user.svg` dan `analytic-user-dark.svg`.
- Dua Lottie JSON emoji di atas.
- Geist Latin WOFF2 yang dimuat: `/_next/static/media/caa3a2e1cccd8315-s.p.09~u27dqhyhd6.woff2`; stylesheet font juga mendeklarasikan subset Unicode lainnya.
- SVG ikon dan brand harus cocok dengan sumber yang teramati. Jangan mengganti logo atau ilustrasi dengan emoji, placeholder atau ikon yang sekadar mirip.

Manifest aset seluruh route, seluruh varian bahasa dan seluruh gambar lazy-loaded belum lengkap. Yang disimpan saat ini adalah sumber Analytics dan beberapa URL aset dashboard lain pada log penelitian, bukan paket seluruh aset siap deploy.

## 12. Risiko dan hal yang belum boleh dianggap selesai

1. Semua halaman awal dikunjungi ≠ seluruh interaksi, modal, hover, keyboard, error/loading/empty/success state diuji.
2. Screenshot `recon-` awal dapat menangkap blur/stagger/recharts setengah jalan. Gunakan `settled-` untuk dashboard dan ambil state stabil ulang untuk route lain sebelum pixel matching.
3. Data seperti tanggal kalender, waktu relatif posting, teks filler dan greeting bersifat dinamis. Beberapa teks filler berubah antara kunjungan; test fixture harus membekukan waktu/data agar perbandingan masuk akal.
4. Store cart checkout awal kosong, tetapi drawer global berisi tiga produk demo. Jangan menyatukan keduanya tanpa menelusuri aliran state.
5. eCommerce recent-orders menampilkan lima row tetapi counter awal 1–4 of 4; label demo dan typo lain perlu keputusan eksplisit untuk fidelity vs perbaikan.
6. Menu galeri eksternal memperluas scope menjadi website terpisah dengan banyak komponen. Tidak dimasukkan diam-diam ke klaim 75 route internal.
7. Kode minified publik memberi bukti implementasi frontend, bukan akses source asli/private backend atau versi package yang pasti.
8. Tidak diuji Safari/Firefox, seluruh browser accessibility tree, device touch nyata, semua preferensi OS, atau semua kombinasi 7 tema × mode × layout × direction × container.
9. Tidak ada bukti bahwa label live/online/AI/POS pada demo adalah koneksi realtime sungguhan.
10. Hak pakai logo, ilustrasi dan aset template perlu dipastikan untuk publikasi/distribusi; analisis ini tidak menetapkan lisensinya.

## 13. Kriteria verifikasi nanti — bukan perintah implementasi sekarang

- Scope disepakati: Analytics saja, seluruh demo internal, atau termasuk galeri eksternal.
- Tetapkan apakah meniru bug/typo/perilaku no-op asli atau memperbaikinya.
- Tetapkan frontend-only demo vs fungsi backend yang benar-benar diinginkan.
- Gunakan baseline viewport 1440×1000, dark Vega LTR, state sidebar expanded, waktu/data terkontrol; bandingkan juga mobile dan tablet.
- Verifikasi layout, font file, asset, border, warna, dimensi, scroll, fixed/sticky, overlay dan focus.
- Bandingkan motion pada awal, pertengahan dan akhir: 0/120/240/350/500/700/1000 ms relevan, bukan hanya screenshot final.
- Uji setiap trigger yang disepakati: click/hover/focus/keyboard/Escape/outside click/reload/back serta loading/empty/error.
- Jalankan visual regression dan matrix perilaku setelah ada implementasi. Jangan menyebut 100% sebelum cakupan serta toleransinya dibuktikan.

**Belum ada source aplikasi, dependency project, komponen, atau implementasi yang dibuat. Tunggu instruksi berikutnya dari pengguna.**
