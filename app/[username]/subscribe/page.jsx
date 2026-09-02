import { redirect } from 'next/navigation';

export default async function SubscribePage({ params }) {
  const { username: rawUsername } = await params;
  const username = rawUsername?.toLowerCase() || '';
  redirect(`/${username}`);
}
