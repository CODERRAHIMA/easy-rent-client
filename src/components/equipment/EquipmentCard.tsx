import Link from "next/link";
import { ArrowRight, CalendarClock, Heart, MapPin, Wrench } from "lucide-react";
import type { Equipment, EquipmentRentalType } from "@/types/type";
import FavouriteButton from "./FavouriteButton";
import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const CURRENCY = "৳";

const unit: Record<EquipmentRentalType, string> = {
  Daily: "day",
  Weekly: "week",
  Monthly: "month",
};

export default async function EquipmentCard({ item }: { item: Equipment }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isCustomer = session?.user?.role === "customer";
  const available = item.availableQuantity > 0;

  return (
    <li className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#1B1F16]/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EEF4E0]">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#3F6212]/40">
            <Wrench className="h-12 w-12" aria-hidden />
          </div>
        )}
        <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full bg-[#F4F4F2] px-3 py-1 text-xs font-semibold">
          {item.category}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
            available
              ? "bg-[#7CB518] text-[#1B1F16]"
              : "bg-[#1B1F16] text-[#F4F4F2]"
          }`}
        >
          {available ? "Available" : "Unavailable"}
        </span>

        {isCustomer && <FavouriteButton equipmentId={String(item._id)} />}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-extrabold">{item.name}</h3>

        <ul className="mt-3 space-y-1.5 text-sm text-[#1B1F16]/70">
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#3F6212]" aria-hidden />
            <span className="truncate">{item.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <CalendarClock
              className="h-4 w-4 shrink-0 text-[#3F6212]"
              aria-hidden
            />
            {item.rentalType} rental
          </li>
        </ul>

        <div className="mt-auto pt-5">
          <p className="text-2xl font-extrabold leading-none">
            {CURRENCY}
            {item.rentalPrice.toLocaleString()}
            <span className="text-sm font-semibold text-[#1B1F16]/60">
              {" "}
              / {unit[item.rentalType]}
            </span>
          </p>
          <Link
            href={`/all-equipment/${item._id}`}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1B1F16] text-sm font-bold text-[#F4F4F2] transition hover:bg-[#2d3326] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
          >
            View details <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </li>
  );
}
