// Tiny local server for testing (no installs needed):  node tools/serve.mjs   then open http://localhost:8787
// It serves public/ like Cloudflare Pages would, including HEAD requests, video ranges, 404.html
// and the rules in public/_headers (so the security policy is tested locally too).
import { createServer } from "node:http";
import { createReadStream, statSync, existsSync, readFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../public", import.meta.url)));
const PORT = Number(process.argv[2] || process.env.PORT || 8787);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml",
  ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2",
  ".mp4": "video/mp4", ".webm": "video/webm", ".txt": "text/plain; charset=utf-8", ".ics": "text/calendar",
};

// _headers: a path line, then indented "Name: value" lines. A * matches anything.
function loadHeaderRules() {
  const rules = [];
  let current = null;
  const file = join(ROOT, "_headers");
  if (!existsSync(file)) return rules;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) {
      const escaped = line.trim().split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
      current = { pattern: new RegExp("^" + escaped + "$"), headers: {} };
      rules.push(current);
    } else if (current) {
      const i = line.indexOf(":");
      current.headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return rules;
}

createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const path = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, "");
  let file = join(ROOT, path);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  let status = 200;
  if (!existsSync(file)) { file = join(ROOT, "404.html"); status = 404; }
  const size = statSync(file).size;
  const headers = { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Accept-Ranges": "bytes", "Cache-Control": "no-cache" };
  for (const rule of loadHeaderRules()) if (rule.pattern.test(url.pathname)) Object.assign(headers, rule.headers);
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
  if (range && status === 200) {
    const start = range[1] ? Number(range[1]) : size - Number(range[2]);
    const end = range[1] && range[2] ? Number(range[2]) : size - 1;
    res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1 });
    if (req.method === "HEAD") return res.end();
    return createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(status, { ...headers, "Content-Length": size });
  if (req.method === "HEAD") return res.end();
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`The Recharge: http://localhost:${PORT}`));
