import en from "../i18n/en.js";
import sw from "../i18n/sw.js";
import ki from "../i18n/ki.js";

const PACKS = { en, sw, ki };
const KEY = "recharge-lang";
let lang = "en";
const listeners = new Set();

export function detectLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (PACKS[saved]) return saved;
  } catch {}
  for (const l of navigator.languages || [navigator.language]) {
    const code = String(l || "").toLowerCase().split("-")[0];
    if (code === "sw" || code === "ki" || code === "en") return code;
    if (code === "kik") return "ki";
  }
  return "en";
}

export const getLang = () => lang;
export const pack = () => PACKS[lang];

export function t(key, vars) {
  let s = PACKS[lang][key] ?? en[key] ?? key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
  return s;
}

export function onLangChange(fn) {
  listeners.add(fn);
}

export function setLang(next, { persist = false } = {}) {
  if (!PACKS[next]) next = "en";
  lang = next;
  document.documentElement.lang = next;
  if (persist) {
    try { localStorage.setItem(KEY, next); } catch {}
  }
  applyStatic(document);
  listeners.forEach((fn) => fn(next));
}

// Elements with data-i18n="key" get their text; data-i18n-attr="aria-label:key;title:key" sets attributes.
export function applyStatic(root, vars = staticVars) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n, vars);
  });
  root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":");
      el.setAttribute(attr, t(key, vars));
    });
  });
}

let staticVars = {};
export function setStaticVars(v) {
  staticVars = v;
}
