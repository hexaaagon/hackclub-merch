import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-[calc(70vh-100px)] min-h-64 flex-col items-center justify-center">
      <p>??? - page unavailable.</p>
      <p>this page is still at development. check back later.</p>
      <Link
        className="font-mono text-sky-700 transition-all hover:underline sm:text-sm dark:text-sky-600"
        href="/"
      >
        [go back?]
      </Link>
    </main>
  );
}
