'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/links?tab=products');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Redirecting to Products & Store...</p>
      </div>
    </div>
  );
}
