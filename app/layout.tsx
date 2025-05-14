import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'Free Online Word Counter Tool | Accurate & Fast',
  description:
    'Our Word Counter Tool offers live word count, readability stats, SEO keyword density analysis, and more.',
  openGraph: {
    title: 'Free Online Word Counter Tool | Accurate & Fast',
    description:
      'Track word count, readability, and SEO insights for your writing in real time.',
    url: 'https://word-counter-three-amber.vercel.app/',
    siteName: 'Word Counter Tool',
    images: [{ url: 'https://word-counter-three-amber.vercel.app/og-image.jpg' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Word Counter Tool | Accurate & Fast',
    description:
      'Track word count, readability, and SEO insights for your writing in real time.',
    images: ['https://word-counter-three-amber.vercel.app/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </body>
    </html>
  );
}
