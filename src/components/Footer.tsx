export function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-6 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 text-xs text-zinc-500 md:px-10">
        <p>© {new Date().getFullYear()} tft1trick</p>
        <p className="text-right">Built with Next.js 16 + TailwindCSS</p>
      </div>
    </footer>
  );
}
