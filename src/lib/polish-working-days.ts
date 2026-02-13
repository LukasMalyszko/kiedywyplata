/**
 * Polish working days: weekends (Sat/Sun) + public holidays (PL).
 * ZUS and other institutions pay on the previous working day when the due date falls on a non-working day.
 * Holiday data: Nager.Date API (https://date.nager.at). Update with: node scripts/update-polish-holidays.mjs
 */

import polishHolidays from '@/data/polish-holidays.json';

const holidaySet = new Set<string>(polishHolidays as string[]);

/** YYYY-MM-DD for a given Date (local date, not UTC). */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** True if date is Saturday (6) or Sunday (0). */
export function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

/** True if date is a Polish public holiday (from cached data). */
export function isPolishHoliday(d: Date): boolean {
  return holidaySet.has(toDateKey(d));
}

/** True if date is a working day in Poland (not weekend, not public holiday). */
export function isWorkingDay(d: Date): boolean {
  return !isWeekend(d) && !isPolishHoliday(d);
}

/**
 * If the given date is not a working day, returns the previous working day.
 * Used for ZUS/Polish benefit payment dates: when due date falls on non-working day, payment is on the previous working day.
 */
export function toPreviousWorkingDay(d: Date): Date {
  const result = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  while (!isWorkingDay(result)) {
    result.setDate(result.getDate() - 1);
  }
  return result;
}
