'use client';

import { useMemo, useState } from 'react';
import { Payment } from '@/types/payment';
import PaymentCard from '@/components/payment-card/payment-card';

import './payments-explorer.scss';

interface PaymentsExplorerProps {
  payments: Payment[];
}

const FAVORITES_STORAGE_KEY = 'kw.favorite.benefits';

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function PaymentsExplorer({ payments }: PaymentsExplorerProps) {
  const [query, setQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed.filter((id) => typeof id === 'string'));
      }
    } catch {
      // Ignore invalid local storage payload and keep defaults.
    }
    return new Set();
  });

  const saveFavorites = (nextFavorites: Set<string>) => {
    setFavoriteIds(nextFavorites);
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(nextFavorites)));
  };

  const toggleFavorite = (paymentId: string) => {
    const next = new Set(favoriteIds);
    if (next.has(paymentId)) next.delete(paymentId);
    else next.add(paymentId);
    saveFavorites(next);
  };

  const indexedPayments = useMemo(() => {
    return payments.map((payment) => {
      const searchBlob = [payment.name, payment.description, payment.schedule, payment.category].join(' ');
      return {
        payment,
        searchIndex: normalizeText(searchBlob),
      };
    });
  }, [payments]);

  const normalizedQuery = normalizeText(query);

  const filteredPayments = useMemo(() => {
    if (!normalizedQuery) return payments;
    return indexedPayments
      .filter((item) => item.searchIndex.includes(normalizedQuery))
      .map((item) => item.payment);
  }, [payments, indexedPayments, normalizedQuery]);

  const suggestionItems = useMemo(() => {
    if (!normalizedQuery) return [];

    return payments
      .filter((payment) => normalizeText(payment.name).includes(normalizedQuery))
      .slice(0, 6)
      .map((payment) => payment.name);
  }, [normalizedQuery, payments]);

  const favoritePayments = useMemo(() => {
    return payments.filter((payment) => favoriteIds.has(payment.id));
  }, [payments, favoriteIds]);

  return (
    <section className="payments-explorer" aria-label="Wyszukiwarka świadczeń">
      <div className="payments-explorer__controls">
        <label htmlFor="payments-search" className="payments-explorer__label">Szybkie wyszukiwanie</label>
        <div className="payments-explorer__search-row">
          <input
            id="payments-search"
            type="search"
            className="payments-explorer__input"
            placeholder="Np. 800+, emerytura, kwiecień"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="payments-explorer__clear"
              onClick={() => setQuery('')}
              aria-label="Wyczyść wyszukiwanie"
            >
              Wyczyść
            </button>
          )}
        </div>

        {suggestionItems.length > 0 && (
          <div className="payments-explorer__suggestions" aria-label="Podpowiedzi">
            {suggestionItems.map((item) => (
              <button
                key={item}
                type="button"
                className="payments-explorer__suggestion"
                onClick={() => setQuery(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        <p className="payments-explorer__meta">
          Znalezione świadczenia: <strong>{filteredPayments.length}</strong>
        </p>

      </div>

      {favoritePayments.length > 0 && (
        <div className="payments-explorer__favorites">
          <h3 className="home-page__section-title">Twoje obserwowane świadczenia</h3>
          <div className="home-page__payments-grid">
            {favoritePayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                linkToDetail={true}
                isFavorite={favoriteIds.has(payment.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      <h2 className="home-page__section-title">
        {normalizedQuery ? 'Wyniki wyszukiwania' : 'Wszystkie świadczenia'}
      </h2>
      <div className="home-page__payments-grid">
        {filteredPayments.map((payment) => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            linkToDetail={true}
            isFavorite={favoriteIds.has(payment.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}
