'use client';

import { useState } from 'react';
import { Package, ChevronUp } from 'lucide-react';
import ProductCard from './ProductCard';

/**
 * Public Profile Products & Services Section
 * Collapses products behind a "View Products (N)" button by default.
 * Expands to show category filters and product cards when clicked.
 */
export default function ProductList({
  products = [],
  font,
  preview = false,
  contrastMode = 'light',
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const isDark = contrastMode === 'dark';
  const customFontStyle = font ? { fontFamily: font } : {};

  const visibleProducts = (products || []).filter((p) => p.is_active !== false);

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
      {/* Section Header (Always visible) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
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

        {/* Small collapse link in header when expanded */}
        {expanded && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className={`text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              isDark
                ? 'text-purple-300 hover:text-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ChevronUp size={13} /> Hide
          </button>
        )}
      </div>

      {/* Collapsed State: Single 'View Products' Button */}
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={`w-full min-h-[48px] px-4 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-150 cursor-pointer select-none active:scale-[0.99] ${
            isDark
              ? 'bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow-soft hover:shadow-md'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-soft hover:shadow-md hover:border-slate-300'
          }`}
        >
          <Package
            size={16}
            className={isDark ? 'text-purple-400' : 'text-indigo-600'}
          />
          <span>View Products ({visibleProducts.length})</span>
        </button>
      ) : (
        /* Expanded State: Category Tabs + Products Grid + Collapse Footer */
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
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

          {/* Bottom Collapse Button */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className={`text-xs font-semibold inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-full transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <ChevronUp size={14} /> Hide Products
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
