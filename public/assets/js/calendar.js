// .ics files made in the browser. Times are written in UTC.

const EVENT_NAMES = { morning: "The Recharge, Morning Session", evening: "The Recharge, Evening Session" };

const utc = (ms) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

// Lines longer than 75 octets are folded, as the format asks.
function fold(line) {
  const out = [];
  let rest = line;
  while (new TextEncoder().encode(rest).length > 75) {
    let cut = 75;
    while (new TextEncoder().encode(rest.slice(0, cut)).length > 75) cut--;
    out.push(rest.slice(0, cut));
    rest = " " + rest.slice(cut);
  }
  out.push(rest);
  return out.join("\r\n");
}

export function buildIcs(sessions, config) {
  const stamp = utc(Date.now());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Jesus Healing Centre Churches Kenya//The Recharge//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const s of sessions) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:the-recharge-${s.start.slice(0, 10)}-${s.id}@jhc-the-recharge`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${utc(s.startMs)}`,
      `DTEND:${utc(s.endMs)}`,
      `SUMMARY:${esc(EVENT_NAMES[s.id] || `The Recharge, ${s.id}`)}`,
      `LOCATION:${esc(config.venue.address)}`,
      `DESCRIPTION:${esc(`${config.event.theme} (${config.event.scripture}). Inquiries: ${config.contact.phoneDisplay}`)}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function downloadIcs(filename, text) {
  const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
