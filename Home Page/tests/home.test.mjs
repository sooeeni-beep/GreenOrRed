import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  defaultConfig,
  visibleModules,
  toggleModule,
  configSchema,
} from "../shared/config.mjs";
import { handleApi } from "../server/api.mjs";
function setup(filename = ":memory:") {
  const sqlite = new DatabaseSync(filename);
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
const get = (path = "/api/home") => new Request("https://example.test" + path);
const put = (config, revision = 0, origin = "https://example.test") =>
  new Request("https://example.test/api/admin/home", {
    method: "PUT",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify({ config, revision }),
  });
test("referral accordion starts closed; a new card replaces the previous and active card closes", () => {
  let a = null;
  a = toggleModule(a, "traders");
  assert.equal(a, "traders");
  a = toggleModule(a, "educators");
  assert.equal(a, "educators");
  assert.equal(toggleModule(a, "educators"), null);
});
test("hidden/disabled/archived services disappear without mutating their saved data", () => {
  const c = structuredClone(defaultConfig);
  c.modules[0].enabled = false;
  c.modules[1].showOnHome = false;
  c.modules[2].status = "archived";
  assert.deepEqual(
    visibleModules(c).map((m) => m.id),
    ["videos", "journal", "products"],
  );
  assert.equal(c.modules.length, 6);
});
test("journal/products cannot become accordion sections; duplicate IDs and unsafe links rejected", () => {
  const c = structuredClone(defaultConfig);
  c.modules[4].display = "expandable";
  assert.equal(configSchema.safeParse(c).success, false);
  const d = structuredClone(defaultConfig);
  d.modules.push(d.modules[0]);
  assert.equal(configSchema.safeParse(d).success, false);
  const e = structuredClone(defaultConfig);
  e.modules[0].url = "javascript:alert(1)";
  assert.equal(configSchema.safeParse(e).success, false);
});
test("authorization, validation, concurrency and disabled-data preservation", async () => {
  const { db, sqlite } = setup();
  assert.equal((await handleApi(get("/api/admin/home"), db, null)).status, 401);
  assert.equal(
    (await handleApi(get("/api/admin/home"), db, "owner")).status,
    200,
  );
  assert.equal((await handleApi(put(defaultConfig), db, "other")).status, 403);
  assert.equal(
    (await handleApi(put(defaultConfig, 0, "https://evil.test"), db, "owner"))
      .status,
    403,
  );
  const c = structuredClone(defaultConfig);
  c.modules[0].enabled = false;
  assert.equal((await handleApi(put(c), db, "owner")).status, 200);
  assert.equal((await handleApi(put(c), db, "owner")).status, 409);
  const pub = await (await handleApi(get(), db, null)).json();
  assert.equal(pub.config.modules.length, 5);
  const admin = await (
    await handleApi(get("/api/admin/home"), db, "owner")
  ).json();
  assert.equal(admin.config.modules.length, 6);
  assert.equal(admin.config.modules[0].enabled, false);
  c.modules[0].enabled = true;
  assert.equal((await handleApi(put(c, 1), db, "owner")).status, 200);
  sqlite.close();
});
test("saved settings and owner survive closing and reopening the database", async () => {
  const folder = mkdtempSync(join(tmpdir(), "gor-home-"));
  const file = join(folder, "home.sqlite");
  let { db, sqlite } = setup(file);
  await handleApi(get("/api/admin/home"), db, "owner");
  const config = structuredClone(defaultConfig);
  config.modules[0].title = "Saved through restart";
  await handleApi(put(config), db, "owner");
  sqlite.close();
  sqlite = new DatabaseSync(file);
  db = adapter(sqlite);
  const body = await (await handleApi(get(), db, null)).json();
  assert.equal(body.config.modules[0].title, "Saved through restart");
  assert.equal(
    (await handleApi(put(defaultConfig, 1), db, "other")).status,
    403,
  );
  sqlite.close();
  rmSync(folder, { recursive: true });
});
test("database outage gives recoverable 503 instead of silently losing settings", async () => {
  assert.equal((await handleApi(get(), null, null)).status, 503);
});
