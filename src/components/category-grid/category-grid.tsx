'use client';

import Link from 'next/link';
import { PaymentCategory } from '@/types/payment';
import CategoryIcon from '@/components/category-icon/category-icon';
import './category-grid.scss';

interface CategoryGridProps {
  categories: PaymentCategory[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="category-grid">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/${category.id}`}
          className="category-card"
        >
          <div className="category-card__icon">
            <CategoryIcon icon={category.icon} imageClassName="category-card__icon-image" />
          </div>
          <div className="category-card__content">
            <h3 className="category-card__title">{category.name}</h3>
            <p className="category-card__description">{category.description}</p>
          </div>
          <div className="category-card__arrow">→</div>
        </Link>
      ))}
    </div>
  );
}