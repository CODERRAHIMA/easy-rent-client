"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Plus, Eye, Pencil, Trash2, Wrench, PackageOpen } from "lucide-react";

import DeleteEquipment from "@/components/equipment/DeleteEquipment";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import type { EquipmentStatus, OwnerEquipment } from "@/types/type";
import EditEquipmentDialog from "@/components/equipment/EditEquipment";

const CURRENCY = "৳";

const API_URL = "http://localhost:5000/equipments";

const unit = {
  Daily: "day",
  Weekly: "week",
  Monthly: "month",
} as const;

const statusStyle: Record<
  EquipmentStatus,
  { label: string; badge: string; dot: string }
> = {
  approved: {
    label: "Approved",
    badge: "bg-[#EEF4E0] text-[#3F6212]",
    dot: "bg-[#7CB518]",
  },
  pending: {
    label: "Pending",
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
  },
  rejected: {
    label: "Rejected",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
};

const tabs: { value: EquipmentStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

const iconBtn =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#1B1F16]/10 bg-white text-[#1B1F16]/70 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3F6212]";

export default function OwnerMyEquipmentsPage() {
  // Get logged-in user's session
  const { data: session, isPending } = authClient.useSession();

  // Equipment states
  const [equipment, setEquipment] = useState<OwnerEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI states
  const [filter, setFilter] = useState<EquipmentStatus | "all">("all");
  const [deleteTarget, setDeleteTarget] = useState<OwnerEquipment | null>(null);
  const [editTarget, setEditTarget] = useState<OwnerEquipment | null>(null);

  // Fetch logged-in owner's equipments
  useEffect(() => {
    const fetchMyEquipments = async () => {
      if (isPending) return;

      const email = session?.user?.email;

      if (!email) {
        setEquipment([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const token = await getTokenFromClient();

        const response = await fetch(
          `${API_URL}/my-equipment?email=${encodeURIComponent(email)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch equipments");
        }

        setEquipment(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error("Fetch my equipments error:", error);

        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyEquipments();
  }, [session?.user?.email, isPending]);

  // Count equipment by status
  const counts = equipment.reduce<Record<EquipmentStatus, number>>(
    (total, item) => {
      total[item.status] += 1;
      return total;
    },
    { approved: 0, pending: 0, rejected: 0 },
  );

  const stats = [
    { label: "Total equipment", value: equipment.length },
    { label: "Approved", value: counts.approved },
    { label: "Pending", value: counts.pending },
    { label: "Rejected", value: counts.rejected },
  ];

  // Filter equipment by status
  const rows = equipment.filter(
    (item) => filter === "all" || item.status === filter,
  );

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              My equipments
            </h1>

            <p className="mt-2 max-w-xl text-sm text-[#1B1F16]/70">
              Manage the equipment you listed for rent and track its approval
              status.
            </p>
          </div>

          <Link
            href="/owner/add-equipment"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7CB518] px-6 text-sm font-bold text-black transition hover:bg-[#6aa00f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add equipment
          </Link>
        </div>

        {/* Stats */}
        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <li
              key={s.label}
              className="rounded-2xl border border-[#1B1F16]/10 bg-white p-5"
            >
              <p className="text-3xl font-extrabold leading-none">{s.value}</p>

              <p className="mt-2 text-sm text-[#1B1F16]/60">{s.label}</p>
            </li>
          ))}
        </ul>

        {/* Table card */}
        <section className="mt-6 rounded-3xl border border-[#1B1F16]/10 bg-white">
          {/* Status filter */}
          <div className="flex flex-wrap gap-2 border-b border-[#1B1F16]/10 p-4 sm:p-5">
            {tabs.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setFilter(t.value)}
                aria-pressed={filter === t.value}
                className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                  filter === t.value
                    ? "border-[#1B1F16] bg-[#1B1F16] text-[#F4F4F2]"
                    : "border-[#1B1F16]/15 bg-white text-[#1B1F16]/70 hover:border-[#7CB518]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && <p className="px-5 py-3 text-sm text-red-600">{error}</p>}

          {/* Loading */}
          {loading ? (
            <ul className="space-y-3 p-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <li
                  key={i}
                  className="h-16 animate-pulse rounded-2xl bg-[#1B1F16]/5"
                />
              ))}
            </ul>
          ) : rows.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4E0] text-[#3F6212]">
                <PackageOpen className="h-7 w-7" aria-hidden />
              </span>

              <h2 className="mt-4 text-lg font-extrabold">
                {equipment.length === 0
                  ? "You have not added any equipment yet"
                  : "No equipment in this status"}
              </h2>

              <p className="mt-1 max-w-sm text-sm text-[#1B1F16]/60">
                {equipment.length === 0
                  ? "List your first item and start earning from rentals."
                  : "Try another status filter."}
              </p>

              {equipment.length === 0 && (
                <Link
                  href="/dashboard/owner/add-equipment"
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#7CB518] px-6 text-sm font-bold text-[#1B1F16] hover:bg-[#6aa00f]"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Add equipment
                </Link>
              )}
            </div>
          ) : (
            /* Equipment table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1B1F16]/10 text-xs uppercase tracking-wider text-[#1B1F16]/50">
                    <th className="px-5 py-4 font-bold">Equipment</th>
                    <th className="px-5 py-4 font-bold">Category</th>
                    <th className="px-5 py-4 font-bold">Rental price</th>
                    <th className="px-5 py-4 font-bold">Quantity</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((item) => {
                    const st = statusStyle[item.status];

                    return (
                      <tr
                        key={item._id}
                        className="border-b border-[#1B1F16]/5 transition last:border-0 hover:bg-[#F4F4F2]/60"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#EEF4E0]">
                              {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.image}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#3F6212]/50">
                                  <Wrench className="h-5 w-5" aria-hidden />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-bold">{item.name}</p>

                              <p className="truncate text-xs text-[#1B1F16]/60">
                                {item.brand} · {item.model}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-[#1B1F16]/80">
                          {item.category}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-bold">
                          {CURRENCY}
                          {item.rentalPrice.toLocaleString()}

                          <span className="font-normal text-[#1B1F16]/60">
                            {" "}
                            / {unit[item.rentalType]}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-semibold">
                          {item.availableQuantity}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${st.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${st.dot}`}
                            />
                            {st.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/all-equipment/${item._id}`}
                              aria-label={`View details of ${item.name}`}
                              title="View details"
                              className={`${iconBtn} hover:border-[#7CB518] hover:text-[#3F6212]`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setEditTarget(item)}
                              aria-label={`Update ${item.name}`}
                              title="Update"
                              className={`${iconBtn} hover:border-[#7CB518] hover:text-[#3F6212]`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              aria-label={`Delete ${item.name}`}
                              title="Delete"
                              className={`${iconBtn} hover:border-red-300 hover:bg-red-50 hover:text-red-600`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {editTarget && (
        <EditEquipmentDialog
          item={editTarget}
          open={!!editTarget}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null);
          }}
          onUpdated={(updatedItem) => {
            setEquipment((prevItems) =>
              prevItems.map((item) =>
                item._id === updatedItem._id
                  ? { ...item, ...updatedItem }
                  : item,
              ),
            );
            setEditTarget(null);
          }}
        />
      )}

      <DeleteEquipment
        equipment={deleteTarget}
        email={session?.user?.email}
        onClose={() => setDeleteTarget(null)}
        onDeleted={(id) => {
          setEquipment((items) => items.filter((item) => item._id !== id));
          setDeleteTarget(null);
        }}
        onError={setError}
      />
    </div>
  );
}
