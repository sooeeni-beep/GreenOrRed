import { catalogSchema } from "../shared/catalog.mjs";
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
const key = "script-catalog";
export async function scriptsCatalogApi(request, db, admin = false) {
  if (request.method === "GET") {
    const row = await db
      .prepare("SELECT config,revision FROM home_state WHERE id = ?")
      .bind(key)
      .first();
    const config = row
      ? catalogSchema.parse(JSON.parse(row.config))
      : { products: [] };
    return json({
      config: admin
        ? config
        : { products: config.products.filter((p) => p.status === "published") },
      revision: row?.revision ?? 0,
    });
  }
  if (!admin || request.method !== "PUT")
    return json({ error: "Method not allowed" }, 405);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return json({ error: "Cross-origin writes are not allowed" }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ error: "JSON required" }, 415);
  const text = await request.text();
  if (text.length > 512000) return json({ error: "Catalog too large" }, 413);
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const parsed = catalogSchema.safeParse(body?.config);
  if (!parsed.success)
    return json(
      { error: parsed.error.issues.map((i) => i.message).join(" ") },
      400,
    );
  if (!Number.isInteger(body?.revision) || body.revision < 0)
    return json({ error: "Invalid revision" }, 400);
  const row = await db
    .prepare("SELECT revision FROM home_state WHERE id = ?")
    .bind(key)
    .first();
  if ((row?.revision ?? 0) !== body.revision)
    return json(
      { error: "Another session updated this catalog. Reload before saving." },
      409,
    );
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      "INSERT INTO home_state (id,config,revision,updated_at) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET config=excluded.config,revision=excluded.revision,updated_at=excluded.updated_at WHERE home_state.revision = ? RETURNING revision",
    )
    .bind(
      key,
      JSON.stringify(parsed.data),
      body.revision + 1,
      now,
      body.revision,
    )
    .first();
  if (!result)
    return json(
      { error: "Another session updated this catalog. Reload before saving." },
      409,
    );
  return json({ revision: result.revision, updatedAt: now });
}
