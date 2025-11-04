import { notFound } from 'next/navigation';
import PaymentCard from '@/components/payment-card/payment-card';
import { Payment, PAYMENT_CATEGORIES } from '@/types/payment';
import paymentsData from '../../../../data/payments.json';
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
  const categoryData = PAYMENT_CATEGORIES.find(cat => cat.id === params.category);
  
  if (!categoryData) {
    return {
      title: 'Kategoria nie znaleziona - Kiedy Wypłata',
    };
  }

  return {
    title: `${categoryData.name} - Kiedy Wypłata`,
    description: `Sprawdź terminy wypłat dla kategorii: ${categoryData.description}. Aktualne daty wypłat w Polsce.`,
    openGraph: {
      title: `${categoryData.name} - Kiedy Wypłata`,
      description: `Sprawdź terminy wypłat dla kategorii: ${categoryData.description}`,
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryData = PAYMENT_CATEGORIES.find(cat => cat.id === params.category);
  
  if (!categoryData) {
    notFound();
  }

  const payments: Payment[] = paymentsData as Payment[];
  const categoryPayments = payments.filter(payment => payment.category === params.category);

  const getNextPayment = () => {
    const today = new Date();
    const upcomingPayments = categoryPayments
      .filter(payment => new Date(payment.next_payment) >= today)
      .sort((a, b) => new Date(a.next_payment).getTime() - new Date(b.next_payment).getTime());
    
    return upcomingPayments[0] || null;
  };

  const nextPayment = getNextPayment();

  return (
    <div className="category-page">
      <div className="container">
        <header className="category-page__header">
          <div className="category-page__breadcrumb">
            <a href="/" className="category-page__breadcrumb-link">Strona główna</a>
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
                <span>{new Date(nextPayment.next_payment).toLocaleDateString('pl-PL', {
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
                  <PaymentCard key={payment.id} payment={payment} />
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
              .filter(cat => cat.id !== params.category)
              .map((category) => (
                <a
                  key={category.id}
                  href={`/kategoria/${category.id}`}
                  className="category-page__other-card"
                >
                  <span className="category-page__other-icon">{category.icon}</span>
                  <div className="category-page__other-info">
                    <h3 className="category-page__other-name">{category.name}</h3>
                    <p className="category-page__other-desc">{category.description}</p>
                  </div>
                </a>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}