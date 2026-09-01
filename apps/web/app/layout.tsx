import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: {
    template: '%s | SkillSync',
    default: 'SkillSync — Skills to Opportunity Intelligence Platform',
  },
  description:
    'An AI-powered academia–industry platform that maps skills, closes gaps, and connects talent with real-world opportunities.',
  keywords: [
    'skill intelligence',
    'placement',
    'internship',
    'career guidance',
    'academia industry',
    'skill gap',
    'AI career',
  ],
  authors: [{ name: 'SkillSync Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'SkillSync',
    title: 'SkillSync — Skills to Opportunity Intelligence Platform',
    description:
      'AI-powered platform connecting students, industry, and academia through skill intelligence.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-[var(--surface-bg)] text-[var(--text-primary)]">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            expand={false}
            richColors
            closeButton
            toastOptions={{
              style: {
                background: 'var(--surface-paper)',
                border: '1px solid var(--border-warm)',
                color: 'var(--text-primary)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
