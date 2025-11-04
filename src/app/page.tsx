import PaymentCard from '@/components/payment-card/payment-card';
import NextPaymentBanner from '@/components/next-payment-banner/next-payment-banner';
import CategoryGrid from '@/components/category-grid/category-grid';
import { Payment, PAYMENT_CATEGORIES } from '@/types/payment';
import paymentsData from '../../data/payments.json';
import './page.scss';

export default function Home() {
  const payments: Payment[] = paymentsData as Payment[];

  return (
    <div className="home-page">
      <NextPaymentBanner payments={payments} />
      
      <div className="container">
        <header className="home-page__header">
          <h1 className="home-page__title">
            Kiedy Wypłata?
          </h1>
          <p className="home-page__description">
            Sprawdź terminy wypłat świadczeń społecznych w Polsce. 
            Aktualne informacje o wypłatach 800+, emerytur ZUS, zasiłków i innych świadczeń.
          </p>
        </header>

        <section className="home-page__categories">
          <h2 className="home-page__section-title">Wybierz kategorię</h2>
          <CategoryGrid categories={PAYMENT_CATEGORIES} />
        </section>

        <section className="home-page__all-payments">
          <h2 className="home-page__section-title">Wszystkie świadczenia</h2>
          <div className="home-page__payments-grid">
            {payments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} linkToDetail={true} />
            ))}
          </div>
        </section>

        <section className="home-page__info">
          <div className="info-box">
            <h3 className="info-box__title">ℹ️ Ważne informacje</h3>
            <ul className="info-box__list">
              <li>Terminy wypłat mogą się różnić w zależności od banku</li>
              <li>W dni wolne od pracy wypłaty mogą być realizowane wcześniej</li>
              <li>Zawsze sprawdzaj aktualne informacje na stronach urzędowych</li>
              <li>Dane aktualizowane na bieżąco na podstawie oficjalnych źródeł</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
