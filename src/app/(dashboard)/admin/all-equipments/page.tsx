"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, Trash2, Wrench, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import type { EquipmentStatus, OwnerEquipment } from "@/types/type";
import DeleteEquipment from "@/components/equipment/DeleteEquipment";
import EditEquipmentDialog from "@/components/equipment/EditEquipment";
import Link from "next/link";

const CURRENCY = "৳";
const API_URL = `${process.env.API_URL}/equipments`;

// An equipment item, plus the owner info that the backend sends
type AdminEquipment = OwnerEquipment & {
  owner?: { name: string; email: string };
};

const unit = { Daily: "day", Weekly: "week", Monthly: "month" } as const;

const statusStyle: Record<EquipmentStatus, { label: string; badge: string; dot: string }> = {
  approved: { label: "Approved", badge: "bg-[#EEF4E0] text-[#3F6212]", dot: "bg-[#7CB518]" },
  pending: { label: "Pending", badge: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  rejected: { label: "Rejected", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const statuses: EquipmentStatus[] = ["pending", "approved", "rejected"];

const actionBtn =
  "inline-flex size-9 items-center justify-center rounded-lg border border-[#1B1F16]/10 bg-white text-[#1B1F16]/70 transition disabled:cursor-not-allowed disabled:opacity-40";

export default function AdminAllEquipmentsPage() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [equipment, setEquipment] = useState<AdminEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editTarget, setEditTarget] = useState<AdminEquipment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminEquipment | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (isPending) return;

      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const token = await getTokenFromClient();
        const response = await fetch(`${API_URL}/admin/all?email=${encodeURIComponent(email)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch equipment");
        }

        setEquipment(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [email, isPending]);

  const handleStatusChange = async (item: AdminEquipment, newStatus: EquipmentStatus) => {
    try {
      setError("");
      const token = await getTokenFromClient();

      const response = await fetch(`${API_URL}/${item._id}/status?email=${encodeURIComponent(email!)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update status");
      }

      setEquipment(equipment.map((e) => (e._id === item._id ? { ...e, status: newStatus } : e)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const text = search.trim().toLowerCase();
  const filteredEquipment = equipment.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(text) ||
      (item.owner?.name ?? "").toLowerCase().includes(text) ||
      (item.owner?.email ?? "").toLowerCase().includes(text);
    return matchesStatus && matchesSearch;
  });

  const stats = [
    { label: "Total equipment", value: equipment.length },
    { label: "Pending", value: equipment.filter((e) => e.status === "pending").length },
    { label: "Approved", value: equipment.filter((e) => e.status === "approved").length },
    { label: "Rejected", value: equipment.filter((e) => e.status === "rejected").length },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">All equipments</h1>
        <p className="mt-2 text-sm text-[#1B1F16]/70">
          Review equipment added by owners. Approve it, reject it, update it or delete it.
        </p>

        {/* Stat cards */}
        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="rounded-2xl border border-[#1B1F16]/10 bg-white p-5">
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="mt-2 text-sm text-[#1B1F16]/60">{s.label}</p>
            </li>
          ))}
        </ul>

        {/* Table card */}
        <section className="mt-6 rounded-3xl border border-[#1B1F16]/10 bg-white">
          {/* Search + filter */}
          <div className="flex flex-col gap-4 border-b border-[#1B1F16]/10 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by equipment or owner"
              className="h-11 rounded-xl border-[#1B1F16]/15 lg:w-80"
            />

            <div className="flex flex-wrap gap-2">
              {["all", ...statuses].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold capitalize transition ${
                    statusFilter === status
                      ? "border-[#1B1F16] bg-[#1B1F16] text-[#F4F4F2]"
                      : "border-[#1B1F16]/15 bg-white text-[#1B1F16]/70 hover:border-[#7CB518]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && <p className="px-5 py-3 text-sm text-red-600">{error}</p>}

          {/* Loading / empty / table */}
          {loading ? (
            <p className="px-5 py-16 text-center text-[#1B1F16]/60">Loading equipment...</p>
          ) : filteredEquipment.length === 0 ? (
            <p className="px-5 py-16 text-center text-[#1B1F16]/60">No equipment found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1B1F16]/10 text-xs uppercase tracking-wider text-[#1B1F16]/50">
                    <th className="px-5 py-4 font-bold">Equipment</th>
                    <th className="px-5 py-4 font-bold">Category</th>
                    <th className="px-5 py-4 font-bold">Owner</th>
                    <th className="px-5 py-4 font-bold">Rental price</th>
                    <th className="px-5 py-4 font-bold">Quantity</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEquipment.map((item) => {
                    const status = statusStyle[item.status];

                    return (
                      <tr key={item._id} className="border-b border-[#1B1F16]/5 last:border-0 hover:bg-[#F4F4F2]/60">
                        {/* Equipment */}
                        <td className="px-5 py-4">
                          <Link href={`/all-equipment/${item._id}`}>
                            <div className="flex items-center gap-3">
                            <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-[#EEF4E0]">
                              {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.image} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#3F6212]/50">
                                  <Wrench className="size-5" />
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
                          </Link>
                        </td>

                        <td className="px-5 py-4 text-[#1B1F16]/80">{item.category}</td>

                        {/* Owner */}
                        <td className="px-5 py-4">
                          <p className="font-semibold">{item.owner?.name ?? "-"}</p>
                          <p className="text-xs text-[#1B1F16]/60">{item.owner?.email}</p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-bold">
                          {CURRENCY}
                          {item.rentalPrice.toLocaleString()}
                          <span className="font-normal text-[#1B1F16]/60"> / {unit[item.rentalType]}</span>
                        </td>

                        <td className="px-5 py-4 font-semibold">{item.availableQuantity}</td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${status.badge}`}
                          >
                            <span className={`size-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </td>

                        {/* Actions: approve, reject, update, delete */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={item.status === "approved"}
                              onClick={() => handleStatusChange(item, "approved")}
                              title="Approve"
                              aria-label={`Approve ${item.name}`}
                              className={`${actionBtn} hover:border-[#7CB518] hover:bg-[#EEF4E0] hover:text-[#3F6212]`}
                            >
                              <Check className="size-4" />
                            </button>

                            <button
                              type="button"
                              disabled={item.status === "rejected"}
                              onClick={() => handleStatusChange(item, "rejected")}
                              title="Reject"
                              aria-label={`Reject ${item.name}`}
                              className={`${actionBtn} hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700`}
                            >
                              <X className="size-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditTarget(item)}
                              title="Update"
                              aria-label={`Update ${item.name}`}
                              className={`${actionBtn} hover:border-[#7CB518] hover:text-[#3F6212]`}
                            >
                              <Pencil className="size-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              title="Delete"
                              aria-label={`Delete ${item.name}`}
                              className={`${actionBtn} hover:border-red-300 hover:bg-red-50 hover:text-red-600`}
                            >
                              <Trash2 className="size-4" />
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

      {/* Update dialog (your existing component) */}
      {editTarget && (
        <EditEquipmentDialog
          item={editTarget}
          open={!!editTarget}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null);
          }}
          onUpdated={(updatedItem) => {
            setEquipment(equipment.map((e) => (e._id === updatedItem._id ? { ...e, ...updatedItem } : e)));
            setEditTarget(null);
          }}
        />
      )}

      {/* Delete dialog (your existing component) */}
      <DeleteEquipment
        equipment={deleteTarget}
        email={email}
        onClose={() => setDeleteTarget(null)}
        onDeleted={(id) => {
          setEquipment(equipment.filter((e) => e._id !== id));
          setDeleteTarget(null);
        }}
        onError={setError}
      />
    </div>
  );
}