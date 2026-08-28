'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import { isValidProductImageUrl } from '@/utils/isAllowedImageUrl';

export default function ProductCard({
  product,
  font,
  preview = false,
  contrastMode = 'light',
}) {
  function handleClick(e) {
    if (preview || !product.url) {
      if (!product.url) e.preventDefault();
      return;
    }
  }

  const customFontStyle = font ? { fontFamily: font } : {};
  const hasUrl = Boolean(product.url && product.url.trim());
  const hasValidImage = isValidProductImageUrl(product.image_url);

  const CardWrapper = hasUrl ? 'a' : 'div';
  const wrapperProps = hasUrl
    ? {
        href: preview ? '#' : `/api/track-product/${product.id}`,
        target: preview ? '_self' : '_blank',
        rel: 'noopener noreferrer',
        onClick: handleClick,
      }
    : {};

  return (
    <CardWrapper
      {...wrapperProps}
      style={customFontStyle}
      className={`group block w-full rounded-3xl overflow-hidden bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-soft hover:shadow-card transition-all duration-200 text-slate-900 dark:text-slate-100 ${
        hasUrl ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''
      }`}
    >
      {/* Product Image Banner */}
      <div className="w-full h-44 sm:h-52 bg-slate-100 dark:bg-slate-800/80 overflow-hidden relative flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
        {hasValidImage ? (
          <Image
            src={product.image_url}
            alt={product.name || 'Product Image'}
            fill
            sizes="(max-width: 640px) 100vw, 580px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500 bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/90">
            <Package size={36} strokeWidth={1.5} />
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Product Image</span>
          </div>
        )}
      </div>

      {/* Product Info (Name, Badges, & Description) */}
      <div className="p-4 sm:p-5 space-y-2 text-left">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.category && (
              <span className="inline-flex items-center text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                {product.category}
              </span>
            )}
            {product.price && (
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded-full">
                {product.price}
              </span>
            )}
          </div>
        </div>

        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
    </CardWrapper>
  );
}
