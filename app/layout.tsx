import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/lib/providers/ReduxProvider";
roviders/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Axiom Trade - Token Discovery",
  description: "Discover and track the latest tokens with real-time price updates",
  other: {
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://assets.coingecko.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.coingecko.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <QueryProvider>
            <TooltipProvider delayDuration={200}>
              {children}
            </TooltipProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
