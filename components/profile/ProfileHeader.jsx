import Image from 'next/image';
import Avatar from './Avatar';
import { User } from 'lucide-react';
import { getContrastMode } from '@/utils/getContrastMode';

/**
 * ProfileHeader renders the user's avatar according to the selected avatar_layout:
 *   - 'classic': Centered circular avatar with clean border
 *   - 'hero': Larger circular avatar with vibrant gradient glow & colored aura bleeding behind
 *   - 'banner': Wide banner backdrop color band directly framing the overlapping circular avatar
 *   - 'cutout': Frameless transparent cutout style where the subject floats without a contained box/circle
 *   - 'shape': Distinct organic geometric blob shape
 *
 * Automatically adapts title, username, and bio contrast to the background theme.
 */
export default function ProfileHeader({
  profile,
  compact = false,
  contrastMode,
  theme,
}) {
  if (!profile) return null;

  const layout = profile.avatar_layout || 'classic';
  const avatarUrl = profile.avatar_url;
  const displayName = profile.display_name || profile.username || 'User';
  const username = profile.username;
  const bio = profile.bio;

  // Background and theme detection
  const effectiveTheme = theme || profile?.themes;
  const bg = effectiveTheme?.background;
  const isImageBg =
    bg?.type === 'image' ||
    (typeof bg === 'string' && (bg.startsWith('http') || bg.startsWith('/') || bg.startsWith('data:image')));

  // Determine contrast mode (light background -> dark text; dark background -> light text)
  // For image backgrounds, always default to high-contrast white text with text shadow & scrim
  const effectiveContrastMode =
    contrastMode ||
    getContrastMode(bg);
  const isDark = isImageBg || effectiveContrastMode === 'dark';

  // Title styling based on title_style with tightened tracking for modern aesthetics
  const titleStyle = profile.title_style || 'bold';
  let titleClasses = isDark
    ? 'font-extrabold text-white leading-tight tracking-tight'
    : 'font-extrabold text-slate-900 leading-tight tracking-tight';

  if (titleStyle === 'classic') {
    titleClasses = isDark
      ? 'font-serif font-bold text-white leading-tight'
      : 'font-serif font-bold text-slate-900 leading-tight';
  } else if (titleStyle === 'soft') {
    titleClasses = isDark
      ? 'font-medium text-white/95 leading-tight tracking-tight'
      : 'font-medium text-slate-800 leading-tight tracking-tight';
  }

  const usernameClass = isDark
    ? 'font-bold tracking-tight text-white/90'
    : 'font-bold tracking-tight text-slate-700';

  const bioClass = isDark
    ? 'font-normal text-white/80 leading-relaxed max-w-xs'
    : 'font-normal text-slate-500 leading-relaxed max-w-xs';

  const textShadowStyle = isImageBg
    ? { textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.5)' }
    : undefined;

  const titleAndBioInner = (
    <>
      <div className="space-y-0.5">
        <h1
          style={textShadowStyle}
          className={`${titleClasses} ${compact ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'}`}
        >
          {displayName}
        </h1>
        {username && (
          <p
            style={textShadowStyle}
            className={`${usernameClass} ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}
          >
            @{username}
          </p>
        )}
      </div>

      {bio && (
        <p
          style={textShadowStyle}
          className={`${bioClass} ${compact ? 'text-sm mt-1' : 'text-base mt-1.5'}`}
        >
          {bio}
        </p>
      )}
    </>
  );

  const titleAndBio = isImageBg ? (
    <div className="rounded-3xl bg-black/25 backdrop-blur-md px-5 py-3 inline-block shadow-soft my-1">
      {titleAndBioInner}
    </div>
  ) : (
    titleAndBioInner
  );

  // ── Layout: Hero (Larger avatar with gradient ring & colored ambient glow) ──
  if (layout === 'hero') {
    const avatarSize = compact ? 76 : 100;
    return (
      <div className={`flex flex-col items-center text-center ${compact ? 'gap-2 py-2' : 'gap-2.5 py-4'}`}>
        <div className="relative inline-flex items-center justify-center my-1">
          {/* Soft colored gradient glow aura bleeding behind the circular image */}
          <div className="absolute -inset-3 rounded-full bg-linear-to-tr from-indigo-500/40 via-purple-500/40 to-pink-500/40 blur-xl opacity-90 animate-pulse pointer-events-none" />
          
          {/* Outer gradient border ring */}
          <div className="relative p-1 rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl">
            <Avatar
              src={avatarUrl}
              alt={displayName}
              size={avatarSize}
              className="ring-2 ring-white/90 shadow-md"
            />
          </div>
        </div>

        {titleAndBio}
      </div>
    );
  }

  // ── Layout: Banner (Wide rectangular banner strip framing behind overlapping avatar) ──
  if (layout === 'banner') {
    const avatarSize = compact ? 64 : 84;
    return (
      <div className={`flex flex-col items-center text-center w-full ${compact ? 'pb-2' : 'pb-4'}`}>
        {/* Banner background block */}
        <div className="w-full h-20 sm:h-24 rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 shadow-md relative overflow-hidden flex items-center justify-center border border-slate-800/60">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_70%)]" />
        </div>

        {/* Overlapping circular avatar */}
        <div className="-mt-10 sm:-mt-11 mb-2 z-10">
          <Avatar
            src={avatarUrl}
            alt={displayName}
            size={avatarSize}
            className="shadow-xl ring-4 ring-white"
          />
        </div>

        {titleAndBio}
      </div>
    );
  }

  // ── Layout: Cutout (Transparent floating image silhouette without background/border containment) ──
  if (layout === 'cutout') {
    const sizeClasses = compact ? 'w-18 h-18' : 'w-24 h-24 sm:w-28 sm:h-28';
    return (
      <div className={`flex flex-col items-center text-center ${compact ? 'gap-1.5 py-2' : 'gap-2 py-4'}`}>
        <div className={`relative ${sizeClasses} flex items-center justify-center my-1`}>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={112}
              height={112}
              className="w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)] transition-transform hover:scale-105 duration-200"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center drop-shadow-md ${isDark ? 'text-white/80' : 'text-slate-800'}`}>
              <User size={compact ? 48 : 64} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {titleAndBio}
      </div>
    );
  }

  // ── Layout: Shape (Distinct organic blob shape mask) ─────────────────────
  if (layout === 'shape') {
    const sizeClasses = compact ? 'w-18 h-18' : 'w-24 h-24 sm:w-28 sm:h-28';
    return (
      <div className={`flex flex-col items-center text-center ${compact ? 'gap-1.5 py-2' : 'gap-2 py-4'}`}>
        <div className="relative inline-flex items-center justify-center my-1">
          {/* Organic blob mask container */}
          <div
            className={`${sizeClasses} overflow-hidden shadow-card border-2 border-slate-900 bg-slate-900 transition-transform hover:rotate-3 duration-300`}
            style={{
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            }}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {titleAndBio}
      </div>
    );
  }

  // ── Default / Classic: Centered circular avatar ────────────────────────
  const avatarSize = compact ? 64 : 92;

  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'gap-1.5 py-2' : 'gap-2 py-4'}`}>
      <Avatar
        src={avatarUrl}
        alt={displayName}
        size={avatarSize}
        className="shadow-card ring-2 ring-white/80"
      />

      {titleAndBio}
    </div>
  );
}
