import './globals.css';
import { Inter, Outfit, Roboto } from 'next/font/google';
import { ThemeModeProvider } from '@/components/providers/ThemeModeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata = {
  title: 'LinkNest — One Link for Everything You Share',
  description:
    'Create a stunning, lightning-fast personal link-in-bio page. Track analytics, customize themes, and connect your audience in seconds.',
  keywords: ['link in bio', 'linktree alternative', 'social links', 'bio page', 'linknest'],
  authors: [{ name: 'LinkNest' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${roboto.variable}`}
    >
      <body className={`${inter.className} bg-[#fafaf9] dark:bg-[#0a0b0f] text-slate-900 dark:text-slate-100 min-h-screen antialiased selection:bg-slate-900 selection:text-white transition-colors duration-150`}>
        <ThemeModeProvider>
          {children}
        </ThemeModeProvider>
      </body>
    </html>
  );
}
