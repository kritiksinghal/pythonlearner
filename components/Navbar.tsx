"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Links shown in the navbar
const links = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Site name / logo */}
        <Link href="/" className="text-lg font-semibold tracking-tight">
          🐍 PyLearner
        </Link>

        {/* Navigation links */}
        <ul className="flex gap-6 text-sm">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors hover:text-accent ${
                    isActive ? "text-accent font-medium" : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
