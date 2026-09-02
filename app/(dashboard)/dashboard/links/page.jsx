'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function LinksRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams ? searchParams.get('tab') : null;

  useEffect(() => {
    if (tabQuery === 'social') {
      router.replace('/dashboard/social-links');
    } else if (tabQuery === 'location' || tabQuery === 'business' || tabQuery === 'reach-us' || tabQuery === 'reachout') {
      router.replace('/dashboard/location-hours');
    } else if (tabQuery === 'customer' || tabQuery === 'form' || tabQuery === 'leads') {
      router.replace('/dashboard/customer-form');
    } else if (tabQuery === 'reviews' || tabQuery === 'review' || tabQuery === 'google-reviews') {
      router.replace('/dashboard/reviews');
    } else if (tabQuery === 'products' || tabQuery === 'product') {
      router.replace('/dashboard/products');
    } else {
      router.replace('/dashboard/quick-links');
    }
  }, [tabQuery, router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Redirecting to Quick Action...</p>
      </div>
    </div>
  );
}

export default function LinksRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LinksRedirectContent />
    </Suspense>
  );
}
