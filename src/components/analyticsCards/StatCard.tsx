import type { LucideIcon } from "lucide-react";

/**
 * Compact number card (icon on the left, number and label on the right).
 * Place at: components/analyticsCards/StatCard.tsx
 * Use variant="highlight" for the most important number (earnings / revenue).
 */
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
      className={`flex items-center gap-4 rounded-2xl p-4 ${
        highlight ? "bg-[#1B1F16] text-white" : "border border-[#1B1F16]/10 bg-white"
      }`}
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
          highlight ? "bg-[#e4e8db] text-black" : "bg-[#EEF4E0] text-[#3F6212]"
        }`}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>

      <div className="min-w-0">
        <p className="truncate text-sm sm:text-2xl font-extrabold leading-none">{value}</p>
        <p className={`mt-1.5 truncate text-[10px] sm:text-xs font-medium ${highlight ? "text-white" : "text-[#1B1F16]/60"}`}>
          {label}
        </p>
      </div>
    </li>
  );
}