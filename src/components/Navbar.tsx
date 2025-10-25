"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
  <nav className="w-full relative flex items-center justify-end px-12 py-6 border-b border-border bg-background sticky top-0 z-50">
    {/* Center: Links */}
    <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-12 text-lg font-light">
      <Link href="#about" className="hover:text-primary transition-colors">
        About
      </Link>
      <Link href="#projects" className="hover:text-primary transition-colors">
        Projects
      </Link>
      <Link href="#blog" className="hover:text-primary transition-colors">
        Blog
      </Link>
      <Link href="#contact" className="hover:text-primary transition-colors">
        Contact
      </Link>
    </div>

    {/* Right: Dark Mode Toggle */}
    <button
      onClick={toggleTheme}
      className="rounded-full border px-4 py-1 text-sm hover:bg-muted transition-colors"
    >
      {mounted && theme === "dark" ? "☀️" : "🌙"}
    </button>
  </nav>
);

}
