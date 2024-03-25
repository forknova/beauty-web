import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { cn } from '@/lib/utils';
import Header from '@/components/Header/Header';
import '@/global.css';

export const metadata: Metadata = {
  title: 'Afro Hair and Beauty Shop: Premium Black Hair & Beauty Products',
  description:
    'Discover a wide range of premium black hair and beauty products at Afro Hair and Beauty Shop. Natural, organic, and specially curated for you. Shop now!',
  keywords:
    'Afro Hair, Black Beauty, Natural Hair Care, Organic Beauty Products',
  robots: {
    follow: true,
    index: true,
  },
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header className="mb-12" />
        <main
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable,
          )}
        >
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
