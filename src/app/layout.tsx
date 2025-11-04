import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    <html lang="en">
      <body className={inter.variable}>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  );
}
