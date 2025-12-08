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
          <main className="app-shell">
            <div className="app-container">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
