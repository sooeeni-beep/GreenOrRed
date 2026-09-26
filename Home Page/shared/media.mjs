import { z } from "zod";
export const localUrl = z
  .string()
  .max(250)
  .refine(
    (v) => !v || /^\/(?!\/)[a-zA-Z0-9/_?#=&.%-]*$/.test(v),
    "Use a local path beginning with /",
  );
export const mediaUrl = z
  .string()
  .max(250)
  .refine(
    (v) =>
      !v ||
      /^\/(assets\/[a-zA-Z0-9_-]+\.(webp|png|jpg)|api\/media\/[a-zA-Z0-9-]+\.(png|jpg|webp|mp4|webm))$/.test(
        v,
      ),
    "Choose an uploaded image or video",
  );
const text = z.string().max(2000).default("");
export const blockSchema = z.object({
  id: z.string().max(80),
  type: z.enum(["banner", "text", "image", "video", "cta"]),
  title: text,
  titleFa: text,
  description: text,
  descriptionFa: text,
  media: mediaUrl.default(""),
  mobileMedia: mediaUrl.default(""),
  cta: text,
  ctaFa: text,
  url: localUrl.default(""),
  enabled: z.boolean().default(true),
});
export const slotSchema = z.object({
  mode: z.enum(["intro", "image", "video", "market"]).default("intro"),
  title: text,
  titleFa: text,
  description: text,
  descriptionFa: text,
  media: mediaUrl.default(""),
  poster: mediaUrl.default(""),
  cta: text,
  ctaFa: text,
  url: localUrl.default(""),
});
export const campaignSchema = slotSchema
  .extend({
    id: z.string().max(80),
    slot: z.enum(["laptop", "phone"]),
    status: z.enum(["draft", "approved", "disabled"]),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    liveAt: z.string().datetime().or(z.literal("")).default(""),
    advertiser: text,
  })
  .superRefine((c, ctx) => {
    if (c.endsAt <= c.startsAt)
      ctx.addIssue({
        code: "custom",
        message: "Campaign end must follow its start",
      });
    if (c.status === "approved" && (!c.media || !c.url))
      ctx.addIssue({
        code: "custom",
        message: "Approved campaigns need uploaded media and a destination",
      });
    if (c.status === "approved" && !["image", "video"].includes(c.mode))
      ctx.addIssue({
        code: "custom",
        message: "Campaigns need image or video mode",
      });
  });
export const heroSchema = z.object({
  laptop: slotSchema,
  phone: slotSchema,
  campaigns: z.array(campaignSchema).max(30),
});
export const heroDefaults = {
  laptop: {
    mode: "intro",
    title: "Smarter tools. Brighter traders.",
    titleFa: "ابزارهای هوشمندتر، معامله‌گران آگاه‌تر",
    description: "Your trading journey, all in one place.",
    descriptionFa: "تمام مسیر معاملاتی شما، در یک پلتفرم.",
    media: "",
    poster: "",
    cta: "Explore services",
    ctaFa: "کشف خدمات",
    url: "",
  },
  phone: {
    mode: "intro",
    title: "Track. Analyze. Improve.",
    titleFa: "ثبت کن. تحلیل کن. پیشرفت کن.",
    description: "Your trading journal",
    descriptionFa: "ژورنال معاملاتی شما",
    media: "",
    poster: "",
    cta: "",
    ctaFa: "",
    url: "",
  },
  campaigns: [],
};
export const contentSchema = z
  .object({
    id: z.string().max(80),
    kind: z.enum(["product", "video"]),
    status: z.enum(["draft", "published"]),
    title: text,
    titleFa: text,
    description: text,
    descriptionFa: text,
    originalLanguage: z.string().min(2).max(20).default("en"),
    creator: text,
    image: mediaUrl.default(""),
    video: mediaUrl.default(""),
    url: localUrl.default(""),
    price: z.number().min(0).max(1000000).default(0),
    currency: z.enum(["USD", "EUR", "IRR"]).default("USD"),
    category: text,
    createdAt: z.string().datetime(),
  })
  .superRefine((v, ctx) => {
    if (v.status === "published" && (!v.title || !v.image))
      ctx.addIssue({
        code: "custom",
        message: "Published content needs a title and image",
      });
  });
export function selectSlot(hero, slot, now = Date.now()) {
  const active = hero.campaigns.find(
    (c) =>
      c.slot === slot &&
      c.status === "approved" &&
      Date.parse(c.startsAt) <= now &&
      now < Date.parse(c.endsAt),
  );
  return active
    ? { ...active, sponsored: true }
    : { ...hero[slot], sponsored: false };
}
export function validateCampaignOverlap(list) {
  const approved = list.filter((c) => c.status === "approved");
  return approved.some((a, i) =>
    approved
      .slice(i + 1)
      .some(
        (b) =>
          a.slot === b.slot && a.startsAt < b.endsAt && b.startsAt < a.endsAt,
      ),
  );
}
export function localizedContent(item, field, lang) {
  const translated =
    lang === "fa"
      ? item[field + "Fa"]
      : item.originalLanguage === "en"
        ? item[field]
        : "";
  return {
    text: translated || item[field] || "",
    translated: !!translated,
    missing: lang !== item.originalLanguage && !translated,
  };
}
