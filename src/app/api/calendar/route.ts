import { NextRequest } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Payment } from '@/types/payment';
import { getPaymentsByDateInMonth } from '@/lib/payments';

function loadPayments(): Payment[] {
  const path = join(process.cwd(), 'data', 'payments.json');
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') ?? '', 10);
  const month = parseInt(searchParams.get('month') ?? '', 10) - 1; // 1-12 -> 0-11
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const y = Number.isNaN(year) ? currentYear : year;
  const m = Number.isNaN(month) || month < 0 || month > 11 ? currentMonth : month;

  try {
    const payments = loadPayments();
    const paymentsByDate = getPaymentsByDateInMonth(payments, y, m);
    return Response.json({ year: y, month: m, paymentsByDate });
  } catch (err) {
    return Response.json({ year: y, month: m, paymentsByDate: {} }, { status: 200 });
  }
}
