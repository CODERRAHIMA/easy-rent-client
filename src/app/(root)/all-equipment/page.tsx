import Link from "next/link";
import { Handshake, ArrowRight } from "lucide-react";
import type { Equipment, EquipmentFilters } from "@/types/type";
import EquipmentCard from "@/components/equipment/EquipmentCard";
import { parseFilters, parsePage, SearchParams } from "@/components/utils/filters";
import EquipmentBrowser from "@/components/equipment/EquipmentBrowser";

const EQUIPMENT_API_URL = `${process.env.API_URL}/equipments`;
const PAGE_SIZE = 9;

function getEquipmentRecords(result: unknown): Equipment[] | null {
  if (Array.isArray(result)) return result as Equipment[];
  if (!result || typeof result !== "object") return null;

  if ("data" in result && Array.isArray(result.data)) {
    return result.data as Equipment[];
  }
  if ("equipments" in result && Array.isArray(result.equipments)) {
    return result.equipments as Equipment[];
  }

  return null;
}

async function fetchEquipment(
  filters: EquipmentFilters,
): Promise<{ records: Equipment[]; error: string }> {
  try {
    // Create query parameters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    const response = await fetch(`${EQUIPMENT_API_URL}?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Unable to load equipment (HTTP ${response.status}).`);
    }

    const records = getEquipmentRecords(await response.json());
    if (!records) {
      throw new Error("The equipment API returned an unexpected response.");
    }

    // Backend already filters approved equipments
    return { records, error: "" };
  } catch (err) {
    return {
      records: [],
      error: err instanceof Error ? err.message : "Unable to load equipment. Please try again.",
    };
  }
}

export default async function AllEquipmentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const { records, error } = await fetchEquipment(filters);

  const totalItems = records.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const page = Math.min(parsePage(params), Math.max(totalPages, 1));
  const items = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <p className="text-sm font-bold uppercase tracking-widest text-[#3F6212]">
          All equipment
        </p>
        <h1 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Find the right equipment
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#1B1F16]/70">
          Browse approved equipment from verified owners and rent it for the
          time you need.
        </p>

        <EquipmentBrowser
          filters={filters}
          page={page}
          totalItems={totalItems}
          totalPages={totalPages}
          fetchError={error}
        >
          {/* Cards: 3-column grid, equal height */}
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </ul>
        </EquipmentBrowser>

        <section className="mt-16 flex flex-col items-start gap-6 rounded-3xl bg-[#7CB518] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:px-10">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-[#1B1F16]">
              <Handshake className="size-7" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[#1B1F16] sm:text-xl">
                Need a custom rental?
              </h2>
              <p className="mt-1 text-sm leading-6 text-white">
                Tell us what you need, and we&apos;ll help you find the right
                equipment.
              </p>
            </div>
          </div>
          <Link
            href="mailto:support@easyrent.com?subject=Custom%20rental%20request"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1B1F16] px-6 text-sm font-bold text-white transition hover:bg-[#2d3326] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1F16]"
          >
            Contact Us <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}