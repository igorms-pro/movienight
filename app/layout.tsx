import "./globals.css";
import type { ReactNode } from "react";
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
    <html lang="fr" className={inter.className}>
      <body>
        <div className="app-bg" />
        <div className="app-hero" />
        <Providers>
          <Header />
          <main className="min-h-screen flex flex-col items-center pt-12 sm:pt-[120px]">
            <div className="w-full max-w-[1180px] px-3 md:px-0">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
