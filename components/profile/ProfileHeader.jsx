import Image from 'next/image';
import Avatar from './Avatar';
import { User, Check } from 'lucide-react';
import { getContrastMode } from '@/utils/getContrastMode';

/**
 * VerifiedSeal: Orange seal badge with white checkmark
 */
function VerifiedSeal({ size = 16 }) {
  return (
    <div
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs shrink-0"
      style={{ width: size, height: size }}
      title="Verified Profile"
    >
      <Check size={size * 0.65} strokeWidth={3.5} />
    </div>
  );
}

/**
 * ProfileHeader renders the user's avatar according to the selected avatar_layout:
 *   - 'classic': Centered circular avatar with glowing warm border
 *   - 'hero': Larger circular avatar with vibrant gradient glow & colored aura bleeding behind
 *   - 'banner': Wide banner backdrop color band directly framing the overlapping circular avatar
 *   - 'cutout': Frameless transparent cutout style
 *   - 'shape': Distinct organic geometric blob shape
 */
export default function ProfileHeader({
  profile,
  compact = false,
  contrastMode,
  theme,
  font,
}) {
  if (!profile) return null;

  const effectiveFont = font || theme?.font || profile?.themes?.font;
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
  const effectiveContrastMode = contrastMode || getContrastMode(bg);
  const isDark = isImageBg || effectiveContrastMode === 'dark';

  // Title styling based on title_style
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
    ? 'font-semibold tracking-tight text-white/85'
    : 'font-semibold tracking-tight text-slate-700';

  const bioClass = isDark
    ? 'font-normal text-white/80 leading-relaxed max-w-sm'
    : 'font-normal text-slate-600 leading-relaxed max-w-sm';

  const textColor = effectiveTheme?.text_color;
  const fontStyle = effectiveFont && titleStyle !== 'classic' ? { fontFamily: effectiveFont } : {};
  const textShadowStyle = isImageBg
    ? { textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.5)', ...(textColor ? { color: textColor } : {}), ...fontStyle }
    : { ...(textColor ? { color: textColor } : {}), ...fontStyle };

  // Pure transparent title and bio without heavy container box
  const titleAndBio = (
    <div className="w-full max-w-sm mx-auto space-y-1 mt-1">
      <h1
        style={textShadowStyle}
        className={`${titleClasses} ${compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl font-bold'} tracking-tight`}
      >
        {displayName}
      </h1>

      {username && (
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          <p
            style={textShadowStyle}
            className={`${usernameClass} ${compact ? 'text-xs' : 'text-xs sm:text-sm font-medium opacity-80'}`}
          >
            @{username}
          </p>
          <VerifiedSeal size={compact ? 13 : 15} />
        </div>
      )}

      {bio && (
        <p
          style={textShadowStyle}
          className={`${bioClass} ${compact ? 'text-xs mt-1.5' : 'text-xs sm:text-sm mt-2'} opacity-80 leading-relaxed max-w-xs sm:max-w-sm mx-auto`}
        >
          {bio}
        </p>
      )}
    </div>
  );

  // ── Layout: Hero ───────────────────────────────────────────────────────────
  if (layout === 'hero') {
    const avatarSize = compact ? 76 : 100;
    return (
      <div className={`flex flex-col items-center text-center ${compact ? 'gap-2 py-1' : 'gap-2.5 py-3'}`}>
        <div className="relative inline-flex items-center justify-center my-0.5">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/30 to-yellow-500/20 blur-lg opacity-80 pointer-events-none" />
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 shadow-soft">
            <Avatar
              src={avatarUrl}
              alt={displayName}
              size={avatarSize}
              className="ring-2 ring-white/90 shadow-soft"
            />
          </div>
        </div>
        {titleAndBio}
      </div>
    );
  }

  // ── Layout: Banner ─────────────────────────────────────────────────────────
  if (layout === 'banner') {
    const avatarSize = compact ? 64 : 84;
    return (
      <div className={`flex flex-col items-center text-center w-full ${compact ? 'pb-1' : 'pb-3'}`}>
        <div className="w-full h-20 sm:h-24 rounded-2xl bg-gradient-to-r from-slate-900 via-orange-950/40 to-slate-900 shadow-soft relative overflow-hidden flex items-center justify-center border border-orange-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.25),transparent_70%)]" />
        </div>
        <div className="-mt-10 sm:-mt-11 mb-2 z-10">
          <Avatar
            src={avatarUrl}
            alt={displayName}
            size={avatarSize}
            className="shadow-soft ring-3 ring-orange-500/50"
          />
        </div>
        {titleAndBio}
      </div>
    );
  }

  // ── Layout: Cutout ─────────────────────────────────────────────────────────
  if (layout === 'cutout') {
    const sizeClasses = compact ? 'w-16 h-16' : 'w-20 h-20 sm:w-24 sm:h-24';
    return (
      <div className={`flex flex-col items-center text-center ${compact ? 'gap-1.5 py-1' : 'gap-2 py-3'}`}>
        <div className={`relative ${sizeClasses} flex items-center justify-center my-0.5`}>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={96}
              height={96}
              className="w-full h-full object-contain drop-shadow-md transition-transform hover:scale-105 duration-200"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center drop-shadow-xs ${isDark ? 'text-white/80' : 'text-slate-800'}`}>
              <User size={compact ? 44 : 56} strokeWidth={1.5} />
            </div>
          )}
        </div>
        {titleAndBio}
      </div>
    );
  }

  // ── Layout: Shape ──────────────────────────────────────────────────────────
  if (layout === 'shape') {
    const sizeClasses = compact ? 'w-16 h-16' : 'w-20 h-20 sm:w-24 sm:h-24';
    return (
      <div className={`flex flex-col items-center text-center ${compact ? 'gap-1.5 py-1' : 'gap-2 py-3'}`}>
        <div className="relative inline-flex items-center justify-center my-0.5">
          <div
            className={`${sizeClasses} overflow-hidden shadow-soft border-2 border-orange-500/80 bg-slate-900 transition-transform hover:rotate-3 duration-300`}
            style={{
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            }}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        {titleAndBio}
      </div>
    );
  }

  // ── Default / Classic: Clean circular avatar with soft subtle ring ──────────
  const avatarSize = compact ? 72 : 88;

  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'gap-1.5 py-1' : 'gap-2 py-2.5'}`}>
      <div className="relative inline-flex items-center justify-center">
        <Avatar
          src={avatarUrl}
          alt={displayName}
          size={avatarSize}
          className="relative shadow-soft ring-2 ring-black/10 dark:ring-white/20"
        />
      </div>

      {titleAndBio}
    </div>
  );
}
