import Link from 'next/link';
import type { Metadata } from 'next';
import './page.scss';

const SEJM_API_BASE = 'https://api.sejm.gov.pl/sejm/term10';

export const metadata: Metadata = {
  title: 'Interpelacje o emeryturach | Kiedy Wypłata',
  description:
    'Lista interpelacji poselskich Sejmu RP kadencji X dotyczących emerytur i rent. Aktualne pytania posłów do ministrów w sprawie świadczeń emerytalnych.',
  alternates: { canonical: '/sejm/interpelacje' },
};

interface InterpellationSummary {
  num: number;
  title: string;
  receiptDate: string;
  from: string[];
  to: string[];
  replies: unknown[];
}

async function getInterpellations(): Promise<InterpellationSummary[]> {
  const res = await fetch(
    `${SEJM_API_BASE}/interpellations?title=emerytur&limit=100`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function InterpellationsPage() {
  const items = await getInterpellations();

  return (
    <div className="interpellations-list-page">
      <div className="container">
        <header className="interpellations-list-page__header">
          <h1 className="interpellations-list-page__title">
            Interpelacje o emeryturach
          </h1>
          <p className="interpellations-list-page__subtitle">
            Interpelacje poselskie kadencji X dotyczące emerytur i rent · Sejm Rzeczypospolitej Polskiej
          </p>
        </header>

        {items.length === 0 ? (
          <p className="interpellations-list-page__error">
            Nie udało się pobrać listy interpelacji.
          </p>
        ) : (
          <ul className="interpellations-list-page__grid">
            {items.map((item) => (
              <li key={item.num}>
                <Link
                  href={`/sejm/interpelacje/${item.num}`}
                  className="interpellations-list-page__card"
                >
                  <p className="interpellations-list-page__card-num">
                    Nr {item.num}
                  </p>
                  <p className="interpellations-list-page__card-title">
                    {item.title}
                  </p>
                  <p className="interpellations-list-page__card-meta">
                    {item.receiptDate}
                    {item.to?.length > 0 && ` · Do: ${item.to.join(', ')}`}
                    {item.replies?.length > 0 &&
                      ` · ${item.replies.length} odpowiedź/odpowiedzi`}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
