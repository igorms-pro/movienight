import "./globals.css";
import type { ReactNode } from "react";
import { Suspense } from "react";
import Script from "next/script";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MovieNight",
  description: "Browse and discover movies",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/home-bg.png" />
        <Script
          id="theme-sync"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem("theme");
                  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
                  const theme = stored === "light" || (!stored && prefersLight) ? "light" : "dark";
                  document.documentElement.setAttribute("data-theme", theme);
                } catch (e) {
                  document.documentElement.setAttribute("data-theme", "dark");
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <div className="app-bg" />
        <div className="app-hero" />
        <Providers>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main className="min-h-screen flex flex-col items-center pt-12 data-[page=credits]:pt-1">
            <div className="w-full max-w-[1180px] px-3 md:px-0">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
