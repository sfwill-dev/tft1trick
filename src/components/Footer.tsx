export function Footer() {
  return (
    <footer className="border-t border-zinc-200/20 py-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 text-xs text-zinc-300 md:px-10">
        <div className="flex flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
          {/* Static export renders this at build time; year updates on next deploy. */}
          <p>© {new Date().getFullYear()} TFT1Trick</p>
          <p className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
            <span>
              Developed by{" "}
              <a
                className="text-zinc-100 underline decoration-zinc-400 underline-offset-2"
                href="https://sfwill.me"
                rel="noopener noreferrer"
                target="_blank"
              >
                sfwill
              </a>
            </span>
            <span aria-hidden="true" className="text-zinc-500">
              ·
            </span>
            <a
              aria-label="View source code and licenses on GitHub"
              className="inline-flex items-center gap-1 text-zinc-100 underline decoration-zinc-400 underline-offset-2"
              href="https://github.com/sfwill-dev/tft1trick"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12A11.5 11.5 0 0 0 8.36 22.93c.58.1.79-.25.79-.56v-2.2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.04 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11.13 11.13 0 0 1 5.78 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              <span>CC BY 4.0 · Code MIT</span>
            </a>
          </p>
        </div>

        <p className="text-center text-[10px] leading-relaxed text-zinc-500">
          TFT1Trick isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions
          of Riot Games or anyone officially involved in producing or managing Riot Games
          properties. Riot Games, and all associated properties are trademarks or registered
          trademarks of Riot Games, Inc.
        </p>
      </div>
    </footer>
  );
}
