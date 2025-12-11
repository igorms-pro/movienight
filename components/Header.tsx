"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ${
        isScrolled ? "fixed top-0 left-0 right-0 backdrop-blur-sm shadow-lg" : "relative"
      }`}
      data-testid="header"
      style={{
        backgroundColor: isScrolled ? "var(--header-bg)" : "transparent",
        boxShadow: isScrolled ? "var(--header-shadow)" : "none",
      }}
    >
      <div className="w-full lg:w-[calc(100%/1.5)] lg:max-w-[1320px] mx-auto flex flex-col gap-1 py-2 sm:py-5 px-[12px] lg:px-0 lg:flex-row lg:items-center lg:justify-between">
        <div
          className={`flex w-full items-center justify-between ${
            isScrolled ? "hidden lg:flex" : ""
          }`}
          data-testid="header-brand-row"
        >
          <Link href="/" aria-label="Retour à l'accueil">
            <h1
              className="text-[20px] lg:text-[32px] font-bold uppercase tracking-[2px] m-0"
              style={{ color: "var(--text-primary)" }}
            >
              MOVIENIGHT
            </h1>
          </Link>
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex w-full items-center gap-4 lg:w-auto lg:items-center">
          <div className="hidden lg:flex">
            <ThemeToggle />
          </div>
          <div className="flex-1 lg:w-[520px]" data-testid="header-search">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
