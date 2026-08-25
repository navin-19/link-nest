'use client';

import Image from 'next/image';
import { User } from 'lucide-react';

/**
 * Avatar component that renders a user's avatar image or a fallback icon.
 */
export default function Avatar({ src, alt, size = 80, className = '' }) {
  const sizeClass = {
    40:  'w-10 h-10',
    48:  'w-12 h-12',
    56:  'w-14 h-14',
    64:  'w-16 h-16',
    80:  'w-20 h-20',
    96:  'w-24 h-24',
    112: 'w-28 h-28',
    128: 'w-32 h-32',
  }[size] ?? `w-${Math.round(size / 4)} h-${Math.round(size / 4)}`;

  return (
    <div
      className={[
        sizeClass,
        'rounded-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900',
        'flex items-center justify-center shrink-0 border border-slate-200/80 shadow-xs',
        className,
      ].join(' ')}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || 'Avatar'}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          priority
        />
      ) : (
        <User size={size * 0.45} className="text-white/80" />
      )}
    </div>
  );
}
