import { z } from "zod";
import { mediaUrl } from "../../Home Page/shared/media.mjs";
export const platforms = [
  ["mt4", "MetaTrader 4", "متاتریدر ۴"],
  ["mt5", "MetaTrader 5", "متاتریدر ۵"],
  ["ctrader", "cTrader", "سی‌تریدر"],
  ["tradingview", "TradingView", "تریدینگ‌ویو"],
  ["ninjatrader", "NinjaTrader", "نینجاتریدر"],
];
export const categories = [
  ["trend", "Trend", "روند"],
  ["oscillator", "Oscillator", "نوسان‌نما"],
  ["volume", "Volume", "حجم"],
  ["support", "Support & Resistance", "حمایت و مقاومت"],
  ["signal", "Signal", "سیگنال"],
  ["fibonacci", "Fibonacci", "فیبوناچی"],
  ["multi", "Multi-Function", "چندمنظوره"],
  ["other", "Other", "سایر"],
];
const copy = z.string().trim().max(4000).default("");
export const indicatorSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]{1,80}$/),
    title: z.string().trim().min(1).max(120),
    titleFa: copy,
    description: copy,
    descriptionFa: copy,
    creator: z.string().trim().max(120).default(""),
    image: mediaUrl
      .refine((v) => !v || /\.(png|jpg|webp)$/.test(v), "Choose an image")
      .default(""),
    platforms: z
      .array(z.enum(platforms.map((p) => p[0])))
      .min(1)
      .max(5),
    category: z.enum(categories.map((c) => c[0])),
    price: z.number().finite().min(0).max(1000000),
    currency: z.literal("USD").default("USD"),
    status: z.enum(["draft", "published"]).default("draft"),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .superRefine((v, ctx) => {
    if (v.status === "published" && (!v.image || !v.description))
      ctx.addIssue({
        code: "custom",
        message: "Published indicators need an image and description.",
      });
  });
export const catalogSchema = z
  .object({ products: z.array(indicatorSchema).max(200) })
  .superRefine((v, ctx) => {
    if (new Set(v.products.map((p) => p.id)).size !== v.products.length)
      ctx.addIssue({ code: "custom", message: "Duplicate product IDs." });
  });
export function selectProducts(
  products,
  {
    query = "",
    platform = [],
    category = [],
    maxPrice = Infinity,
    sort = "newest",
  } = {},
) {
  const q = query.trim().toLocaleLowerCase();
  return products
    .filter(
      (p) =>
        p.status === "published" &&
        (!q ||
          [p.title, p.titleFa, p.description, p.descriptionFa, p.creator]
            .join(" ")
            .toLocaleLowerCase()
            .includes(q)) &&
        (!platform.length || p.platforms.some((x) => platform.includes(x))) &&
        (!category.length || category.includes(p.category)) &&
        p.price <= maxPrice,
    )
    .sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : sort === "name"
            ? a.title.localeCompare(b.title)
            : b.createdAt.localeCompare(a.createdAt),
    );
}
