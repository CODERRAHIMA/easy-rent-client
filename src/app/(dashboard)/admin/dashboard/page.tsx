"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, CheckCircle2, Clock, Package, Users, Wallet } from "lucide-react";
import StatCard from "@/components/analyticsCards/StatCard";
import MonthlyChart from "@/components/analyticsCards/MonthlyChart";
import { fetchData, groupByMonth } from "@/components/analyticsCards/Helper";
import { authClient } from "@/lib/auth-client";

const CURRENCY = "৳";

type User = { _id: string };
type Equipment = { _id: string; status: string }; // "pending" | "approved" | "rejected"
type Booking = {
  createdAt: string;
  totalAmount: number;
  paymentStatus: string; // "paid" | "pending" | "failed"
  bookingStatus: string; // "pending" | "confirmed" | "completed" | "cancelled"
};

export default function AdminOverviewPage() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [users, setUsers] = useState<User[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
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
        const [userList, equipmentList, bookingList] = await Promise.all([
          fetchData<User>("/users"),
          fetchData<Equipment>(`/equipments/admin/all?email=${encodeURIComponent(email)}`),
          fetchData<Booking>("/bookings/admin/all"),
        ]);

        setUsers(userList);
        setEquipments(equipmentList);
        setBookings(bookingList);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [email, isPending]);

  const pendingApprovals = equipments.filter((e) => e.status === "pending").length;
  const completedRentals = bookings.filter((b) => b.bookingStatus === "completed").length;

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const monthlyBookings = groupByMonth(bookings, (b) => b.createdAt, () => 1, "bookings");

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Global Platform Performance Overview</h1>
        <p className="mt-2 text-sm text-[#1B1F16]/70">Comprehensive financial metrics, rental confirmation rates, and platform booking velocities</p>

        {loading ? (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard icon={Users} label="Total users" value={users.length.toLocaleString()} />
              <StatCard icon={Package} label="Total equipment" value={equipments.length.toLocaleString()} />
              <StatCard icon={CalendarCheck} label="Total bookings" value={bookings.length.toLocaleString()} />
              <StatCard icon={Clock} label="Pending approvals" value={pendingApprovals.toLocaleString()} />
              <StatCard icon={CheckCircle2} label="Completed rentals" value={completedRentals.toLocaleString()} />
              <StatCard
                icon={Wallet}
                label="Total revenue"
                value={`${CURRENCY}${totalRevenue.toLocaleString()}`}
                variant="highlight"
              />
            </ul>

            <MonthlyChart
              title="Monthly bookings"
              description="Number of bookings made on the platform in the last 6 months."
              data={monthlyBookings}
              dataKey="bookings"
            />
          </div>
        )}
      </div>
    </div>
  );
}