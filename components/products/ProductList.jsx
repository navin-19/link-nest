'use client';

import { useState } from 'react';
import { ShoppingBag, ChevronRight, ChevronUp } from 'lucide-react';
import { buttonStyles } from '@/components/links/buttonStyles';
import ProductCard from './ProductCard';

/**
 * Public Profile Products & Services Section
 * Features the "PRODUCTS & STORE" category heading with ShoppingBag icon.
 * Collapsed state displays a unified pill row ("View Our Products", chevron) matching LinkButton style.
 * Expands to show category filters and product cards when clicked.
 */
export default function ProductList({
  products = [],
  buttonStyle = 'rounded',
  font,
  preview = false,
  contrastMode = 'light',
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const isDark = contrastMode === 'dark';
  const customFontStyle = font ? { fontFamily: font } : {};
  const buttonClass = buttonStyles[buttonStyle] ?? buttonStyles.rounded;

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
    <section style={customFontStyle} className="w-full space-y-2.5 pt-2">
      {/* Section Header (Always visible) */}
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-2">
          <ShoppingBag
            size={14}
            className={isDark ? 'text-white/80' : 'text-slate-700'}
            strokeWidth={2.5}
          />
          <h2
            className={`text-xs font-bold uppercase tracking-wide ${
              isDark ? 'text-white/90' : 'text-slate-800'
            }`}
          >
            PRODUCTS & STORE
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

      {/* Collapsed State: Unified Pill Row Entry Point */}
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          style={customFontStyle}
          className={[
            'group flex items-center justify-between gap-3 w-full px-4 py-3 sm:px-5 sm:py-3.5',
            'font-semibold text-sm',
            'transition-all duration-150 ease-out',
            'hover:scale-[1.01] active:scale-[0.98]',
            buttonClass,
            'cursor-pointer select-none',
          ].join(' ')}
        >
          {/* Left: ShoppingBag Icon */}
          <span className="flex items-center justify-center w-6 h-6 shrink-0 transition-transform group-hover:scale-110">
            <ShoppingBag size={22} className="shrink-0 drop-shadow-2xs text-current" />
          </span>

          {/* Center/Left: Label */}
          <span className="flex-1 text-left truncate">View Our Products</span>

          {/* Right: Trailing Chevron */}
          <ChevronRight
            size={18}
            className="shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-current"
          />
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
