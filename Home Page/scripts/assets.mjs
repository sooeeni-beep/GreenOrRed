import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const names = JSON.parse(
  await readFile(new URL("./source-assets.json", import.meta.url)),
);
const keys = [
  "insights",
  "members",
  "affiliate-icon",
  "education-banner",
  "cart",
  "header-cart",
  "affiliate-cta",
  "request-cta",
  "affiliate-chart",
  "satisfaction",
  "educators",
  "experts-icon",
  "experts-chart",
  "marketplace-cta",
  "developers-card",
  "developers-arrow",
  "educators-card",
  "educators-arrow",
  "traders-card",
  "traders-arrow",
  "education-cap",
  "indicators-icon",
  "indicators-chart",
  "tool-arrow",
  "brand",
  "journal-devices",
  "hero-shell",
  "mt4",
  "mt5",
  "request-monitor",
  "ninjatrader",
  "request-paper",
  "analytics",
  "products",
  "scripts-icon",
  "scripts-chart",
  "goals",
  "star",
  "free-badge",
  "journal-hero-cta",
  "journal-cta",
  "request-check",
  "return-badge",
  "footer-tagline",
  "videos-card",
  "videos-arrow",
  "signals-icon",
  "signals-chart",
  "tradingview",
  "profile-cta",
  "play",
  "bestseller",
  "ctrader",
  "education-cta",
  "new",
  "popular",
  "learning-cta",
  "affiliate-check",
  "journal-arrow",
  "education-arrow",
  "live",
  "hero-decoration",
];
await mkdir(root + "public/assets", { recursive: true });
const report = [];
for (let i = 0; i < names.length; i++) {
  const input = root + "assets/" + names[i];
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let l = info.width,
    t = info.height,
    r = 0,
    b = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[(y * info.width + x) * 4 + 3] > 32) {
        l = Math.min(l, x);
        r = Math.max(r, x);
        t = Math.min(t, y);
        b = Math.max(b, y);
      }
  l = Math.max(0, l - 2);
  t = Math.max(0, t - 2);
  r = Math.min(info.width - 1, r + 2);
  b = Math.min(info.height - 1, b + 2);
  const width = r - l + 1,
    height = b - t + 1;
  const max = /hero|journal-devices|decoration/.test(keys[i])
    ? 1800
    : /chart|banner/.test(keys[i])
      ? 1100
      : /cta|brand|tagline/.test(keys[i])
        ? 800
        : 300;
  await sharp(input)
    .extract({ left: l, top: t, width, height })
    .resize({ width: max, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(root + "public/assets/" + keys[i] + ".webp");
  report.push({
    key: keys[i],
    source: names[i],
    width,
    height,
    kind: "uploaded",
  });
}
const crops = {
  "hero-reference": [431, 47, 986, 286],
  "hero-laptop-screen": [475, 74, 793, 260],
  "hero-phone-screen": [814, 121, 889, 278],
  "video-1": [40, 1130, 321, 1226],
  "video-2": [336, 1130, 478, 1193],
  "video-3": [494, 1130, 638, 1193],
  "video-4": [654, 1130, 798, 1193],
  "video-5": [816, 1130, 980, 1193],
  alex: [376, 996, 408, 1028],
  sara: [503, 996, 535, 1028],
  david: [630, 996, 662, 1028],
  "creator-1": [339, 1228, 359, 1248],
  "creator-2": [497, 1228, 517, 1248],
  "creator-3": [656, 1228, 676, 1248],
  "creator-4": [819, 1228, 839, 1248],
  marketmind: [41, 1243, 57, 1259],
  "product-thumb": [755, 1309, 835, 1355],
  "leader-1": [719, 668, 735, 686],
  "leader-2": [719, 691, 735, 709],
  "leader-3": [719, 714, 735, 732],
  "leader-4": [719, 737, 735, 755],
  "leader-5": [719, 760, 735, 778],
  "social-x": [842, 1418, 858, 1432],
  "social-youtube": [870, 1418, 888, 1432],
  "social-discord": [900, 1418, 918, 1432],
  "social-telegram": [931, 1418, 949, 1432],
};
for (const [key, [x, y, x2, y2]] of Object.entries(crops)) {
  const left = Math.round(240 + x * 1.40625),
    top = Math.round(y * 1.40625),
    width = Math.round((x2 - x) * 1.40625),
    height = Math.round((y2 - y) * 1.40625);
  await sharp(root + "Home Page.png")
    .extract({ left, top, width, height })
    .webp({ quality: 95 })
    .toFile(root + "public/assets/" + key + ".webp");
  report.push({
    key,
    source: "Home Page.png",
    crop: { left, top, width, height },
    kind: "reference-fallback",
  });
}
await writeFile(
  root + "public/assets/manifest.json",
  JSON.stringify(report, null, 2),
);
console.log("Prepared " + report.length + " assets; originals preserved.");
