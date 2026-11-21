"use client";

import { useOptimistic, useState, useTransition, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, MapPin, SlidersHorizontal, X, ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EquipmentFilters } from "@/types/type";
import { initialFilters, toSearchString } from "../utils/filters";

const categories = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];
const rentalTypes = ["Daily", "Weekly", "Monthly"];
const availabilityOptions = ["Available Only"];
const sortOptions = [
  { value: "recently added", label: "recently added" },
  { value: "price: low to high", label: "price: low to high" },
  { value: "price: high to low", label: "price: high to low" },
];

const fieldCls =
  "h-11 rounded-xl border-[#1B1F16]/15 bg-white focus-visible:border-[#7CB518] focus-visible:ring-[#7CB518]/25";

const arrowBtnCls =
  "rounded-xl border-[#1B1F16]/15 bg-white hover:border-[#7CB518] hover:bg-white";

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
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

function PillFilter({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (option: string) => void;
}) {
  return (
    <div>
      <Label className="text-sm font-semibold">{label}</Label>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <Pill key={option} active={value === option} onClick={() => onSelect(option)}>
            {option}
          </Pill>
        ))}
      </div>
    </div>
  );
}

type Props = {
  filters: EquipmentFilters;
  page: number;
  totalItems: number;
  totalPages: number;
  fetchError: string;
  children: ReactNode; 
};

export default function EquipmentBrowser({ filters, page, totalItems, totalPages, fetchError, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, startTransition] = useTransition(); // true while the server fetches new results
  const [view, setView] = useOptimistic({ filters, page }); // shows changes instantly while the URL updates
  const [showFilters, setShowFilters] = useState(false); // mobile only

  const current = view.filters;

  const navigate = (nextFilters: EquipmentFilters, nextPage: number) => {
    startTransition(() => {
      setView({ filters: nextFilters, page: nextPage });
      const query = toSearchString(nextFilters, nextPage);
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const update = (key: keyof EquipmentFilters, value: string) =>
    navigate({ ...current, [key]: current[key] === value && key !== "sort" ? "" : value }, 1);
  const setText = (key: keyof EquipmentFilters, value: string) =>
    navigate({ ...current, [key]: value }, view.page);
  const reset = () => navigate(initialFilters, 1);
  const goToPage = (n: number) => navigate(current, n);

  const activeCount = [
    current.category,
    current.rentalType,
    current.availability,
    current.minPrice,
    current.maxPrice,
  ].filter(Boolean).length;

  return (
    <>
      {/* Search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate(current, 1);
        }}
        className="mt-8 flex flex-col gap-2 rounded-2xl border border-[#1B1F16]/10 bg-white p-2 shadow-sm sm:flex-row sm:items-center"
      >
        <label className="flex flex-1 items-center gap-2 px-3 py-2">
          <Search className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
          <span className="sr-only">Equipment name</span>
          <input
            value={current.search}
            onChange={(e) => setText("search", e.target.value)}
            placeholder="Search by equipment name"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#1B1F16]/45"
          />
        </label>
        <span className="hidden h-8 w-px bg-[#1B1F16]/10 sm:block" />
        <label className="flex flex-1 items-center gap-2 px-3 py-2">
          <MapPin className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
          <span className="sr-only">Location</span>
          <input
            value={current.location}
            onChange={(e) => setText("location", e.target.value)}
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
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-1 text-xs font-bold text-[#3F6212] hover:underline"
                >
                  <X className="h-3.5 w-3.5" aria-hidden /> Clear all
                </button>
              )}
            </div>

            <div>
              <Label className="text-sm font-semibold">Category</Label>
              <ul className="mt-3 space-y-1.5">
                {categories.map((c) => {
                  const active = current.category === c;
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

            <PillFilter
              label="Rental type"
              options={rentalTypes}
              value={current.rentalType}
              onSelect={(value) => update("rentalType", value)}
            />

            <div>
              <Label className="text-sm font-semibold">Price range</Label>
              <div className="mt-3 flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={current.minPrice}
                  onChange={(e) => update("minPrice", e.target.value)}
                  placeholder="Min"
                  aria-label="Minimum price"
                  className={fieldCls}
                />
                <span className="text-[#1B1F16]/40">-</span>
                <Input
                  type="number"
                  min={0}
                  value={current.maxPrice}
                  onChange={(e) => update("maxPrice", e.target.value)}
                  placeholder="Max"
                  aria-label="Maximum price"
                  className={fieldCls}
                />
              </div>
            </div>

            <PillFilter
              label="Availability"
              options={availabilityOptions}
              value={current.availability}
              onSelect={(value) => update("availability", value)}
            />
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
              <Select value={current.sort} onValueChange={(v: string | null) => update("sort", v ?? initialFilters.sort)}>
                <SelectTrigger className={`${fieldCls} w-[190px]`}>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            /* Loading skeleton */
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="h-[380px] animate-pulse rounded-3xl bg-[#1B1F16]/5" />
              ))}
            </ul>
          ) : fetchError ? (
            <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-white px-6 py-8 text-center text-sm font-medium text-red-700">
              {fetchError}
            </div>
          ) : totalItems === 0 ? (
            /* Empty state */
            <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-[#1B1F16]/20 bg-white px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4E0] text-[#3F6212]">
                <PackageSearch className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-extrabold">No equipment found</h3>
              <p className="mt-1 max-w-sm text-sm text-[#1B1F16]/60">Try changing your search or clearing some filters.</p>
              <Button onClick={reset} className="mt-5 rounded-xl bg-[#7CB518] font-bold text-[#1B1F16] hover:bg-[#6aa00f]">
                Clear filters
              </Button>
            </div>
          ) : (
            children
          )}

          {/* Pagination (optional requirement) */}
          {!loading && !fetchError && totalItems > 0 && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={view.page === 1}
                onClick={() => goToPage(view.page - 1)}
                aria-label="Previous page"
                className={arrowBtnCls}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => goToPage(n)}
                  aria-current={view.page === n ? "page" : undefined}
                  className={`h-9 w-9 rounded-xl text-sm font-bold transition ${
                    view.page === n ? "bg-[#7CB518] text-[#1B1F16]" : "bg-white text-[#1B1F16]/70 hover:bg-[#EEF4E0]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <Button
                variant="outline"
                size="icon"
                disabled={view.page === totalPages}
                onClick={() => goToPage(view.page + 1)}
                aria-label="Next page"
                className={arrowBtnCls}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          )}
        </section>
      </div>
    </>
  );
}