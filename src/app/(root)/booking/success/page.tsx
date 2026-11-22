import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function BookingSuccessPage() {
  return (
    <section className="flex w-full flex-1 items-center bg-[#F4F4F2] px-5 py-12 text-[#1B1F16] sm:px-8 sm:py-16">
      <div className="relative mx-auto w-full max-w-3xl rounded-3xl border border-[#1B1F16]/10 border-t-4 border-t-[#7CB518] bg-white px-6 pt-10 pb-14 text-center shadow-[0_16px_50px_rgba(27,31,22,0.08)] sm:px-12 sm:pt-14 sm:pb-16">
        <span className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-[#EEF4E0] text-[#3F6212]">
          <Check className="size-9" strokeWidth={3} aria-hidden="true" />
        </span>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-[#3F6212]">
          Payment successful
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Your booking is confirmed
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#1B1F16]/65 sm:text-base">
          Thank you for choosing EasyRent. Your payment was received. You can
          review your booking details and status in your rentals dashboard.
        </p>
        <div className="mx-auto mt-8 h-px w-full max-w-md bg-[#1B1F16]/10" />
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/customer/my-rentals"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#7CB518] px-7 py-3 text-sm font-bold text-[#1B1F16] transition hover:bg-[#6aa00f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
          >
            View my rentals
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/all-equipment"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#1B1F16]/15 bg-white px-7 py-3 text-sm font-bold transition hover:border-[#7CB518] hover:bg-[#F4F4F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
          >
            Continue browsing
          </Link>
        </div>
      </div>
    </section>
  );
}
