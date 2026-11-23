"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle2, Clock, Package, Users, Wallet } from "lucide-react";
import StatCard from "@/components/analyticsCards/StatCard";
import MonthlyChart from "@/components/analyticsCards/MonthlyChart";
import { fetchData, groupByMonth } from "@/components/analyticsCards/Helper";
import { authClient } from "@/lib/auth-client";

const CURRENCY = "৳";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string; // "customer" | "owner" | "admin"
};

type Equipment = { _id: string; status: string }; // "pending" | "approved" | "rejected"

type Booking = {
  _id: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string; // "paid" | "pending" | "failed"
  bookingStatus: string; // "pending" | "confirmed" | "completed" | "cancelled"
  equipmentName: string;
  customer: { name: string };
};

// Rows of the "Users by role" card
const userRoles = [
  { key: "customer", label: "Customers", bar: "bg-[#1B1F16]/40" },
  { key: "owner", label: "Owners", bar: "bg-[#7CB518]" },
  { key: "admin", label: "Admins", bar: "bg-amber-400" },
];

// Colors for the badges
const roleColor: Record<string, string> = {
  customer: "bg-[#1B1F16]/10 text-[#1B1F16]/70",
  owner: "bg-[#EEF4E0] text-[#3F6212]",
  admin: "bg-[#1B1F16] text-[#F4F4F2]",
};

const bookingColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-sky-100 text-sky-800",
  completed: "bg-[#EEF4E0] text-[#3F6212]",
  cancelled: "bg-red-100 text-red-700",
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

  // Numbers for the cards
  const pendingApprovals = equipments.filter((e) => e.status === "pending").length;
  const completedRentals = bookings.filter((b) => b.bookingStatus === "completed").length;

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const monthlyBookings = groupByMonth(bookings, (b) => b.createdAt, () => 1, "bookings");

  // The backend sends the newest rentals and users first
  const recentBookings = bookings.slice(0, 5);
  const newUsers = users.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Global Platform Performance Overview</h1>
        <p className="mt-1.5 text-sm text-[#1B1F16]/70">
          Comprehensive financial metrics, rental confirmation rates, and platform booking velocities
        </p>

        {loading ? (
          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
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

            {/* Chart + users by role */}
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <MonthlyChart
                  title="Monthly bookings"
                  description="Number of bookings made on the platform in the last 6 months."
                  data={monthlyBookings}
                  dataKey="bookings"
                />
              </div>

              <section className="rounded-3xl border border-[#1B1F16]/10 bg-white p-5 sm:p-6">
                <h2 className="text-lg font-extrabold">Users by role</h2>
                <p className="mt-1 text-sm text-[#1B1F16]/60">How the {users.length} registered users are split.</p>

                {users.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-dashed border-[#1B1F16]/20 px-4 py-8 text-center text-sm text-[#1B1F16]/60">
                    No users yet.
                  </p>
                ) : (
                  <ul className="mt-6 space-y-5">
                    {userRoles.map(({ key, label, bar }) => {
                      const count = users.filter((u) => u.role === key).length;
                      const percent = Math.round((count / users.length) * 100);

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

            {/* Recent rentals + attention + new users */}
            <div className="grid gap-5 lg:grid-cols-3">
              <section className="rounded-3xl border border-[#1B1F16]/10 bg-white p-5 sm:p-6 lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-extrabold">Recent rentals</h2>
                  <Link href="/admin/all-rentals" className="text-sm font-bold text-[#3F6212] hover:underline">
                    View all
                  </Link>
                </div>

                {recentBookings.length === 0 ? (
                  <p className="mt-5 rounded-2xl border border-dashed border-[#1B1F16]/20 px-4 py-8 text-center text-sm text-[#1B1F16]/60">
                    No rentals yet.
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-[#1B1F16]/10">
                    {recentBookings.map((booking) => (
                      <li key={booking._id} className="flex items-center gap-4 py-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1B1F16] text-sm font-bold text-[#F4F4F2]">
                          {booking.customer?.name?.[0]?.toUpperCase() ?? "?"}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">{booking.customer?.name}</p>
                          <p className="truncate text-xs text-[#1B1F16]/60">{booking.equipmentName}</p>
                        </div>

                        <p className="shrink-0 text-sm font-bold">
                          {CURRENCY}
                          {booking.totalAmount.toLocaleString()}
                        </p>

                        <span
                          className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-bold capitalize sm:inline-block ${
                            bookingColor[booking.bookingStatus] ?? "bg-[#1B1F16]/10 text-[#1B1F16]/70"
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <div className="space-y-5">
                {/* Needs attention */}
                <section className="rounded-3xl bg-[#1B1F16] p-5 text-[#F4F4F2] sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7CB518]">Needs attention</p>
                  <p className="mt-3 text-3xl font-extrabold leading-none">{pendingApprovals}</p>
                  <p className="mt-2 text-sm text-[#F4F4F2]/70">
                    {pendingApprovals === 1 ? "equipment is" : "equipment are"} waiting for your approval.
                  </p>
                  <Link
                    href="/admin/all-equipment"
                    className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-[#7CB518] px-4 text-sm font-bold text-[#1B1F16] transition hover:bg-[#6aa00f]"
                  >
                    Review equipment <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </section>

                {/* New users */}
                <section className="rounded-3xl border border-[#1B1F16]/10 bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-extrabold">New users</h2>
                    <Link href="/admin/all-users" className="text-sm font-bold text-[#3F6212] hover:underline">
                      View all
                    </Link>
                  </div>

                  {newUsers.length === 0 ? (
                    <p className="mt-4 text-sm text-[#1B1F16]/60">No users yet.</p>
                  ) : (
                    <ul className="mt-3 divide-y divide-[#1B1F16]/10">
                      {newUsers.map((user) => (
                        <li key={user._id} className="flex items-center gap-3 py-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4E0] text-sm font-bold text-[#3F6212]">
                            {user.name?.[0]?.toUpperCase() ?? "?"}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{user.name}</p>
                            <p className="truncate text-xs text-[#1B1F16]/60">{user.email}</p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                              roleColor[user.role] ?? "bg-[#1B1F16]/10 text-[#1B1F16]/70"
                            }`}
                          >
                            {user.role}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}