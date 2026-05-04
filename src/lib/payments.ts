import { Payment } from '@/types/payment';
import { toPreviousWorkingDay } from '@/lib/polish-working-days';

/** Years for which `/benefit/[id]/[year]/[month]` SEO pages are generated. */
export const PROGRAMMATIC_SEO_YEAR_MIN = 2026;
export const PROGRAMMATIC_SEO_YEAR_MAX = 2027;
export const PROGRAMMATIC_SEO_YEARS = [2026, 2027] as const;

const POLISH_MONTHS: Record<string, number> = {
  styczeń: 0, stycznia: 0,
  luty: 1, lutego: 1,
  marzec: 2, marca: 2,
  kwiecień: 3, kwietnia: 3,
  maj: 4, maja: 4,
  czerwiec: 5, czerwca: 5,
  lipiec: 6, lipca: 6,
  sierpień: 7, sierpnia: 7,
  wrzesień: 8, września: 8,
  październik: 9, października: 9,
  listopad: 10, listopada: 10,
  grudzień: 11, grudnia: 11,
};

function clampDay(year: number, month: number, day: number) {
  const last = new Date(year, month + 1, 0).getDate();
  return Math.min(Math.max(1, day), last);
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  const targetMonth = d.getMonth() + months;
  const year = d.getFullYear() + Math.floor(targetMonth / 12);
  const month = ((targetMonth % 12) + 12) % 12;
  const day = clampDay(year, month, d.getDate());
  return new Date(year, month, day, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}

function parseNumbers(schedule: string): number[] {
  const matches = schedule.match(/\b(\d{1,2})\b/g);
  if (!matches) return [];
  const nums = Array.from(new Set(matches.map((m) => parseInt(m, 10)))).filter(n => n >=1 && n <= 31);
  return nums.sort((a,b)=>a-b);
}

function findPolishMonth(schedule: string): number | null {
  const lower = schedule.toLowerCase();
  for (const key of Object.keys(POLISH_MONTHS)) {
    if (lower.includes(key)) return POLISH_MONTHS[key];
  }
  return null;
}

export function getEffectiveNextPayment(payment: Payment, refDate = new Date()): string {
  // If next_payment already in future, return it (adjusted to working day)
  if (payment.next_payment) {
    const np = new Date(payment.next_payment);
    if (!isNaN(np.getTime()) && np >= startOfDay(refDate)) {
      return toWorkingDayISO(np);
    }
  }

  const schedule = (payment.schedule || '').toLowerCase();

  // 1) If schedule contains explicit days (monthly)
  const days = parseNumbers(schedule);
  if (days.length > 0) {
    // find next day in current month
    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    for (const day of days) {
      const d = new Date(year, month, clampDay(year, month, day));
      if (d >= startOfDay(refDate)) return toWorkingDayISO(d);
    }
    // otherwise take earliest in next month
    const nextMonth = addMonths(new Date(year, month, 1), 1);
    const y2 = nextMonth.getFullYear();
    const m2 = nextMonth.getMonth();
    const d2 = new Date(y2, m2, clampDay(y2, m2, days[0]));
    return toWorkingDayISO(d2);
  }

  // 2) If schedule mentions a month -> choose last day of that month in current or next year
  const monthNumber = findPolishMonth(schedule);
  if (monthNumber !== null) {
    const year = refDate.getFullYear();
    const candidate = new Date(year, monthNumber + 1, 0); // last day of month
    if (candidate >= startOfDay(refDate)) return toWorkingDayISO(candidate);
    const candidateNext = new Date(year + 1, monthNumber + 1, 0);
    return toWorkingDayISO(candidateNext);
  }

  // 3) If schedule contains words like "co miesiąc" or "miesiąc", assume same day-of-month as previous next_payment if valid, else use refDate + 1 month
  if (/miesi[aą]c|co miesi[aą]c|miesi[ąa]c/.test(schedule)) {
    // try to use day of payment.next_payment if present
    if (payment.next_payment) {
      const last = new Date(payment.next_payment);
      if (!isNaN(last.getTime())) {
        let candidate = new Date(last);
        while (candidate < startOfDay(refDate)) {
          candidate = addMonths(candidate, 1);
        }
        return toWorkingDayISO(candidate);
      }
    }
    // fallback: use first day of next month
    const next = addMonths(startOfDay(refDate), 1);
    return toWorkingDayISO(new Date(next.getFullYear(), next.getMonth(), 1));
  }

  // 4) Fallback: if next_payment exists but in past, increment month until in future
  if (payment.next_payment) {
    let candidate = new Date(payment.next_payment);
    if (isNaN(candidate.getTime())) candidate = startOfDay(refDate);
    let safety = 0;
    while (candidate < startOfDay(refDate) && safety < 36) {
      candidate = addMonths(candidate, 1);
      safety++;
    }
    return toWorkingDayISO(candidate);
  }

  // 5) Last fallback: tomorrow
  const tomorrow = new Date(startOfDay(refDate).getTime() + 24 * 60 * 60 * 1000);
  return toWorkingDayISO(tomorrow);
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Returns ISO date (YYYY-MM-DD) for the actual payout date: when nominal date is non‑working (weekend/holiday), use previous working day (ZUS/Polish rule). */
function toWorkingDayISO(d: Date): string {
  const adj = toPreviousWorkingDay(d);
  const y = adj.getFullYear();
  const m = String(adj.getMonth() + 1).padStart(2, '0');
  const day = String(adj.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysUntil(dateISO: string, refDate = new Date()): number {
  const d = new Date(dateISO);
  const diff = startOfDay(d).getTime() - startOfDay(refDate).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getEligiblePayments(payments: Payment[]): Payment[] {
  return payments.filter(p => !p.excludeFromNext);
}

/**
 * ISO payout date(s) for this benefit in the given calendar month (`month` 1–12).
 * Uses the same rules as the calendar (`getEffectiveNextPayment` + working-day adjustment).
 * For `excludeFromNext` / yearly entries, uses `yearly_snapshots[year].next_payment` when set, else `next_payment`.
 */
export function getPayoutDatesForPaymentInMonth(
  payment: Payment,
  year: number,
  month: number
): string[] {
  if (month < 1 || month > 12) return [];

  const monthIndex = month - 1;

  if (payment.excludeFromNext) {
    let iso: string | undefined;
    const snap = payment.yearly_snapshots?.[String(year)]?.next_payment;
    if (snap) iso = snap.trim();
    else if (payment.next_payment) iso = payment.next_payment.trim();
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return [];
    const [py, pm] = iso.split('-').map(Number);
    if (py !== year || pm !== month) return [];
    return [iso.slice(0, 10)];
  }

  const scheduleDays = parseNumbers(payment.schedule || '');
  if (scheduleDays.length > 0) {
    const seen = new Set<string>();
    for (const day of scheduleDays) {
      const nominal = new Date(year, monthIndex, clampDay(year, monthIndex, day));
      if (nominal.getFullYear() !== year || nominal.getMonth() !== monthIndex) continue;
      seen.add(toWorkingDayISO(nominal));
    }
    return [...seen].sort();
  }

  const monthEnd = new Date(year, monthIndex + 1, 0);
  const seen = new Set<string>();
  const result: string[] = [];
  let ref = new Date(year, monthIndex, 1);
  let iterations = 0;
  const maxIterationsPerPayment = 40;
  const paymentNoStickyNext: Payment = { ...payment, next_payment: '' };

  while (ref <= monthEnd && iterations < maxIterationsPerPayment) {
    iterations++;
    try {
      const nextDateStr = getEffectiveNextPayment(paymentNoStickyNext, ref);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(nextDateStr)) break;
      const [y, m, d] = nextDateStr.split('-').map(Number);
      const next = new Date(y, m - 1, d);
      if (Number.isNaN(next.getTime())) break;
      if (next.getFullYear() !== year || next.getMonth() !== monthIndex) break;
      if (!seen.has(nextDateStr)) {
        seen.add(nextDateStr);
        result.push(nextDateStr);
      }
      ref = new Date(next.getTime() + 24 * 60 * 60 * 1000);
    } catch {
      break;
    }
  }

  return result.sort();
}

/** Upcoming months (from the first day of the current month) within SEO year range that have at least one payout. */
export function getUpcomingSeoMonthLinks(
  payment: Payment,
  maxLinks = 6
): { year: number; month: number }[] {
  const links: { year: number; month: number }[] = [];
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth(), 1);

  for (const year of PROGRAMMATIC_SEO_YEARS) {
    for (let month = 1; month <= 12; month++) {
      const first = new Date(year, month - 1, 1);
      if (first < cutoff) continue;
      if (getPayoutDatesForPaymentInMonth(payment, year, month).length === 0) continue;
      links.push({ year, month });
      if (links.length >= maxLinks) return links;
    }
  }
  return links;
}

/** Returns map of date (YYYY-MM-DD) to payments that fall on that day in the given month. */
export function getPaymentsByDateInMonth(
  payments: Payment[],
  year: number,
  month: number
): Record<string, Payment[]> {
  const result: Record<string, Payment[]> = {};
  const monthEnd = new Date(year, month + 1, 0);
  const maxIterationsPerPayment = 31;
  for (const p of getEligiblePayments(payments)) {
    let ref = new Date(year, month, 1);
    let iterations = 0;
    while (ref <= monthEnd && iterations < maxIterationsPerPayment) {
      iterations++;
      try {
        const nextDateStr = getEffectiveNextPayment(p, ref);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(nextDateStr)) break;
        const [y, m, d] = nextDateStr.split('-').map(Number);
        const next = new Date(y, m - 1, d);
        if (Number.isNaN(next.getTime())) break;
        if (next.getFullYear() !== year || next.getMonth() !== month) break;
        if (!result[nextDateStr]) result[nextDateStr] = [];
        result[nextDateStr].push(p);
        ref = new Date(next.getTime() + 24 * 60 * 60 * 1000);
      } catch {
        break;
      }
    }
  }
  return result;
}

export interface MonthlyShiftChange {
  paymentId: string;
  paymentName: string;
  nominalISO: string;
  effectiveISO: string;
}

export interface MonthPayoutSummary {
  totalPayouts: number;
  activeBenefits: number;
}

export interface PaymentMonthComparison {
  paymentId: string;
  paymentName: string;
  leftDates: string[];
  rightDates: string[];
}

/** Payouts in the selected month that shift to a different working day. */
export function getMonthlyShiftChanges(
  payments: Payment[],
  year: number,
  month: number
): MonthlyShiftChange[] {
  if (month < 1 || month > 12) return [];

  const monthIndex = month - 1;
  const changes: MonthlyShiftChange[] = [];
  const seen = new Set<string>();

  const addIfShifted = (payment: Payment, nominal: Date) => {
    if (nominal.getFullYear() !== year || nominal.getMonth() !== monthIndex) return;
    const nominalISO = toISODate(nominal);
    const effectiveISO = toWorkingDayISO(nominal);
    if (nominalISO === effectiveISO) return;
    const key = `${payment.id}:${nominalISO}`;
    if (seen.has(key)) return;
    seen.add(key);
    changes.push({
      paymentId: payment.id,
      paymentName: payment.name,
      nominalISO,
      effectiveISO,
    });
  };

  for (const payment of payments) {
    if (payment.excludeFromNext) continue;

    const scheduleDays = parseNumbers(payment.schedule || '');
    if (scheduleDays.length > 0) {
      for (const day of scheduleDays) {
        const nominal = new Date(year, monthIndex, clampDay(year, monthIndex, day));
        addIfShifted(payment, nominal);
      }
      continue;
    }

    if (!payment.next_payment) continue;
    const nominal = new Date(payment.next_payment);
    if (Number.isNaN(nominal.getTime())) continue;
    addIfShifted(payment, nominal);
  }

  return changes.sort((a, b) => {
    if (a.effectiveISO === b.effectiveISO) return a.paymentName.localeCompare(b.paymentName, 'pl');
    return a.effectiveISO.localeCompare(b.effectiveISO);
  });
}

/** Summary stats for all payouts scheduled in a calendar month (`month` 1–12). */
export function getMonthPayoutSummary(
  payments: Payment[],
  year: number,
  month: number
): MonthPayoutSummary {
  let totalPayouts = 0;
  let activeBenefits = 0;

  for (const payment of payments) {
    const dates = getPayoutDatesForPaymentInMonth(payment, year, month);
    totalPayouts += dates.length;
    if (dates.length > 0) activeBenefits++;
  }

  return { totalPayouts, activeBenefits };
}

/** Date-by-date benefit changes between two months (`month` values 1–12). */
export function getMonthComparison(
  payments: Payment[],
  left: { year: number; month: number },
  right: { year: number; month: number }
): PaymentMonthComparison[] {
  const result: PaymentMonthComparison[] = [];

  const dayPattern = (dates: string[]) => dates.map((iso) => iso.slice(-2)).join('|');

  for (const payment of payments) {
    const leftDates = getPayoutDatesForPaymentInMonth(payment, left.year, left.month);
    const rightDates = getPayoutDatesForPaymentInMonth(payment, right.year, right.month);
    const leftKey = dayPattern(leftDates);
    const rightKey = dayPattern(rightDates);

    if (leftKey === rightKey) continue;

    result.push({
      paymentId: payment.id,
      paymentName: payment.name,
      leftDates,
      rightDates,
    });
  }

  return result.sort((a, b) => a.paymentName.localeCompare(b.paymentName, 'pl'));
}
