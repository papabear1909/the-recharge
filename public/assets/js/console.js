// The live console: state word, line, countdown, instruments, ticker, top-bar mark and screen-reader note.
import * as S from "./state.js";
import { t, getLang } from "./i18n.js";
import { timeLabel, hhmm, weekday, weekdayShort, dayDate, splitDuration, p2, local } from "./format.js";

const $ = (sel, root = document) => root.querySelector(sel);
const GLASS_H = 86;

export function createConsole({ config, sch, clock }) {
  const body = document.body;
  const readout = $(".readout");
  const word = $(".js-state-word");
  const line = $(".js-state-line");
  const countdown = $(".js-countdown");
  const tz = $(".js-tz");
  const closing = $(".closing");
  const announce = $("#announce");
  const testFlag = $(".js-test");
  const runs = [...document.querySelectorAll(".ticker-run")];
  const levels = [...document.querySelectorAll(".js-level")].map((el) => ({ el, h: Number(el.getAttribute("height")) }));
  const sandTop = $(".sand-top");
  // Smaller clocks elsewhere on the page read the same state on the same tick.
  const minis = [...document.querySelectorAll(".js-mini")].map((el) => ({
    word: el.querySelector(".mini-word"),
    digits: el.querySelector(".mini-digits"),
    line: el.querySelector(".mini-line"),
    shape: "",
    cells: [],
  }));
  const meters = [...document.querySelectorAll(".js-meter")];
  const sandBottom = $(".sand-bottom");

  let lastKey = "";
  let lastKind = "";
  let lastAnnounce = "";
  let cdShape = "";
  let cdCells = [];
  let tickerCells = [];

  const sessionName = (s) => t(`session_${s.id}`) || s.id;

  function texts(st) {
    switch (st.kind) {
      case S.PRE_EVENT: {
        const d = st.day;
        const vars = { day: weekday(d.weekday), date: dayDate(d), time: timeLabel(st.target) };
        return { word: t("pre_title"), line: t("pre_line", vars), announce: t("announce_pre", vars) };
      }
      case S.DAY_LIVE_WAITING: {
        const vars = { day: weekday(st.day.weekday), time: timeLabel(st.target) };
        return { word: t("wait_title", vars), line: t("wait_line", vars), announce: t("announce_wait", vars) };
      }
      case S.SESSION_ONGOING: {
        const vars = { session: sessionName(st.session), time: timeLabel(st.target) };
        return { word: t("ongoing_title"), line: t("ongoing_line", vars), announce: t("announce_ongoing", vars) };
      }
      case S.BREAK: {
        const vars = { session: sessionName(st.next), time: timeLabel(st.target) };
        return { word: t("break_title"), line: t("break_line", vars), announce: t("announce_break", vars) };
      }
      case S.DAY_DONE: {
        const nd = sch.days[st.next.dayIndex];
        const vars = { session: sessionName(st.next), day: weekday(nd.weekday), time: timeLabel(st.target) };
        return { word: t("done_title"), line: t("done_line", vars), announce: t("announce_done", vars) };
      }
      default:
        return { word: t("ended_title"), line: t("ended_line"), announce: t("announce_ended") };
    }
  }

  function tickerWords(st) {
    const cd = { cd: true };
    switch (st.kind) {
      case S.PRE_EVENT:
        return [t("ticker_pre"), cd, `${weekday(st.day.weekday)} ${dayDate(st.day)}`, config.event.year, t("place_short")];
      case S.DAY_LIVE_WAITING:
        return [t("wait_title", { day: weekday(st.day.weekday) }), cd, `${sessionName(st.next)} ${hhmm(st.target)}`];
      case S.SESSION_ONGOING:
        return [t("ongoing_title"), sessionName(st.session), cd, t("ticker_left")];
      case S.BREAK:
        return [t("break_title"), `${sessionName(st.next)} ${hhmm(st.target)}`, cd];
      case S.DAY_DONE:
        return [t("done_title"), `${weekday(sch.days[st.next.dayIndex].weekday)} ${hhmm(st.target)}`, cd];
      default:
        return [t("ended_title"), t("theme_line"), t("scripture_ref")];
    }
  }

  function buildTicker(st) {
    const words = tickerWords(st);
    tickerCells = [];
    runs.forEach((run) => {
      run.textContent = "";
      for (let rep = 0; rep < 2; rep++) {
        words.forEach((w) => {
          const span = document.createElement("span");
          if (w && w.cd) tickerCells.push(span);
          else span.textContent = w;
          run.append(span);
          const sep = document.createElement("span");
          sep.className = "tk-sep";
          run.append(sep);
        });
      }
    });
  }

  function tickerCountdown(ms, withDays) {
    const { d, h, m, s } = splitDuration(ms);
    const hms = `${p2(h)}:${p2(m)}:${p2(s)}`;
    if (withDays && d > 0) return `${d} ${t("unit_days")} ${hms}`;
    return d > 0 ? `${d * 24 + h}:${p2(m)}:${p2(s)}` : hms;
  }

  // Countdown digits sit in fixed-width cells so nothing jumps as they change.
  function buildCountdown(shape) {
    countdown.textContent = "";
    cdCells = [];
    const digitCell = (n) => {
      const wrap = document.createElement("span");
      wrap.className = "cd-n";
      const cells = [];
      for (let i = 0; i < n; i++) {
        const c = document.createElement("span");
        c.className = "cd-d";
        wrap.append(c);
        cells.push(c);
      }
      return { wrap, cells };
    };
    if (shape === "days") {
      ["unit_days", "unit_hours", "unit_minutes", "unit_seconds"].forEach((unit) => {
        const g = document.createElement("span");
        g.className = "cd-g";
        const { wrap, cells } = digitCell(2);
        const u = document.createElement("span");
        u.className = "cd-u";
        u.textContent = t(unit);
        g.append(wrap, u);
        countdown.append(g);
        cdCells.push(cells);
      });
    } else if (shape === "hms") {
      const row = document.createElement("span");
      row.className = "cd-n";
      [0, 1, 2].forEach((i) => {
        if (i) {
          const colon = document.createElement("span");
          colon.className = "cd-colon";
          colon.textContent = ":";
          row.append(colon);
        }
        const cells = [];
        for (let k = 0; k < 2; k++) {
          const c = document.createElement("span");
          c.className = "cd-d";
          row.append(c);
          cells.push(c);
        }
        cdCells.push(cells);
      });
      const left = document.createElement("span");
      left.className = "cd-left";
      left.dataset.role = "left";
      countdown.append(row, left);
    }
    cdShape = shape;
  }

  function setDigits(cells, value) {
    const str = String(value).padStart(cells.length, "0");
    if (str.length > cells.length) {
      cells[0].textContent = str.slice(0, str.length - cells.length + 1);
      for (let i = 1; i < cells.length; i++) cells[i].textContent = str[str.length - cells.length + i];
      return;
    }
    cells.forEach((c, i) => {
      if (c.textContent !== str[i]) c.textContent = str[i];
    });
  }

  function renderCountdown(st, now) {
    const shape = st.kind === S.EVENT_ENDED ? "none" : st.kind === S.PRE_EVENT ? "days" : "hms";
    if (shape !== cdShape) buildCountdown(shape);
    if (shape === "none") {
      renderMinis(st, 0);
      return;
    }
    const ms = Math.ceil((st.target - now) / 1000) * 1000;
    const { d, h, m, s } = splitDuration(ms);
    if (shape === "days") {
      [d, h, m, s].forEach((v, i) => setDigits(cdCells[i], v));
    } else {
      [d * 24 + h, m, s].forEach((v, i) => setDigits(cdCells[i], v));
      const left = countdown.querySelector("[data-role=left]");
      const label = st.kind === S.SESSION_ONGOING ? t("left") : t("until_start");
      if (left.textContent !== label) left.textContent = label;
    }
    renderMinis(st, ms);
    const tk = tickerCountdown(ms, shape === "days");
    tickerCells.forEach((c) => {
      if (c.textContent !== tk) c.textContent = tk;
    });
  }

  function miniLine(st) {
    if (st.kind === S.EVENT_ENDED) return t("scripture_ref");
    const l = local(st.target);
    const today = local(st.now);
    const when = l.d === today.d ? hhmm(st.target) : `${weekdayShort(l.wd)} ${hhmm(st.target)}`;
    return t("mini_until", { time: when });
  }

  function renderMinis(st, ms) {
    const shape = st.kind === S.EVENT_ENDED ? "none" : st.kind === S.PRE_EVENT ? "days" : "hms";
    const { d, h, m, s } = splitDuration(ms);
    const vals = shape === "days" ? [d, h, m, s] : [d * 24 + h, m, s];
    for (const mini of minis) {
      if (mini.shape !== shape) {
        mini.digits.textContent = "";
        mini.cells = [];
        const units = shape === "days" ? ["unit_days", "unit_hours", "unit_minutes", "unit_seconds"] : shape === "hms" ? ["unit_hours", "unit_minutes", "unit_seconds"] : [];
        for (const unit of units) {
          const g = document.createElement("span");
          g.className = "mg";
          const n = document.createElement("span");
          n.className = "mn";
          const cells = [0, 1].map(() => {
            const c = document.createElement("span");
            c.className = "cd-d";
            n.append(c);
            return c;
          });
          const u = document.createElement("span");
          u.className = "mu";
          u.textContent = t(unit);
          g.append(n, u);
          mini.digits.append(g);
          mini.cells.push(cells);
        }
        mini.shape = shape;
      }
      if (shape !== "none") vals.forEach((v, i) => setDigits(mini.cells[i], v));
    }
  }

  function renderLevels(st) {
    for (const el of meters) el.style.transform = `scaleX(${st.level.toFixed(4)})`;
    for (const { el, h } of levels) {
      el.style.transform = `translateY(${((1 - st.level) * h).toFixed(2)}px)`;
    }
    if (st.kind === S.SESSION_ONGOING) {
      const p = st.progress;
      // Area-true sand: the top bulb narrows to the neck, the bottom one widens to the base.
      const topDepth = GLASS_H * Math.sqrt(1 - p);
      const bottomDepth = GLASS_H * (1 - Math.sqrt(1 - p));
      sandTop.style.transform = `translateY(${(GLASS_H - topDepth).toFixed(2)}px)`;
      sandBottom.style.transform = `translateY(${(GLASS_H - bottomDepth).toFixed(2)}px)`;
    }
  }

  function renderTz(now) {
    const deviceOffset = -new Date(now).getTimezoneOffset();
    const nairobiOffset = 180;
    if (deviceOffset === nairobiOffset || clock.isTest) {
      tz.hidden = true;
      return;
    }
    const localTime = new Date(now).toLocaleTimeString(getLang(), { hour: "2-digit", minute: "2-digit" });
    const msg = t("tz_note", { local: localTime });
    if (tz.textContent !== msg) tz.textContent = msg;
    tz.hidden = false;
  }

  function renderTestFlag(now) {
    if (!clock.isTest) return;
    const l = local(now);
    const msg = `${weekday(l.wd)} ${l.d} ${p2(l.h)}:${p2(l.mi)}:${p2(l.s)}${clock.rate > 1 ? ` (x${clock.rate})` : ""} · ${t("test_clock")}`;
    testFlag.textContent = msg;
    testFlag.hidden = false;
  }

  return {
    update(st, now, { force = false } = {}) {
      const key = `${st.kind}|${st.session?.n ?? ""}|${st.next?.n ?? ""}|${getLang()}`;
      if (key !== lastKey || force) {
        const tx = texts(st);
        body.dataset.state = st.kind;
        body.dataset.mode = st.mode;
        body.dataset.live = config.livestreamUrl && st.kind === S.SESSION_ONGOING ? "on" : "off";
        word.textContent = tx.word;
        line.textContent = tx.line;
        closing.hidden = st.kind !== S.EVENT_ENDED;
        buildTicker(st);
        cdShape = "";
        for (const mini of minis) {
          mini.word.textContent = tx.word;
          mini.line.textContent = miniLine(st);
          mini.shape = "";
        }
        if (lastKind && st.kind !== lastKind) {
          readout.classList.remove("is-switching");
          void readout.offsetWidth;
          readout.classList.add("is-switching");
        }
        if (tx.announce !== lastAnnounce) {
          announce.textContent = tx.announce;
          lastAnnounce = tx.announce;
        }
        lastKey = key;
        lastKind = st.kind;
      }
      renderCountdown(st, now);
      renderLevels(st);
      renderTz(now);
      renderTestFlag(now);
    },
  };
}
