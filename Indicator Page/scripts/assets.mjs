import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const source = fileURLToPath(new URL("../assets/", import.meta.url));
const out = fileURLToPath(
  new URL("../../Home Page/public/assets/", import.meta.url),
);
await mkdir(out, { recursive: true });
const jobs = [
  ["hero", "Hero Picture.png", 1100],
  ["background", "Background of Hero.png", 1600],
  ["handwriting", "Better Tools, Bigger Opportunities.png", 300],
  ...[
    ["analyze", "Analyze Faster"],
    ["entries", "Find Better Entries"],
    ["improve", "Improve Your Trades"],
    ["confidence", "Trade with Confidence"],
  ].map(([key, n]) => [
    key,
    n + " in Hero.png",
    160,
    { left: 330, top: 125, width: 520, height: 520 },
  ]),
  ...[
    ["quality", "High Quality"],
    ["updates", "Lifetime Updated"],
    ["support", "Dedicated Support"],
    ["trusted", "Trasted by Traders"],
  ].map(([key, n]) => [
    key,
    n + " in Hero.png",
    120,
    { left: 0, top: 0, width: ["updates", "trusted"].includes(key) ? 735 : 650, height: 724 },
  ]),
  ...[
    ["mt4", "MetaTrader 4"],
    ["mt5", "MetaTrader 5"],
    ["ctrader", "cTrader"],
    ["tradingview", "TradingView"],
    ["ninjatrader", "NinjaTrader"],
  ].map(([key, n]) => [
    key,
    n + " LOGO in Indicator Card (Just for show the Indicators Plateform).png",
    120,
  ]),
  ["custom-paper", "Paper Icon in below of Page.png", 160],
  ["custom-background", "banner background in below of Page.png", 1600],
  ["custom-gear", "custom development in below of Page.png", 100, {left:0,top:0,width:143,height:140}],
  ["custom-people", "fair pricing in below of Page.png", 100, {left:0,top:0,width:149,height:120}],
  ["custom-clock", "on time delivery in below of Page.png", 100, {left:0,top:0,width:128,height:134}],
];
for (const [key, file, width, crop] of jobs) {
  let p = sharp(source + file);
  if (crop) p = sharp(await p.extract(crop).toBuffer());
  await p
    .trim({ threshold: 12 })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(out + "ind-" + key + ".webp");
}
