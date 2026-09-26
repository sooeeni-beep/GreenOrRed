import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
const path = (k) =>
  resolve(".dev-state/uploads", k.replace(/[^a-zA-Z0-9/.-]/g, ""));
export const localBucket = {
  async put(key, bytes, opts) {
    await mkdir(resolve(".dev-state/uploads/media"), { recursive: true });
    await writeFile(path(key), bytes);
    await writeFile(path(key) + ".json", JSON.stringify(opts));
  },
  async head(key) {
    try {
      const s = await stat(path(key)),
        opts = JSON.parse(await readFile(path(key) + ".json", "utf8"));
      return { size: s.size, ...opts };
    } catch {
      return null;
    }
  },
  async get(key, opts) {
    let bytes = await readFile(path(key));
    if (opts?.range)
      bytes = bytes.subarray(
        opts.range.offset,
        opts.range.offset + opts.range.length,
      );
    return { body: new Uint8Array(bytes) };
  },
};
