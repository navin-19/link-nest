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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Inter:wght@400..700&family=Outfit:wght@400..700&family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Poppins:ital,wght@0,400..700;1,400..700&family=Roboto:ital,wght@0,400..700;1,400..700&family=Sora:wght@400..700&family=Space+Grotesk:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#fafaf9] text-slate-900 min-h-screen antialiased selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
