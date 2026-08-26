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
    accent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    iconBg: 'bg-indigo-100',
  },
  {
    icon: Palette,
    title: 'Custom Theme Editor',
    description:
      'Choose from curated presets or design your own with custom background gradients, button styles, and font pairings that match your brand.',
    accent: 'bg-violet-50 text-violet-700 border-violet-100',
    iconBg: 'bg-violet-100',
  },
  {
    icon: CreditCard,
    title: 'Digital Business Card & QR',
    description:
      'Generate a scannable QR code and downloadable digital vCard for in-person networking — bridging your offline presence with your LinkNest page.',
    accent: 'bg-sky-50 text-sky-700 border-sky-100',
    iconBg: 'bg-sky-100',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Understand your audience with real-time charts: total views, unique visitors, device breakdown, and per-link click-through rates.',
    accent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    iconBg: 'bg-emerald-100',
  },
];

export default function ProductSection() {
  return (
    <section
      id="product"
      className="py-24 border-t border-stone-200/80 bg-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200/80 text-xs font-medium text-stone-600">
            Everything you need
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
            Built for how creators actually work
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Four powerful tools — one dashboard. Manage links, personalise your
            page, share a scannable card, and track every click.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, description, iconBg }) => (
            <div
              key={title}
              className="group p-7 rounded-3xl bg-stone-50 border border-stone-200/70 space-y-4
                         hover:border-stone-400 hover:shadow-card-hover hover:-translate-y-0.5
                         transition-all duration-200"
            >
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs border border-stone-200 bg-white`}
              >
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className="text-stone-800"
                />
              </div>

              {/* Text */}
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                {title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
