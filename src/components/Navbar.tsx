"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#over", label: "Over" },
    { href: "#gallerij", label: "Gallerij" },
    { href: "#details", label: "Het huis" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ocean-900/95 backdrop-blur-md shadow-lg shadow-ocean-900/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="text-2xl font-heading font-bold tracking-tight">
          <span className="text-ocean-300">Vila</span>{" "}
          <span className="text-coral-400">Deleite</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ocean-200 hover:text-white transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral-400 transition-all group-hover:w-full" />
            </a>
          ))}
          <a
            href="#contact"
            className="bg-coral-500 hover:bg-coral-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-coral-500/30"
          >
            Boek nu
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-ocean-900/98 backdrop-blur-lg border-t border-ocean-700/50 px-6 pb-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-ocean-200 hover:text-white font-medium border-b border-ocean-800/50"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="block mt-4 bg-coral-500 text-white text-center px-5 py-3 rounded-full font-semibold"
          >
            Boek nu
          </a>
        </div>
      )}
    </nav>
  );
}
