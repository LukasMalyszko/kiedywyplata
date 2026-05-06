import { NextRequest } from 'next/server';

const GOV_API_BASE = 'https://api.dane.gov.pl/1.4';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const page = searchParams.get('page') ?? '1';

  const url = new URL(`${GOV_API_BASE}/datasets`);
  if (query) url.searchParams.set('q', query);
  url.searchParams.set('page', page);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });

  if (!res.ok) {
    return Response.json({ error: 'Failed to fetch datasets' }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
