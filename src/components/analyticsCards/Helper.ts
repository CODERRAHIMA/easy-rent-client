import { getTokenFromClient } from "@/lib/getTokenFromClient";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export async function fetchData<T>(path: string): Promise<T[]> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load data");
  }

  return Array.isArray(result.data) ? result.data : [];
}

function getLastMonths(count: number) {
  const now = new Date();

  return Array.from({ length: count }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: date.toLocaleString("en-US", { month: "short" }),
    };
  });
}


export function groupByMonth<T>(
  items: T[],
  getDate: (item: T) => string,
  getValue: (item: T) => number,
  dataKey: string,
  count = 6,
) {
  const months = getLastMonths(count);
  const totals = new Map(months.map((m) => [m.key, 0]));

  for (const item of items) {
    const date = new Date(getDate(item));
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (totals.has(key)) {
      totals.set(key, (totals.get(key) ?? 0) + getValue(item));
    }
  }

  return months.map((m) => ({ month: m.month, [dataKey]: totals.get(m.key) ?? 0 }));
}