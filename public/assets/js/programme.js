import { sessionStatus, SESSION_ONGOING, EVENT_ENDED, PRE_EVENT } from "./state.js";
import { t } from "./i18n.js";
import { hhmm, clockPhrase, weekday, weekdayShort, dayDate, monthName } from "./format.js";
import { buildIcs, downloadIcs } from "./calendar.js";

const ARROW = '<svg class="row-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const CAL = '<svg class="ico" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 5h14v12H3zM3 9h14M7 2v5M13 2v5"/></svg>';

export function createProgramme({ config, sch }) {
  const tabs = document.querySelector(".day-tabs");
  const daysEl = document.querySelector(".js-days");
  const rows = new Map();
  let lastStateKey = "";
  let todayIndex = -1;

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function build() {
    tabs.textContent = "";
    daysEl.textContent = "";
    rows.clear();
    for (const day of sch.days) {
      const tab = el("button", "day-tab");
      tab.type = "button";
      tab.setAttribute("aria-label", `${weekday(day.weekday)} ${dayDate(day)}`);
      tab.dataset.day = day.dayIndex;
      const b = el("b");
      b.textContent = weekdayShort(day.weekday);
      const small = el("small");
      small.textContent = String(day.day);
      tab.append(b, small);
      tab.addEventListener("click", () => {
        document.getElementById(`day-${day.date}`).scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        select(day.dayIndex);
      });
      tabs.append(tab);

      const group = el("div", "day-group");
      group.id = `day-${day.date}`;
      group.dataset.day = day.dayIndex;
      const head = el("div", "day-head");
      // A big date block per day so each day reads as its own unit.
      const h3 = el("h3", "day-title");
      const num = el("span", "dd-num");
      num.textContent = String(day.day).padStart(2, "0");
      const txt = el("span", "dd-text");
      const wd = el("span", "dd-wd");
      wd.textContent = weekday(day.weekday);
      const mo = el("span", "dd-mo");
      mo.textContent = `${monthName(day.month)} ${day.year}`;
      const today = el("span", "dd-today");
      today.textContent = t("today");
      txt.append(wd, mo);
      h3.append(num, txt, today);
      h3.setAttribute("aria-label", `${weekday(day.weekday)} ${dayDate(day)}`);
      const cal = el("button", "cal-btn", `${CAL}<span></span>`);
      cal.type = "button";
      cal.querySelector("span").textContent = t("add_calendar");
      cal.setAttribute("aria-label", `${t("add_calendar")}: ${weekday(day.weekday)} ${dayDate(day)}`);
      cal.addEventListener("click", () => downloadIcs(`the-recharge-${day.date}.ics`, buildIcs(day.sessions, config)));
      head.append(h3, cal);
      const ol = el("ol");
      for (const s of day.sessions) {
        const li = el("li", "row");
        const num = el("span", "row-n");
        num.textContent = String(s.n).padStart(3, "0");
        const main = el("span", "row-main");
        const title = el("span", "row-title");
        title.textContent = t(`session_${s.id}`);
        const time = el("span", "row-time");
        time.textContent = t("time_range", { a: hhmm(s.startMs), b: hhmm(s.endMs) });
        main.append(title, time);
        const phraseA = clockPhrase(s.startMs);
        const phraseB = clockPhrase(s.endMs);
        if (phraseA && phraseB) {
          const lp = el("span", "row-local");
          lp.textContent = t("time_range", { a: phraseA, b: phraseB });
          main.append(lp);
        }
        if (s.topic) {
          const topic = el("span", "row-extra");
          topic.textContent = `${t("label_topic")}: ${s.topic}`;
          main.append(topic);
        }
        if (s.speaker) {
          const sp = el("span", "row-extra");
          sp.textContent = `${t("label_speaker")}: ${s.speaker}`;
          main.append(sp);
        }
        const end = el("span", "row-end", `<span class="row-flag"></span>${ARROW}`);
        li.append(num, main, end);
        ol.append(li);
        rows.set(s, li);
      }
      // Shown over a day once all its sessions are over.
      const done = el("div", "day-done");
      const doneBig = el("span", "day-done-big");
      doneBig.textContent = t("day_done");
      const doneSmall = el("span", "day-done-small");
      doneSmall.textContent = t("day_done_line");
      done.append(doneBig, doneSmall);
      group.append(head, ol, done);
      daysEl.append(group);
    }
    lastStateKey = "";
  }

  const bigNum = document.querySelector(".js-prog-num");
  function select(i) {
    const n = String(sch.days[Math.max(0, i)].day).padStart(2, "0");
    if (bigNum && bigNum.textContent !== n) {
      bigNum.classList.remove("is-in");
      void bigNum.offsetWidth;
      bigNum.textContent = n;
      bigNum.classList.add("is-in");
    }
    tabs.querySelectorAll(".day-tab").forEach((tab) => {
      if (Number(tab.dataset.day) === i) tab.setAttribute("aria-current", "true");
      else tab.removeAttribute("aria-current");
    });
  }

  // The tab follows the day group under the pinned bar.
  const spy = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) select(Number(visible[0].target.dataset.day));
    },
    { rootMargin: "-30% 0px -60% 0px" },
  );

  function observe() {
    spy.disconnect();
    daysEl.querySelectorAll(".day-group").forEach((g) => spy.observe(g));
  }

  build();
  observe();
  select(0);

  return {
    relabel() {
      build();
      observe();
      select(Math.max(0, todayIndex));
    },
    update(st) {
      const key = `${st.kind}|${st.session?.n ?? ""}|${st.next?.n ?? ""}`;
      if (key === lastStateKey) return;
      lastStateKey = key;
      for (const [s, li] of rows) {
        const status = sessionStatus(s, st);
        li.classList.toggle("is-now", status === "now");
        li.classList.toggle("is-next", status === "next");
        li.classList.toggle("is-past", status === "past");
        const flag = li.querySelector(".row-flag");
        flag.textContent = status === "now" ? t("status_now") : status === "next" ? t("status_next") : "";
        if (status === "now") li.setAttribute("aria-current", "true");
        else li.removeAttribute("aria-current");
      }
      const inEvent = st.kind !== PRE_EVENT && st.kind !== EVENT_ENDED;
      todayIndex = inEvent ? st.day.dayIndex : -1;
      tabs.querySelectorAll(".day-tab").forEach((tab) => tab.classList.toggle("is-today", Number(tab.dataset.day) === todayIndex));
      daysEl.querySelectorAll(".day-group").forEach((g) => {
        const d = sch.days[Number(g.dataset.day)];
        g.classList.toggle("is-today", d.dayIndex === todayIndex);
        g.classList.toggle("is-past", d.sessions.every((s) => s.endMs <= st.now));
      });
      if (st.kind === SESSION_ONGOING || inEvent) select(todayIndex);
    },
    downloadAll() {
      downloadIcs("the-recharge-2026.ics", buildIcs(sch.sessions, config));
    },
  };
}
