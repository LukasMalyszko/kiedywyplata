import Link from 'next/link';
import type { Metadata } from 'next';
import './page.scss';

const SEJM_API_BASE = 'https://api.sejm.gov.pl/sejm/term10';

interface RecipientDetail {
  name: string;
  sent: string;
  answerDelayedDays: number;
}

interface Reply {
  from: string;
  key?: string;
  receiptDate: string;
  lastModified: string;
  onlyAttachment: boolean;
  prolongation: boolean;
  links: { href: string; rel: string }[];
}

interface ApiLink {
  href: string;
  rel: string;
}

interface Interpellation {
  num: number;
  term: number;
  title: string;
  receiptDate: string;
  sentDate: string;
  from: string[];
  to: string[];
  recipientDetails: RecipientDetail[];
  replies: Reply[];
  answerDelayedDays: number;
  lastModified: string;
  links: ApiLink[];
}

async function getInterpellation(num: string): Promise<Interpellation | null> {
  const res = await fetch(`${SEJM_API_BASE}/interpellations/${num}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function getBody(num: string): Promise<string | null> {
  const res = await fetch(`${SEJM_API_BASE}/interpellations/${num}/body`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.text();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ num: string }>;
}): Promise<Metadata> {
  const { num } = await params;
  const data = await getInterpellation(num);
  const title = data
    ? `Interpelacja nr ${data.num} – ${data.title}`
    : `Interpelacja nr ${num}`;
  return {
    title: `${title} | Kiedy Wypłata`,
    description: data?.title,
    alternates: { canonical: `/sejm/interpelacje/${num}` },
  };
}

export default async function InterpellationPage({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;

  const [data, body] = await Promise.all([
    getInterpellation(num),
    getBody(num),
  ]);

  if (!data) {
    return (
      <div className="interpellation-page">
        <div className="container">
          <div className="interpellation-page__error">
            <h1 className="interpellation-page__error-title">
              Nie znaleziono interpelacji
            </h1>
            <p>Interpelacja nr {num} nie istnieje lub jest niedostępna.</p>
            <Link href="/sejm/interpelacje" className="interpellation-page__back-link">
              ← Wróć do listy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const webDescriptionLink = data.links.find((l) => l.rel === 'web-description');

  return (
    <div className="interpellation-page">
      <div className="container">
        <header className="interpellation-page__header">
          <Link href="/sejm/interpelacje" className="interpellation-page__back-link">
            ← Interpelacje Sejmu
          </Link>
          <p className="interpellation-page__num">
            Kadencja {data.term} · Interpelacja nr {data.num}
          </p>
          <h1 className="interpellation-page__title">{data.title}</h1>

          <ul className="interpellation-page__meta">
            <li className="interpellation-page__meta-item">
              <strong>Data wpływu:</strong>
              <span>{data.receiptDate}</span>
            </li>
            {data.sentDate && (
              <li className="interpellation-page__meta-item">
                <strong>Przekazano:</strong>
                <span>{data.sentDate}</span>
              </li>
            )}
            {data.from?.length > 0 && (
              <li className="interpellation-page__meta-item">
                <strong>Zgłaszający:</strong>
                <span>{data.from.join(', ')}</span>
              </li>
            )}
            {data.to?.length > 0 && (
              <li className="interpellation-page__meta-item">
                <strong>Adresat:</strong>
                <span>{data.to.join(', ')}</span>
              </li>
            )}
          </ul>

          {webDescriptionLink && (
            <div className="interpellation-page__links" style={{ marginTop: '0.75rem' }}>
              <a
                href={webDescriptionLink.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Otwórz na sejm.gov.pl ↗
              </a>
            </div>
          )}
        </header>

        {/* Body */}
        <div className="interpellation-page__body-card">
          <h2 className="interpellation-page__section-title">Treść interpelacji</h2>
          {body ? (
            <pre className="interpellation-page__body-text">{body}</pre>
          ) : (
            <p className="interpellation-page__body-loading">
              Treść niedostępna.
            </p>
          )}
        </div>

        {/* Recipients */}
        {data.recipientDetails?.length > 0 && (
          <div className="interpellation-page__recipients-card">
            <h2 className="interpellation-page__section-title">Adresaci</h2>
            <ul className="interpellation-page__recipient-list">
              {data.recipientDetails.map((r, i) => (
                <li key={i} className="interpellation-page__recipient-item">
                  <p className="interpellation-page__recipient-name">{r.name}</p>
                  <p className="interpellation-page__recipient-meta">
                    Wysłano: {r.sent}
                    {r.answerDelayedDays > 0 &&
                      ` · Opóźnienie odpowiedzi: ${r.answerDelayedDays} dni`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Replies */}
        {data.replies?.length > 0 && (
          <div className="interpellation-page__replies-card">
            <h2 className="interpellation-page__section-title">
              Odpowiedzi ({data.replies.length})
            </h2>
            <ul className="interpellation-page__reply-list">
              {data.replies.map((r, i) => {
                const replyBodyLink = r.links?.find((l) => l.rel === 'body');
                const replyWebLink = r.links?.find((l) => l.rel === 'web-body');
                return (
                  <li key={i} className="interpellation-page__reply-item">
                    <p className="interpellation-page__reply-from">{r.from}</p>
                    <p className="interpellation-page__reply-meta">
                      Odebrano: {r.receiptDate}
                      {r.prolongation && ' · Przedłużenie terminu'}
                      {r.onlyAttachment && ' · Tylko załącznik'}
                    </p>
                    {(replyWebLink || replyBodyLink) && (
                      <div
                        className="interpellation-page__links"
                        style={{ marginTop: '0.4rem' }}
                      >
                        {replyWebLink && (
                          <a
                            href={replyWebLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Treść ↗
                          </a>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
