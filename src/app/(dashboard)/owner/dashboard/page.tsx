"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Package, Wallet } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import StatCard from "@/components/analyticsCards/StatCard";
import MonthlyChart from "@/components/analyticsCards/MonthlyChart";
import { fetchData, groupByMonth } from "@/components/analyticsCards/Helper";

const CURRENCY = "৳";

type Equipment = { _id: string };

type Rental = {
  createdAt: string;
  totalAmount: number;
  paymentStatus: string; // "paid" | "pending" | "failed"
  bookingStatus: string; // "pending" | "confirmed" | "completed" | "cancelled"
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

  const completedRentals = rentals.filter((r) => r.bookingStatus === "completed").length;


  const paidRentals = rentals.filter((r) => r.paymentStatus === "paid");
  const totalEarnings = paidRentals.reduce((sum, r) => sum + r.totalAmount, 0);
  const monthlyEarnings = groupByMonth(paidRentals, (r) => r.createdAt, (r) => r.totalAmount, "earnings");

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-3xl">Financial & Rental Volume Performance</h1>
        <p className="mt-2 text-sm text-[#1B1F16]/70">Track how your rental business is performing.</p>

        {loading ? (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-3xl bg-[#1B1F16]/5" />
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-3xl bg-[#1B1F16]/5" />
          </div>
        ) : error ? (
          <p role="alert" className="mt-8 rounded-2xl border border-red-200 bg-white px-6 py-8 text-center text-sm font-medium text-red-700">
            {error}
          </p>
        ) : (
          <div className="mt-8 space-y-6">
            <ul className="grid gap-4 sm:grid-cols-3">
              <StatCard icon={Package} label="Total listed equipment" value={equipments.length.toLocaleString()} />
              <StatCard icon={CheckCircle2} label="Completed rentals" value={completedRentals.toLocaleString()} />
              <StatCard
                icon={Wallet}
                label="Total earnings"
                value={`${CURRENCY}${totalEarnings.toLocaleString()}`}
                variant="highlight"
              />
            </ul>

            <MonthlyChart
              title="Monthly earnings"
              description="How much you earned from paid rentals in the last 6 months."
              data={monthlyEarnings}
              dataKey="earnings"
              prefix={CURRENCY}
            />
          </div>
        )}
      </div>
    </div>
  );
}