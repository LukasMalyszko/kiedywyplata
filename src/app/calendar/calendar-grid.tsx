'use client';

import { useState, useRef, useEffect } from 'react';
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

function getPaymentsForDate(
  paymentsByDate: Record<string, Payment[]>,
  dateKey: string
): Payment[] {
  const raw = paymentsByDate[dateKey] ?? [];
  const seen = new Set<string>();
  return raw.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export default function CalendarGrid({ year, month, paymentsByDate, monthName }: CalendarGridProps) {
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const lastDay = last.getDate();
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

  // Close day popover when clicking outside
  useEffect(() => {
    if (!selectedDateKey) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (gridRef.current && !gridRef.current.contains(target)) {
        setSelectedDateKey(null);
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [selectedDateKey]);

  const selectedPayments = selectedDateKey ? getPaymentsForDate(paymentsByDate, selectedDateKey) : [];
  const selectedDayLabel = selectedDateKey
    ? new Date(selectedDateKey + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })
    : '';

  return (
    <div ref={gridRef} className="calendar-grid" role="application" aria-label={`Kalendarz wypłat na ${monthName} ${year}`}>
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
              const payments = getPaymentsForDate(paymentsByDate, key);
              const hasPayments = payments.length > 0;
              const tooltipText = hasPayments ? payments.map((p) => p.name).join(' · ') : '';
              const isSelected = selectedDateKey === key;

              return (
                <div
                  key={key}
                  className={`calendar-grid__cell ${hasPayments ? 'calendar-grid__cell--has-payments' : ''} ${isToday(day) ? 'calendar-grid__cell--today' : ''} ${isSelected ? 'calendar-grid__cell--selected' : ''}`}
                  role="gridcell"
                  aria-label={day + (hasPayments ? `: wypłaty: ${tooltipText}` : '')}
                  aria-expanded={hasPayments ? isSelected : undefined}
                  onClick={() => hasPayments && setSelectedDateKey(isSelected ? null : key)}
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

      {selectedDateKey && selectedPayments.length > 0 && (
        <div className="calendar-grid__day-popover" role="dialog" aria-label={`Wypłaty dnia ${selectedDayLabel}`}>
          <div className="calendar-grid__day-popover-header">
            <span className="calendar-grid__day-popover-title">Wypłaty – {selectedDayLabel}</span>
            <button
              type="button"
              className="calendar-grid__day-popover-close"
              onClick={() => setSelectedDateKey(null)}
              aria-label="Zamknij"
            >
              ×
            </button>
          </div>
          <ul className="calendar-grid__day-popover-list">
            {selectedPayments.map((p) => (
              <li key={p.id}>
                <Link href={`/benefit/${p.id}`} className="calendar-grid__day-popover-link" onClick={() => setSelectedDateKey(null)}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
