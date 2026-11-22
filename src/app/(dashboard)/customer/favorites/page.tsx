"use client";

import { memo, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Heart, Loader2, MapPin, Wrench } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import type { Equipment, EquipmentRentalType } from "@/types/type";

const CURRENCY = "৳";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

type Favourite = {
  _id: string;
  email: string;
  equipmentId: string;
  equipment: Equipment;
};

type Result = { email: string; items: Favourite[]; failed: boolean };

const unit: Record<EquipmentRentalType, string> = {
  Daily: "day",
  Weekly: "week",
  Monthly: "month",
};

async function getFavourites(email: string, signal: AbortSignal): Promise<Favourite[]> {
  const token = await getTokenFromClient();
  const response = await fetch(`${API_URL}/favourites?email=${encodeURIComponent(email)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch favourites");
  }

  return result.data;
}

const FavouriteCard = memo(function FavouriteCard({
  equipment,
  removing,
  onRemove,
}: {
  equipment: Equipment;
  removing: boolean;
  onRemove: (equipmentId: string) => void;
}) {
  const equipmentId = String(equipment._id);

  return (
    <li className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#1B1F16]/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EEF4E0]">
        {equipment.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={equipment.image}
            alt={equipment.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#3F6212]/40">
            <Wrench className="size-12" aria-hidden />
          </div>
        )}

        <span className="absolute left-3 top-3 max-w-[65%] truncate rounded-full bg-[#F4F4F2] px-3 py-1 text-xs font-semibold">
          {equipment.category}
        </span>

        <button
          type="button"
          onClick={() => onRemove(equipmentId)}
          disabled={removing}
          aria-label={`Remove ${equipment.name} from favourites`}
          title="Remove from favourites"
          className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:scale-110 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3F6212] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {removing ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : (
            <Heart className="size-5 fill-red-500" aria-hidden />
          )}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-1 text-lg font-extrabold">{equipment.name}</h2>

        <p className="mt-2 flex items-center gap-2 text-sm text-[#1B1F16]/60">
          <MapPin className="size-4 shrink-0 text-[#3F6212]" aria-hidden />
          <span className="truncate">{equipment.location}</span>
        </p>

        <div className="mt-auto pt-5">
          <p className="text-2xl font-extrabold leading-none">
            {CURRENCY}
            {equipment.rentalPrice.toLocaleString()}
            <span className="ml-1 text-sm font-semibold text-[#1B1F16]/60">
              / {unit[equipment.rentalType]}
            </span>
          </p>

          <Link
            href={`/all-equipment/${equipmentId}`}
            className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[#1B1F16] text-sm font-bold text-white transition hover:bg-[#2d3326] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
          >
            View Details
          </Link>
        </div>
      </div>
    </li>
  );
});

function CardsSkeleton() {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading favourites">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="h-[380px] animate-pulse rounded-3xl bg-[#1B1F16]/5" />
      ))}
    </ul>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-[#1B1F16]/20 bg-white px-5 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#EEF4E0] text-[#3F6212]">
        <Heart className="size-7" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-extrabold">No favourites yet</h2>
      <p className="mt-2 max-w-sm text-sm text-[#1B1F16]/60">
        Explore equipment and save your favourite items here.
      </p>
      <Link
        href="/all-equipment"
        className="mt-5 inline-flex h-11 items-center rounded-xl bg-[#1B1F16] px-6 text-sm font-bold text-white transition hover:bg-[#2d3326] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
      >
        Explore Equipment
      </Link>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-3xl border border-red-200 bg-white px-5 py-12 text-center">
      <AlertCircle className="size-10 text-red-500" aria-hidden />
      <p className="mt-3 text-sm font-semibold text-red-700">Could not load your favourites.</p>
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


export default function CustomerFavouritesPage() {
  const { data: session, isPending } = useSession();
  const email = session?.user?.email;

  const [result, setResult] = useState<Result | null>(null);
  const [reloadKey, setReloadKey] = useState(0); // bump it to fetch again ("Try again")
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

    const controller = new AbortController();

    getFavourites(email, controller.signal)
      .then((items) => setResult({ email, items, failed: false }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch favourites:", err);
        setResult({ email, items: [], failed: true });
      });

    return () => controller.abort();
  }, [email, reloadKey]);

  const current = result?.email === email ? result : null;
  const favourites = current?.items ?? [];
  const loading = isPending || (!!email && !current);

  const handleRetry = () => {
    setResult(null);
    setReloadKey((key) => key + 1);
  };

  const handleRemove = useCallback(
    async (equipmentId: string) => {
      if (!email) return;

      try {
        setRemovingId(equipmentId);
        const token = await getTokenFromClient();

        const response = await fetch(
          `${API_URL}/favourites/${equipmentId}?email=${encodeURIComponent(email)}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        // Remove the item from the list without refetching
        setResult((previous) =>
          previous && {
            ...previous,
            items: previous.items.filter((item) => String(item.equipment._id) !== equipmentId),
          },
        );
      } catch (err) {
        console.error("Failed to remove favourite:", err);
        alert("Could not remove favourite");
      } finally {
        setRemovingId(null);
      }
    },
    [email],
  );

  if (loading) {
    return (
      <section className="space-y-6">
        <CardsSkeleton />
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
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1B1F16] sm:text-4xl">My Favourites</h1>
          <p className="mt-2 text-sm text-[#1B1F16]/60">Equipment you have saved for later.</p>
        </div>

        {favourites.length > 0 && (
          <p className="inline-flex items-center gap-2 self-start rounded-full border border-[#1B1F16]/10 bg-white px-4 py-2 text-sm font-semibold sm:self-auto">
            {favourites.length} saved equipment
          </p>
        )}
      </div>

      {current?.failed ? (
        <ErrorState onRetry={handleRetry} />
      ) : favourites.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favourites.map(({ _id, equipment }) => (
            <FavouriteCard
              key={_id}
              equipment={equipment}
              removing={removingId === String(equipment._id)}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      )}
    </section>
  );
}