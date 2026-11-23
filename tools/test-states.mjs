// Boundary tests for the state table. Run from recharge-site:  node tools/test-states.mjs
import config from "../public/config.js";
import { buildSchedule, computeState } from "../public/assets/js/state.js";

const sch = buildSchedule(config);
const cases = [
  ["2026-11-20T12:00:00+03:00", "PRE_EVENT"],
  ["2026-11-23T00:00:00+03:00", "PRE_EVENT"],
  ["2026-12-01T23:59:59+03:00", "PRE_EVENT"],
  ["2026-12-02T00:00:00+03:00", "DAY_LIVE_WAITING"],
  ["2026-12-02T09:59:59+03:00", "DAY_LIVE_WAITING"],
  ["2026-12-02T10:00:00+03:00", "SESSION_ONGOING", "morning"],
  ["2026-12-02T10:40:00+03:00", "SESSION_ONGOING", "morning"],
  ["2026-12-02T12:59:59+03:00", "SESSION_ONGOING", "morning"],
  ["2026-12-02T13:00:00+03:00", "BREAK"],
  ["2026-12-02T14:59:59+03:00", "BREAK"],
  ["2026-12-02T15:00:00+03:00", "SESSION_ONGOING", "evening"],
  ["2026-12-02T17:59:59+03:00", "SESSION_ONGOING", "evening"],
  ["2026-12-02T18:00:00+03:00", "DAY_DONE"],
  ["2026-12-02T23:59:59+03:00", "DAY_DONE"],
  ["2026-12-03T00:00:00+03:00", "DAY_LIVE_WAITING"],
  ["2026-12-04T14:10:00+03:00", "BREAK"],
  ["2026-12-05T23:59:59+03:00", "DAY_DONE"],
  ["2026-12-06T00:00:00+03:00", "DAY_LIVE_WAITING"],
  ["2026-12-06T09:59:59+03:00", "DAY_LIVE_WAITING"],
  ["2026-12-06T10:00:00+03:00", "SESSION_ONGOING", "morning"],
  ["2026-12-06T12:59:59+03:00", "SESSION_ONGOING", "morning"],
  ["2026-12-06T13:00:00+03:00", "BREAK"],
  ["2026-12-06T14:59:59+03:00", "BREAK"],
  ["2026-12-06T15:00:00+03:00", "SESSION_ONGOING", "evening"],
  ["2026-12-06T17:59:59+03:00", "SESSION_ONGOING", "evening"],
  ["2026-12-06T18:00:00+03:00", "EVENT_ENDED"],
  ["2026-12-07T00:00:00+03:00", "EVENT_ENDED"],
];

const fmt = (ms) => (ms == null ? "" : new Date(ms + 3 * 3600e3).toISOString().slice(5, 16).replace("T", " "));
let failed = 0;
console.log("| Moment (Nairobi) | Expected | Got | Level | Counts down to | Result |");
console.log("|---|---|---|---|---|---|");
for (const [iso, kind, sessionId] of cases) {
  const s = computeState(Date.parse(iso), sch);
  const ok = s.kind === kind && (!sessionId || s.session?.id === sessionId);
  if (!ok) failed++;
  const got = s.kind + (s.session ? ` (${s.session.id})` : "");
  console.log(`| ${iso.slice(0, 19).replace("T", " ")} | ${kind}${sessionId ? ` (${sessionId})` : ""} | ${got} | ${s.level.toFixed(3)} | ${fmt(s.target)} | ${ok ? "pass" : "FAIL"} |`);
}
console.log(`\n${cases.length - failed} of ${cases.length} passed`);
process.exit(failed ? 1 : 0);
