'use client';

import ProductCard from './ProductCard';
import { Package } from 'lucide-react';

export default function ProductList({
  products = [],
  buttonStyle = 'rounded',
  font,
  preview = false,
}) {
  const activeProducts = products.filter((p) => p.is_active);

  if (activeProducts.length === 0) return null;

  return (
    <section className="w-full space-y-3 pt-2">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1">
        <Package size={15} className="text-slate-500" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Products & Services
        </h2>
      </div>

      {/* Product Cards Stack */}
      <div className="space-y-3">
        {activeProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            buttonStyle={buttonStyle}
            font={font}
            preview={preview}
          />
        ))}
      </div>
    </section>
  );
}
