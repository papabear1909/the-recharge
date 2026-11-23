// Writes TRANSLATION_REVIEW.md from the three strings files.  node tools/translation-review.mjs
import { writeFileSync } from "node:fs";
import en from "../public/assets/i18n/en.js";
import sw from "../public/assets/i18n/sw.js";
import ki from "../public/assets/i18n/ki.js";

const flat = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) return v.map((item, i) => [`${key}[${i}]`, Array.isArray(item) ? item.join(" ") : String(item)]);
    if (v && typeof v === "object") return flat(v, key);
    return [[key, String(v)]];
  });

const E = Object.fromEntries(flat(en));
const S = Object.fromEntries(flat(sw));
const K = Object.fromEntries(flat(ki));
const keys = [...new Set([...Object.keys(E), ...Object.keys(S), ...Object.keys(K)])].filter((k) => k !== "meta_lang");
const cell = (s) => (s == null ? "" : s.replace(/\|/g, "\\|"));

let md = `# Translation review

Every Swahili (sw) and Gĩkũyũ (ki) string below is a draft written without a native speaker. Each one is marked NEEDS_REVIEW.
Please correct the text directly in \`public/assets/i18n/sw.js\` and \`public/assets/i18n/ki.js\`, then run \`node tools/translation-review.mjs\` to refresh this list.

Points to check first:

- The scripture lines (\`scripture\`) are drafts, not quotations from a published Swahili or Gĩkũyũ Bible. Replace them with the wording your church uses.
- The theme words (\`theme_from\`, \`theme_to\`, \`theme_line\`) appear very large on the page.
- Where a Gĩkũyũ word was uncertain, English was kept on purpose ("Live", "Menu", "Copy address", "Not to scale", "Coordinates", "Parking", "Accommodation", "Bishop", "Reverend").
- \`clock_*\` builds the local way of telling time, for example 10:00 is "saa nne asubuhi".
- Speaker titles are in \`titles\`.

| Key | English | Kiswahili | Status | Gĩkũyũ | Status |
|---|---|---|---|---|---|
`;
for (const k of keys) {
  md += `| \`${k}\` | ${cell(E[k])} | ${cell(S[k])} | NEEDS_REVIEW | ${cell(K[k])} | NEEDS_REVIEW |\n`;
}
writeFileSync(new URL("../TRANSLATION_REVIEW.md", import.meta.url), md, "utf8");
console.log(`TRANSLATION_REVIEW.md: ${keys.length} strings, ${keys.length * 2} marked NEEDS_REVIEW`);
