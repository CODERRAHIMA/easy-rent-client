"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const CURRENCY = "৳";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/bookings`;
const MS_PER_DAY = 86_400_000;

// One rental (this is what the backend sends)
type Rental = {
  _id: string;
  equipmentName: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  requiredQuantity: number;
  totalAmount: number;
  paymentStatus: string; // "paid" | "pending" | "failed"
  bookingStatus: string; // "pending" | "confirmed" | "completed" | "cancelled"
  customer: { name: string; email: string; phone?: string; photo?: string };
  owner: { name: string; email: string; phone?: string };
};

const bookingStatuses = ["pending", "confirmed", "completed", "cancelled"];

// Colors for the booking status dropdown
const bookingColor: Record<string, string> = {
  pending: "border-amber-300 bg-amber-100 text-amber-800",
  confirmed: "border-sky-300 bg-sky-100 text-sky-800",
  completed: "border-[#7CB518]/40 bg-[#EEF4E0] text-[#3F6212]",
  cancelled: "border-red-300 bg-red-100 text-red-700",
};

// Colors for the payment badge
const paymentStyle: Record<string, { label: string; badge: string; dot: string }> = {
  paid: { label: "Paid", badge: "bg-[#EEF4E0] text-[#3F6212]", dot: "bg-[#7CB518]" },
  pending: { label: "Pending", badge: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  failed: { label: "Failed", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const getDays = (start: string, end: string) =>
  Math.max(1, Math.round((+new Date(end) - +new Date(start)) / MS_PER_DAY) + 1);

export default function AdminAllRentalsPage() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      if (isPending) return;

      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const token = await getTokenFromClient();

        const response = await fetch(`${API_URL}/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch rentals");
        }

        setRentals(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [email, isPending]);

  const handleStatusChange = async (rental: Rental, newStatus: string) => {
    try {
      setError("");
      setUpdatingId(rental._id);

      const token = await getTokenFromClient();

      const response = await fetch(`${API_URL}/${rental._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update status");
      }

      setRentals(rentals.map((r) => (r._id === rental._id ? { ...r, bookingStatus: newStatus } : r)));
      toast.success("Booking status updated.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      setError(message);
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const text = search.trim().toLowerCase();
  const filteredRentals = rentals.filter((rental) => {
    const matchesStatus = statusFilter === "all" || rental.bookingStatus === statusFilter;
    const matchesSearch =
      rental.equipmentName.toLowerCase().includes(text) ||
      rental.customer.name.toLowerCase().includes(text) ||
      rental.customer.email.toLowerCase().includes(text) ||
      rental.owner.name.toLowerCase().includes(text) ||
      rental.owner.email.toLowerCase().includes(text);
    return matchesStatus && matchesSearch;
  });

  const revenue = rentals
    .filter((r) => r.paymentStatus === "paid")
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const stats = [
    { label: "Total rentals", value: rentals.length.toLocaleString() },
    { label: "Confirmed", value: rentals.filter((r) => r.bookingStatus === "confirmed").length.toLocaleString() },
    { label: "Completed", value: rentals.filter((r) => r.bookingStatus === "completed").length.toLocaleString() },
    { label: "Total revenue", value: `${CURRENCY}${revenue.toLocaleString()}` },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">All rentals</h1>
        <p className="mt-2 text-sm text-[#1B1F16]/70">
          Monitor every rental on the platform and update the booking status when needed.
        </p>

        {/* Stat cards */}
        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="rounded-2xl border border-[#1B1F16]/10 bg-white p-5">
              <p className="truncate text-3xl font-extrabold">{s.value}</p>
              <p className="mt-2 text-sm text-[#1B1F16]/60">{s.label}</p>
            </li>
          ))}
        </ul>

        {/* Table card */}
        <section className="mt-6 rounded-3xl border border-[#1B1F16]/10 bg-white">
          {/* Search + filter */}
          <div className="flex flex-col gap-4 border-b border-[#1B1F16]/10 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, owner or equipment"
              className="h-11 rounded-xl border-[#1B1F16]/15 lg:w-96"
            />

            <div className="flex flex-wrap gap-2">
              {["all", ...bookingStatuses].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold capitalize transition ${
                    statusFilter === status
                      ? "border-[#1B1F16] bg-[#1B1F16] text-[#F4F4F2]"
                      : "border-[#1B1F16]/15 bg-white text-[#1B1F16]/70 hover:border-[#7CB518]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && <p className="px-5 py-3 text-sm text-red-600">{error}</p>}

          {/* Loading / empty / table */}
          {loading ? (
            <p className="px-5 py-16 text-center text-[#1B1F16]/60">Loading rentals...</p>
          ) : filteredRentals.length === 0 ? (
            <p className="px-5 py-16 text-center text-[#1B1F16]/60">No rentals found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1B1F16]/10 text-xs uppercase tracking-wider text-[#1B1F16]/50">
                    <th className="px-5 py-4 font-bold">Customer</th>
                    <th className="px-5 py-4 font-bold">Owner</th>
                    <th className="px-5 py-4 font-bold">Equipment</th>
                    <th className="px-5 py-4 font-bold">Rental duration</th>
                    <th className="px-5 py-4 font-bold">Booking amount</th>
                    <th className="px-5 py-4 font-bold">Payment</th>
                    <th className="px-5 py-4 font-bold">Booking status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRentals.map((rental) => {
                    const payment = paymentStyle[rental.paymentStatus] ?? paymentStyle.pending;
                    const days = getDays(rental.startDate, rental.endDate);

                    return (
                      <tr key={rental._id} className="border-b border-[#1B1F16]/5 last:border-0 hover:bg-[#F4F4F2]/60">
                        {/* Customer information */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {rental.customer.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={rental.customer.photo} alt="" className="size-10 shrink-0 rounded-full object-cover" />
                            ) : (
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1B1F16] text-sm font-bold text-[#F4F4F2]">
                                {rental.customer.name?.[0]?.toUpperCase() ?? "?"}
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-bold">{rental.customer.name}</p>
                              <p className="truncate text-xs text-[#1B1F16]/60">{rental.customer.email}</p>
                              {rental.customer.phone && (
                                <p className="truncate text-xs text-[#1B1F16]/60">{rental.customer.phone}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Owner information */}
                        <td className="px-5 py-4">
                          <p className="font-bold">{rental.owner.name}</p>
                          <p className="text-xs text-[#1B1F16]/60">{rental.owner.email}</p>
                          {rental.owner.phone && <p className="text-xs text-[#1B1F16]/60">{rental.owner.phone}</p>}
                        </td>

                        {/* Equipment */}
                        <td className="px-5 py-4">
                          <p className="font-bold">{rental.equipmentName}</p>
                          <p className="text-xs text-[#1B1F16]/60">Quantity: {rental.requiredQuantity}</p>
                        </td>

                        {/* Rental duration */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <p className="flex items-center gap-1.5 text-[#1B1F16]/80">
                            <CalendarDays className="size-4 shrink-0 text-[#3F6212]" />
                            {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                          </p>
                          <p className="mt-1 pl-[22px] text-xs text-[#1B1F16]/60">
                            {days} {days === 1 ? "day" : "days"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-bold">
                          {CURRENCY}
                          {rental.totalAmount.toLocaleString()}
                        </td>

                        {/* Payment status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${payment.badge}`}
                          >
                            <span className={`size-1.5 rounded-full ${payment.dot}`} />
                            {payment.label}
                          </span>
                        </td>

                        {/* Booking status (admin can change it) */}
                        <td className="px-5 py-4">
                          <select
                            value={rental.bookingStatus}
                            disabled={updatingId === rental._id}
                            onChange={(e) => handleStatusChange(rental, e.target.value)}
                            aria-label={`Change booking status of ${rental.equipmentName}`}
                            className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize disabled:opacity-60 ${
                              bookingColor[rental.bookingStatus] ?? "border-[#1B1F16]/15 bg-white"
                            }`}
                          >
                            {bookingStatuses.map((status) => (
                              <option key={status} value={status} className="bg-white text-[#1B1F16]">
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}