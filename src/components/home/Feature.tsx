import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EquipmentCard from "@/components/equipment/EquipmentCard";
import FeaturedEquipmentGrid from "@/components/home/FeaturedEquipmentGrid";
import type { Equipment } from "@/types/type";

const FEATURED_EQUIPMENT_API_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/equipments/featured`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isEquipment(value: unknown): value is Equipment {
  return (
    isRecord(value) &&
    typeof value._id === "string" &&
    typeof value.name === "string" &&
    typeof value.category === "string" &&
    typeof value.location === "string" &&
    typeof value.rentalPrice === "number" &&
    (value.rentalType === "Daily" ||
      value.rentalType === "Weekly" ||
      value.rentalType === "Monthly") &&
    typeof value.availableQuantity === "number" &&
    typeof value.status === "string" &&
    (value.image == null || typeof value.image === "string")
  );
}

function getEquipmentList(result: unknown): Equipment[] {
  const records = Array.isArray(result)
    ? result
    : isRecord(result) && Array.isArray(result.data)
      ? result.data
      : isRecord(result) && Array.isArray(result.equipments)
        ? result.equipments
        : null;

  if (!records || !records.every(isEquipment)) {
    throw new Error("The featured equipment API returned unexpected data.");
  }

  return records;
}

function SectionLoading() {
  return (
    <section className="bg-[#F4F4F2] px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-64 animate-pulse rounded-xl bg-[#1B1F16]/10" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="aspect-[4/5] animate-pulse rounded-3xl bg-[#1B1F16]/10"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

async function FeaturedEquipment() {
  let equipment: Equipment[] = [];
  let error = "";

  try {
    const response = await fetch(FEATURED_EQUIPMENT_API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Unable to load featured equipment (HTTP ${response.status}).`);
    }

    equipment = getEquipmentList(await response.json());
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Unable to load featured equipment. Please try again.";
  }

  return (
    <section
      aria-labelledby="featured-equipment-heading"
      className="bg-[#F4F4F2] px-5 py-16 text-[#1B1F16] sm:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#3F6212]">
              Recently listed
            </p>
            <h2
              id="featured-equipment-heading"
              className="mt-3 max-w-lg text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            >
              Featured equipment
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#1B1F16]/65 sm:text-base">
              Explore the latest approved equipment available to rent.
            </p>
          </div>
          <Link
            href="/all-equipment"
            className="inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-[#1B1F16]/15 bg-white px-5 text-sm font-bold transition hover:border-[#7CB518] hover:bg-[#EEF4E0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
          >
            Browse all equipment
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {error ? (
          <p role="alert" className="rounded-2xl bg-white p-6 text-sm text-red-700">
            {error}
          </p>
        ) : equipment.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-[#1B1F16]/65">
            No approved equipment is available yet.
          </p>
        ) : (
          <FeaturedEquipmentGrid>
            {equipment.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </FeaturedEquipmentGrid>
        )}
      </div>
    </section>
  );
}

export default function Feature() {
  return (
    <Suspense fallback={<SectionLoading />}>
      <FeaturedEquipment />
    </Suspense>
  );
}

