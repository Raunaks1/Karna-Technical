"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Moon, Sun } from "lucide-react";
import Logo from "./Logo";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Partners", href: "#partners" },
  { name: "Branches", href: "#branches" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Logo className="w-12 h-12" />
          <div className="hidden sm:block">
            <p className="font-heading font-bold text-sm leading-tight text-gray-900 dark:text-white">
              Karna Technical
            </p>
            <p className="font-heading text-xs text-primary font-semibold">
              Fire & Safety Services
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4 border-l border-gray-200 dark:border-gray-700 pl-6">
          <a
            href="tel:+918905214092"
            className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
          >
            <Phone size={16} className="text-primary" />
            +91 8905214092
          </a>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 text-sm font-bold tracking-wider transition-colors rounded-sm uppercase">
            Contact Us
          </button>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex lg:hidden items-center gap-3 z-50">
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="text-gray-900 dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          className={`fixed inset-0 bg-white dark:bg-gray-950 z-40 flex flex-col pt-24 px-6 transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } lg:hidden`}
        >
          <div className="flex flex-col space-y-6 text-lg font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-800 dark:text-gray-200 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
              <a href="tel:+918905214092" className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-200">
                <Phone size={20} className="text-primary" />
                +91 8905214092
              </a>
              <button className="bg-primary text-white py-3 font-bold uppercase rounded-sm w-full text-center">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
