import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  variant = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: "default" | "highlight";
}) {
  const highlight = variant === "highlight";

  return (
    <li
      className={`rounded-3xl p-6 ${
        highlight ? "bg-[#7CB518] text-[#1B1F16]" : "border border-[#1B1F16]/10 bg-white"
      }`}
    >
      <span
        className={`flex size-11 items-center justify-center rounded-xl ${
          highlight ? "bg-[#1B1F16]/10" : "bg-[#EEF4E0] text-[#3F6212]"
        }`}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-5 truncate text-3xl font-extrabold leading-none">{value}</p>
      <p className={`mt-2 text-sm ${highlight ? "text-[#1B1F16]/75" : "text-[#1B1F16]/60"}`}>{label}</p>
    </li>
  );
}