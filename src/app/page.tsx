import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import NextPaymentBanner from '@/components/next-payment-banner/next-payment-banner';
import FAQ from '@/components/faq/faq';
import { Payment, PAYMENT_CATEGORIES } from '@/types/payment';
import { FAQ_ITEMS } from '@/data/faq';
import paymentsData from '../../data/payments.json';
import './page.scss';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Lazy load components that appear below the fold
const PaymentsExplorer = dynamic(() => import('@/components/payments-explorer/payments-explorer'), {
  loading: () => <div style={{height: '200px', background: '#f8f9fa', borderRadius: '8px', animation: 'pulse 1.5s ease-in-out infinite'}} />,
});

const CategoryGrid = dynamic(() => import('@/components/category-grid/category-grid'), {
  loading: () => <div style={{height: '300px', background: '#f8f9fa', borderRadius: '8px', animation: 'pulse 1.5s ease-in-out infinite'}} />,
});

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
          <PaymentsExplorer payments={payments} />
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

        <FAQ items={FAQ_ITEMS} title="Często Zadawane Pytania" />
      </div>
    </div>
  );
}
