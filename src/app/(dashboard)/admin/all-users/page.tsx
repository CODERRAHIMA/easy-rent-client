"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// What one user looks like (rename the fields if your database uses different names)
type User = {
  _id: string;
  name: string;
  email: string;
  role: string; // "customer" | "owner" | "admin"
  createdAt: string;
};

const roles = ["customer", "owner", "admin"];

// Colors for the role dropdown
const roleColor: Record<string, string> = {
  customer: "border-[#1B1F16]/15 bg-white text-[#1B1F16]",
  owner: "border-[#7CB518]/40 bg-[#EEF4E0] text-[#3F6212]",
  admin: "border-[#1B1F16] bg-[#1B1F16] text-[#F4F4F2]",
};

export default function AdminAllUserPage() {
  // 1. Get the logged in admin
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  // 2. States
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  // 3. Load all users when the page opens
  useEffect(() => {
  const fetchUsers = async () => {
    if (isPending) return;

    if (!email) {
      setLoading(false);
      return;
    }

    try {
      const token = await getTokenFromClient();

      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch users");
      }

      setUsers(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [email, isPending]);

  // 4. Change a user's role
  const handleRoleChange = async (user: User, newRole: string) => {
    try {
      setError("");

      const token = await getTokenFromClient();

      const response = await fetch(
        `${API_URL}/users/${user._id}/role?email=${encodeURIComponent(email!)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to change role");
      }

      // Update the role in the list on the screen
      setUsers(
        users.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)),
      );
      toast.success("User role updated.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to change role";
      setError(message);
      toast.error(message);
    }
  };

  // 5. Delete a user
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setError("");

      const token = await getTokenFromClient();

      const response = await fetch(
        `${API_URL}/users/${deleteTarget._id}?email=${encodeURIComponent(email!)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      // Remove the user from the list on the screen
      setUsers(users.filter((u) => u._id !== deleteTarget._id));
      toast.success("User deleted.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete user";
      setError(message);
      toast.error(message);
    } finally {
      setDeleteTarget(null);
    }
  };

  // 6. Search + role filter
  const text = search.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text);
    return matchesRole && matchesSearch;
  });

  // 7. Numbers for the cards
  const stats = [
    { label: "Total users", value: users.length },
    {
      label: "Customers",
      value: users.filter((u) => u.role === "customer").length,
    },
    { label: "Owners", value: users.filter((u) => u.role === "owner").length },
    { label: "Admins", value: users.filter((u) => u.role === "admin").length },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Registered Users
        </h1>
        <p className="mt-2 text-sm text-[#1B1F16]/70">
          See every registered user, change their role, or remove accounts.
        </p>

        {/* Stat cards */}
        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <li
              key={s.label}
              className="rounded-2xl border border-[#1B1F16]/10 bg-white p-5"
            >
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
              placeholder="Search by name or email"
              className="h-11 rounded-xl border-[#1B1F16]/15 lg:w-80"
            />

            <div className="flex flex-wrap gap-2">
              {["all", ...roles].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRoleFilter(role)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold capitalize transition ${
                    roleFilter === role
                      ? "border-[#1B1F16] bg-[#1B1F16] text-[#F4F4F2]"
                      : "border-[#1B1F16]/15 bg-white text-[#1B1F16]/70 hover:border-[#7CB518]"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && <p className="px-5 py-3 text-sm text-red-600">{error}</p>}

          {/* Loading / empty / table */}
          {loading ? (
            <p className="px-5 py-16 text-center text-[#1B1F16]/60">
              Loading users...
            </p>
          ) : filteredUsers.length === 0 ? (
            <p className="px-5 py-16 text-center text-[#1B1F16]/60">
              No users found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1B1F16]/10 text-xs uppercase tracking-wider text-[#1B1F16]/50">
                    <th className="px-5 py-4 font-bold">Name</th>
                    <th className="px-5 py-4 font-bold">Email</th>
                    <th className="px-5 py-4 font-bold">Role</th>
                    <th className="px-5 py-4 font-bold">Registered</th>
                    <th className="px-5 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    // You cannot change or delete your own account
                    const isMe = user.email === email;

                    return (
                      <tr
                        key={user._id}
                        className="border-b border-[#1B1F16]/5 last:border-0 hover:bg-[#F4F4F2]/60"
                      >
                        <td className="px-5 py-4 font-bold">
                          {user.name}
                          {isMe && (
                            <span className="ml-2 text-xs font-semibold text-[#3F6212]">
                              (You)
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-[#1B1F16]/80">
                          {user.email}
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={user.role}
                            disabled={isMe}
                            onChange={(e) =>
                              handleRoleChange(user, e.target.value)
                            }
                            aria-label={`Change role of ${user.name}`}
                            className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize disabled:opacity-60 ${roleColor[user.role]}`}
                          >
                            {roles.map((role) => (
                              <option
                                key={role}
                                value={role}
                                className="bg-white text-[#1B1F16]"
                              >
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-5 py-4 text-[#1B1F16]/80">
                          {new Date(user.createdAt).toLocaleDateString("en-GB")}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            disabled={isMe}
                            onClick={() => setDeleteTarget(user)}
                            aria-label={`Delete ${user.name}`}
                            title="Delete user"
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-[#1B1F16]/10 text-[#1B1F16]/70 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 className="size-4" />
                          </button>
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

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="rounded-3xl bg-white p-6 sm:max-w-md sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">
              Delete this user?
            </DialogTitle>
            <DialogDescription className="text-sm text-[#1B1F16]/70">
              {deleteTarget?.name} ({deleteTarget?.email}) will be removed. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="h-11 rounded-xl px-6 font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="h-11 rounded-xl bg-red-600 px-6 font-bold text-white hover:bg-red-700"
            >
              Yes, delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
