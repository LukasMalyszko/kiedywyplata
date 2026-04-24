import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PaymentCard from '@/components/payment-card/payment-card';

const AddToCalendar = dynamic(() => import('@/components/add-to-calendar/add-to-calendar'));
import { Payment, PAYMENT_CATEGORIES } from '@/types/payment';
import CategoryIcon from '@/components/category-icon/category-icon';
import { getEffectiveNextPayment, daysUntil as computeDaysUntil, getUpcomingSeoMonthLinks } from '@/lib/payments';
import paymentsData from '../../../../data/payments.json';
import './page.scss';

interface BenefitPageProps {
  params: Promise<{ benefit: string }>;
}

export async function generateStaticParams() {
  const payments: Payment[] = paymentsData as Payment[];
  return payments.map((payment) => ({
    benefit: payment.id,
  }));
}

export async function generateMetadata({ params }: BenefitPageProps) {
  const { benefit } = await params;
  const payments: Payment[] = paymentsData as Payment[];
  const payment = payments.find(p => p.id === benefit);
  
  if (!payment) {
    return {
      title: 'Świadczenie nie znalezione - Kiedy Wypłata',
    };
  }
  
  // For excluded payments, use original date without calculation
  const effectiveDate = payment.excludeFromNext 
    ? payment.next_payment 
    : getEffectiveNextPayment(payment);
  const effective = new Date(effectiveDate);

  return {
    title: `${payment.name} - Kiedy Wypłata`,
    description: `${payment.description} Sprawdź termin wypłaty: ${effective.toLocaleDateString('pl-PL')}`,
    keywords: `wypłata ${payment.name.toLowerCase()}, ${payment.schedule.toLowerCase()}, terminy wypłat`,
    alternates: { canonical: `/benefit/${benefit}` },
    openGraph: {
      title: `${payment.name} - Kiedy Wypłata`,
      description: payment.description,
      type: 'website',
      locale: 'pl_PL',
    },
  };
}

export default async function BenefitPage({ params }: BenefitPageProps) {
  const { benefit } = await params;
  const payments: Payment[] = paymentsData as Payment[];
  const payment = payments.find(p => p.id === benefit);
  
  if (!payment) {
    notFound();
  }

  // Get category info
  const categoryData = PAYMENT_CATEGORIES.find(cat => cat.id === payment.category);
  
  // Get related payments from the same category
  const relatedPayments = payments
    .filter(p => p.category === payment.category && p.id !== payment.id)
    .slice(0, 3);

  // Calculate payment date and days until
  const today = new Date();
  let effectiveISO: string;
  
  // For excluded payments, use original date without calculation
  if (payment.excludeFromNext) {
    effectiveISO = payment.next_payment;
  } else {
    effectiveISO = getEffectiveNextPayment(payment, today);
  }
  
  const paymentDate = new Date(effectiveISO);
  const daysUntil = computeDaysUntil(effectiveISO, today);
  const isUpcoming = daysUntil >= 0 && daysUntil <= 7;
  const isPast = daysUntil < 0;
  const monthLinks = getUpcomingSeoMonthLinks(payment, 8);
  const showPoliceHousingInfoTile = payment.id === 'dodatek-mieszkaniowy';

  return (
    <div className="benefit-page">
      <div className="container">
        <header className="benefit-page__header">
          <div className="benefit-page__breadcrumb">
            <Link href="/" className="benefit-page__breadcrumb-link">Strona główna</Link>
            <span className="benefit-page__breadcrumb-separator">→</span>
            {categoryData && (
              <>
                <Link href={`/${payment.category}`} className="benefit-page__breadcrumb-link">
                  {categoryData.name}
                </Link>
                <span className="benefit-page__breadcrumb-separator">→</span>
              </>
            )}
            <span className="benefit-page__breadcrumb-current">{payment.name}</span>
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
            
            <h1 className="benefit-page__title">{payment.name}</h1>
            <p className="benefit-page__description">{payment.description}</p>
          </div>

          <div className={`benefit-page__payment-info ${isUpcoming ? 'benefit-page__payment-info--upcoming' : ''} ${isPast ? 'benefit-page__payment-info--past' : ''}`}>
            <div className="benefit-page__payment-date">
              <h2 className="benefit-page__date-label">
                {payment.excludeFromNext ? 
                  (payment.id === 'dobry-start' ? 'Wypłata roczna:' : 'Jednorazowa wypłata:') :
                  (isPast ? 'Ostatnia wypłata:' : 'Następna wypłata:')}
              </h2>
              {payment.next_payment !== "" && <div className="benefit-page__date-value">
                {paymentDate.toLocaleDateString('pl-PL', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>}
              {!isPast && !payment.excludeFromNext && (
                <div className="benefit-page__countdown">
                  {daysUntil === 0 ? '🎉 Dziś!' : 
                   daysUntil === 1 ? '⏰ Jutro' : 
                   `📅 Za ${daysUntil} ${daysUntil < 5 ? 'dni' : 'dni'}`}
                </div>
              )}
              {payment.excludeFromNext && (
                <div className="benefit-page__special-note">
                  {payment.id === 'dobry-start' ? 
                    '📚 Świadczenie wypłacane raz w roku' : 
                    '⚡ Świadczenie jednorazowe'}
                </div>
              )}
            </div>
            
            <div className="benefit-page__schedule">
              <h3 className="benefit-page__schedule-title">Harmonogram wypłat:</h3>
              <p className="benefit-page__schedule-text">{payment.schedule}</p>
            </div>

            {payment.next_payment !== '' && (
              <AddToCalendar payment={payment} nextPaymentISO={effectiveISO} />
            )}
          </div>

          {monthLinks.length > 0 && (
            <nav className="benefit-page__month-links" aria-label="Nadchodzące wypłaty wg miesięcy">
              <h2 className="benefit-page__month-links-title">Nadchodzące terminy (2026–2027)</h2>
              <ul className="benefit-page__month-links-list">
                {monthLinks.map(({ year, month }) => {
                  const label = new Date(year, month - 1, 1).toLocaleDateString('pl-PL', {
                    month: 'long',
                    year: 'numeric',
                  });
                  const cap = label.charAt(0).toUpperCase() + label.slice(1);
                  return (
                    <li key={`${year}-${month}`} className="benefit-page__month-links-item">
                      <Link
                        href={`/benefit/${benefit}/${year}/${month}`}
                        className="benefit-page__month-links-link"
                      >
                        {cap}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </header>

        <section className="benefit-page__details">
          <div className="benefit-page__info-grid">
            <div className="benefit-page__info-card">
              <h3 className="benefit-page__info-title">📋 Szczegóły</h3>
              <p className="benefit-page__info-text">{payment.description}</p>
            </div>
            
            <div className="benefit-page__info-card">
              <h3 className="benefit-page__info-title">📅 Harmonogram</h3>
              <p className="benefit-page__info-text">{payment.schedule}</p>
            </div>
            
            <div className="benefit-page__info-card">
              <h3 className="benefit-page__info-title">🏛️ Źródło informacji</h3>
              <a 
                href={payment.source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="benefit-page__source-link"
              >
                Oficjalna strona →
              </a>
            </div>

            {showPoliceHousingInfoTile && (
              <div className="benefit-page__info-card">
                <h3 className="benefit-page__info-title">👮 Mieszkaniówka w Policji (2026)</h3>
                <p className="benefit-page__info-text">
                  Dodatek mieszkaniowy dla policjantów w 2026 roku jest wypłacany po złożeniu wniosku.
                  Środki trafiają na konto funkcjonariusza w terminie ustalonym przez jednostkę kadrową,
                  zwykle w cyklu miesięcznym.
                </p>
                <p className="benefit-page__info-text">
                  Świadczenie przysługuje policjantom, którzy nie korzystają z lokalu służbowego lub internatu.
                  Kwota wynosi od 900 do 1800 zł miesięcznie (zależnie od miejsca służby). Wniosek można
                  złożyć papierowo lub elektronicznie (profil zaufany / podpis kwalifikowany).
                </p>
                <p className="benefit-page__info-text">
                  Wypłaty realizowane są miesięcznie. Świadczenie przyznane po złożeniu wniosku jest wypłacane
                  od dnia jego złożenia. Przy zachowaniu terminu złożenia możliwe jest wyrównanie od 1 lipca 2025 r.
                </p>
                <a
                  href="https://www.gov.pl/web/mswia/swiadczenie-mieszkaniowe-do-1800-zl-wkrotce-trafi-do-funkcjonariuszy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="benefit-page__source-link"
                >
                  Źródło: MSWiA (gov.pl) →
                </a>
                <a
                  href="https://specbrands.pl/mieszkaniowka-dla-policji-kiedy-bedzie-wyplacane-swiadczenie-mieszkaniowe-dla-funkcjonariuszy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="benefit-page__source-link"
                >
                  Źródło: SpecBrands.pl →
                </a>
              </div>
            )}
          </div>
        </section>

        {relatedPayments.length > 0 && (
          <section className="benefit-page__related">
            <h2 className="benefit-page__section-title">Podobne świadczenia</h2>
            <div className="benefit-page__related-grid">
              {relatedPayments.map((relatedPayment) => (
                <PaymentCard key={relatedPayment.id} payment={relatedPayment} linkToDetail={true} />
              ))}
            </div>
          </section>
        )}

        <section className="benefit-page__actions">
          <div className="benefit-page__action-buttons">
            <Link href="/" className="button button--secondary">
              ← Powrót do strony głównej
            </Link>
            {categoryData && (
              <Link href={`/${payment.category}`} className="button button--primary">
                Zobacz wszystkie: {categoryData.name}
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}