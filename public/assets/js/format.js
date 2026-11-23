// Formatting in Nairobi time without relying on the phone's time zone data.
import { pack, t } from "./i18n.js";

let offsetMin = 180;
export function setUtcOffset(str) {
  const m = /^([+-])(\d{2}):(\d{2})$/.exec(str || "");
  if (m) offsetMin = (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

export function local(ms) {
  const d = new Date(ms + offsetMin * 60000);
  return {
    y: d.getUTCFullYear(), mo: d.getUTCMonth() + 1, d: d.getUTCDate(),
    h: d.getUTCHours(), mi: d.getUTCMinutes(), s: d.getUTCSeconds(), wd: d.getUTCDay(),
  };
}

const p2 = (n) => String(n).padStart(2, "0");

export function hhmm(ms) {
  const l = local(ms);
  return `${p2(l.h)}:${p2(l.mi)}`;
}

// "10:00" in English; "10:00 (saa nne asubuhi)" where the language counts hours from sunrise.
export function timeLabel(ms) {
  const base = hhmm(ms);
  const phrase = clockPhrase(ms);
  return phrase ? `${base} (${phrase})` : base;
}

export function clockPhrase(ms) {
  const P = pack();
  if (!P.clock_format) return "";
  const l = local(ms);
  if (l.mi !== 0) return "";
  const hour = P.clock_hours[(l.h + 5) % 12];
  let period = "";
  for (const [from, word] of P.clock_periods) if (l.h >= from) period = word;
  return P.clock_format.replace("{h}", hour).replace("{p}", period);
}

export const weekday = (wd) => pack().weekdays[wd];
export const weekdayShort = (wd) => pack().weekdays_short[wd];
export const monthName = (m) => pack().months[m - 1];

export function dayDate(day) {
  return `${day.day} ${monthName(day.month)}`;
}

export function datesRange(sch) {
  const a = sch.days[0];
  const b = sch.days[sch.days.length - 1];
  return t("dates_range", { d1: a.day, d2: b.day, month: monthName(b.month), year: b.year });
}

export function splitDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

export { p2 };
