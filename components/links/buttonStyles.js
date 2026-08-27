export const buttonStyles = {
  // ── 6 Original Presets ──────────────────────────────────────────────────
  rounded:
    'rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 shadow-soft hover:shadow-card hover:border-slate-300',
  filled:
    'rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-btn hover:shadow-btn-hover border border-slate-900',
  outline:
    'rounded-2xl bg-transparent border-2 border-slate-300 hover:border-slate-900 text-slate-800 hover:bg-slate-50 shadow-xs',
  shadow:
    'rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-card hover:shadow-card-hover text-slate-800',
  glassmorphism:
    'rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/60 text-slate-900 shadow-soft hover:shadow-card',
  hardshadow:
    'rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-slate-900',

  // ── 10 New Presets ───────────────────────────────────────────────────────
  neumorphism:
    'rounded-2xl bg-slate-100 border-0 text-slate-700 shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] transition-shadow',

  liquidglass:
    'rounded-3xl bg-white/20 backdrop-blur-2xl backdrop-saturate-150 border border-white/50 text-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/30',

  neobrutalism:
    'rounded-none bg-yellow-300 border-4 border-black text-black font-black uppercase shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000] transition-all',

  claymorphism:
    'rounded-[28px] bg-linear-to-br from-white to-slate-50 border border-white/60 text-slate-800 shadow-[0_8px_16px_rgba(0,0,0,0.10),inset_0_-4px_8px_rgba(0,0,0,0.06),inset_0_4px_8px_rgba(255,255,255,0.9)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.12),inset_0_-4px_8px_rgba(0,0,0,0.06),inset_0_4px_8px_rgba(255,255,255,0.9)]',

  bentogrid:
    'rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 shadow-soft hover:shadow-card hover:border-slate-300',

  flat:
    'rounded-xl bg-indigo-500 border-0 text-white shadow-none hover:bg-indigo-600',

  neondark:
    'rounded-2xl bg-slate-950 border border-cyan-400/60 text-cyan-300 font-semibold shadow-[0_0_12px_rgba(34,211,238,0.45)] hover:shadow-[0_0_20px_rgba(34,211,238,0.75)] hover:border-cyan-300 transition-all',

  minimal:
    'bg-transparent border-0 border-b border-slate-200 rounded-none text-slate-800 shadow-none px-2 py-3.5 hover:border-slate-900 transition-colors',

  skeuomorphism:
    'rounded-lg bg-linear-to-b from-slate-200 to-slate-400 border border-slate-500 text-slate-900 font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.3)] hover:from-slate-300 hover:to-slate-500',

  maximalism:
    'rounded-3xl bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 border-4 border-black text-white font-black uppercase tracking-tight shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-0.5 transition-all',
};

export const BUTTON_STYLES = [
  { id: 'rounded',       label: 'Soft Rounded',      desc: 'Sleek white card with gentle shadow' },
  { id: 'filled',        label: 'Solid Charcoal',    desc: 'High-contrast bold solid fill' },
  { id: 'outline',       label: 'Minimal Outline',   desc: 'Subtle clean border lines' },
  { id: 'shadow',        label: 'Elevated Floating', desc: 'Deep floating drop shadow' },
  { id: 'glassmorphism', label: 'Glassmorphism',     desc: 'Translucent frosted glass blur' },
  { id: 'hardshadow',    label: 'Hard Shadow',       desc: 'Bold retro pop offset shadow' },
  { id: 'neumorphism',   label: 'Neumorphism',       desc: 'Soft extruded plastic with dual shadows' },
  { id: 'liquidglass',   label: 'Liquid Glass',      desc: 'Refractive frosted glass with dynamic light' },
  { id: 'neobrutalism',  label: 'Neobrutalism',      desc: 'Bold flat color, thick borders, hard offset shadow' },
  { id: 'claymorphism',  label: 'Claymorphism',      desc: 'Puffy 3D clay shapes with soft shadows' },
  { id: 'bentogrid',     label: 'Bento Grid',        desc: 'Compact grid of square cards (changes layout)' },
  { id: 'flat',          label: 'Flat Design',       desc: 'Pure solid color, zero shadows or gradients' },
  { id: 'neondark',      label: 'Neon Dark',         desc: 'Dark background with glowing neon border' },
  { id: 'minimal',       label: 'Minimalism',        desc: 'No card chrome — clean text link with underline' },
  { id: 'skeuomorphism', label: 'Skeuomorphism',     desc: 'Brushed-metal button with realistic depth' },
  { id: 'maximalism',    label: 'Maximalism',        desc: 'Vibrant gradient, heavy type, bold contrast border' },
];

export default buttonStyles;
