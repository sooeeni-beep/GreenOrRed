import {
  defaultConfig,
  configSchema,
  publicConfig,
  normalizeConfig,
} from "../shared/config.mjs";
import { uploadMedia, readMedia } from "./media.mjs";
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
export async function handleApi(request, db, userId, bucket) {
  const path = new URL(request.url).pathname;
  if (!db)
    return json(
      {
        error:
          "The homepage database is temporarily unavailable. Please retry.",
      },
      503,
    );
  try {
    if (
      path.startsWith("/api/media/") &&
      ["GET", "HEAD"].includes(request.method)
    )
      return readMedia(request, bucket);
    if (path === "/api/home" && request.method === "GET") {
      const row = await db
        .prepare("SELECT config,revision FROM home_state WHERE id = ?")
        .bind("home")
        .first();
      return json({
        config: publicConfig(row ? JSON.parse(row.config) : defaultConfig),
        revision: row?.revision ?? 0,
      });
    }
    if (!path.startsWith("/api/admin"))
      return json({ error: "Not found" }, 404);
    if (!userId)
      return json({ error: "Sign in to access homepage administration." }, 401);
    // This deployment is OWNER-PRIVATE. The first authenticated owner is persisted.
    // Do not widen platform access without replacing bootstrap with an explicit admin allowlist.
    await db
      .prepare(
        "INSERT INTO admin_owner (id,user_id) VALUES (?,?) ON CONFLICT(id) DO NOTHING",
      )
      .bind("owner", userId)
      .run();
    const owner = await db
      .prepare("SELECT user_id FROM admin_owner WHERE id = ?")
      .bind("owner")
      .first();
    if (owner?.user_id !== userId)
      return json(
        { error: "Only the homepage owner can administer this site." },
        403,
      );
    if (path === "/api/admin/media" && request.method === "POST") {
      const origin = request.headers.get("origin");
      if (origin && origin !== new URL(request.url).origin)
        return json({ error: "Cross-origin writes are not allowed." }, 403);
      return await uploadMedia(request, bucket);
    }
    if (path === "/api/admin/home" && request.method === "GET") {
      const row = await db
        .prepare(
          "SELECT config,revision,updated_at FROM home_state WHERE id = ?",
        )
        .bind("home")
        .first();
      return json({
        config: normalizeConfig(row ? JSON.parse(row.config) : defaultConfig),
        revision: row?.revision ?? 0,
        updatedAt: row?.updated_at ?? null,
      });
    }
    if (path === "/api/admin/home" && request.method === "PUT") {
      const origin = request.headers.get("origin");
      if (origin && origin !== new URL(request.url).origin)
        return json({ error: "Cross-origin writes are not allowed." }, 403);
      if (!request.headers.get("content-type")?.includes("application/json"))
        return json({ error: "JSON required" }, 415);
      const text = await request.text();
      if (text.length > 256000)
        return json({ error: "Configuration too large" }, 413);
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }
      const parsed = configSchema.safeParse(body.config);
      if (!parsed.success)
        return json(
          { error: parsed.error.issues.map((v) => v.message).join(" ") },
          400,
        );
      if (!Number.isInteger(body.revision) || body.revision < 0)
        return json({ error: "Invalid revision" }, 400);
      const current = await db
        .prepare("SELECT revision FROM home_state WHERE id = ?")
        .bind("home")
        .first();
      if ((current?.revision ?? 0) !== body.revision)
        return json(
          {
            error:
              "Another session updated this page. Reload the saved version before making changes.",
          },
          409,
        );
      const now = new Date().toISOString();
      const result = await db
        .prepare(
          "INSERT INTO home_state (id,config,revision,updated_at) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET config=excluded.config,revision=excluded.revision,updated_at=excluded.updated_at WHERE home_state.revision = ? RETURNING revision",
        )
        .bind(
          "home",
          JSON.stringify(parsed.data),
          body.revision + 1,
          now,
          body.revision,
        )
        .first();
      if (!result)
        return json(
          { error: "Another session updated this page. Reload before saving." },
          409,
        );
      return json({ revision: result.revision, updatedAt: now });
    }
    return json({ error: "Not found" }, 404);
  } catch (error) {
    console.error("Homepage storage error", error.message);
    return json(
      {
        error:
          "Unable to access saved settings. Your unsaved changes are still here; please retry.",
      },
      503,
    );
  }
}
