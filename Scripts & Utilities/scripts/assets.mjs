import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const source=fileURLToPath(new URL('../assets/',import.meta.url));
const out=fileURLToPath(new URL('../../Home Page/public/assets/',import.meta.url));
await mkdir(out,{recursive:true});
for(const [key,file,width,crop] of [
 ['hero','Hero.png',1100],['handwriting','Smail Scripts big impact.png',300],
 ['efficiency','boost efficiency in Hero.png',110,.25],['automate','automate tasks in Hero.png',110,.25],['accuracy','improve accuracy in Hero.png',110,.25],['compatible','compatible platforms in Hero.png',110,.25],['creators','created by experts in Hero.png',110,.25],
 ['custom-icon','01_custom_script_icon.png',140],['step-1','02_step_1.png',90],['step-2','03_step_2.png',90],['step-3','04_step_3.png',90],['custom-background','banner background in below of Page.png',1600],
 ...[['mt4','MetaTrader 4'],['mt5','MetaTrader 5'],['ctrader','cTrader'],['tradingview','TradingView'],['ninjatrader','NinjaTrader']].map(([key,name])=>[key,name+' LOGO in Indicator Card (Just for show the Indicators Plateform).png',120])
]){
 let p=sharp(source+file);
 if(crop){const m=await p.metadata();p=sharp(await p.extract({left:0,top:0,width:Math.floor(m.width*crop),height:m.height}).toBuffer());}
 await p.trim({threshold:12}).resize({width,withoutEnlargement:true}).webp({quality:90,alphaQuality:100}).toFile(out+'scr-'+key+'.webp');
}
