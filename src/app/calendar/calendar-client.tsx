'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Payment } from '@/types/payment';
import CalendarGrid from './calendar-grid';
import './page.scss';

const MONTH_NAMES = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

export default function CalendarClient() {
  const searchParams = useSearchParams();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const yearParam = searchParams.get('year');
  const monthParam = searchParams.get('month');
  const year = yearParam ? parseInt(yearParam, 10) : currentYear;
  const month = (monthParam ? parseInt(monthParam, 10) - 1 : currentMonth);
  const y = Number.isNaN(year) ? currentYear : year;
  const m = Number.isNaN(month) || month < 0 || month > 11 ? currentMonth : month;

  const requestKey = `${y}-${m}`;
  const [lastRequestKey, setLastRequestKey] = useState<string | null>(null);
  const [paymentsByDate, setPaymentsByDate] = useState<Record<string, Payment[]>>({});
  const [errorRequestKey, setErrorRequestKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/calendar?year=${y}&month=${m + 1}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setLastRequestKey(requestKey);
          setPaymentsByDate(data.paymentsByDate ?? {});
          setErrorRequestKey(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorRequestKey(requestKey);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  const loading = lastRequestKey !== requestKey;
  const error = errorRequestKey === requestKey;

  const earliestYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const earliestMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const latestYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const latestMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const canGoPrev = y > earliestYear || (y === earliestYear && m > earliestMonth);
  const canGoNext = y < latestYear || (y === latestYear && m < latestMonth);

  const prevMonth = m === 0 ? 11 : m - 1;
  const prevYear = m === 0 ? y - 1 : y;
  const nextMonth = m === 11 ? 0 : m + 1;
  const nextYear = m === 11 ? y + 1 : y;

  return (
    <div className="calendar-page">
      <div className="container">
        <header className="calendar-page__header">
          <Link href="/" className="calendar-page__breadcrumb">
            Strona główna
          </Link>
          <h1 className="calendar-page__title">Kalendarz wypłat</h1>
          <p className="calendar-page__description">
            Dni z wypłatami świadczeń w wybranym miesiącu. Najedź na zaznaczony dzień, aby zobaczyć listę świadczeń.
          </p>

          <div className="calendar-page__nav">
            {canGoPrev ? (
              <Link
                href={`/calendar?year=${prevYear}&month=${prevMonth + 1}`}
                className="calendar-page__nav-btn calendar-page__nav-btn--prev"
                aria-label="Poprzedni miesiąc"
              >
                ← {MONTH_NAMES[prevMonth]} {prevYear}
              </Link>
            ) : (
              <span className="calendar-page__nav-btn calendar-page__nav-btn--disabled" aria-hidden>
                —
              </span>
            )}
            <span className="calendar-page__nav-current" aria-current="true">
              {MONTH_NAMES[m]} {y}
            </span>
            {canGoNext ? (
              <Link
                href={`/calendar?year=${nextYear}&month=${nextMonth + 1}`}
                className="calendar-page__nav-btn calendar-page__nav-btn--next"
                aria-label="Następny miesiąc"
              >
                {MONTH_NAMES[nextMonth]} {nextYear} →
              </Link>
            ) : (
              <span className="calendar-page__nav-btn calendar-page__nav-btn--disabled" aria-hidden>
                —
              </span>
            )}
          </div>
        </header>

        {loading && (
          <div className="calendar-page__loading" aria-live="polite">
            Ładowanie kalendarza…
          </div>
        )}
        {error && (
          <div className="calendar-page__error" role="alert">
            Nie udało się załadować danych. Odśwież stronę.
          </div>
        )}
        {!loading && !error && (
          <CalendarGrid
            year={y}
            month={m}
            paymentsByDate={paymentsByDate}
            monthName={MONTH_NAMES[m]}
          />
        )}
      </div>
    </div>
  );
}
