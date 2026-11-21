import type { EquipmentFilters } from "@/types/type";

export type SearchParams = Record<string, string | string[] | undefined>;

export const initialFilters: EquipmentFilters = {
  search: "",
  location: "",
  category: "",
  rentalType: "",
  availability: "",
  minPrice: "",
  maxPrice: "",
  sort: "recently added",
};

const first = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

/** Read the filters from the URL (missing values fall back to the defaults). */
export function parseFilters(searchParams: SearchParams): EquipmentFilters {
  const filters = { ...initialFilters };
  for (const key of Object.keys(initialFilters) as (keyof EquipmentFilters)[]) {
    filters[key] = first(searchParams[key]) || initialFilters[key];
  }
  return filters;
}

export function parsePage(searchParams: SearchParams): number {
  const page = Number(first(searchParams.page));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/** Build the URL query string. Defaults are left out to keep the URL clean. */
export function toSearchString(filters: EquipmentFilters, page: number): string {
  const params = new URLSearchParams();
  (Object.entries(filters) as [keyof EquipmentFilters, string][]).forEach(([key, value]) => {
    if (value && value !== initialFilters[key]) params.set(key, value);
  });
  if (page > 1) params.set("page", String(page));
  return params.toString();
}