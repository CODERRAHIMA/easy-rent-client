"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CalendarX2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const CURRENCY = "৳";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// One booking (these are the fields your booking route saves)
type Rental = {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  createdAt: string; // booking date
  totalPrice: number;
  paymentStatus: string; // "unpaid" | "paid" | "failed"
  status: string; // booking status: "pending" | "confirmed" | "completed" | "cancelled"
};

type Result = { email: string; items: Rental[]; failed: boolean };

type BadgeStyle = { label: string; badge: string; dot: string };

const paymentStyle: Record<string, BadgeStyle> = {
  paid: { label: "Paid", badge: "bg-[#EEF4E0] text-[#3F6212]", dot: "bg-[#7CB518]" },
  unpaid: { label: "Unpaid", badge: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  failed: { label: "Failed", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const bookingStyle: Record<string, BadgeStyle> = {
  pending: { label: "Pending", badge: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  confirmed: { label: "Confirmed", badge: "bg-sky-100 text-sky-800", dot: "bg-sky-500" },
  completed: { label: "Completed", badge: "bg-[#EEF4E0] text-[#3F6212]", dot: "bg-[#7CB518]" },
  cancelled: { label: "Cancelled", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const getBadge = (styles: Record<string, BadgeStyle>, value: string): BadgeStyle =>
  styles[value] ?? {
    label: value ? value.charAt(0).toUpperCase() + value.slice(1) : "-",
    badge: "bg-[#1B1F16]/10 text-[#1B1F16]/70",
    dot: "bg-[#1B1F16]/40",
  };

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(+date)
    ? "-"
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

async function getRentals(email: string, signal: AbortSignal): Promise<Rental[]> {
  const token = await getTokenFromClient();
  const response = await fetch(`${API_URL}/bookings/my-rentals?email=${encodeURIComponent(email)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch rentals");
  }

  return result.data;
}

function Badge({ label, badge, dot }: BadgeStyle) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${badge}`}>
      <span className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-3xl border border-[#1B1F16]/10 bg-white">
      <ul className="space-y-3 p-5" aria-label="Loading rentals">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="h-14 animate-pulse rounded-2xl bg-[#1B1F16]/5" />
        ))}
      </ul>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-[#1B1F16]/20 bg-white px-5 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#EEF4E0] text-[#3F6212]">
        <CalendarX2 className="size-7" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-extrabold">No rentals yet</h2>
      <p className="mt-2 max-w-sm text-sm text-[#1B1F16]/60">
        When you book equipment, your rentals will show up here.
      </p>
      <Link
        href="/all-equipment"
        className="mt-5 inline-flex h-11 items-center rounded-xl bg-[#7CB518] px-6 text-sm font-bold text-[#1B1F16] transition hover:bg-[#6aa00f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
      >
        Browse equipment
      </Link>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-3xl border border-red-200 bg-white px-5 py-12 text-center">
      <AlertCircle className="size-10 text-red-500" aria-hidden />
      <p className="mt-3 text-sm font-semibold text-red-700">Could not load your rentals.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#1B1F16] px-5 text-sm font-bold text-white transition hover:bg-[#2d3326]"
      >
        Try again
      </button>
    </div>
  );
}

export default function CustomerMyRentalsPage() {
  const { data: session, isPending } = useSession();
  const email = session?.user?.email;

  const [result, setResult] = useState<Result | null>(null);
  const [reloadKey, setReloadKey] = useState(0); 

  useEffect(() => {
    if (!email) return;

    const controller = new AbortController();

    getRentals(email, controller.signal)
      .then((items) => setResult({ email, items, failed: false }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch rentals:", err);
        setResult({ email, items: [], failed: true });
      });

    return () => controller.abort();
  }, [email, reloadKey]);

  const current = result?.email === email ? result : null;
  const rentals = current?.items ?? [];
  const loading = isPending || (!!email && !current);

  const handleRetry = () => {
    setResult(null);
    setReloadKey((key) => key + 1);
  };

  if (loading) {
    return (
      <section className="space-y-6">
        <TableSkeleton />
      </section>
    );
  }

  if (!email) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Please login first</h2>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1B1F16] sm:text-4xl">My Rentals</h1>
          <p className="mt-2 text-sm text-[#1B1F16]/60">All your equipment bookings and their status.</p>
        </div>

        {rentals.length > 0 && (
          <p className="inline-flex items-center gap-2 self-start rounded-full border border-[#1B1F16]/10 bg-white px-4 py-2 text-sm font-semibold sm:self-auto">
            {rentals.length} {rentals.length === 1 ? "rental" : "rentals"}
          </p>
        )}
      </div>

      {current?.failed ? (
        <ErrorState onRetry={handleRetry} />
      ) : rentals.length === 0 ? (
        <EmptyState />
      ) : (
        /* Rentals table */
        <div className="overflow-x-auto rounded-3xl border border-[#1B1F16]/10 bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#1B1F16]/10 text-xs uppercase tracking-wider text-[#1B1F16]/50">
                <th className="px-5 py-4 font-bold">Equipment</th>
                <th className="px-5 py-4 font-bold">Start date</th>
                <th className="px-5 py-4 font-bold">End date</th>
                <th className="px-5 py-4 font-bold">Booking date</th>
                <th className="px-5 py-4 font-bold">Total amount</th>
                <th className="px-5 py-4 font-bold">Payment</th>
                <th className="px-5 py-4 font-bold">Booking status</th>
              </tr>
            </thead>

            <tbody>
              {rentals.map((rental) => (
                <tr key={rental._id} className="border-b border-[#1B1F16]/5 transition last:border-0 hover:bg-[#F4F4F2]/60">
                  <td className="px-5 py-4">
                    <Link
                      href={`/all-equipment/${rental.equipmentId}`}
                      className="line-clamp-1 font-bold hover:text-[#3F6212] hover:underline"
                    >
                      {rental.equipmentName}
                    </Link>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-[#1B1F16]/80">{formatDate(rental.startDate)}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#1B1F16]/80">{formatDate(rental.endDate)}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#1B1F16]/80">{formatDate(rental.createdAt)}</td>

                  <td className="whitespace-nowrap px-5 py-4 font-bold">
                    {CURRENCY}
                    {rental.totalPrice.toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    <Badge {...getBadge(paymentStyle, rental.paymentStatus)} />
                  </td>

                  <td className="px-5 py-4">
                    <Badge {...getBadge(bookingStyle, rental.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}