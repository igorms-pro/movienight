import { useEffect, useState } from "react";
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
      style={{
        backgroundColor: isScrolled ? "var(--header-bg)" : "transparent",
        boxShadow: isScrolled ? "var(--header-shadow)" : "none",
      }}
    >
      <div className="app-container flex items-center justify-between gap-4 py-5">
        <h1
          className="text-[32px] font-bold uppercase tracking-[2px] m-0"
          style={{ color: "var(--text-primary)" }}
        >
          MOVIENIGHT
        </h1>
        <div className="flex items-center gap-3 w-[436px] max-[1280px]:w-full max-[1280px]:max-w-[436px]">
          <ThemeToggle />
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
