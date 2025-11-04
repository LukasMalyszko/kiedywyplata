import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/contexts/theme-context";
import Header from "@/components/header/header";
import "./globals.scss";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.variable} suppressHydrationWarning>
        <ThemeProvider>
          <Header />
          <main className="main">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
