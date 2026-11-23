// One clock for the whole page. Never counts down by subtracting: every reading is a fresh "now".
//   ?now=2026-12-04T14:10:00+03:00   freeze at that moment
//   ?speed=60                        run 60 times faster (from ?now if given, else from the real time)

const TRUST_DEVICE_WITHIN_MS = 2000;

export function createClock(search = location.search) {
  const params = new URLSearchParams(search);
  const nowParam = params.get("now");
  const speedParam = Number(params.get("speed"));
  let test = null;

  const parsedNow = nowParam ? Date.parse(nowParam.replace(" ", "+")) : NaN;
  if (!Number.isNaN(parsedNow) || speedParam > 0) {
    test = {
      base: Number.isNaN(parsedNow) ? Date.now() : parsedNow,
      rate: speedParam > 0 ? speedParam : Number.isNaN(parsedNow) ? 1 : 0,
      perf0: performance.now(),
    };
  }

  let offset = 0;

  return {
    isTest: Boolean(test),
    rate: test ? test.rate : 1,
    get offset() {
      return offset;
    },
    now() {
      if (test) return test.base + (performance.now() - test.perf0) * test.rate;
      return Date.now() + offset;
    },
    // Reads the server's Date header once. Fails silently and keeps the device clock.
    async sync() {
      if (test || !navigator.onLine) return;
      try {
        const sentAt = Date.now();
        const p0 = performance.now();
        const res = await fetch(`./?clock=${sentAt}`, { method: "HEAD", cache: "no-store" });
        const rtt = performance.now() - p0;
        const header = res.headers.get("Date");
        if (!header) return;
        // The header is truncated to the second, so its true value is on average half a second later.
        const serverMid = Date.parse(header) + 500;
        const estimate = serverMid - (sentAt + rtt / 2);
        offset = Math.abs(estimate) > TRUST_DEVICE_WITHIN_MS ? estimate : 0;
      } catch {
        offset = 0;
      }
    },
  };
}
