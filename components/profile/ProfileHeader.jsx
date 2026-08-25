import Avatar from './Avatar';

/**
 * ProfileHeader renders the user's avatar, display name, username, and bio.
 * Styled with crisp typography and subtle shadows.
 */
export default function ProfileHeader({ profile, compact = false }) {
  if (!profile) return null;

  const avatarSize = compact ? 64 : 96;

  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'gap-2 py-4' : 'gap-3 py-8'}`}>
      <Avatar
        src={profile.avatar_url}
        alt={profile.display_name || profile.username}
        size={avatarSize}
        className="shadow-card"
      />

      <div className="space-y-0.5">
        <h1
          className={`font-extrabold text-slate-900 leading-tight ${
            compact ? 'text-base' : 'text-xl'
          }`}
        >
          {profile.display_name || profile.username}
        </h1>

        <p className={`text-slate-500 font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
          @{profile.username}
        </p>
      </div>

      {profile.bio && (
        <p
          className={`text-slate-600 leading-relaxed max-w-xs ${
            compact ? 'text-xs' : 'text-sm'
          }`}
        >
          {profile.bio}
        </p>
      )}
    </div>
  );
}
