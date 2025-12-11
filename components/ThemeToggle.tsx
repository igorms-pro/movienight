"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Basculer le thème"
      className="w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer"
      style={{
        backgroundColor: "transparent",
        border: "none",
        color: "var(--text-primary)",
      }}
    >
      {theme === "dark" ? <Sun size={26} /> : <Moon size={26} />}
    </button>
  );
}
