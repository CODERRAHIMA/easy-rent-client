"use client";

import { memo, useEffect, useState } from "react";
import { CalendarDays, CalendarX2, Wrench } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type PaymentStatus = "paid" | "pending" | "failed";
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

type OwnerRental = {
  _id: string;
  customer: { name: string; email: string; phone?: string; photo?: string };
  equipment: { name: string; category?: string; image?: string };
  startDate: string;
  endDate: string;
  requiredQuantity: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
};

const CURRENCY = "৳";
const API_URL = "http://localhost:5000/bookings";
const MS_PER_DAY = 86_400_000;

type BadgeStyle = { label: string; badge: string; dot: string };

const paymentStyle: Record<PaymentStatus, BadgeStyle> = {
  paid: { label: "Paid", badge: "bg-[#EEF4E0] text-[#3F6212]", dot: "bg-[#7CB518]" },
  pending: { label: "Pending", badge: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  failed: { label: "Failed", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const bookingStyle: Record<BookingStatus, BadgeStyle> = {
  pending: { label: "Pending", badge: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  confirmed: { label: "Confirmed", badge: "bg-sky-100 text-sky-800", dot: "bg-sky-500" },
  completed: { label: "Completed", badge: "bg-[#EEF4E0] text-[#3F6212]", dot: "bg-[#7CB518]" },
  cancelled: { label: "Cancelled", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const tabs: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

/* ---------- helpers ---------- */

type ApiResult = { data?: unknown; message?: string };

/** fetch + parse JSON + throw the API message (or the fallback) when the response is not ok */
async function requestJson(url: string, init: RequestInit, fallbackMessage: string): Promise<ApiResult> {
  const response = await fetch(url, init);
  const result: ApiResult = await response.json();
  if (!response.ok) throw new Error(result.message || fallbackMessage);
  return result;
}

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const getDays = (start: string, end: string) =>
  Math.max(1, Math.round((+new Date(end) - +new Date(start)) / MS_PER_DAY) + 1);

/* ---------- small components ---------- */

function Badge({ label, badge, dot }: BadgeStyle) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

const RentalRow = memo(function RentalRow({ rental }: { rental: OwnerRental }) {
  const { customer, equipment } = rental;
  const days = getDays(rental.startDate, rental.endDate);

  return (
    <tr className="border-b border-[#1B1F16]/5 transition last:border-0 hover:bg-[#F4F4F2]/60">
      {/* Customer information */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {customer.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={customer.photo} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1B1F16] text-sm font-bold text-[#F4F4F2]">
              {customer.name?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-bold">{customer.name}</p>
            <p className="truncate text-xs text-[#1B1F16]/60">{customer.email}</p>
            {customer.phone && <p className="truncate text-xs text-[#1B1F16]/60">{customer.phone}</p>}
          </div>
        </div>
      </td>

      {/* Equipment information */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#EEF4E0]">
            {equipment.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={equipment.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#3F6212]/50">
                <Wrench className="h-5 w-5" aria-hidden />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold">{equipment.name}</p>
            {equipment.category && <p className="truncate text-xs text-[#1B1F16]/60">{equipment.category}</p>}
          </div>
        </div>
      </td>

      {/* Rental duration */}
      <td className="whitespace-nowrap px-5 py-4">
        <p className="flex items-center gap-1.5 text-[#1B1F16]/80">
          <CalendarDays className="h-4 w-4 shrink-0 text-[#3F6212]" aria-hidden />
          {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
        </p>
        <p className="mt-1 pl-[22px] text-xs text-[#1B1F16]/60">
          {days} {days === 1 ? "day" : "days"}
        </p>
      </td>

      <td className="px-5 py-4 font-semibold">{rental.requiredQuantity}</td>

      <td className="whitespace-nowrap px-5 py-4 font-bold">
        {CURRENCY}
        {rental.totalAmount.toLocaleString()}
      </td>

      <td className="px-5 py-4">
        <Badge {...paymentStyle[rental.paymentStatus]} />
      </td>

      <td className="px-5 py-4">
        <Badge {...bookingStyle[rental.bookingStatus]} />
      </td>
    </tr>
  );
});

function TableSkeleton() {
  return (
    <ul className="space-y-3 p-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="h-16 animate-pulse rounded-2xl bg-[#1B1F16]/5" />
      ))}
    </ul>
  );
}

function EmptyState({ hasRentals }: { hasRentals: boolean }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4E0] text-[#3F6212]">
        <CalendarX2 className="h-7 w-7" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-extrabold">
        {hasRentals ? "No rentals in this status" : "No rentals yet"}
      </h2>
      <p className="mt-1 max-w-sm text-sm text-[#1B1F16]/60">
        {hasRentals
          ? "Try another status filter."
          : "When customers book your equipment, their rentals will show up here."}
      </p>
    </div>
  );
}


export default function OwnerMyEquipmentRentalsPage() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [rentals, setRentals] = useState<OwnerRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  // Fetch the rentals of the logged-in owner's equipment once the session is ready
  useEffect(() => {
    if (isPending) return;

    if (!email) {
      setRentals([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchRentals = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await requestJson(
          `${API_URL}/owner-rentals?email=${encodeURIComponent(email)}`,
          { signal: controller.signal },
          "Failed to fetch rentals",
        );

        setRentals(Array.isArray(result.data) ? (result.data as OwnerRental[]) : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Fetch owner rentals error:", err);
        setError(getErrorMessage(err, "Something went wrong"));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchRentals();
    return () => controller.abort();
  }, [email, isPending]);

  const count = (status: BookingStatus) => rentals.filter((r) => r.bookingStatus === status).length;
  const earnings = rentals
    .filter((r) => r.paymentStatus === "paid")
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const stats = [
    { label: "Total rentals", value: rentals.length.toLocaleString() },
    { label: "Active (confirmed)", value: count("confirmed").toLocaleString() },
    { label: "Completed", value: count("completed").toLocaleString() },
    { label: "Total earnings", value: `${CURRENCY}${earnings.toLocaleString()}` },
  ];

  const rows = rentals.filter((r) => filter === "all" || r.bookingStatus === filter);

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">My equipment rentals</h1>
          <p className="mt-2 max-w-xl text-sm text-[#1B1F16]/70">
            See who rented your equipment, for how long, and the payment and booking status.
          </p>
        </div>

        {/* Stats */}
        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="rounded-2xl border border-[#1B1F16]/10 bg-white p-5">
              <p className="truncate text-3xl font-extrabold leading-none">{s.value}</p>
              <p className="mt-2 text-sm text-[#1B1F16]/60">{s.label}</p>
            </li>
          ))}
        </ul>

        {/* Table card */}
        <section className="mt-6 rounded-3xl border border-[#1B1F16]/10 bg-white">
          {/* Booking status filter */}
          <div className="flex flex-wrap gap-2 border-b border-[#1B1F16]/10 p-4 sm:p-5">
            {tabs.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setFilter(t.value)}
                aria-pressed={filter === t.value}
                className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                  filter === t.value
                    ? "border-[#1B1F16] bg-[#1B1F16] text-[#F4F4F2]"
                    : "border-[#1B1F16]/15 bg-white text-[#1B1F16]/70 hover:border-[#7CB518]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {error && <p className="px-5 py-3 text-sm text-red-600">{error}</p>}

          {loading ? (
            <TableSkeleton />
          ) : rows.length === 0 ? (
            <EmptyState hasRentals={rentals.length > 0} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1B1F16]/10 text-xs uppercase tracking-wider text-[#1B1F16]/50">
                    <th className="px-5 py-4 font-bold">Customer</th>
                    <th className="px-5 py-4 font-bold">Equipment</th>
                    <th className="px-5 py-4 font-bold">Rental duration</th>
                    <th className="px-5 py-4 font-bold">Quantity</th>
                    <th className="px-5 py-4 font-bold">Booking amount</th>
                    <th className="px-5 py-4 font-bold">Payment</th>
                    <th className="px-5 py-4 font-bold">Booking status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((rental) => (
                    <RentalRow key={rental._id} rental={rental} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}