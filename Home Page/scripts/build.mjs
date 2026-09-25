import "./assets.mjs";
import { build } from "vite";
import { build as bundle } from "esbuild";
import { readFile, rm } from "node:fs/promises";
await build({ configFile: "Home Page/vite.config.js" });
// Local review harness is never published.
await rm("dist/client/__qa.html", { force: true });
const html = await readFile("dist/client/index.html", "utf8");
await bundle({
  entryPoints: ["Home Page/server/worker.mjs"],
  outfile: "dist/server/index.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  define: { __APP_HTML__: JSON.stringify(html) },
});
