import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultConfig,
  normalizeConfig,
  configSchema,
  publicConfig,
} from "../shared/config.mjs";
import { selectSlot, localizedContent } from "../shared/media.mjs";
import { uploadMedia, readMedia } from "../server/media.mjs";
const campaign = {
  id: "ad-1",
  slot: "laptop",
  status: "approved",
  mode: "image",
  media: "/assets/brand.webp",
  url: "/profile",
  startsAt: "2026-09-25T10:00:00.000Z",
  endsAt: "2026-09-25T11:00:00.000Z",
};
test("legacy config preserves modules and receives non-destructive media defaults", () => {
  const c = normalizeConfig(defaultConfig);
  assert.equal(c.modules.length, 6);
  assert.equal(c.hero.laptop.mode, "intro");
  assert.deepEqual(c.content, []);
  assert.deepEqual(c.modules[0].contentBlocks, []);
});
test("campaign begins inclusively, ends exclusively and falls back automatically", () => {
  const c = normalizeConfig({
    ...defaultConfig,
    hero: { ...normalizeConfig(defaultConfig).hero, campaigns: [campaign] },
  });
  assert.equal(
    selectSlot(c.hero, "laptop", Date.parse(campaign.startsAt) - 1).sponsored,
    false,
  );
  assert.equal(
    selectSlot(c.hero, "laptop", Date.parse(campaign.startsAt)).id,
    "ad-1",
  );
  assert.equal(
    selectSlot(c.hero, "laptop", Date.parse(campaign.endsAt)).sponsored,
    false,
  );
  assert.equal(
    selectSlot(c.hero, "phone", Date.parse(campaign.startsAt)).sponsored,
    false,
  );
});
test("same-slot overlap and wrong media rejected; separate slots and adjacent intervals accepted", () => {
  const c = normalizeConfig(defaultConfig);
  c.hero.campaigns = [campaign, { ...campaign, id: "ad-2" }];
  assert.equal(configSchema.safeParse(c).success, false);
  c.hero.campaigns[1].slot = "phone";
  assert.equal(configSchema.safeParse(c).success, true);
  c.hero.campaigns[1] = {
    ...campaign,
    id: "ad-2",
    startsAt: campaign.endsAt,
    endsAt: "2026-09-25T12:00:00.000Z",
  };
  assert.equal(configSchema.safeParse(c).success, true);
  c.hero.laptop = {
    ...c.hero.laptop,
    mode: "video",
    media: "/assets/brand.webp",
  };
  assert.equal(configSchema.safeParse(c).success, false);
});
test("public payload excludes drafts and upload inventory", () => {
  const c = normalizeConfig(defaultConfig);
  c.mediaLibrary = [
    {
      url: "/assets/brand.webp",
      type: "image/webp",
      size: 20,
      name: "Private draft",
    },
  ];
  c.hero.campaigns = [{ ...campaign, status: "draft" }];
  c.content = [
    {
      id: "p-1",
      kind: "product",
      status: "draft",
      createdAt: campaign.startsAt,
    },
  ];
  const p = publicConfig(c);
  assert.equal("mediaLibrary" in p, false);
  assert.deepEqual(p.content, []);
  assert.deepEqual(p.hero.campaigns, []);
});
test("translated copy preserves original and explicitly identifies missing translation", () => {
  const c = { title: "Original", titleFa: "ترجمه", originalLanguage: "en" };
  assert.equal(localizedContent(c, "title", "fa").text, "ترجمه");
  assert.equal(c.title, "Original");
  assert.equal(
    localizedContent({ ...c, titleFa: "" }, "title", "fa").missing,
    true,
  );
});
test("uploaded media survives storage and supports range/HEAD; unsupported payload rejected", async () => {
  const objects = new Map();
  const bucket = {
    async put(k, b, o) {
      objects.set(k, { bytes: b, ...o });
    },
    async head(k) {
      const o = objects.get(k);
      return o && { size: o.bytes.length, httpMetadata: o.httpMetadata };
    },
    async get(k, opts) {
      const o = objects.get(k),
        r = opts?.range;
      return {
        body: r ? o.bytes.slice(r.offset, r.offset + r.length) : o.bytes,
      };
    },
  };
  const bytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3, 4]);
  const up = await uploadMedia(
    new Request("https://site.test/api/admin/media", {
      method: "POST",
      body: bytes,
    }),
    bucket,
  );
  assert.equal(up.status, 201);
  const { url } = await up.json();
  const partial = await readMedia(
    new Request("https://site.test" + url, {
      headers: { range: "bytes=8-10" },
    }),
    bucket,
  );
  assert.equal(partial.status, 206);
  assert.equal(partial.headers.get("content-range"), "bytes 8-10/12");
  assert.deepEqual([...new Uint8Array(await partial.arrayBuffer())], [1, 2, 3]);
  assert.equal(
    (
      await readMedia(
        new Request("https://site.test" + url, { method: "HEAD" }),
        bucket,
      )
    ).headers.get("content-length"),
    "12",
  );
  assert.equal(
    (
      await readMedia(
        new Request("https://site.test" + url, {
          headers: { range: "bytes=99-" },
        }),
        bucket,
      )
    ).status,
    416,
  );
  assert.equal(
    (
      await uploadMedia(
        new Request("https://site.test/api/admin/media", {
          method: "POST",
          body: "<script>bad</script>",
        }),
        bucket,
      )
    ).status,
    415,
  );
});
