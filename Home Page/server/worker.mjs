import { handleApi } from "./api.mjs";
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/"))
      return handleApi(
        request,
        env.DB,
        request.headers.get("oai-authenticated-user-id"),
        env.BUCKET,
      );
    if (request.method !== "GET" && request.method !== "HEAD")
      return new Response("Method not allowed", { status: 405 });
    if (
      url.pathname === "/" ||
      url.pathname === "/admin" ||
      url.pathname === "/admin/"
    )
      return new Response(request.method === "HEAD" ? null : __APP_HTML__, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-cache",
          "x-content-type-options": "nosniff",
          "referrer-policy": "strict-origin-when-cross-origin",
        },
      });
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Not found", { status: 404 });
  },
};
