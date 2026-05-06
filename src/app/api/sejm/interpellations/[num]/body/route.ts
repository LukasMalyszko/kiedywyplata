import { NextRequest } from 'next/server';

const SEJM_API_BASE = 'https://api.sejm.gov.pl/sejm/term10';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ num: string }> }
) {
  const { num } = await params;
  const parsedNum = parseInt(num, 10);

  if (isNaN(parsedNum) || parsedNum <= 0) {
    return new Response('Invalid interpellation number', { status: 400 });
  }

  const res = await fetch(`${SEJM_API_BASE}/interpellations/${parsedNum}/body`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return new Response('Body not found', { status: res.status });
  }

  const text = await res.text();
  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
