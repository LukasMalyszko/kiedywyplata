import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/contexts/theme-context";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import "./globals.scss";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap', // Improve font loading performance
  preload: true,
});

export const metadata: Metadata = {
  title: "Kiedy Wypłata - Terminy wypłat świadczeń w Polsce",
  description: "Sprawdź terminy wypłat 800+, emerytur ZUS, zasiłków rodzinnych i innych świadczeń w Polsce. Aktualne daty wypłat na listopad 2025.",
  keywords: "wypłata 800+, emerytura ZUS, zasiłki rodzinne, świadczenia społeczne, terminy wypłat",
  robots: "index, follow",
  openGraph: {
    title: "Kiedy Wypłata - Terminy wypłat świadczeń w Polsce",
    description: "Sprawdź terminy wypłat 800+, emerytur ZUS, zasiłków rodzinnych i innych świadczeń w Polsce.",
    type: "website",
    locale: "pl_PL",
  },
  other: {
    'format-detection': 'telephone=no',
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0070f3',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="canonical" href="https://www.kiedywyplata.pl/" />
      </head>
      <body className={inter.variable} suppressHydrationWarning>
        <ThemeProvider>
          <Header />
          <main className="main">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
