'use client';

import { useState } from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import QuickActionPopup from '@/components/profile/QuickActionPopup';
import ProductCard from '@/components/products/ProductCard';
import Heading from '@/components/ui/Heading';
import { buttonStyles } from '@/components/links/buttonStyles';

/**
 * ProductsStoreSection: Dedicated independent section below "FOLLOW US".
 * Heading: "PRODUCTS & SERVICES" with underline & highlight
 * Button: Full-width card with centered icon + text and subtle chevron indicator.
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

  const customFontStyle = font ? { fontFamily: font } : {};
  const buttonClass = buttonStyles[buttonStyle] ?? buttonStyles.rounded;

  return (
    <section style={customFontStyle} className="w-full flex flex-col space-y-2 pt-1">
      {/* Section Heading with Highlight & Underline */}
      <Heading
        as="h3"
        align="center"
        underline={true}
        className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-0.5 select-none"
      >
        Products & Services
      </Heading>

      {/* Full-width Entry Card with Centered Icon + Text & Subtle Chevron */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={customFontStyle}
        className={`relative w-full min-h-[50px] px-4 flex items-center justify-center gap-2 text-center font-semibold text-xs sm:text-sm uppercase tracking-wide transition-all duration-150 cursor-pointer select-none active:scale-[0.99] ${buttonClass}`}
      >
        <ShoppingBag size={16} className="shrink-0 opacity-80" />
        <span>Products & Services</span>
        <ChevronRight size={15} className="absolute right-4 opacity-50 shrink-0" />
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
          <div className="text-center py-8 space-y-1.5 opacity-75">
            <p className="text-xs font-semibold">No products listed yet</p>
            <p className="text-[11px] opacity-60">Add products in Quick Action → Products & Stores</p>
          </div>
        )}
      </QuickActionPopup>
    </section>
  );
}
