'use client';

import { useState } from 'react';
import './faq.scss';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({ items, title = 'Często Zadawane Pytania' }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq" id="faq">
      <div className="container">
        {title && <h2 className="faq__title">{title}</h2>}
        
        <div className="faq__list">
          {items.map((item) => (
            <div
              key={item.id}
              className={`faq__item ${openId === item.id ? 'faq__item--open' : ''}`}
            >
              <button
                className="faq__button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={openId === item.id}
                aria-controls={`faq-content-${item.id}`}
              >
                <span className="faq__question">{item.question}</span>
                <span className="faq__icon" aria-hidden="true">
                  {openId === item.id ? '−' : '+'}
                </span>
              </button>
              
              {openId === item.id && (
                <div
                  id={`faq-content-${item.id}`}
                  className="faq__content"
                  role="region"
                  aria-labelledby={`faq-button-${item.id}`}
                >
                  <div className="faq__answer">
                    {item.answer.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
