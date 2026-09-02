import { redirect } from 'next/navigation';

export default function SocialLinksRedirect() {
  redirect('/dashboard/quick-links?tab=social');
}

