// Static checks for the upload folder.  node tools/check-site.mjs
// Strings in all languages, every referenced file exists, the offline list is complete,
// no duplicate ids, links are the real ones, no third-party requests, no em or en dashes.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import config from "../public/config.js";
import en from "../public/assets/i18n/en.js";
import sw from "../public/assets/i18n/sw.js";
import ki from "../public/assets/i18n/ki.js";

const PUB = resolve(dirname(fileURLToPath(import.meta.url)), "../public");
const problems = [];
const ok = [];
const fail = (m) => problems.push(m);

// 1. every language has every key, no empty strings, placeholders match
const shape = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? `array:${v.length}` : typeof v]));
const E = shape(en);
for (const [name, pack] of [["sw", sw], ["ki", ki]]) {
  const P = shape(pack);
  for (const k of Object.keys(E)) {
    if (!(k in P)) fail(`${name}: missing key ${k}`);
    else if (E[k] !== P[k] && k !== "clock_format") fail(`${name}: ${k} is ${P[k]}, English is ${E[k]}`);
  }
  for (const k of Object.keys(P)) if (!(k in E) && !k.startsWith("clock_")) fail(`${name}: extra key ${k}`);
  for (const [k, v] of Object.entries(pack)) {
    if (typeof v === "string") {
      if (!v.trim()) fail(`${name}: ${k} is empty`);
      const ph = (s) => (s.match(/\{\w+\}/g) || []).sort().join();
      if (typeof en[k] === "string" && ph(en[k]) !== ph(v)) fail(`${name}: ${k} placeholders ${ph(v)} differ from English ${ph(en[k])}`);
    }
  }
}
ok.push("strings: same keys and placeholders in en, sw, ki");

// 2. every data-i18n key used in the page exists
const html = readFileSync(join(PUB, "index.html"), "utf8");
for (const m of html.matchAll(/data-i18n="(\w+)"/g)) if (!(m[1] in en)) fail(`index.html uses unknown key ${m[1]}`);
for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) for (const pair of m[1].split(";")) { const k = pair.split(":")[1]; if (!(k in en)) fail(`index.html attr uses unknown key ${k}`); }
const js = readdirSync(join(PUB, "assets/js")).map((f) => readFileSync(join(PUB, "assets/js", f), "utf8")).join("\n");
for (const m of js.matchAll(/\bt\("(\w+)"/g)) if (!(m[1] in en)) fail(`script uses unknown key ${m[1]}`);
ok.push("strings: every key used by the page and scripts exists");

// 3. duplicate ids
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dup.length) fail(`duplicate ids: ${dup.join(", ")}`);
for (const m of html.matchAll(/(?:href|aria-controls|aria-labelledby)="#?([\w-]+)"/g)) {
  if (html.includes(`href="#${m[1]}"`) || m[0].startsWith("aria")) if (!ids.includes(m[1]) && !m[1].startsWith("http")) fail(`reference to missing id ${m[1]}`);
}
ok.push(`ids: ${ids.length} unique, all in-page links resolve`);

// 4. every local file referenced exists
const refs = new Set();
const scan = (text, base) => {
  for (const m of text.matchAll(/(?:src|href|srcset)="([^"#]+)"/g)) m[1].split(",").forEach((part) => refs.add(join(base, part.trim().split(" ")[0])));
  for (const m of text.matchAll(/url\("?([^")]+)"?\)/g)) if (!m[1].startsWith("data:") && !m[1].startsWith("#")) refs.add(join(base, m[1]));
};
scan(html, PUB);
for (const f of ["site.css", "poster.css"]) scan(readFileSync(join(PUB, "assets/css", f), "utf8"), join(PUB, "assets/css"));
for (const sp of config.speakers) for (const k of ["still", "stillSmall", "video", "videoWebm"]) if (sp[k]) {
  refs.add(join(PUB, sp[k]));
  if (sp.avif && /\.webp$/.test(sp[k])) refs.add(join(PUB, sp[k].replace(/\.webp$/, ".avif")));
}
const manifest = JSON.parse(readFileSync(join(PUB, "manifest.webmanifest"), "utf8"));
manifest.icons.forEach((i) => refs.add(join(PUB, i.src)));
for (const r of refs) {
  if (/^https?:|^tel:|^mailto:/.test(r.replace(PUB, "").replace(/^[\\/]/, ""))) continue;
  const p = r.split("?")[0];
  if (p.includes("REPLACE-WITH-YOUR-SITE") || /https?:/.test(p)) continue;
  if (!existsSync(p)) fail(`missing file: ${p.replace(PUB, "public")}`);
}
ok.push(`files: ${refs.size} references checked`);

// 5. the offline list only names files that exist
const swText = readFileSync(join(PUB, "sw.js"), "utf8");
const pre = [...swText.matchAll(/"\.\/([^"]*)"/g)].map((m) => m[1]);
for (const p of pre) if (p && !existsSync(join(PUB, p))) fail(`sw.js precache missing: ${p}`);
for (const f of readdirSync(join(PUB, "assets/js"))) if (!pre.includes(`assets/js/${f}`)) fail(`sw.js precache does not list assets/js/${f}`);
ok.push(`offline list: ${pre.length} entries exist`);

// 6. the real links, written exactly as given
const want = {
  youtube: "https://youtube.com/@jesushealingcentrechurchke5930",
  tiktok: "https://www.tiktok.com/@migwi_evangelism",
  map: "https://www.google.com/maps/place/Jesus+Healing+Centre+Church+Headquarters/data=!4m2!3m1!1s0x0:0x29a17d93d224dacd?sa=X&ved=1t:2428&ictx=111",
};
if (config.social.youtube !== want.youtube) fail("YouTube link changed");
if (config.social.tiktok !== want.tiktok) fail("TikTok link changed");
if (config.venue.mapUrl !== want.map) fail("Map link changed");
if (config.contact.phoneIntl !== "+254723545922") fail("phone changed");
ok.push("links: YouTube, TikTok, map and phone match the brief");

// 7. no third-party requests from the page itself
const third = [...html.matchAll(/(?:src|href)="(https?:[^"]+)"/g)].map((m) => m[1]);
for (const u of third) if (!u.includes("REPLACE-WITH-YOUR-SITE")) fail(`third-party reference in index.html: ${u}`);
if (/fonts\.googleapis|gstatic|cdn\./.test(html + js)) fail("CDN or Google Fonts reference found");
ok.push("network: nothing loads from another site");

// 8. no em or en dashes anywhere in the upload
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
for (const f of walk(PUB)) if (/\.(html|js|css|webmanifest|txt|svg)$|_headers$/.test(f)) {
  if (/[–—]/.test(readFileSync(f, "utf8"))) fail(`dash found in ${f.replace(PUB, "public")}`);
}
ok.push("copy: no em or en dashes");

// 9. schedule sanity
const sorted = config.days.flatMap((d) => d.sessions).map((s) => [Date.parse(s.start), Date.parse(s.end), s]);
for (const [a, b, s] of sorted) if (!(b > a)) fail(`session ends before it starts: ${s.start}`);
for (let i = 1; i < sorted.length; i++) if (sorted[i][0] < sorted[i - 1][1]) fail(`sessions overlap at ${sorted[i][2].start}`);
for (const [, , s] of sorted) if (!/\+03:00$/.test(s.start) || !/\+03:00$/.test(s.end)) fail(`missing +03:00 on ${s.start}`);
ok.push(`schedule: ${sorted.length} sessions, in order, no overlaps, all +03:00`);

ok.forEach((m) => console.log("ok   " + m));
problems.forEach((m) => console.log("FAIL " + m));
console.log(problems.length ? `\n${problems.length} problem(s)` : "\nall static checks pass");
process.exit(problems.length ? 1 : 0);
