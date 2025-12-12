import "./globals.css";
import type { ReactNode } from "react";
import { Suspense } from "react";
import Script from "next/script";
import { Archivo_Narrow, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import BackgroundLayer from "@/components/BackgroundLayer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-archivo-narrow",
});

export const metadata = {
  title: "MovieNight",
  description: "Browse and discover movies",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${archivoNarrow.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/home-bg.png" type="image/png" />
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
        <BackgroundLayer />
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
