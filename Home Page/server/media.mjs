const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
export function sniffMedia(bytes) {
  if (bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71)
    return ["png", "image/png"];
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
    return ["jpg", "image/jpeg"];
  const s = new TextDecoder().decode(bytes.slice(0, 16));
  if (s.startsWith("RIFF") && s.slice(8, 12) === "WEBP")
    return ["webp", "image/webp"];
  if (s.slice(4, 8) === "ftyp") return ["mp4", "video/mp4"];
  if (
    bytes[0] === 26 &&
    bytes[1] === 69 &&
    bytes[2] === 223 &&
    bytes[3] === 163
  )
    return ["webm", "video/webm"];
  return null;
}
export async function uploadMedia(request, bucket) {
  if (!bucket) return json({ error: "Media storage is unavailable" }, 503);
  const max = 50 * 1024 * 1024;
  if (Number(request.headers.get("content-length")) > max)
    return json({ error: "Maximum upload size is 50 MB" }, 413);
  const reader = request.body?.getReader();
  if (!reader) return json({ error: "Select a file" }, 400);
  let size = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      return json({ error: "Maximum upload size is 50 MB" }, 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let pos = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, pos);
    pos += chunk.length;
  }
  chunks.length = 0;
  const kind = sniffMedia(bytes);
  if (!kind) return json({ error: "Use PNG, JPEG, WebP, MP4 or WebM" }, 415);
  if (kind[1].startsWith("image/") && size > 10 * 1024 * 1024)
    return json({ error: "Images must be smaller than 10 MB" }, 413);
  const key = crypto.randomUUID() + "." + kind[0];
  await bucket.put("media/" + key, bytes, {
    httpMetadata: { contentType: kind[1] },
  });
  return json({ url: "/api/media/" + key, type: kind[1], size }, 201);
}
export async function readMedia(request, bucket) {
  if (!bucket) return new Response("Media unavailable", { status: 503 });
  const key = new URL(request.url).pathname.slice("/api/media/".length);
  if (!/^[a-zA-Z0-9-]+\.(png|jpg|webp|mp4|webm)$/.test(key))
    return new Response("Not found", { status: 404 });
  const meta = await bucket.head("media/" + key);
  if (!meta) return new Response("Not found", { status: 404 });
  const headers = {
    "content-type":
      meta.httpMetadata?.contentType || "application/octet-stream",
    "x-content-type-options": "nosniff",
    "cache-control": "private, max-age=86400",
    "accept-ranges": "bytes",
  };
  let options,
    code = 200;
  const range = request.headers.get("range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2]))
      return new Response(null, {
        status: 416,
        headers: { "content-range": "bytes */" + meta.size },
      });
    const start = match[1]
      ? Number(match[1])
      : Math.max(0, meta.size - Number(match[2]));
    const end = match[1]
      ? match[2]
        ? Math.min(Number(match[2]), meta.size - 1)
        : meta.size - 1
      : meta.size - 1;
    if (start >= meta.size || end < start)
      return new Response(null, {
        status: 416,
        headers: { "content-range": "bytes */" + meta.size },
      });
    options = { range: { offset: start, length: end - start + 1 } };
    headers["content-range"] = `bytes ${start}-${end}/${meta.size}`;
    headers["content-length"] = String(end - start + 1);
    code = 206;
  } else headers["content-length"] = String(meta.size);
  if (request.method === "HEAD")
    return new Response(null, { headers, status: code });
  const file = await bucket.get("media/" + key, options);
  return new Response(file.body, { headers, status: code });
}
