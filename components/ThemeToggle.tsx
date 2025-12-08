"use client";

import { useEffect, useState } from "react";

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
      className="w-11 h-11 rounded-full flex items-center justify-center border transition-colors"
      style={{
        backgroundColor: "var(--surface-strong)",
        borderColor: "var(--border-strong)",
        color: "var(--text-primary)",
      }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
