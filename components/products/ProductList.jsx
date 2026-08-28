'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import ProductCard from './ProductCard';

/**
 * Public Profile Products & Services Section
 * Renders products with client-side category filtering when multi-category.
 */
export default function ProductList({
  products = [],
  font,
  preview = false,
  contrastMode = 'light',
}) {
  const isDark = contrastMode === 'dark';
  const customFontStyle = font ? { fontFamily: font } : {};

  const visibleProducts = (products || []).filter((p) => p.is_active !== false);

  const [selectedCategory, setSelectedCategory] = useState('All');

  if (visibleProducts.length === 0) {
    return null;
  }

  // Extract unique valid category names
  const categories = Array.from(
    new Set(visibleProducts.map((p) => p.category?.trim()).filter(Boolean))
  );

  const hasMultipleCategories = categories.length > 1;

  const displayedProducts =
    selectedCategory === 'All'
      ? visibleProducts
      : visibleProducts.filter((p) => p.category?.trim() === selectedCategory);

  return (
    <section style={customFontStyle} className="w-full space-y-3 pt-3">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1">
        <Package
          size={16}
          className={isDark ? 'text-purple-400' : 'text-indigo-600'}
          strokeWidth={2.2}
        />
        <h2
          className={`text-xs font-bold uppercase tracking-wider ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Products & Store
        </h2>
      </div>

      {/* Category Filter Tabs (Rendered ONLY when multiple categories exist) */}
      {hasMultipleCategories && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-0.5">
          {['All', ...categories].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-purple-600 text-white shadow-soft ring-1 ring-purple-400/30'
                      : 'bg-slate-900 text-white shadow-btn'
                    : isDark
                      ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      <div className="space-y-3.5">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            font={font}
            preview={preview}
            contrastMode={contrastMode}
          />
        ))}
      </div>
    </section>
  );
}
