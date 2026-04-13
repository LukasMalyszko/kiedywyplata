import { Suspense } from 'react';
import CalendarClient from './calendar-client';

export const metadata = {
  title: 'Kalendarz wypłat | Kiedy Wypłata',
  description: 'Kalendarz wypłat świadczeń w Polsce. Sprawdź, kiedy wypłacane są 800+, emerytury ZUS i inne świadczenia.',
  alternates: { canonical: '/calendar' },
};

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="calendar-page"><div className="container"><p>Ładowanie…</p></div></div>}>
      <CalendarClient />
    </Suspense>
  );
}
