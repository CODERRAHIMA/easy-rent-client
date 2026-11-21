"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search, MapPin, SlidersHorizontal, X, ChevronLeft, ChevronRight,
  PackageSearch, Handshake, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type {
  Equipment,
  EquipmentFilters,
} from "@/types/type";
import EquipmentCard from "@/components/equipment/EquipmentCard";

const EQUIPMENT_API_URL = "http://localhost:5000/equipments";
const PAGE_SIZE = 9;

const categories = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];
const rentalTypes = ["Daily", "Weekly", "Monthly"];
const availabilityOptions = ["Available", "Unavailable"];
const sortOptions = [
  { value: "newest", label: "Recently added" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];
const initialFilters: EquipmentFilters = {
  search: "", location: "", category: "", rentalType: "",
  availability: "", minPrice: "", maxPrice: "", sort: "newest",
};

const fieldCls =
  "h-11 rounded-xl border-[#1B1F16]/15 bg-white focus-visible:border-[#7CB518] focus-visible:ring-[#7CB518]/25";

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
        active
          ? "border-[#1B1F16] bg-[#1B1F16] text-[#F4F4F2]"
          : "border-[#1B1F16]/15 bg-white text-[#1B1F16]/70 hover:border-[#7CB518]"
      }`}
    >
      {children}
    </button>
  );
}

export default function AllEquipmentPage() {
  const [filters, setFilters] = useState<EquipmentFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false); // mobile only
  const [page, setPage] = useState(1);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadEquipment = async () => {
      try {
        const response = await fetch(EQUIPMENT_API_URL, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Unable to load equipment (HTTP ${response.status}).`);
        }

        const result: unknown = await response.json();
        const records = Array.isArray(result)
          ? result
          : result &&
              typeof result === "object" &&
              "data" in result &&
              Array.isArray(result.data)
            ? result.data
            : result &&
                typeof result === "object" &&
                "equipments" in result &&
                Array.isArray(result.equipments)
              ? result.equipments
              : null;

        if (!records) {
          throw new Error("The equipment API returned an unexpected response.");
        }

        const approvedRecords = records.filter(
          (item): item is Equipment =>
            item !== null &&
            typeof item === "object" &&
            "status" in item &&
            item.status === "approved",
        );

        setEquipment(approvedRecords);
      } catch (err) {
        if (controller.signal.aborted) return;
        setFetchError(
          err instanceof Error
            ? err.message
            : "Unable to load equipment. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadEquipment();
    return () => controller.abort();
  }, []);

  const totalItems = equipment.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const items = equipment.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const update = (key: keyof EquipmentFilters, value: string) => {
    setFilters((f) => ({ ...f, [key]: f[key] === value && key !== "sort" ? "" : value }));
    setPage(1);
  };
  const reset = () => { setFilters(initialFilters); setPage(1); };

  const activeCount = [filters.category, filters.rentalType, filters.availability, filters.minPrice, filters.maxPrice]
    .filter(Boolean).length;

  const handleSearch = () => {
    setPage(1);
    console.log("Search with filters:", filters);
  };

  return (
    <main className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl py-8">
        {/* Header */}
        <p className="text-sm font-bold uppercase tracking-widest text-[#3F6212]">All equipment</p>
        <h1 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Find the right equipment
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#1B1F16]/70">
          Browse approved equipment from verified owners and rent it for the time you need.
        </p>

        {/* Search bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="mt-8 flex flex-col gap-2 rounded-2xl border border-[#1B1F16]/10 bg-white p-2 shadow-sm sm:flex-row sm:items-center"
        >
          <label className="flex flex-1 items-center gap-2 px-3 py-2">
            <Search className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
            <span className="sr-only">Equipment name</span>
            <input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search by equipment name"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#1B1F16]/45"
            />
          </label>
          <span className="hidden h-8 w-px bg-[#1B1F16]/10 sm:block" />
          <label className="flex flex-1 items-center gap-2 px-3 py-2">
            <MapPin className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
            <span className="sr-only">Location</span>
            <input
              value={filters.location}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              placeholder="Location"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#1B1F16]/45"
            />
          </label>
          <Button type="submit" className="h-12 rounded-xl bg-[#7CB518] px-8 text-sm font-bold text-[#1B1F16] hover:bg-[#6aa00f]">
            Search
          </Button>
        </form>

        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="space-y-7 rounded-3xl border border-[#1B1F16]/10 bg-white p-6 lg:sticky lg:top-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold">Filters</h2>
                {activeCount > 0 && (
                  <button type="button" onClick={reset} className="flex items-center gap-1 text-xs font-bold text-[#3F6212] hover:underline">
                    <X className="h-3.5 w-3.5" aria-hidden /> Clear all
                  </button>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold">Category</Label>
                <ul className="mt-3 space-y-1.5">
                  {categories.map((c) => {
                    const active = filters.category === c;
                    return (
                      <li key={c}>
                        <button
                          type="button"
                          onClick={() => update("category", c)}
                          aria-pressed={active}
                          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition ${
                            active ? "bg-[#EEF4E0] font-bold text-[#3F6212]" : "text-[#1B1F16]/80 hover:bg-[#F4F4F2]"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${active ? "bg-[#7CB518]" : "bg-[#1B1F16]/20"}`} />
                          {c}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <Label className="text-sm font-semibold">Rental type</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {rentalTypes.map((t) => (
                    <Pill key={t} active={filters.rentalType === t} onClick={() => update("rentalType", t)}>{t}</Pill>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Price range</Label>
                <div className="mt-3 flex items-center gap-2">
                  <Input type="number" min={0} value={filters.minPrice} onChange={(e) => update("minPrice", e.target.value)} placeholder="Min" aria-label="Minimum price" className={fieldCls} />
                  <span className="text-[#1B1F16]/40">-</span>
                  <Input type="number" min={0} value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} placeholder="Max" aria-label="Maximum price" className={fieldCls} />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Availability</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {availabilityOptions.map((a) => (
                    <Pill key={a} active={filters.availability === a} onClick={() => update("availability", a)}>{a}</Pill>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <section>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters((s) => !s)}
                  className="h-10 rounded-xl border-[#1B1F16]/15 bg-white font-bold hover:border-[#7CB518] hover:bg-white lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 text-[#3F6212]" aria-hidden />
                  Filters{activeCount > 0 && ` (${activeCount})`}
                </Button>
                <p className="text-sm text-[#1B1F16]/70">
                  <span className="font-bold text-[#1B1F16]">{totalItems}</span> items found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-[#1B1F16]/60 sm:block">Sort by</span>
                <Select value={filters.sort} onValueChange={(v: string | null) => update("sort", v ?? "newest")}>
                  <SelectTrigger className={`${fieldCls} w-[190px]`}><SelectValue placeholder="Sort by" /></SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading skeleton */}
            {loading ? (
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="h-[380px] animate-pulse rounded-3xl bg-[#1B1F16]/5" />
                ))}
              </ul>
            ) : fetchError ? (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-red-200 bg-white px-6 py-8 text-center text-sm font-medium text-red-700"
              >
                {fetchError}
              </div>
            ) : items.length === 0 ? (
              /* Empty state */
              <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-[#1B1F16]/20 bg-white px-6 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4E0] text-[#3F6212]">
                  <PackageSearch className="h-7 w-7" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-extrabold">No equipment found</h3>
                <p className="mt-1 max-w-sm text-sm text-[#1B1F16]/60">Try changing your search or clearing some filters.</p>
                <Button onClick={reset} className="mt-5 rounded-xl bg-[#7CB518] font-bold text-[#1B1F16] hover:bg-[#6aa00f]">Clear filters</Button>
              </div>
            ) : (
              /* Cards: 3-column grid, equal height */
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <EquipmentCard key={item._id} item={item} />
                ))}
              </ul>
            )}

            {/* Pagination (optional requirement) */}
            {!loading && items.length > 0 && (
              <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Previous page"
                  className="rounded-xl border-[#1B1F16]/15 bg-white hover:border-[#7CB518] hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    aria-current={page === n ? "page" : undefined}
                    className={`h-9 w-9 rounded-xl text-sm font-bold transition ${
                      page === n ? "bg-[#7CB518] text-[#1B1F16]" : "bg-white text-[#1B1F16]/70 hover:bg-[#EEF4E0]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Next page"
                  className="rounded-xl border-[#1B1F16]/15 bg-white hover:border-[#7CB518] hover:bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            )}
          </section>
        </div>

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
            href="/contact"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1B1F16] px-6 text-sm font-bold text-white transition hover:bg-[#2d3326] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1F16]"
          >
            Contact Us <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}