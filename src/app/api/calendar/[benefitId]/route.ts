import { NextRequest } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Payment } from '@/types/payment';
import { generateUpcomingDates, generateICS } from '@/lib/ics';

function loadPayments(): Payment[] {
  const path = join(process.cwd(), 'data', 'payments.json');
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ benefitId: string }> }
) {
  const { benefitId } = await params;
  const payments = loadPayments();
  const payment = payments.find((p) => p.id === benefitId);

  if (!payment) {
    return new Response('Świadczenie nie znalezione.', { status: 404 });
  }

  const dates = generateUpcomingDates(payment, 12);
  const ics = generateICS(payment, dates);

  if (!ics) {
    return new Response('Brak danych do wygenerowania kalendarza.', { status: 404 });
  }

  const filename = `${benefitId}-wyplata.ics`;

  return new Response(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
