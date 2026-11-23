"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Heart, Search, User, Wallet, Clock } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import StatCard from "@/components/analyticsCards/StatCard";

const CURRENCY = "৳";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

type Rental = {
  _id: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  paymentStatus: string;
  status: string;
};

// Small colored badge for the booking status
const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-sky-100 text-sky-800",
  completed: "bg-[#EEF4E0] text-[#3F6212]",
  cancelled: "bg-red-100 text-red-700",
};

// Quick links at the bottom (change the hrefs if your routes are different)
const quickLinks = [
  { href: "/all-equipment", label: "Browse equipment", icon: Search },
  { href: "/customer/my-rentals", label: "My rentals", icon: CalendarCheck },
  { href: "/customer/favourites", label: "My favourites", icon: Heart },
  { href: "/customer/profile", label: "My profile", icon: User },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// Get a list from the backend
async function fetchList<T>(path: string, email: string, token: string): Promise<T[]> {
  const response = await fetch(`${API_URL}${path}?email=${encodeURIComponent(email)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load your data");
  }

  return result.data;
}

export default function CustomerOverviewPage() {
  // 1. Get the logged in customer
  const { data: session, isPending } = useSession();
  const email = session?.user?.email;
  const firstName = session?.user?.name?.split(" ")[0];

  // 2. States
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 3. Load the rentals and favourites when the page opens
  useEffect(() => {
    const loadOverview = async () => {
      if (isPending) return;

      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const token = await getTokenFromClient();

        const [rentalList, favouriteList] = await Promise.all([
          fetchList<Rental>("/bookings/my-rentals", email, token),
          fetchList<unknown>("/favourites", email, token),
        ]);

        setRentals(rentalList);
        setFavouritesCount(favouriteList.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [email, isPending]);

  // 4. Numbers for the cards
  const activeRentals = rentals.filter((r) => r.status === "confirmed").length;
  const totalSpent = rentals
    .filter((r) => r.paymentStatus === "paid")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  // The backend sends the newest booking first, so the first 3 are the latest
  const recentRentals = rentals.slice(0, 3);

  if (!isPending && !email) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Please login first</h2>
      </div>
    );
  }

  return (
    <section className="space-y-8 text-[#1B1F16]">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Welcome back{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-2 text-sm text-[#1B1F16]/60">Here is a quick look at your rentals.</p>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl border border-red-200 bg-white px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {/* Number cards */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-3xl bg-[#1B1F16]/5" />
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={CalendarCheck} label="Total rentals" value={rentals.length} />
          <StatCard icon={Clock} label="Active rentals" value={activeRentals} />
          <StatCard icon={Heart} label="Saved favourites" value={favouritesCount} />
          <StatCard
            icon={Wallet}
            label="Total spent"
            value={`${CURRENCY}${totalSpent.toLocaleString()}`}
            variant="highlight"
          />
        </ul>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent rentals */}
        <div className="rounded-3xl border border-[#1B1F16]/10 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold">Recent rentals</h2>
            <Link href="/customer/my-rentals" className="text-sm font-bold text-[#3F6212] hover:underline">
              View all
            </Link>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-[#1B1F16]/60">Loading...</p>
          ) : recentRentals.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#1B1F16]/20 px-5 py-10 text-center">
              <p className="text-sm text-[#1B1F16]/60">You have not rented any equipment yet.</p>
              <Link
                href="/all-equipment"
                className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#7CB518] px-5 text-sm font-bold text-[#1B1F16] hover:bg-[#6aa00f]"
              >
                Browse equipment
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-[#1B1F16]/10">
              {recentRentals.map((rental) => (
                <li key={rental._id} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{rental.equipmentName}</p>
                    <p className="mt-1 text-xs text-[#1B1F16]/60">
                      {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-bold">
                      {CURRENCY}
                      {rental.totalPrice.toLocaleString()}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                        statusColor[rental.status] ?? "bg-[#1B1F16]/10 text-[#1B1F16]/70"
                      }`}
                    >
                      {rental.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick links */}
        <div className="rounded-3xl bg-[#1B1F16] p-6 text-[#F4F4F2] sm:p-8">
          <h2 className="text-lg font-extrabold">Quick links</h2>

          <ul className="mt-4 space-y-2">
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-center gap-3 rounded-xl border border-[#F4F4F2]/10 bg-[#F4F4F2]/5 px-4 py-3 text-sm font-semibold transition hover:border-[#7CB518]/60 hover:bg-[#F4F4F2]/10"
                >
                  <Icon className="size-4 text-[#7CB518]" aria-hidden="true" />
                  {label}
                  <ArrowRight className="ml-auto size-4 text-[#F4F4F2]/40 transition group-hover:translate-x-1 group-hover:text-[#7CB518]" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}