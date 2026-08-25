'use client';

import ProfileHeader from '@/components/profile/ProfileHeader';
import LinkButton from '@/components/links/LinkButton';
import SocialIcons from '@/components/profile/SocialIcons';
import { Smartphone } from 'lucide-react';

/**
 * Live phone-mockup preview in light theme mode.
 */
export default function LivePreview({ profile, links = [], theme }) {
  const activeLinks = links.filter((l) => l.is_active);

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
    };
  }

  const font = theme?.font || 'Inter';
  const buttonStyle = theme?.button_style || 'rounded';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Header pill */}
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-500">
        <Smartphone size={14} />
        <span>Live Device Preview</span>
      </div>

      {/* Phone Mockup Frame */}
      <div className="relative w-[310px] h-[620px] rounded-[48px] border-[10px] border-slate-900 bg-slate-900 p-2.5 shadow-2xl ring-1 ring-slate-200">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20" />

        {/* Screen Container */}
        <div
          style={{ ...bgStyle, fontFamily: font }}
          className="w-full h-full rounded-[36px] overflow-y-auto overflow-x-hidden p-4 pt-8 flex flex-col justify-between scrollbar-none transition-all duration-300 shadow-inner"
        >
          <div className="space-y-4">
            {/* Profile Header */}
            <ProfileHeader profile={profile} compact />

            {/* Social Icons Bar */}
            <SocialIcons links={links} size={14} />

            {/* Links */}
            <div className="space-y-2.5 pt-2">
              {activeLinks.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-medium">
                  No active links
                </div>
              ) : (
                activeLinks.map((link) => (
                  <LinkButton
                    key={link.id}
                    link={link}
                    buttonStyle={buttonStyle}
                    username={profile?.username}
                    preview={true}
                  />
                ))
              )}
            </div>
          </div>

          {/* Footer Logo */}
          <div className="py-4 text-center">
            <span className="text-[10px] tracking-widest uppercase font-bold text-slate-500 bg-white/70 px-3 py-1 rounded-full border border-slate-200/60 shadow-xs backdrop-blur-xs">
              LinkNest
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
