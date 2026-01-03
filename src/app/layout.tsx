
import type { Metadata } from 'next';
import { Baloo_2, Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const headlineFont = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'One Move Puzzle',
  description: 'Solve a simple puzzle. Discover famous places.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${headlineFont.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
