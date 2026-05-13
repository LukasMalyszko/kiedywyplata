import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Payment, PAYMENT_CATEGORIES } from '@/types/payment';
import CategoryIcon from '@/components/category-icon/category-icon';
import {
  PROGRAMMATIC_SEO_YEARS,
  getPayoutDatesForPaymentInMonth,
} from '@/lib/payments';
import paymentsData from '../../../../../../data/payments.json';
import '../../page.scss';

interface BenefitMonthPageProps {
  params: Promise<{ benefit: string; year: string; month: string }>;
}

function parseYearMonth(yearStr: string, monthStr: string): { year: number; month: number } | null {
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
  if (!(PROGRAMMATIC_SEO_YEARS as readonly number[]).includes(year)) return null;
  if (month < 1 || month > 12) return null;
  if (String(month) !== monthStr.trim()) return null;
  if (String(year) !== yearStr.trim()) return null;
  return { year, month };
}

function capitalizePlMonthLabel(year: number, month: number): string {
  const d = new Date(year, month - 1, 1);
  const raw = d.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export async function generateStaticParams() {
  const payments: Payment[] = paymentsData as Payment[];
  const params: { benefit: string; year: string; month: string }[] = [];

  for (const payment of payments) {
    for (const year of PROGRAMMATIC_SEO_YEARS) {
      for (let month = 1; month <= 12; month++) {
        if (getPayoutDatesForPaymentInMonth(payment, year, month).length > 0) {
          params.push({
            benefit: payment.id,
            year: String(year),
            month: String(month),
          });
        }
      }
    }
  }

  return params;
}

export const dynamicParams = false;

export async function generateMetadata({ params }: BenefitMonthPageProps): Promise<Metadata> {
  const { benefit, year: yStr, month: mStr } = await params;
  const parsed = parseYearMonth(yStr, mStr);
  const payments: Payment[] = paymentsData as Payment[];
  const payment = payments.find((p) => p.id === benefit);

  if (!parsed || !payment) {
    return { title: 'Strona nie znaleziona - Kiedy Wypłata' };
  }

  const { year, month } = parsed;
  const dates = getPayoutDatesForPaymentInMonth(payment, year, month);
  if (dates.length === 0) {
    return { title: 'Strona nie znaleziona - Kiedy Wypłata' };
  }

  const monthTitle = capitalizePlMonthLabel(year, month);
  const datePhrase =
    dates.length === 1
      ? new Date(dates[0] + 'T12:00:00').toLocaleDateString('pl-PL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : `terminy: ${dates
          .map((d) =>
            new Date(d + 'T12:00:00').toLocaleDateString('pl-PL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          )
          .join(', ')}`;

  const path = `/benefit/${benefit}/${year}/${month}`;
  const title = `${payment.name} — wypłata ${monthTitle} | Kiedy Wypłata`;
  const description = `Termin wypłaty ${payment.name} w ${monthTitle}: ${datePhrase}. ${payment.description.slice(0, 120)}${payment.description.length > 120 ? '…' : ''}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pl_PL',
    },
  };
}

export default async function BenefitMonthPage({ params }: BenefitMonthPageProps) {
  const { benefit, year: yStr, month: mStr } = await params;
  const parsed = parseYearMonth(yStr, mStr);
  const payments: Payment[] = paymentsData as Payment[];
  const payment = payments.find((p) => p.id === benefit);

  if (!parsed || !payment) {
    notFound();
  }

  const { year, month } = parsed;
  const dates = getPayoutDatesForPaymentInMonth(payment, year, month);
  if (dates.length === 0) {
    notFound();
  }

  const categoryData = PAYMENT_CATEGORIES.find((cat) => cat.id === payment.category);
  const monthTitle = capitalizePlMonthLabel(year, month);

  return (
    <div className="benefit-page">
      <div className="container">
        <header className="benefit-page__header">
          <div className="benefit-page__breadcrumb">
            <Link href="/" className="benefit-page__breadcrumb-link">
              Strona główna
            </Link>
            <span className="benefit-page__breadcrumb-separator">→</span>
            {categoryData && (
              <>
                <Link href={`/${payment.category}`} className="benefit-page__breadcrumb-link">
                  {categoryData.name}
                </Link>
                <span className="benefit-page__breadcrumb-separator">→</span>
              </>
            )}
            <Link href={`/benefit/${benefit}`} className="benefit-page__breadcrumb-link">
              {payment.name}
            </Link>
            <span className="benefit-page__breadcrumb-separator">→</span>
            <span className="benefit-page__breadcrumb-current">{monthTitle}</span>
          </div>

          <div className="benefit-page__hero">
            {categoryData && (
              <div className="benefit-page__category">
                <span className="benefit-page__category-icon">
                  <CategoryIcon icon={categoryData.icon} imageClassName="benefit-page__category-icon-image" />
                </span>
                <span className="benefit-page__category-name">{categoryData.name}</span>
              </div>
            )}

            <h1 className="benefit-page__title">
              {payment.name} — wypłata ({monthTitle})
            </h1>
            <p className="benefit-page__description">{payment.description}</p>
          </div>

          <div className="benefit-page__payment-info">
            <div className="benefit-page__payment-date">
              <h2 className="benefit-page__date-label">
                {dates.length === 1 ? 'Termin wypłaty w tym miesiącu:' : 'Terminy wypłat w tym miesiącu:'}
              </h2>
              <ul className="benefit-page__date-list">
                {dates.map((iso) => (
                  <li key={iso} className="benefit-page__date-value benefit-page__date-value--list">
                    {new Date(iso + 'T12:00:00').toLocaleDateString('pl-PL', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </li>
                ))}
              </ul>
              {payment.id === '800plus' && (
                <p className="benefit-page__month-note">
                  Konkretny dzień wypłaty 800+ jest przypisany indywidualnie — poniżej możliwe terminy z harmonogramu ZUS
                  po uwzględnieniu dni roboczych.
                </p>
              )}
            </div>

            <div className="benefit-page__schedule">
              <h3 className="benefit-page__schedule-title">Harmonogram wypłat:</h3>
              <p className="benefit-page__schedule-text">{payment.schedule}</p>
            </div>
          </div>
        </header>

        <section className="benefit-page__actions">
          <div className="benefit-page__action-buttons">
            <Link href={`/benefit/${benefit}`} className="button button--secondary">
              ← Pełny opis: {payment.name}
            </Link>
            <Link href="/#faq" className="button button--secondary">
              ❓ Masz pytania? Sprawdź FAQ
            </Link>
            <Link href="/calendar" className="button button--primary">
              Kalendarz wypłat
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
