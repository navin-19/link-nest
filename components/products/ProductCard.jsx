'use client';

import Image from 'next/image';
import { ExternalLink, ShoppingBag, Package } from 'lucide-react';
import { buttonStyles } from '@/components/links/buttonStyles';

export default function ProductCard({
  product,
  buttonStyle = 'rounded',
  font,
  preview = false,
}) {
  function handleClick(e) {
    if (preview) {
      e.preventDefault();
      return;
    }
  }

  const customFontStyle = font ? { fontFamily: font } : {};
  const buttonClass = buttonStyles[buttonStyle] ?? buttonStyles.rounded;

  return (
    <a
      href={preview ? '#' : `/api/track-product/${product.id}`}
      target={preview ? '_self' : '_blank'}
      rel="noopener noreferrer"
      onClick={handleClick}
      style={customFontStyle}
      className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 p-3.5 sm:p-4 rounded-3xl bg-white/90 hover:bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-slate-900 overflow-hidden"
    >
      {/* Product Image / Thumbnail */}
      <div className="w-full sm:w-20 h-32 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200/60 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs relative">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name || 'Product Image'}
            width={160}
            height={160}
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-50 to-slate-100 text-indigo-500">
            <Package size={28} />
          </div>
        )}
        {product.price && (
          <div className="sm:hidden absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
            {product.price}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          {product.price && (
            <span className="hidden sm:inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
              {product.price}
            </span>
          )}
        </div>

        {product.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      {/* Action Button Pill with matching buttonStyle */}
      <div className="shrink-0 flex items-center justify-end sm:justify-center pt-2 sm:pt-0">
        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold transition-all ${buttonClass}`}>
          <span>View</span>
          <ExternalLink size={12} />
        </span>
      </div>
    </a>
  );
}
