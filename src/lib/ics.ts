import { Payment } from '@/types/payment';
import { getEffectiveNextPayment } from '@/lib/payments';

/** Format a Date as ICS YYYYMMDD all-day string. */
function toICSDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

/** Advance a date by one day. */
function addOneDay(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
}

/** Escape special characters in ICS text values. */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate the next `count` payment dates for a payment, starting from today.
 * For one-time / excluded-from-next benefits, returns at most 1 date.
 */
export function generateUpcomingDates(payment: Payment, count = 12): Date[] {
  if (payment.next_payment === '') return [];

  // One-time benefits: return the single date if it exists and is valid.
  if (payment.excludeFromNext || payment.frequency === 'one-time') {
    const d = new Date(payment.next_payment);
    if (!isNaN(d.getTime())) return [d];
    return [];
  }

  const dates: Date[] = [];
  let refDate = new Date();
  refDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const iso = getEffectiveNextPayment(payment, refDate);
    const d = new Date(iso);
    if (isNaN(d.getTime())) break;
    dates.push(d);
    // Advance past this date so the next iteration finds the following one.
    refDate = addOneDay(d);
  }

  return dates;
}

/**
 * Build a VCALENDAR string (.ics) with one all-day VEVENT per date.
 * Each event includes a VALARM 1 day before.
 */
export function generateICS(payment: Payment, dates: Date[]): string {
  if (dates.length === 0) return '';

  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

  const summary = escapeICSText(`Wypłata: ${payment.name}`);
  const description = escapeICSText(
    `${payment.description}\n\nHarmonogram: ${payment.schedule}\n\nŹródło: ${payment.source}`
  );
  const url = `https://www.kiedywyplata.pl/benefit/${payment.id}`;

  const events = dates.map((date, idx) => {
    const dtStart = toICSDate(date);
    const dtEnd = toICSDate(addOneDay(date));
    const uid = `${payment.id}-${dtStart}-${idx}@www.kiedywyplata.pl`;

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}Z`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `URL:${url}`,
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Przypomnienie: ${summary}`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kiedy Wypłata//PL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Kiedy Wypłata',
    'X-WR-TIMEZONE:Europe/Warsaw',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

/** Build a Google Calendar "add event" deep-link URL for a single date. */
export function buildGoogleCalendarUrl(payment: Payment, date: Date): string {
  const dtStart = toICSDate(date);
  const dtEnd = toICSDate(addOneDay(date));
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Wypłata: ${payment.name}`,
    dates: `${dtStart}/${dtEnd}`,
    details: `${payment.description}\n\nHarmonogram: ${payment.schedule}`,
    sprop: `website:https://www.kiedywyplata.pl`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Build an Outlook.com "add event" deep-link URL for a single date. */
export function buildOutlookUrl(payment: Payment, date: Date): string {
  const dtStart = toICSDate(date);
  // Insert dashes for Outlook (YYYY-MM-DD)
  const fmt = (s: string) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  const params = new URLSearchParams({
    subject: `Wypłata: ${payment.name}`,
    startdt: fmt(dtStart),
    enddt: fmt(toICSDate(addOneDay(date))),
    body: `${payment.description}\n\nHarmonogram: ${payment.schedule}`,
    allday: 'true',
  });
  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}
