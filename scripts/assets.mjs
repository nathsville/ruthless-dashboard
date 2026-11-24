import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
const origin = "https://demos.shadcndashboard.dev";
const paths = [
  "/images/backgrounds/analytic-user.svg",
  "/images/backgrounds/analytic-user-dark.svg",
  "/images/backgrounds/profilebg.png",
  "/images/backgrounds/404.svg",
  "/images/flag/icon-flag-en.svg",
  "/images/svgs/google-icon.svg",
  "/images/svgs/github-icon.svg",
  ...Array.from({ length: 9 }, (_, i) => `/images/profile/user-${i + 1}.png`),
  ...[
    "advance-macbook",
    "beauty-product",
    "boat-headphone",
    "little-angel-toy",
    "new-book",
    "new-games",
    "short-sweet-purse",
    "shoes",
    "teddybear",
    "toy-dino",
    "woman-dress",
  ].map((n) => `/images/products/${n}.png`),
  ...[1, 2, 3, 4, 5, 6, 8, 9, 12].map((n) => `/images/blog/blog-img${n}.png`),
  ...["luxesoft", "solardesk", "artisan", "wireless", "minimalist"].map(
    (n) => `/images/products/recent-sales/${n}.webp`,
  ),
  ...["wirelessPad", "ergonomic", "smartHome", "bluetooth"].map(
    (n) => `/images/products/latest/${n}.webp`,
  ),
  "/animations/emoji/sun.json",
  "/animations/emoji/moon.json",
];
const sources = paths.map((path) => ({
  url: origin + path,
  output: "public" + path,
}));
sources.push({
  url: origin + "/_next/static/media/caa3a2e1cccd8315-s.p.09~u27dqhyhd6.woff2",
  output: "public/fonts/geist-latin.woff2",
});
for (const name of [
  "pepperoni-pizza",
  "truffle-mushroom-burger",
  "woodfired-margherita-pizza",
  "avocado-caesar-bowl",
  "iced-caramel-macchiato",
])
  sources.push({
    url: `https://images.shadcnspace.com/assets/shadcn-dashboard/dashboard-shell/${name}.webp`,
    output: `public/images/dishes/${name}.webp`,
  });
for (const name of ["laptop-desk", "laptop-desk-2", "laptop-desk-3"])
  sources.push({
    url: `https://images.shadcnspace.com/assets/shadcn-dashboard/dashboard-shell/${name}.png`,
    output: `public/images/promos/${name}.png`,
  });
const manifest = [];
for (let i = 0; i < sources.length; i += 6)
  await Promise.all(
    sources.slice(i, i + 6).map(async (item) => {
      const r = await fetch(item.url);
      if (!r.ok) throw new Error(`${r.status}: ${item.url}`);
      const bytes = Buffer.from(await r.arrayBuffer());
      await mkdir(dirname(item.output), { recursive: true });
      await writeFile(item.output, bytes);
      manifest.push({
        ...item,
        bytes: bytes.length,
        acquiredAt: new Date().toISOString(),
        purpose:
          "User-requested visual reconstruction reference asset; verify license before redistribution.",
      });
      console.log(item.output, bytes.length);
    }),
  );
await writeFile("ASSET-PROVENANCE.json", JSON.stringify(manifest, null, 2));
