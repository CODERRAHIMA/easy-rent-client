import Link from "next/link";
import { ArrowLeft, RotateCcw, X } from "lucide-react";

export default function BookingCancelPage() {
  return (
    <section className="flex w-full flex-1 items-center bg-[#F4F4F2] px-5 py-12 text-[#1B1F16] sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-[#1B1F16]/10 border-t-4 border-t-[#1B1F16] bg-white px-6 pt-10 pb-14 text-center shadow-[0_16px_50px_rgba(27,31,22,0.08)] sm:px-12 sm:pt-14 sm:pb-16">
        <span className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-[#F4F4F2] text-[#1B1F16]/70">
          <X className="size-9" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-[#1B1F16]/60">
          Checkout cancelled
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Payment wasn&apos;t completed
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#1B1F16]/65 sm:text-base">
          Your checkout was cancelled before payment was completed. You
          haven&apos;t been charged. Browse equipment and try again whenever
          you&apos;re ready.
        </p>
        <div className="mx-auto mt-8 h-px w-full max-w-md bg-[#1B1F16]/10" />
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/all-equipment"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#7CB518] px-7 py-3 text-sm font-bold text-[#1B1F16] transition hover:bg-[#6aa00f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Try booking again
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#1B1F16]/15 bg-white px-7 py-3 text-sm font-bold transition hover:border-[#7CB518] hover:bg-[#F4F4F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
