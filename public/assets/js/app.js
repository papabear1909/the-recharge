import config from "../../config.js";
import { buildSchedule, computeState } from "./state.js";
import { createClock } from "./clock.js";
import { detectLang, setLang, onLangChange, getLang, t, setStaticVars } from "./i18n.js";
import { setUtcOffset, datesRange, weekday, hhmm, clockPhrase } from "./format.js";
import { createConsole } from "./console.js";
import { createProgramme } from "./programme.js";
import { createSpeakers } from "./speakers.js";
import { createTheme } from "./theme.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

setUtcOffset(config.utcOffset);
const sch = buildSchedule(config);
const clock = createClock();
setStaticVars({ host: config.event.hostPerson });
setLang(detectLang());

const consoleUI = createConsole({ config, sch, clock });
const programme = createProgramme({ config, sch });
const speakers = createSpeakers({ config });
const theme = createTheme();

/* ---------- clock loop: recompute from "now" every second, never subtract ---------- */
let timer = 0;
function tick(force = false) {
  const now = clock.now();
  const st = computeState(now, sch);
  consoleUI.update(st, now, { force });
  programme.update(st);
}
function loop() {
  clearTimeout(timer);
  tick();
  if (clock.rate === 0) return;
  const n = clock.now();
  const toNextSecond = 1000 - (((n % 1000) + 1000) % 1000);
  const delay = clock.rate === 1 ? toNextSecond + 10 : Math.max(50, toNextSecond / clock.rate);
  timer = setTimeout(loop, delay);
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") loop();
});
window.addEventListener("focus", loop);
window.addEventListener("pageshow", loop);
window.addEventListener("online", () => {
  loop();
  clock.sync().then(loop);
});
loop();
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove("is-booting")));
clock.sync().then(loop);

/* ---------- static facts from the config ---------- */
function fillFacts() {
  const waText = encodeURIComponent(t("whatsapp_message"));
  const digits = config.contact.phoneIntl.replace(/\D/g, "");
  $$(".js-call").forEach((a) => (a.href = `tel:${config.contact.phoneIntl}`));
  $$(".js-wa").forEach((a) => (a.href = `https://wa.me/${digits}?text=${waText}`));
  $$(".js-phone").forEach((el) => (el.textContent = config.contact.phoneDisplay));
  $$(".js-yt").forEach((a) => (a.href = config.social.youtube));
  $$(".js-tt").forEach((a) => (a.href = config.social.tiktok));
  $$(".js-fb").forEach((a) => {
    a.href = config.social.facebook || "#";
    a.hidden = !config.social.facebook;
  });
  $$(".js-maps").forEach((a) => (a.href = config.venue.mapUrl));
  $$(".js-dates").forEach((el) => (el.textContent = datesRange(sch)));
  const first = sch.days[0];
  const last = sch.days[sch.days.length - 1];
  $(".js-days-range").textContent = `${t("time_range", { a: weekday(first.weekday), b: weekday(last.weekday) })} · ${t("every_day")}`;
  first.sessions.slice(0, 2).forEach((s, i) => {
    const k = i ? "b" : "a";
    $(`.js-time-${k}`).textContent = t("time_range", { a: hhmm(s.startMs), b: hhmm(s.endMs) });
    const phrase = clockPhrase(s.startMs);
    $(`.js-time-${k}-label`).textContent = t(`session_${s.id}`) + (phrase ? ` · ${phrase}` : "");
  });
  $(".js-address").textContent = config.venue.address;
  $$(".js-host-name").forEach((el) => (el.textContent = config.event.hostPerson));
  $(".js-place").textContent = t("venue_maps_name", { place: config.venue.placeName });
  $(".console-year").textContent = config.event.year;
  const live = $(".js-live");
  // The button exists only when a link is set; during sessions the CSS shows it in place of the quiet YouTube link.
  if (config.livestreamUrl) live.href = config.livestreamUrl;
  live.hidden = !config.livestreamUrl;
  $$(".js-opt").forEach((row) => {
    const value = config.venue[row.dataset.field];
    row.hidden = !value;
    if (value) row.querySelector("dd").textContent = value;
  });
  const notice = $(".notice");
  const text = (config.notice && (config.notice[getLang()] || config.notice.en)) || "";
  notice.textContent = text;
  notice.hidden = !text;
  $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === getLang())));
}
fillFacts();

/* ---------- language ---------- */
$$(".lang button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang, { persist: true })));
onLangChange(() => {
  fillFacts();
  programme.relabel();
  speakers.relabel();
  theme.relabel();
  tick(true);
});

/* ---------- menu ---------- */
const menu = $("#menu");
const menuBtn = $(".menu-btn");
function setMenu(open) {
  menu.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", t(open ? "menu_close" : "menu_open"));
  menuBtn.dataset.i18nAttr = `aria-label:${open ? "menu_close" : "menu_open"}`;
  document.documentElement.style.overflow = open ? "hidden" : "";
  if (open) $("a", menu).focus();
}
menuBtn.addEventListener("click", () => setMenu(menu.hidden));
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !menu.hidden) {
    setMenu(false);
    menuBtn.focus();
  }
});

/* ---------- share, copy, calendar ---------- */
async function share() {
  const text = t("share_text", { dates: datesRange(sch) });
  const url = location.origin + location.pathname;
  if (navigator.share) {
    try {
      await navigator.share({ title: "The Recharge", text, url });
    } catch {}
    return;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener,noreferrer");
}
$$(".js-share").forEach((b) => b.addEventListener("click", share));

$(".js-copy").addEventListener("click", async () => {
  const text = config.venue.address;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.append(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  const msg = $(".js-copied");
  msg.textContent = t("copied");
  setTimeout(() => (msg.textContent = ""), 3000);
});

$(".js-cal-all").addEventListener("click", () => programme.downloadAll());

/* ---------- bottom bar follows the section in view ---------- */
const spyLinks = $$(".bottombar a");
const spy = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const id = e.target.id === "theme" ? "speakers" : e.target.id === "inquiries" ? "venue" : e.target.id;
      spyLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.spy === id));
    }
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
["now", "programme", "speakers", "theme", "venue", "inquiries"].forEach((id) => spy.observe(document.getElementById(id)));

/* ---------- offline support ---------- */
// Test-clock links (?now= / ?speed=) skip the service worker so they always run the newest files.
if ("serviceWorker" in navigator && !clock.isTest && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).catch(() => {});
  });
}
