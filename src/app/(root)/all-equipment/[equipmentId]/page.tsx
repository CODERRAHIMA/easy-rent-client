import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { EquipmentDetails, EquipmentRentalType } from "@/types/type";
import EquipmentDetailsView from "@/components/equipment/EquipmentDetailsView";

const EQUIPMENT_API_URL = "http://localhost:5000/equipments";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRentalType(value: unknown): value is EquipmentRentalType {
  return value === "Daily" || value === "Weekly" || value === "Monthly";
}

function isEquipmentDetails(value: unknown): value is EquipmentDetails {
  if (!isRecord(value) || !isRecord(value.owner)) return false;

  const { owner } = value;
  return (
    ["_id", "name", "description", "category", "location", "condition", "brand", "model"].every(
      (key) => typeof value[key] === "string",
    ) &&
    typeof value.rentalPrice === "number" &&
    isRentalType(value.rentalType) &&
    typeof value.availableQuantity === "number" &&
    Array.isArray(value.rentalTerms) &&
    value.rentalTerms.every((term) => typeof term === "string") &&
    typeof owner.name === "string" &&
    typeof owner.email === "string" &&
    (value.image == null || typeof value.image === "string") &&
    ["image", "photo"].every((key) => owner[key] == null || typeof owner[key] === "string") &&
    (owner.phone == null || typeof owner.phone === "string")
  );
}

function getEquipmentDetails(result: unknown): EquipmentDetails | null {
  if (!isRecord(result)) return null;

  const record = isRecord(result.equipment)
    ? result.equipment
    : isRecord(result.data)
      ? result.data
      : result;
  return isEquipmentDetails(record) ? record : null;
}

async function fetchEquipment(
  equipmentId: string,
): Promise<{ equipment: EquipmentDetails } | { error: string }> {
  try {
    const response = await fetch(`${EQUIPMENT_API_URL}/${encodeURIComponent(equipmentId)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        error:
          response.status === 404
            ? "Equipment not found."
            : `Unable to load equipment (HTTP ${response.status}).`,
      };
    }

    const equipment = getEquipmentDetails(await response.json());
    if (!equipment) return { error: "The equipment API returned unexpected data." };

    return { equipment };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to load equipment. Please try again.",
    };
  }
}

export default async function EquipmentDetailsPage({
  params,
}: {
  params: Promise<{ equipmentId: string }>;
}) {
  const { equipmentId } = await params;
  const result = await fetchEquipment(equipmentId);

  if ("error" in result) {
    return (
      <main className="min-h-screen bg-[#F4F4F2] px-5 py-20 text-center text-[#1B1F16]">
        <p role="alert" className="text-sm font-semibold text-red-700">
          {result.error || "Equipment not found."}
        </p>
        <Link
          href="/all-equipment"
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#3F6212] hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to all equipment
        </Link>
      </main>
    );
  }

  return <EquipmentDetailsView equipment={result.equipment} />;
}