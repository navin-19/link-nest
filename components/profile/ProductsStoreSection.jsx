'use client';

import { useState } from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import QuickActionPopup from '@/components/profile/QuickActionPopup';
import ProductCard from '@/components/products/ProductCard';
import { buttonStyles } from '@/components/links/buttonStyles';

/**
 * ProductsStoreSection: Dedicated independent section below "FOLLOW US".
 * Heading: Plain centered "PRODUCTS & SERVICES"
 * Button: Theme-aware card row with pastel circular badge, title, active product count, and subtle chevron.
 * Clicking opens a popup/modal overlay with product cards.
 */
export default function ProductsStoreSection({
  products = [],
  profile,
  buttonStyle = 'rounded',
  font,
  preview = false,
  contrastMode = 'dark',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleProducts = (products || []).filter((p) => p.is_active !== false);

  if (profile?.show_products === false || (visibleProducts.length === 0 && !preview)) {
    return null;
  }

  const isDark = contrastMode === 'dark';
  const customFontStyle = font ? { fontFamily: font } : {};

  // Dynamic card design from user's theme selection (buttonStyle), with theme-aware fallback
  const customCardClass = buttonStyle && buttonStyle !== 'rounded' && buttonStyles[buttonStyle] ? buttonStyles[buttonStyle] : null;
  const cardBaseClass = customCardClass || (isDark
    ? 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-white'
    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900 shadow-sm');

  return (
    <section style={customFontStyle} className="w-full flex flex-col space-y-2 pt-1">
      {/* ── Plain Centered Section Heading (No Underline) ────────────────────── */}
      <h3
        className={`text-center text-sm font-bold uppercase tracking-wide my-6 select-none ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        PRODUCTS & SERVICES
      </h3>

      {/* Full-width Entry Card with Pastel Circular Badge + Title + Subtitle & Trailing Chevron */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={customFontStyle}
        className={`group flex items-center justify-between w-full px-4 py-3 sm:px-4.5 sm:py-3.5 min-h-[56px] rounded-2xl border transition-all duration-150 ease-out hover:scale-[1.01] active:scale-[0.99] cursor-pointer select-none ${cardBaseClass}`}
      >
        {/* Left: Pastel circular icon badge + Title & Count subtitle */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
              isDark
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            <ShoppingBag size={18} className="shrink-0" />
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="font-semibold text-sm sm:text-base tracking-tight truncate">
              Products & Services
            </span>
            <span
              className={`text-xs font-medium truncate ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'} available
            </span>
          </div>
        </div>

        {/* Right: Chevron */}
        <ChevronRight
          size={18}
          className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
            isDark ? 'text-white/40' : 'text-slate-400'
          }`}
        />
      </button>

      {/* Products Modal Popup */}
      <QuickActionPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Products & Services"
        subtitle="Explore our digital products and offerings"
        preview={preview}
        contrastMode={contrastMode}
        font={font}
      >
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                preview={preview}
                font={font}
                buttonStyle={buttonStyle}
                contrastMode={contrastMode}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 space-y-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <p className="text-xs font-semibold">No products listed yet</p>
            <p className="text-[11px] opacity-75">Add products in Quick Action → Products & Stores</p>
          </div>
        )}
      </QuickActionPopup>
    </section>
  );
}
