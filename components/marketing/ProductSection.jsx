import {
  GripVertical,
  Palette,
  BarChart3,
  CreditCard,
} from 'lucide-react';

const FEATURES = [
  {
    icon: GripVertical,
    title: 'Drag-and-Drop Link Manager',
    description:
      'Add, edit, delete, toggle, and reorder your links with a smooth drag-and-drop interface. Changes reflect on your live page instantly.',
    accent: 'text-purple-400',
    iconBg: 'bg-purple-500/15 border-purple-500/30',
  },
  {
    icon: Palette,
    title: 'Custom Theme Editor',
    description:
      'Choose from curated presets or design your own with custom background gradients, button styles, and font pairings that match your brand.',
    accent: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30',
  },
  {
    icon: CreditCard,
    title: 'Digital Business Card & QR',
    description:
      'Generate a scannable QR code and downloadable digital vCard for in-person networking — bridging your offline presence with your LinkNest page.',
    accent: 'text-sky-400',
    iconBg: 'bg-sky-500/15 border-sky-500/30',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Understand your audience with real-time charts: total views, unique visitors, device breakdown, and per-link click-through rates.',
    accent: 'text-amber-400',
    iconBg: 'bg-amber-500/15 border-amber-500/30',
  },
];

export default function ProductSection() {
  return (
    <section
      id="product"
      className="py-24 border-t border-white/10 bg-[#070914]/80 backdrop-blur-md scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium text-teal-400">
            Everything you need
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Built for how creators actually work
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Four powerful tools — one dashboard. Manage links, personalise your
            page, share a scannable card, and track every click.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, description, iconBg, accent }) => (
            <div
              key={title}
              className="group p-7 rounded-3xl bg-[#0d1127]/60 border border-white/10 space-y-4
                         hover:border-white/20 hover:bg-[#111633]/80 hover:shadow-2xl hover:-translate-y-1
                         transition-all duration-200"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${iconBg}`}
              >
                <Icon
                  size={22}
                  strokeWidth={2}
                  className={accent}
                />
              </div>

              {/* Text */}
              <h3 className="text-base font-bold text-white leading-snug">
                {title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
