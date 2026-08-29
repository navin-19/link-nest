import { redirect } from 'next/navigation';

export default function BusinessPageRedirect() {
  redirect('/dashboard/links?tab=business');
}
