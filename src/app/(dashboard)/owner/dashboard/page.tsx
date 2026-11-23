"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Package, Wallet } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import StatCard from "@/components/analyticsCards/StatCard";
import MonthlyChart from "@/components/analyticsCards/MonthlyChart";
import { fetchData, groupByMonth } from "@/components/analyticsCards/Helper";

const CURRENCY = "৳";

type Equipment = {
  _id: string;
  status: string; // "pending" | "approved" | "rejected"
};

type Rental = {
  _id: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string; // "paid" | "pending" | "failed"
  bookingStatus: string; // "pending" | "confirmed" | "completed" | "cancelled"
  customer: { name: string };
  equipment: { name: string };
};

// Rows of the "Equipment status" card
const equipmentStatuses = [
  { key: "approved", label: "Approved", bar: "bg-[#7CB518]" },
  { key: "pending", label: "Pending", bar: "bg-amber-400" },
  { key: "rejected", label: "Rejected", bar: "bg-red-400" },
];

// Colors for the booking status badge in "Recent rentals"
const bookingColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-sky-100 text-sky-800",
  completed: "bg-[#EEF4E0] text-[#3F6212]",
  cancelled: "bg-red-100 text-red-700",
};

export default function OwnerOverviewPage() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOverview = async () => {
      if (isPending) return;

      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const [equipmentList, rentalList] = await Promise.all([
          fetchData<Equipment>(`/equipments/my-equipment?email=${encodeURIComponent(email)}`),
          fetchData<Rental>(`/bookings/owner-rentals?email=${encodeURIComponent(email)}`),
        ]);

        setEquipments(equipmentList);
        setRentals(rentalList);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [email, isPending]);

  // Numbers for the cards
  const activeRentals = rentals.filter((r) => r.bookingStatus === "confirmed").length;
  const completedRentals = rentals.filter((r) => r.bookingStatus === "completed").length;

  const paidRentals = rentals.filter((r) => r.paymentStatus === "paid");
  const totalEarnings = paidRentals.reduce((sum, r) => sum + r.totalAmount, 0);
  const monthlyEarnings = groupByMonth(paidRentals, (r) => r.createdAt, (r) => r.totalAmount, "earnings");

  // The backend sends the newest rental first
  const recentRentals = rentals.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Financial & Rental Volume Performance</h1>
        <p className="mt-1.5 text-sm text-[#1B1F16]/70">Track how your rental business is performing.</p>

        {loading ? (
          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[76px] animate-pulse rounded-2xl bg-[#1B1F16]/5" />
              ))}
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="h-80 animate-pulse rounded-3xl bg-[#1B1F16]/5 lg:col-span-2" />
              <div className="h-80 animate-pulse rounded-3xl bg-[#1B1F16]/5" />
            </div>
          </div>
        ) : error ? (
          <p role="alert" className="mt-6 rounded-2xl border border-red-200 bg-white px-6 py-8 text-center text-sm font-medium text-red-700">
            {error}
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {/* Number cards */}
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard icon={Package} label="Listed equipment" value={equipments.length.toLocaleString()} />
              <StatCard icon={Clock} label="Active rentals" value={activeRentals.toLocaleString()} />
              <StatCard icon={CheckCircle2} label="Completed rentals" value={completedRentals.toLocaleString()} />
              <StatCard
                icon={Wallet}
                label="Total earnings"
                value={`${CURRENCY}${totalEarnings.toLocaleString()}`}
                variant="highlight"
              />
            </ul>

            {/* Chart + equipment status */}
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <MonthlyChart
                  title="Monthly earnings"
                  description="How much you earned from paid rentals in the last 6 months."
                  data={monthlyEarnings}
                  dataKey="earnings"
                  prefix={CURRENCY}
                />
              </div>

              <section className="rounded-3xl border border-[#1B1F16]/10 bg-white p-5 sm:p-6">
                <h2 className="text-lg font-extrabold">Equipment status</h2>
                <p className="mt-1 text-sm text-[#1B1F16]/60">Approval status of your listings.</p>

                {equipments.length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-[#1B1F16]/20 px-4 py-8 text-center">
                    <p className="text-sm text-[#1B1F16]/60">You have not listed any equipment yet.</p>
                    <Link
                      href="/owner/add-equipment"
                      className="mt-3 inline-flex h-9 items-center rounded-lg bg-[#7CB518] px-4 text-sm font-bold text-[#1B1F16] hover:bg-[#6aa00f]"
                    >
                      Add equipment
                    </Link>
                  </div>
                ) : (
                  <ul className="mt-6 space-y-5">
                    {equipmentStatuses.map(({ key, label, bar }) => {
                      const count = equipments.filter((e) => e.status === key).length;
                      const percent = Math.round((count / equipments.length) * 100);

                      return (
                        <li key={key}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold">{label}</span>
                            <span className="text-[#1B1F16]/60">
                              {count} ({percent}%)
                            </span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1B1F16]/10">
                            <div className={`h-full rounded-full ${bar}`} style={{ width: `${percent}%` }} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </div>

            {/* Recent rentals */}
            <section className="rounded-3xl border border-[#1B1F16]/10 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold">Recent rentals</h2>
                <Link href="/owner/my-equipment-rental" className="text-sm font-bold text-[#3F6212] hover:underline">
                  View all
                </Link>
              </div>

              {recentRentals.length === 0 ? (
                <p className="mt-5 rounded-2xl border border-dashed border-[#1B1F16]/20 px-4 py-8 text-center text-sm text-[#1B1F16]/60">
                  No one has rented your equipment yet.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-[#1B1F16]/10">
                  {recentRentals.map((rental) => (
                    <li key={rental._id} className="flex items-center gap-4 py-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1B1F16] text-sm font-bold text-[#F4F4F2]">
                        {rental.customer?.name?.[0]?.toUpperCase() ?? "?"}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{rental.customer?.name}</p>
                        <p className="truncate text-xs text-[#1B1F16]/60">{rental.equipment?.name}</p>
                      </div>

                      <p className="shrink-0 text-sm font-bold">
                        {CURRENCY}
                        {rental.totalAmount.toLocaleString()}
                      </p>

                      <span
                        className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-bold capitalize sm:inline-block ${
                          bookingColor[rental.bookingStatus] ?? "bg-[#1B1F16]/10 text-[#1B1F16]/70"
                        }`}
                      >
                        {rental.bookingStatus}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}