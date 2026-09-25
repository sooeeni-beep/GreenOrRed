import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { handleApi } from "./server/api.mjs";
function devApi() {
  return {
    name: "local-durable-api",
    configureServer(server) {
      mkdirSync(".dev-state", { recursive: true });
      const sqlite = new DatabaseSync(".dev-state/home.sqlite");
      sqlite.exec(
        "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY)",
      );
      for (const file of readdirSync("drizzle")
        .filter((v) => v.endsWith(".sql"))
        .sort())
        if (
          !sqlite.prepare("SELECT name FROM _migrations WHERE name=?").get(file)
        ) {
          sqlite.exec(readFileSync("drizzle/" + file, "utf8"));
          sqlite.prepare("INSERT INTO _migrations(name) VALUES (?)").run(file);
        }
      const db = {
        prepare(sql) {
          const s = sqlite.prepare(sql);
          return {
            bind(...values) {
              return {
                async first() {
                  return s.get(...values) || null;
                },
                async run() {
                  return s.run(...values);
                },
              };
            },
          };
        },
      };
      server.middlewares.use("/api", async (req, res) => {
        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const request = new Request(
            "http://" + req.headers.host + "/api" + req.url,
            {
              method: req.method,
              headers: req.headers,
              ...(!["GET", "HEAD"].includes(req.method)
                ? { body: Buffer.concat(chunks) }
                : {}),
            },
          );
          const response = await handleApi(request, db, "local-preview-owner");
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(await response.text());
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    },
  };
}
export default defineConfig({
  root: resolve("Home Page"),
  plugins: [react(), devApi()],
  server: { host: "0.0.0.0", port: 4173, allowedHosts: ["terminal.local"] },
  build: { outDir: resolve("dist/client"), emptyOutDir: true },
});
