"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand mark + Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-semibold tracking-tight transition-opacity hover:opacity-85"
        >
          {/* Mini 3x3 dot matrix tile */}
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-surface">
            <span className="grid grid-cols-2 gap-1">
              <span className="h-1 w-1 rounded-full bg-muted/40" />
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span className="h-1 w-1 rounded-full bg-muted/40" />
              <span className="h-1 w-1 rounded-full bg-muted/40" />
            </span>
          </span>
          <span className="font-doto text-base tracking-wider text-foreground">
            PYLEARNER
          </span>
        </Link>

        {/* Navigation links */}
        <ul className="flex items-center gap-6 text-sm">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-1.5 py-1 text-xs tracking-wide transition-colors ${
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <span className="h-1 w-1 rounded-full bg-accent" />
                  )}
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
