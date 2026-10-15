/** Takvime ekle (.ics) dosyası üretir (M05). Saatler Türkiye saatidir (UTC+3). */

function toUtcStamp(dateIso: string, time: string) {
  const [y, m, d] = dateIso.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d, hh - 3, mm));
  return utc.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs({
  uid,
  date,
  time,
  durationMinutes,
  title,
  description,
  location,
  stamp,
}: {
  uid: string;
  date: string;
  time: string;
  durationMinutes: number;
  title: string;
  description: string;
  location: string;
  /** Oluşturma zamanı (ISO), tarayıcıda verilir */
  stamp: string;
}) {
  const [hh, mm] = time.split(":").map(Number);
  const endTotal = hh * 60 + mm + durationMinutes;
  const endTime = `${String(Math.floor(endTotal / 60)).padStart(2, "0")}:${String(endTotal % 60).padStart(2, "0")}`;
  const dtstamp = stamp.replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Revnak Gayrimenkul//Randevu//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}@revnak.example`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${toUtcStamp(date, time)}`,
    `DTEND:${toUtcStamp(date, endTime)}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(location)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Randevu hatırlatması",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
