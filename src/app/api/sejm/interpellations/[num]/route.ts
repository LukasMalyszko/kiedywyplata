import { NextRequest } from 'next/server';

const SEJM_API_BASE = 'https://api.sejm.gov.pl/sejm/term10';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ num: string }> }
) {
  const { num } = await params;
  const parsedNum = parseInt(num, 10);

  if (isNaN(parsedNum) || parsedNum <= 0) {
    return Response.json({ error: 'Invalid interpellation number' }, { status: 400 });
  }

  const res = await fetch(`${SEJM_API_BASE}/interpellations/${parsedNum}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return Response.json({ error: 'Interpellation not found' }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
