import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/guides", label: "Guides" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/20 bg-[#212737]/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 md:px-10">
        <Link
          className="flex items-center gap-3 text-base font-semibold tracking-tight md:text-lg home-link"
          href="/"
        >
          <Image
            alt="TFT1Trick monogram"
            height={28}
            priority
            src="/tft1trick-monogram.png"
            width={48}
          />
          <span className="tracking-widest font-extrabold">TFT1Trick</span>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-6 text-sm text-zinc-300">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="transition-colors hover:underline hover:decoration-amber-300 hover:underline-offset-4"
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
