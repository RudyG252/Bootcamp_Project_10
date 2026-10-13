"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/players", label: "Players" },
  { href: "/matches", label: "Matches" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-blue-400 shadow-md">
      <nav className="max-w-300 m-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex flex-col leading-tight">
            <span className="text-white font-bold text-lg">Cal Poly Badminton</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <ul className="flex items-center gap-1 list-none bg-blue-600/30 rounded-full p-1">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                    isActive(href) ? "bg-white text-blue-600 shadow-sm" : "text-white hover:bg-blue-300/60"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex flex-col justify-center gap-1.5 w-10 h-10 items-center rounded-lg hover:bg-blue-300/60 transition-colors"
        >
          <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`block h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-blue-300 bg-blue-400 px-4 pb-4 pt-2">
          <ul className="flex flex-col gap-1 list-none">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2 rounded-lg font-bold ${
                    isActive(href) ? "bg-white text-blue-600" : "text-white hover:bg-blue-300"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
