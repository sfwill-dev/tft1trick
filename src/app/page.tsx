export default function Home() {
  return (
    <section className="space-y-12">
      <header className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
          Phase 1 foundation
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          tft1trick — minimal home for one-trick TFT content.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
          This baseline includes Next.js 16, TypeScript, TailwindCSS, linting, formatting, and
          testing setup. Content pages and comp data flow come next in Phase 2.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-medium">What&apos;s ready now</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-zinc-600 dark:text-zinc-300">
          <li>App Router project scaffold with shared layout shell</li>
          <li>TailwindCSS v4 global styling baseline</li>
          <li>ESLint + Prettier setup for code quality and formatting</li>
          <li>Vitest + React Testing Library baseline for unit testing</li>
        </ul>
      </div>
    </section>
  );
}
