import { z } from "zod";
export const moduleTypes = [
  "traders",
  "developers",
  "educators",
  "videos",
  "journal",
  "products",
  "custom",
];
export const statuses = [
  "active",
  "coming-soon",
  "maintenance",
  "read-only",
  "archived",
];
const title = z.string().trim().min(1).max(90),
  optional = z.string().max(300).default("");
export const moduleSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{1,49}$/),
  type: z.enum(moduleTypes),
  title,
  titleFa: optional,
  description: optional,
  descriptionFa: optional,
  enabled: z.boolean(),
  showOnHome: z.boolean(),
  status: z.enum(statuses),
  display: z.enum(["expandable", "permanent"]),
  order: z.number().int().min(0).max(999),
  theme: z.enum(["green", "orange", "red"]),
  blocks: z.array(z.string().regex(/^[a-z][a-z0-9-]{0,49}$/)).max(20),
  cta: optional,
  url: z
    .string()
    .max(200)
    .refine(
      (v) => !v || /^\/(?!\/)[a-zA-Z0-9/_?#=&.-]*$/.test(v),
      "Use a local path beginning with /",
    ),
});
export const configSchema = z
  .object({
    schemaVersion: z.literal(1),
    modules: z.array(moduleSchema).max(30),
  })
  .superRefine((v, ctx) => {
    const ids = v.modules.map((m) => m.id);
    if (new Set(ids).size !== ids.length)
      ctx.addIssue({
        code: "custom",
        message: "Each module needs a unique ID.",
      });
    for (const m of v.modules) {
      if (["journal", "products"].includes(m.type) && m.display !== "permanent")
        ctx.addIssue({
          code: "custom",
          message: "Journal and products must remain independent sections.",
        });
      if (
        m.type === "developers" &&
        m.blocks.some((b) => !["affiliate", "requests"].includes(b))
      )
        ctx.addIssue({ code: "custom", message: "Unknown developer block." });
    }
  });
const base = {
  enabled: true,
  showOnHome: true,
  status: "active",
  display: "expandable",
  theme: "green",
  blocks: [],
  cta: "",
  url: "",
};
export const defaultConfig = {
  schemaVersion: 1,
  modules: [
    {
      ...base,
      id: "traders",
      type: "traders",
      title: "For Traders",
      titleFa: "برای معامله‌گران",
      description: "Everything tools, signals and indicators to trade better.",
      descriptionFa: "ابزارها، سیگنال‌ها و اندیکاتورها برای معامله‌ای بهتر.",
      order: 0,
    },
    {
      ...base,
      id: "developers",
      type: "developers",
      title: "For Developers",
      titleFa: "برای توسعه‌دهندگان",
      description:
        "Share your tools, join our affiliate program and request custom solutions.",
      descriptionFa:
        "ابزارهایتان را عرضه کنید، همکاری کنید و راهکار اختصاصی سفارش دهید.",
      order: 1,
      theme: "orange",
      blocks: ["affiliate", "requests"],
    },
    {
      ...base,
      id: "educators",
      type: "educators",
      title: "For Educators",
      titleFa: "برای آموزش‌دهندگان",
      description: "Teach, grow your audience, and make an impact.",
      descriptionFa: "آموزش دهید، مخاطب پیدا کنید و اثرگذار باشید.",
      order: 2,
    },
    {
      ...base,
      id: "videos",
      type: "videos",
      title: "TradeTube",
      titleFa: "تریدتیوب",
      description:
        "Watch trading videos, analysis, education, and join creators.",
      descriptionFa: "ویدئو، تحلیل و آموزش ببینید و به سازندگان بپیوندید.",
      order: 3,
      theme: "red",
    },
    {
      ...base,
      id: "journal",
      type: "journal",
      title: "Your Trading Journal, Powered by AI.",
      titleFa: "ژورنال معاملاتی شما، با قدرت هوش مصنوعی",
      description: "Track. Analyze. Improve with AI.",
      descriptionFa: "ثبت، تحلیل و پیشرفت با هوش مصنوعی.",
      display: "permanent",
      order: 4,
    },
    {
      ...base,
      id: "products",
      type: "products",
      title: "Featured Products",
      titleFa: "محصولات منتخب",
      description: "Handpicked tools from top creators.",
      descriptionFa: "ابزارهای منتخب از بهترین سازندگان.",
      display: "permanent",
      order: 5,
    },
  ],
};
export function visibleModules(config) {
  return config.modules
    .filter((m) => m.enabled && m.showOnHome && m.status !== "archived")
    .sort((a, b) => a.order - b.order);
}
export function toggleModule(current, id) {
  return current === id ? null : id;
}
export function publicConfig(config) {
  return { ...config, modules: visibleModules(config) };
}
