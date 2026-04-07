import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/comps", label: "Comps" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/70 bg-zinc-50/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 md:px-10">
        <Link className="text-sm font-semibold tracking-tight" href="/">
          tft1trick
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
