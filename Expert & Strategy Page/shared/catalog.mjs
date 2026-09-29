import { z } from "zod";
import { mediaUrl } from "../../Home Page/shared/media.mjs";

export const platforms = [
  ["mt4", "MetaTrader 4", "متاتریدر ۴"],
  ["mt5", "MetaTrader 5", "متاتریدر ۵"],
  ["ctrader", "cTrader", "سی‌تریدر"],
  ["tradingview", "TradingView", "تریدینگ‌ویو"],
  ["ninjatrader", "NinjaTrader", "نینجاتریدر"],
];

export const strategyTypes = [
  ["scalping", "Scalping", "اسکالپ"],
  ["day", "Day Trading", "معاملات روزانه"],
  ["swing", "Swing Trading", "سوئینگ"],
  ["grid", "Grid / Martingale", "گرید / مارتینگل"],
  ["arbitrage", "Arbitrage", "آربیتراژ"],
  ["news", "News Trading", "معامله بر خبر"],
  ["ai", "AI / Machine Learning", "هوش مصنوعی / یادگیری ماشین"],
  ["other", "Other", "سایر"],
];

const copy = z.string().trim().max(4000).default("");
const optionalMetric = z.number().finite().min(0).max(1000000).nullable().default(null);

export const expertSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,80}$/),
  title: z.string().trim().min(1).max(120),
  titleFa: copy,
  description: copy,
  descriptionFa: copy,
  creator: z.string().trim().max(120).default(""),
  image: mediaUrl.refine((v) => !v || /\.(png|jpg|webp)$/.test(v), "Choose an image").default(""),
  platforms: z.array(z.enum(platforms.map((p) => p[0]))).min(1).max(5),
  strategyType: z.enum(strategyTypes.map((c) => c[0])),
  price: z.number().finite().min(0).max(1000000),
  badge: z.enum(["none","new","popular","bestseller"]).default("none"),
  access: z.enum(["public","signal-provider"]).default("public"),
  verifiedResults: z.boolean().default(false),
  profitFactor: optionalMetric,
  winRate: z.number().finite().min(0).max(100).nullable().default(null),
  maxDrawdown: z.number().finite().min(0).max(100).nullable().default(null),
  currency: z.literal("USD").default("USD"),
  status: z.enum(["draft","published"]).default("draft"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).superRefine((v, ctx) => {
  if (v.status === "published" && (!v.image || !v.description))
    ctx.addIssue({code:"custom",message:"Published expert products need an image and description."});
  if (v.verifiedResults && (v.profitFactor == null || v.winRate == null || v.maxDrawdown == null))
    ctx.addIssue({code:"custom",message:"Verified results require profit factor, win rate and max drawdown."});
});

export const catalogSchema = z.object({
  products: z.array(expertSchema).max(200),
}).superRefine((v, ctx) => {
  if (new Set(v.products.map((p) => p.id)).size !== v.products.length)
    ctx.addIssue({code:"custom",message:"Duplicate product IDs."});
});

export function selectProducts(products, {
  query="",
  platform=[],
  strategyType=[],
  maxPrice=Infinity,
  verifiedOnly=false,
  sort="newest",
}={}) {
  const q=query.trim().toLocaleLowerCase();
  return products.filter((p)=>
    p.status === "published" &&
    (!q || [p.title,p.titleFa,p.description,p.descriptionFa,p.creator].join(" ").toLocaleLowerCase().includes(q)) &&
    (!platform.length || p.platforms.some((x)=>platform.includes(x))) &&
    (!strategyType.length || strategyType.includes(p.strategyType)) &&
    (!verifiedOnly || p.verifiedResults) &&
    p.price <= maxPrice
  ).sort((a,b)=>
    sort === "price-low" ? a.price-b.price :
    sort === "price-high" ? b.price-a.price :
    sort === "name" ? a.title.localeCompare(b.title) :
    b.createdAt.localeCompare(a.createdAt)
  );
}
