import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { handleApi } from "../../Home Page/server/api.mjs";
import { catalogSchema, selectProducts } from "../shared/catalog.mjs";
const product = {
  id: "test-script",
  title: "QA only",
  titleFa: "آزمایش",
  description: "Test description",
  descriptionFa: "توضیح آزمایشی",
  creator: "QA",
  image: "/assets/brand.webp",
  platforms: ["mt5"],
  category: "automation",
  price: 29,
  currency: "USD",
  status: "published",
  createdAt: "2026-09-28T00:00:00.000Z",
  updatedAt: "2026-09-28T00:00:00.000Z",
};
function setup(file = ":memory:") {
  const sqlite = new DatabaseSync(file);
  for (const f of readdirSync("drizzle").filter((f) => f.endsWith(".sql")))
    sqlite.exec(readFileSync("drizzle/" + f, "utf8"));
  return { sqlite, db: adapter(sqlite) };
}
function adapter(sqlite) {
  return {
    prepare(sql) {
      const stmt = sqlite.prepare(sql);
      return {
        bind(...v) {
          return {
            async first() {
              return stmt.get(...v) || null;
            },
            async run() {
              return stmt.run(...v);
            },
          };
        },
      };
    },
  };
}
const get = (path = "/api/scripts") =>
  new Request("https://example.test" + path);
const put = (products, revision = 0, origin = "https://example.test") =>
  new Request("https://example.test/api/admin/scripts", {
    method: "PUT",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify({ config: { products }, revision }),
  });
test("empty by default; owner-only writes; drafts private; Home state unchanged; stale writes conflict", async () => {
  const { db, sqlite } = setup();
  const home = await (await handleApi(get("/api/home"), db, null)).json();
  assert.deepEqual(
    (await (await handleApi(get(), db, null)).json()).config.products,
    [],
  );
  assert.equal((await handleApi(put([product]), db, null)).status, 401);
  assert.equal(
    (await handleApi(get("/api/admin/scripts"), db, "owner")).status,
    200,
  );
  assert.equal((await handleApi(put([product]), db, "other")).status, 403);
  assert.equal(
    (await handleApi(put([product], 0, "https://evil.test"), db, "owner"))
      .status,
    403,
  );
  const draft = {
    ...product,
    id: "draft",
    status: "draft",
    image: "",
    description: "",
  };
  assert.equal(
    (await handleApi(put([product, draft]), db, "owner")).status,
    200,
  );
  assert.equal((await handleApi(put([]), db, "owner")).status, 409);
  const pub = await (await handleApi(get(), db, null)).json();
  assert.deepEqual(
    pub.config.products.map((p) => p.id),
    ["test-script"],
  );
  const admin = await (
    await handleApi(get("/api/admin/scripts"), db, "owner")
  ).json();
  assert.equal(admin.config.products.length, 2);
  assert.deepEqual(
    await (await handleApi(get("/api/home"), db, null)).json(),
    home,
  );
  assert.equal((await handleApi(put([], 1), db, "owner")).status, 200);
  assert.equal(
    (await (await handleApi(get(), db, null)).json()).config.products.length,
    0,
  );
  sqlite.close();
});
test("catalog survives reopening database", async () => {
  const dir = mkdtempSync(join(tmpdir(), "gor-catalog-"));
  const file = join(dir, "db.sqlite");
  let { sqlite, db } = setup(file);
  await handleApi(put([product]), db, "owner");
  sqlite.close();
  sqlite = new DatabaseSync(file);
  db = adapter(sqlite);
  assert.equal(
    (await (await handleApi(get(), db, null)).json()).config.products[0].title,
    "QA only",
  );
  sqlite.close();
  rmSync(dir, { recursive: true });
});
test("reject incomplete published products, unsafe media, invalid price, duplicate identifiers", () => {
  for (const patch of [
    { image: "" },
    { description: "" },
    { image: "https://evil.test/a.png" },
    { price: -1 },
    { platforms: [] },
  ])
    assert.equal(
      catalogSchema.safeParse({ products: [{ ...product, ...patch }] }).success,
      false,
    );
  assert.equal(
    catalogSchema.safeParse({ products: [product, product] }).success,
    false,
  );
});
test("search both languages, combine platform/category/price, exclude drafts and sort accurately", () => {
  const products = [
    product,
    {
      ...product,
      id: "two",
      title: "Volume",
      price: 10,
      platforms: ["mt4"],
      category: "volume",
    },
    { ...product, id: "hidden", status: "draft", price: 1 },
  ];
  assert.equal(selectProducts(products, { query: "آزمایش" }).length, 2);
  assert.deepEqual(
    selectProducts(products, {
      platform: ["mt5"],
      category: ["automation"],
      maxPrice: 30,
    }).map((p) => p.id),
    ["test-script"],
  );
  assert.equal(
    selectProducts(products, { platform: ["mt4"], category: ["automation"] }).length,
    0,
  );
  assert.deepEqual(
    selectProducts(products, { sort: "price-low" }).map((p) => p.price),
    [10, 29],
  );
});
