import Link from "next/link";

export default function NotFound() {
  return (
    <section className="space-y-5 py-10 text-center">
      <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">404</p>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Page not found</h1>
      <p className="text-sm text-zinc-300">
        Sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <div>
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-zinc-300 underline decoration-zinc-500 underline-offset-4 transition hover:text-zinc-50 hover:decoration-amber-300"
        >
          Back to home →
        </Link>
      </div>
    </section>
  );
}
