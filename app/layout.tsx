import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: "Free Word Counter Tool | SEO & Reading Time Calculator",
  description: "Instantly count words, characters (with/without spaces), and estimate reading time. Free, fast, mobile-friendly & AdSense ready.",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </body>
    </html>
  );
}
