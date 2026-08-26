import Avatar from './Avatar';
import { User } from 'lucide-react';

/**
 * ProfileHeader renders the user's avatar according to the selected avatar_layout:
 *   - 'classic': Centered circular avatar with clean border
 *   - 'hero': Larger circular avatar with vibrant gradient glow & colored aura bleeding behind
 *   - 'banner': Wide banner backdrop color band directly framing the overlapping circular avatar
 *   - 'cutout': Frameless transparent cutout style where the subject floats without a contained box/circle
 *   - 'shape': Distinct organic geometric blob shape
 *
 * NOTE: The Profile Title font is kept fixed & clean, independent of link card fonts.
 */
export default function ProfileHeader({ profile, compact = false }) {
  if (!profile) return null;

  const layout = profile.avatar_layout || 'classic';
  const avatarUrl = profile.avatar_url;
  const displayName = profile.display_name || profile.username || 'User';
  const username = profile.username;
  const bio = profile.bio;

  // Title styling based on title_style
  const titleStyle = profile.title_style || 'bold';
  let titleClasses = 'font-extrabold text-slate-900 leading-tight';
  if (titleStyle === 'classic') titleClasses = 'font-serif font-bold text-slate-900 leading-tight';
  if (titleStyle === 'soft') titleClasses = 'font-medium tracking-wide text-slate-800 leading-tight';

  const titleAndBio = (
    <>
      <div className="space-y-0.5">
        <h1 className={`${titleClasses} ${compact ? 'text-base' : 'text-xl'}`}>
          {displayName}
        </h1>
        {username && (
          <p className={`text-slate-500 font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
            @{username}
          </p>
        )}
      </div>

      {bio && (
        <p className={`text-slate-600 leading-relaxed max-w-xs ${compact ? 'text-xs mt-1' : 'text-sm mt-1.5'}`}>
          {bio}
        </p>
      )}
    </>
  );

  // ── Layout: Hero (Larger avatar with gradient ring & colored ambient glow) ──
  if (layout === 'hero') {
    const avatarSize = compact ? 76 : 100;
    return (
      <div className={`flex flex-col items-center text-center ${compact ? 'gap-2.5 py-3' : 'gap-3.5 py-6'}`}>
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
      <div className={`flex flex-col items-center text-center w-full ${compact ? 'pb-3' : 'pb-6'}`}>
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
      <div className={`flex flex-col items-center text-center ${compact ? 'gap-2 py-3' : 'gap-3 py-6'}`}>
        <div className={`relative ${sizeClasses} flex items-center justify-center my-1`}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)] transition-transform hover:scale-105 duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-800 drop-shadow-md">
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
      <div className={`flex flex-col items-center text-center ${compact ? 'gap-2 py-3' : 'gap-3 py-6'}`}>
        <div className="relative inline-flex items-center justify-center my-1">
          {/* Organic blob mask container */}
          <div
            className={`${sizeClasses} overflow-hidden shadow-card border-2 border-slate-900 bg-slate-900 transition-transform hover:rotate-3 duration-300`}
            style={{
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
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
    <div className={`flex flex-col items-center text-center ${compact ? 'gap-2 py-4' : 'gap-3 py-8'}`}>
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
