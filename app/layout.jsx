import './globals.css';

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
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="bg-[#fafaf9] text-slate-900 min-h-screen antialiased selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
