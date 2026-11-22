import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ViewDetailsButton({
  equipmentId,
}: {
  equipmentId: string;
}) {
  return (
    <Link
      href={`/all-equipment/${equipmentId}`}
      className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1B1F16] text-sm font-bold text-[#F4F4F2] transition hover:bg-[#2d3326] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
    >
      View details <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}
