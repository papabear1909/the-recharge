// WCAG contrast for every text and UI colour pair the site uses.  node tools/contrast.mjs
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function lum(hex, alpha = 1, over = "#ffffff") {
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const fg = rgb(hex);
  const bg = rgb(over);
  const mix = fg.map((v, i) => v * alpha + bg[i] * (1 - alpha));
  const [r, g, b] = mix.map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => {
  const [x, y] = [a, b].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const C = {
  plum950: "#1b0e22", plum900: "#2f1a36", plum800: "#3c2146", plum700: "#4a2766",
  violet600: "#7a479d", violet300: "#c3a9dc", violet100: "#ece3f5", violet50: "#f7f3fb",
  navy: "#021753", red: "#e3080b", white: "#ffffff", muted: "#5e4c6c",
};

// [label, fg, bg, need, fgAlpha]
const pairs = [
  ["Body text: navy on white", C.navy, C.white, 4.5],
  ["Headings: plum on white", C.plum900, C.white, 4.5],
  ["Past rows, notes: muted on white", C.muted, C.white, 4.5],
  ["Row numbers: violet on white", C.violet600, C.white, 4.5],
  ["Next flag, red text on white", C.red, C.white, 4.5],
  ["Buttons: white on red", C.white, C.red, 4.5],
  ["Hero text: white on plum", C.white, C.plum900, 4.5],
  ["Hero bottom: white on plum-700", C.white, C.plum700, 4.5],
  ["Ticker: white on plum-800", C.white, C.plum800, 4.5],
  ["Countdown labels: violet-300 on plum", C.violet300, C.plum900, 4.5],
  ["Countdown labels: violet-300 on plum-700", C.violet300, C.plum700, 4.5],
  ["Notes: violet-100 on plum", C.violet100, C.plum900, 4.5],
  ["Notes: violet-100 on plum-700", C.violet100, C.plum700, 4.5],
  ["Red on plum (large type and shapes only)", C.red, C.plum900, 3],
  ["Red over the giant year numeral (shapes only)", C.red, "#371f3f", 3],
  ["Inquiries: plum on violet-50", C.plum900, C.violet50, 4.5],
  ["Inquiries: navy on violet-50", C.navy, C.violet50, 4.5],
  ["WhatsApp button: white on plum", C.white, C.plum900, 4.5],
  ["Footer: white on plum-950", C.white, C.plum950, 4.5],
  ["Footer notes: violet-100 on plum-950", C.violet100, C.plum950, 4.5],
  // poster edition
  ["Poster: ink on paper", "#14161f", "#efeeeb", 4.5],
  ["Poster: soft ink on paper", "#4a4f63", "#efeeeb", 4.5],
  ["Poster: navy on paper", "#1d2b5b", "#efeeeb", 4.5],
  ["Poster: red date text on paper", "#c8141a", "#efeeeb", 4.5],
  ["Poster: title gradient top (large) on paper", "#da6409", "#efeeeb", 3],
  ["Poster: title gradient bottom (large) on paper", "#c8141a", "#efeeeb", 3],
  ["Poster: yellow on navy (THEME label)", "#f9c80e", "#1d2b5b", 4.5],
  ["Poster: white on deep red (theme bar)", "#ffffff", "#8e1414", 4.5],
  ["Poster: white on navy", "#ffffff", "#1d2b5b", 4.5],
  ["Poster: white on red (ticker in session)", "#ffffff", "#c8141a", 4.5],
  ["Poster: live red shapes on navy", "#ff3b30", "#1d2b5b", 3],
  ["Poster: orange shapes on navy", "#f39a1e", "#1d2b5b", 3],
  ["Poster: orange script on plum (large)", "#f39a1e", "#2f1a36", 3],
  ["Poster: red numbers on white", "#c8141a", "#ffffff", 4.5],
  ["Poster: white on completed-day cover (purple 90% over white)", "#ffffff", "#7d4a9d", 4.5],
  ["Poster: yellow script on completed-day cover (large)", "#f9c80e", "#7d4a9d", 3],
  ["Poster: white title on purple veil over bright sky (large)", "#ffffff", "#8a5aab", 3],
];

console.log("| Pair | Ratio | Needs | Result |");
console.log("|---|---|---|---|");
let fails = 0;
for (const [label, fg, bg, need] of pairs) {
  const r = ratio(lum(fg), lum(bg));
  if (r < need) fails++;
  console.log(`| ${label} | ${r.toFixed(2)} | ${need} | ${r >= need ? "pass" : "FAIL"} |`);
}
// Bottom bar text is white at 80% over plum-950
const bb = ratio(lum(C.white, 0.8, C.plum950), lum(C.plum950));
console.log(`| Bottom bar: white 80% on plum-950 | ${bb.toFixed(2)} | 4.5 | ${bb >= 4.5 ? "pass" : "FAIL"} |`);
if (bb < 4.5) fails++;
console.log(fails ? `\n${fails} failing` : "\nall pass");
