'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { buttonStyles } from '@/components/links/buttonStyles';

/**
 * ProductsStoreSection: Expandable accordion section ("PRODUCTS & SERVICES").
 * Starts COLLAPSED by default on page load.
 * Reflects the selected Card Design across all product cards and headers.
 */
export default function ProductsStoreSection({
  products = [],
  profile,
  isExpanded = false,
  onToggle,
  buttonStyle = 'rounded',
  font,
  preview = false,
  contrastMode = 'dark',
}) {
  const visibleProducts = (products || []).filter((p) => p.is_active !== false);

  if (profile?.show_products === false || visibleProducts.length === 0) {
    return null;
  }

  const customFontStyle = font ? { fontFamily: font } : {};
  const buttonClass = buttonStyles[buttonStyle] ?? buttonStyles.rounded;

  return (
    <section style={customFontStyle} className="w-full flex flex-col space-y-2">
      {/* Collapsed Header Card (Dynamically uses selected Card Design) */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls="products-store-panel"
        style={customFontStyle}
        className={`grid grid-cols-[24px_1fr_24px] items-center w-full min-h-[52px] px-3 sm:px-4 font-bold transition-all duration-200 cursor-pointer select-none text-left active:scale-[0.99] ${buttonClass}`}
      >
        {/* Left spacer for perfect centering */}
        <span className="w-6" aria-hidden="true" />

        {/* Center: Full PRODUCTS & SERVICES Title - Never cut off */}
        <span className="text-center font-bold text-[11px] sm:text-xs md:text-sm uppercase tracking-wider px-1 leading-tight break-words sm:whitespace-nowrap">
          PRODUCTS & SERVICES
        </span>

        {/* Right: Rotating Chevron */}
        <ChevronDown
          size={18}
          className={`justify-self-end opacity-75 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded Accordion Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="products-store-panel"
            role="region"
            aria-label="Products & Services list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden w-full px-0.5"
          >
            <div className={`p-4 sm:p-5 rounded-3xl space-y-4 my-1 ${buttonClass}`}>
              {/* Header intro */}
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  Products & Services
                </h4>
                <p className="text-xs opacity-75">
                  Explore our digital products, courses, and exclusive offerings.
                </p>
              </div>

              {/* Product Cards Grid */}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
