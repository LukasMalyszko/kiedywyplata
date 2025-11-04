import { notFound } from 'next/navigation';
import Link from 'next/link';
import PaymentCard from '@/components/payment-card/payment-card';
import { Payment, PAYMENT_CATEGORIES } from '@/types/payment';
import paymentsData from '../../../data/payments.json';
import { getEffectiveNextPayment } from '@/lib/payments';
import './page.scss';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  return PAYMENT_CATEGORIES.map((category) => ({
    category: category.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = PAYMENT_CATEGORIES.find(cat => cat.id === category);
  
  if (!categoryData) {
    return {
      title: 'Kategoria nie znaleziona - Kiedy Wypłata',
    };
  }

  return {
    title: `${categoryData.name} - Kiedy Wypłata`,
    description: `Sprawdź terminy wypłat dla kategorii: ${categoryData.description}. Aktualne daty wypłat w Polsce.`,
    keywords: `wypłata ${categoryData.name.toLowerCase()}, ${categoryData.description.toLowerCase()}, terminy wypłat`,
    openGraph: {
      title: `${categoryData.name} - Kiedy Wypłata`,
      description: `Sprawdź terminy wypłat dla kategorii: ${categoryData.description}`,
      type: 'website',
      locale: 'pl_PL',
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = PAYMENT_CATEGORIES.find(cat => cat.id === category);
  
  if (!categoryData) {
    notFound();
  }

  const payments: Payment[] = paymentsData as Payment[];
  const categoryPayments = payments.filter(payment => payment.category === category);

  const getNextPayment = () => {
    const today = new Date();
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    // Exclude payments marked as excludeFromNext
    const eligiblePayments = categoryPayments.filter(p => !p.excludeFromNext);
    const withEffective = eligiblePayments
      .map(p => ({ p, iso: getEffectiveNextPayment(p, today) }))
      .map(({ p, iso }) => ({ p, date: new Date(iso) }))
      .filter(({ date }) => date >= startToday)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return withEffective[0] ? withEffective[0].p : null;
  };

  const nextPayment = getNextPayment();

  return (
    <div className="category-page">
      <div className="container">
        <header className="category-page__header">
          <div className="category-page__breadcrumb">
            <Link href="/" className="category-page__breadcrumb-link">Strona główna</Link>
            <span className="category-page__breadcrumb-separator">→</span>
            <span className="category-page__breadcrumb-current">{categoryData.name}</span>
          </div>
          
          <div className="category-page__hero">
            <div className="category-page__icon">{categoryData.icon}</div>
            <div className="category-page__info">
              <h1 className="category-page__title">{categoryData.name}</h1>
              <p className="category-page__description">{categoryData.description}</p>
            </div>
          </div>

          {nextPayment && (
            <div className="category-page__next-payment">
              <h2 className="category-page__next-title">Najbliższa wypłata w tej kategorii:</h2>
              <div className="category-page__next-card">
                <strong>{nextPayment.name}</strong>
                <span>{new Date(getEffectiveNextPayment(nextPayment)).toLocaleDateString('pl-PL', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
            </div>
          )}
        </header>

        <section className="category-page__payments">
          {categoryPayments.length > 0 ? (
            <>
              <h2 className="category-page__section-title">
                Wszystkie świadczenia ({categoryPayments.length})
              </h2>
              <div className="category-page__payments-grid">
                {categoryPayments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} linkToDetail={true} />
                ))}
              </div>
            </>
          ) : (
            <div className="category-page__empty">
              <p>Brak świadczeń w tej kategorii.</p>
            </div>
          )}
        </section>

        <section className="category-page__other-categories">
          <h2 className="category-page__section-title">Inne kategorie</h2>
          <div className="category-page__other-grid">
            {PAYMENT_CATEGORIES
              .filter(cat => cat.id !== category)
              .map((categoryItem) => (
                <a
                  key={categoryItem.id}
                  href={`/${categoryItem.id}`}
                  className="category-page__other-card"
                >
                  <span className="category-page__other-icon">{categoryItem.icon}</span>
                  <div className="category-page__other-info">
                    <h3 className="category-page__other-name">{categoryItem.name}</h3>
                    <p className="category-page__other-desc">{categoryItem.description}</p>
                  </div>
                </a>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}