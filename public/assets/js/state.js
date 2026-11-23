// The site's state is a pure function of (now, schedule). Nothing here reads the clock.

export const PRE_EVENT = "PRE_EVENT";
export const DAY_LIVE_WAITING = "DAY_LIVE_WAITING";
export const SESSION_ONGOING = "SESSION_ONGOING";
export const BREAK = "BREAK";
export const DAY_DONE = "DAY_DONE";
export const EVENT_ENDED = "EVENT_ENDED";

const DAY_MS = 86400000;

export function buildSchedule(config) {
  let n = 0;
  const days = config.days.map((d, dayIndex) => {
    const dayStart = Date.parse(`${d.date}T00:00:00${config.utcOffset}`);
    const [y, m, dd] = d.date.split("-").map(Number);
    const weekday = new Date(Date.UTC(y, m - 1, dd, 12)).getUTCDay();
    const sessions = d.sessions
      .map((s) => ({ ...s, startMs: Date.parse(s.start), endMs: Date.parse(s.end) }))
      .sort((a, b) => a.startMs - b.startMs)
      .map((s, index) => ({ ...s, index, dayIndex, n: ++n }));
    return { date: d.date, dayIndex, dayStart, dayEnd: dayStart + DAY_MS, weekday, day: dd, month: m, year: y, sessions };
  });
  const sessions = days.flatMap((d) => d.sessions);
  return {
    days,
    sessions,
    chargeStart: Date.parse(config.chargeStart),
    eventStart: days[0].dayStart,
    firstStart: sessions[0].startMs,
    lastEnd: sessions[sessions.length - 1].endMs,
  };
}

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

// Charge rises from the end of the previous session (or chargeStart) to the start of the next one.
function chargeTowards(now, sch, next) {
  const prev = [...sch.sessions].reverse().find((s) => s.endMs <= now);
  const from = prev ? prev.endMs : Math.min(sch.chargeStart, next.startMs - 1);
  return clamp01((now - from) / (next.startMs - from));
}

export function computeState(now, sch) {
  const next = sch.sessions.find((s) => s.startMs > now) || null;
  const base = { now, next };

  if (now >= sch.lastEnd) {
    return { ...base, kind: EVENT_ENDED, level: 1, mode: "full", target: null, day: sch.days[sch.days.length - 1] };
  }

  const current = sch.sessions.find((s) => now >= s.startMs && now < s.endMs);
  if (current) {
    const progress = clamp01((now - current.startMs) / (current.endMs - current.startMs));
    return {
      ...base,
      kind: SESSION_ONGOING,
      session: current,
      day: sch.days[current.dayIndex],
      progress,
      level: 1 - progress,
      mode: "drain",
      target: current.endMs,
    };
  }

  if (now < sch.eventStart) {
    return { ...base, kind: PRE_EVENT, level: chargeTowards(now, sch, next), mode: "charge", target: sch.firstStart, day: sch.days[0] };
  }

  const day = sch.days.find((d) => now >= d.dayStart && now < d.dayEnd);
  const level = chargeTowards(now, sch, next);
  if (day && day.sessions.length && now < day.sessions[0].startMs) {
    return { ...base, kind: DAY_LIVE_WAITING, day, level, mode: "charge", target: day.sessions[0].startMs };
  }
  if (day && day.sessions.length && now < day.sessions[day.sessions.length - 1].endMs) {
    return { ...base, kind: BREAK, day, level, mode: "charge", target: next.startMs };
  }
  // After the day's last session (or on a gap day): wait for the next morning.
  return { ...base, kind: DAY_DONE, day: day || sch.days[next.dayIndex], level, mode: "charge", target: next.startMs };
}

// Status of each session row relative to now: "past", "now", "next" or "".
export function sessionStatus(session, state) {
  if (state.kind === SESSION_ONGOING && state.session === session) return "now";
  if (state.next === session) return "next";
  if (session.endMs <= state.now) return "past";
  return "";
}
