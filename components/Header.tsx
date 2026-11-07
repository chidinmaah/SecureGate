"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Menu, X } from "lucide-react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#benefits", label: "Why SecureGate" },
  { href: "#testimonials", label: "Customers" },
];

export default function Header({ session }: { session: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-dark">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-[#0fb5ad] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </span>
          <span className="font-bold text-lg text-white tracking-tight">
            SecureGate
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-white/70 hover:text-white px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-white"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-brand-ink/95 backdrop-blur-xl">
          <nav className="px-6 py-4 flex flex-col" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-white/80 hover:text-white transition-colors border-b border-white/5 last:border-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="px-6 pb-6 flex flex-col gap-3">
            {session ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="bg-brand hover:bg-brand-hover text-white text-center text-sm font-semibold px-5 py-3 rounded-full transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="bg-brand hover:bg-brand-hover text-white text-center text-sm font-semibold px-5 py-3 rounded-full transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-center text-sm font-medium text-white/80 hover:text-white px-5 py-3 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
