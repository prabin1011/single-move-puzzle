
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

const APP_NAME = 'One Move Puzzle';
const APP_DEFAULT_TITLE = 'One Move Puzzle';
const APP_TITLE_TEMPLATE = '%s - One Move Puzzle';
const APP_DESCRIPTION = 'A calm, educational puzzle game about famous landmarks. Can you solve the puzzle in just one move?';
const APP_URL = 'https://one-move-puzzle.web.app'; // Replace with your production URL

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'puzzle game',
    'landmark quiz',
    'geography game',
    'brain teaser',
    'visual puzzle',
    'one move puzzle',
    'educational game',
    'travel trivia',
    'jigsaw puzzle',
    'calm game',
  ],
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_DEFAULT_TITLE,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    url: APP_URL,
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'One Move Puzzle Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
  },
  manifest: '/manifest.json',
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
