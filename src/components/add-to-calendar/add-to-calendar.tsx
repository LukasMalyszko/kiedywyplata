'use client';

import { useState, useEffect, useRef } from 'react';
import { Payment } from '@/types/payment';
import { buildGoogleCalendarUrl, buildOutlookUrl } from '@/lib/ics';
import './add-to-calendar.scss';

interface AddToCalendarProps {
  payment: Payment;
  nextPaymentISO: string;
}

export default function AddToCalendar({ payment, nextPaymentISO }: AddToCalendarProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextDate = new Date(nextPaymentISO);
  const validDate = !isNaN(nextDate.getTime());

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  if (!validDate) return null;

  const googleUrl = buildGoogleCalendarUrl(payment, nextDate);
  const outlookUrl = buildOutlookUrl(payment, nextDate);

  return (
    <div className="add-to-calendar" ref={containerRef}>
      <button
        className="add-to-calendar__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        type="button"
      >
        📅 Dodaj do kalendarza
      </button>

      {open && (
        <div className="add-to-calendar__dropdown" role="menu">
          <a
            className="add-to-calendar__option"
            href={`/api/calendar/${payment.id}`}
            download={`${payment.id}-wyplata.ics`}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <span className="add-to-calendar__option-icon">📥</span>
            <span>
              <strong>Pobierz .ics</strong>
              <small>Apple Calendar, Outlook, Thunderbird</small>
            </span>
          </a>

          <a
            className="add-to-calendar__option"
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <span className="add-to-calendar__option-icon">🗓️</span>
            <span>
              <strong>Google Calendar</strong>
              <small>Otwiera w przeglądarce</small>
            </span>
          </a>

          <a
            className="add-to-calendar__option"
            href={outlookUrl}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <span className="add-to-calendar__option-icon">📨</span>
            <span>
              <strong>Outlook.com</strong>
              <small>Otwiera w przeglądarce</small>
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
