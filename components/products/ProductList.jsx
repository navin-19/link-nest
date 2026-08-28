'use client';

import Link from 'next/link';
import { Package, LayoutGrid, ChevronRight } from 'lucide-react';

/**
 * Public Profile Products & Services Section
 * Renders the heading and single full-width 'View Products' button.
 * Clicking navigates directly to the Product Listing page (/dashboard/product).
 */
export default function ProductList({
  font,
  preview = false,
  contrastMode = 'light',
}) {
  const customFontStyle = font ? { fontFamily: font } : {};

  return (
    <section style={customFontStyle} className="w-full space-y-3 pt-3">
      {/* Section Header: ◇ PRODUCTS & SERVICES */}
      <div className="flex items-center gap-2 px-1">
        <Package size={16} className="text-purple-400 shrink-0" strokeWidth={2.2} />
        <h2 className="text-xs font-bold uppercase tracking-wider text-white">
          Products & Services
        </h2>
      </div>

      {/* View Products Button */}
      <Link
        href="/dashboard/links?tab=products"
        className="group w-full min-h-[54px] sm:min-h-[58px] px-5 py-3.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border-2 border-purple-500/85 hover:border-purple-400 shadow-sm hover:shadow-purple-500/15 backdrop-blur-xs flex items-center justify-between transition-all duration-150 ease-out hover:scale-[1.01] active:scale-[0.99] cursor-pointer select-none"
      >
        {/* Left: Purple Grid Icon + Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors shrink-0">
            <LayoutGrid size={18} strokeWidth={2.2} />
          </div>
          <span className="text-sm sm:text-base font-bold text-white tracking-tight">
            View Products
          </span>
        </div>

        {/* Right: Purple Chevron */}
        <ChevronRight
          size={20}
          className="text-purple-400 group-hover:translate-x-0.5 transition-transform shrink-0"
          strokeWidth={2.2}
        />
      </Link>
    </section>
  );
}
