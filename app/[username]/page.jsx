import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabaseServer';
import ProfileHeader from '@/components/profile/ProfileHeader';
import SocialIcons from '@/components/profile/SocialIcons';
import LinkList from '@/components/links/LinkList';
import ProductList from '@/components/products/ProductList';
import GoogleReviewsSection from '@/components/products/GoogleReviewsSection';
import SubscribeBar from '@/components/profile/SubscribeBar';
import Link from 'next/link';
import { Link2 } from 'lucide-react';

export const revalidate = 0; // Fresh SSR on every load

export async function generateMetadata({ params }) {
  const { username: rawUsername } = await params;
  const username = rawUsername?.toLowerCase();
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio, avatar_url')
    .eq('username', username)
    .maybeSingle();

  if (!profile) {
    return {
      title: 'Profile Not Found | LinkNest',
    };
  }

  const title = `${profile.display_name || username} (@${username}) | LinkNest`;
  const description = profile.bio || `Check out ${profile.display_name || username}'s links on LinkNest.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function PublicProfilePage({ params }) {
  const { username: rawUsername } = await params;
  const username = rawUsername?.toLowerCase();
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, themes!profiles_theme_id_fkey(*)')
    .eq('username', username)
    .maybeSingle();

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-card mb-4">
          <Link2 size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-slate-900">Profile not found</h1>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          The username <span className="font-semibold text-slate-900 font-mono">@{username}</span> hasn&apos;t been claimed yet.
        </p>
        <Link
          href={`/signup?username=${encodeURIComponent(username)}`}
          className="px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold shadow-btn hover:shadow-btn-hover transition-all"
        >
          Claim @{username} on LinkNest
        </Link>
      </div>
    );
  }

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('position', { ascending: true });

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('position', { ascending: true });

  const theme = profile.themes;
  const bg = theme?.background;
  let bgStyle = { backgroundColor: '#ffffff' };

  if (bg?.type === 'solid') {
    bgStyle = { backgroundColor: bg.value };
  } else if (bg?.type === 'gradient') {
    bgStyle = { background: bg.value };
  } else if (bg?.type === 'image') {
    bgStyle = {
      backgroundImage: `url(${bg.value})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    };
  }

  const font = theme?.font || 'Inter';
  const buttonStyle = theme?.button_style || 'rounded';

  return (
    <main
      style={bgStyle}
      className="min-h-screen text-slate-900 flex flex-col justify-between py-12 px-4 selection:bg-slate-900 selection:text-white"
    >
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Logo and Subscribe Controls */}
        <SubscribeBar username={username} />

        {/* Profile Avatar, Display Name & Bio */}
        <ProfileHeader profile={profile} />

        {/* Social platform quick links */}
        <SocialIcons links={links || []} />

        {/* Dynamic Link List with Theme Font */}
        <LinkList
          links={links || []}
          buttonStyle={buttonStyle}
          font={font}
          username={username}
        />

        {/* Products & Services Showcase */}
        {products && products.length > 0 && (
          <ProductList
            products={products}
            buttonStyle={buttonStyle}
            font={font}
          />
        )}

        {/* Google Business Reviews */}
        {profile.show_google_reviews && profile.google_place_id && (
          <GoogleReviewsSection
            placeId={profile.google_place_id}
            font={font}
          />
        )}
      </div>

      {/* Subtle LinkNest Brand Footer */}
      <footer className="w-full text-center pt-12 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200/90 text-xs text-slate-600 hover:text-slate-950 transition-all shadow-xs hover:shadow-soft"
        >
          <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold">
            L
          </div>
          <span>Create your own <strong className="text-slate-900 font-semibold">LinkNest</strong></span>
        </Link>
      </footer>
    </main>
  );
}
