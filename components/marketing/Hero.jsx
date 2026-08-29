'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Link2,
  Palette,
  BarChart3,
  Zap,
} from 'lucide-react';

const HERO_FEATURES = [
  {
    icon: Link2,
    title: 'Drag-and-Drop Links',
    desc: 'Add, organize, and prioritize your key links with a smooth tactile editor.',
    colorClass: 'text-purple-400',
    bgClass: 'bg-purple-500/15 border-purple-500/30',
  },
  {
    icon: Palette,
    title: 'Custom Themes',
    desc: 'Design your signature aesthetic with custom gradients, card styles, and fonts.',
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/15 border-emerald-500/30',
  },
  {
    icon: BarChart3,
    title: 'Built-in Analytics',
    desc: 'Monitor real-time audience engagement, click-through rates, and top referrers.',
    colorClass: 'text-sky-400',
    bgClass: 'bg-sky-500/15 border-sky-500/30',
  },
  {
    icon: Zap,
    title: 'Instant Sharing & QR',
    desc: 'Generate dynamic vector QR codes and scannable digital cards on the fly.',
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/15 border-amber-500/30',
  },
];

export default function Hero() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  function handleGetStarted(e) {
    if (e) e.preventDefault();
    const clean = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
    if (!clean) {
      router.push('/signup');
      return;
    }
    router.push(`/signup?username=${encodeURIComponent(clean)}`);
  }

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
        {/* Sparkle Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/15 text-xs font-medium text-slate-300 backdrop-blur-md shadow-xs hover:border-white/25 transition-all">
          <Sparkles size={13} className="text-teal-400" />
          <span>The clean, modern link-in-bio platform</span>
        </div>

        {/* 3-Line Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-[76px] font-extrabold tracking-tight leading-[1.05] text-white">
          <span className="block">One link for</span>
          <span className="block bg-gradient-to-r from-blue-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent my-1">
            everything
          </span>
          <span className="block">you are.</span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-slate-400 max-w-[42ch] leading-relaxed">
          Join thousands of creators using LinkNest to share everything you create, curate and sell from one clean, modern bio link.
        </p>

        {/* Rounded Input Bar Component */}
        <form
          onSubmit={handleGetStarted}
          className="w-full max-w-xl p-2 rounded-full bg-[#0d1024]/90 border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center justify-between gap-2 transition-all focus-within:border-teal-400/50 focus-within:ring-2 focus-within:ring-teal-400/20"
        >
          <div className="flex items-center flex-1 pl-4 sm:pl-5 pr-2 py-1.5">
            <span className="text-slate-500 font-mono text-sm sm:text-base select-none">
              linknest.app/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              className="w-full bg-transparent text-white font-medium text-sm sm:text-base focus:outline-none pl-1 placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-full transition-all shadow-md shrink-0 active:scale-[0.98] cursor-pointer"
          >
            <span>Sign up free</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Row of Three Checkmark Items */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>Free forever plan</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>Custom themes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>Built-in analytics</span>
          </div>
        </div>
      </div>

      {/* Feature Cards Row (4 equal-width cards) */}
      <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {HERO_FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group p-6 rounded-3xl bg-[#0d1127]/60 hover:bg-[#111633]/80 border border-white/10 hover:border-white/20 shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-1 text-left flex flex-col justify-between space-y-4"
            >
              {/* Icon Tile */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${item.bgClass}`}
              >
                <Icon size={22} className={item.colorClass} strokeWidth={2.2} />
              </div>

              {/* Card Copy */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
