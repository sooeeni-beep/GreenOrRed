import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const source=fileURLToPath(new URL("../assets/",import.meta.url));
const out=fileURLToPath(new URL("../../Home Page/public/assets/",import.meta.url));
await mkdir(out,{recursive:true});

async function iconCrop(file,width=110,ratio=.28){
  const p=sharp(source+file);
  const m=await p.metadata();
  const crop={left:0,top:0,width:Math.max(1,Math.floor(m.width*ratio)),height:m.height};
  return sharp(await p.extract(crop).trim({threshold:12}).toBuffer()).resize({width,withoutEnlargement:true}).webp({quality:90,alphaQuality:100});
}
const jobs=[
  ["hero","Picture of Hero.png",1000],
  ["background","Background of Hero.png",1600],
  ["handwrite-1","Hand Write 1 in Hero.png",300],
  ["handwrite-2","Hand Write 2 in Hero.png",300],
  ["custom-paper","Paper Icon in below of Page.png",160],
  ["custom-background","banner background in below of Page.png",1600],
];
for(const [key,file,width] of jobs){
  await sharp(source+file).trim({threshold:12}).resize({width,withoutEnlargement:true}).webp({quality:90,alphaQuality:100}).toFile(out+"exp-"+key+".webp");
}
for(const [key,file] of [
  ["verified","Verified Performance in Hero.png"],
  ["safe","Safe & Secured in Hero.png"],
  ["updates","Lifetime Updates in Hero.png"],
  ["trusted","Trasted by Traders in Hero.png"],
  ["custom-gear","Built by Experts in below of Page.png"],
  ["custom-fast","fast delivery in below of Page.png"],
  ["custom-secure","Secure & Private in below of Page.png"],
]){
  await (await iconCrop(file,key.startsWith("custom-")?90:110,key.startsWith("custom-")?.30:.25)).toFile(out+"exp-"+key+".webp");
}
for(const [key,file] of [
  ["mt4","MetaTrader 4 LOGO in Indicator Card (Just for show the Indicators Plateform).png"],
  ["mt5","MetaTrader 5 LOGO in Indicator Card (Just for show the Indicators Plateform).png"],
  ["ctrader","cTrader LOGO in Indicator Card (Just for show the Indicators Plateform).png"],
  ["tradingview","TradingView LOGO in Indicator Card (Just for show the Indicators Plateform).png"],
  ["ninjatrader","NinjaTrader LOGO in Indicator Card (Just for show the Indicators Plateform).png"],
]){
  await sharp(source+file).trim({threshold:12}).resize({width:120,withoutEnlargement:true}).webp({quality:90,alphaQuality:100}).toFile(out+"exp-"+key+".webp");
}
