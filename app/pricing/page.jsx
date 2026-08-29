import Navbar from '@/components/marketing/Navbar';
import PricingSection from '@/components/marketing/PricingSection';
import Footer from '@/components/marketing/Footer';

export const metadata = {
  title: 'Pricing Plans — LinkNest',
  description: 'Simple, transparent pricing. Start free, upgrade when you are ready.',
};

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-[#05060f] text-slate-100 selection:bg-teal-500 selection:text-white font-sans overflow-x-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[550px] bg-gradient-to-b from-indigo-600/25 via-purple-600/15 to-transparent rounded-full blur-3xl opacity-75" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-8 pb-16">
          <PricingSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
