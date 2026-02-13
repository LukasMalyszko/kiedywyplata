'use client';

import Link from 'next/link';
import { Payment } from '@/types/payment';
import './calendar-grid.scss';

const WEEKDAYS = ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Nd'];

interface CalendarGridProps {
  year: number;
  month: number;
  paymentsByDate: Record<string, Payment[]>;
  monthName: string;
}

export default function CalendarGrid({ year, month, paymentsByDate, monthName }: CalendarGridProps) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const lastDay = last.getDate();
  // Monday = 0 (PL week start). getDay(): 0=Sun -> 6, 1=Mon -> 0, ...
  const firstWeekday = (first.getDay() + 6) % 7;
  const leadingEmpty = firstWeekday;
  const totalCells = leadingEmpty + lastDay;
  const rows = Math.ceil(totalCells / 7);
  const trailingEmpty = rows * 7 - totalCells;

  const cells: (null | number)[] = [];
  for (let i = 0; i < leadingEmpty; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) cells.push(d);
  for (let i = 0; i < trailingEmpty; i++) cells.push(null);

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const dateKey = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  return (
    <div className="calendar-grid" role="application" aria-label={`Kalendarz wypłat na ${monthName} ${year}`}>
      <div className="calendar-grid__weekdays" role="row">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="calendar-grid__weekday" role="columnheader">
            {wd}
          </div>
        ))}
      </div>
      <div className="calendar-grid__body">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="calendar-grid__row" role="row">
            {cells.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, colIndex) => {
              if (day === null) {
                return <div key={`e-${rowIndex}-${colIndex}`} className="calendar-grid__cell calendar-grid__cell--empty" />;
              }
              const key = dateKey(day);
              const rawPayments = paymentsByDate[key] ?? [];
              // Deduplicate by id so tooltip never repeats the same benefit
              const seenIds = new Set<string>();
              const payments = rawPayments.filter((p) => {
                if (seenIds.has(p.id)) return false;
                seenIds.add(p.id);
                return true;
              });
              const hasPayments = payments.length > 0;
              const tooltipText = hasPayments
                ? payments.map((p) => p.name).join(' · ')
                : '';

              return (
                <div
                  key={key}
                  className={`calendar-grid__cell ${hasPayments ? 'calendar-grid__cell--has-payments' : ''} ${isToday(day) ? 'calendar-grid__cell--today' : ''}`}
                  role="gridcell"
                  aria-label={day + (hasPayments ? `: wypłaty: ${tooltipText}` : '')}
                >
                  <span className="calendar-grid__day-num">{day}</span>
                  {hasPayments && (
                    <span className="calendar-grid__tooltip-wrap" title={tooltipText}>
                      <span className="calendar-grid__dot" aria-hidden />
                      <span className="calendar-grid__tooltip" role="tooltip">
                        <span className="calendar-grid__tooltip-title">Wypłaty:</span>
                        <ul className="calendar-grid__tooltip-list">
                          {payments.map((p) => (
                            <li key={p.id}>
                              <Link href={`/benefit/${p.id}`} className="calendar-grid__tooltip-link" onClick={(e) => e.stopPropagation()}>
                                {p.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
