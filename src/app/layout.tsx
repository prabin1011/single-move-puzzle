
import type { Metadata } from 'next';
import { Baloo_2, Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';
import Script from 'next/script';

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
const APP_DEFAULT_TITLE = 'One Move Puzzle - Smart Brain Games for All Ages';
const APP_TITLE_TEMPLATE = '%s - One Move Puzzle';
const APP_DESCRIPTION = 'A collection of calm, educational puzzle games including picture puzzles, math puzzles, pattern puzzles, and more. Can you solve it in one move?';
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
    'one move puzzle',
    'smart puzzle',
    'small puzzle',
    'jigsaw puzzle',
    'picture puzzle',
    'symbol puzzle',
    'math puzzle',
    'word puzzle',
    'pattern puzzle',
    'brain teaser',
    'educational game',
    'calm game',
    'logic puzzle',
    'geography game',
    'landmark quiz',
    'PWA game',
    'offline game',
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
        alt: 'One Move Puzzle Game Collection',
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
      <head>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4763546734673201"
     crossOrigin="anonymous"></script>
      </head>
      <body className={`${bodyFont.variable} ${headlineFont.variable} font-sans antialiased`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
