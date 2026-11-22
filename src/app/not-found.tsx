import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] w-full flex-1 items-center bg-[#F4F4F2] px-5 py-16 text-[#1B1F16] sm:px-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-[#1B1F16]/10 bg-white px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#3F6212]">
          Error 404
        </p>
        <h1 className="mt-3 text-5xl font-extrabold tracking-tight sm:text-7xl">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#1B1F16]/65 sm:text-base">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have moved or the link may be incorrect.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#7CB518] px-6 py-3 text-sm font-bold text-[#1B1F16] transition hover:bg-[#6aa00f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link
            href="/all-equipment"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#1B1F16]/15 bg-white px-6 py-3 text-sm font-bold transition hover:border-[#7CB518] hover:bg-[#F4F4F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
          >
            Browse equipment
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
