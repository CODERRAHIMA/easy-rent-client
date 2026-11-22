"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import type { OwnerEquipment } from "@/types/type";

type DeleteEquipmentProps = {
  equipment: OwnerEquipment | null;
  email?: string;
  onClose: () => void;
  onDeleted: (id: string) => void;
  onError: (message: string) => void;
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/equipments`;

export default function DeleteEquipment({
  equipment,
  email,
  onClose,
  onDeleted,
  onError,
}: DeleteEquipmentProps) {
  const handleDelete = async () => {
    if (!equipment) return;

    if (!email) {
      onError("Please login first");
      return;
    }

    try {
      onError("");
      const token = await getTokenFromClient();

      const response = await fetch(
        `${API_URL}/${equipment._id}?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete equipment");
      }

      onDeleted(equipment._id);
    } catch (error) {
      console.error("Delete equipment error:", error);
      onError(error instanceof Error ? error.message : "Failed to delete equipment");
    }
  };

  return (
    <Dialog
      open={!!equipment}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="rounded-3xl bg-white p-6 sm:max-w-md sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold tracking-tight">
            Delete this equipment?
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-[#1B1F16]/70">
            <span className="font-bold text-[#1B1F16]">{equipment?.name}</span>{" "}
            will be removed from your listings. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11 rounded-xl border-[#1B1F16]/15 bg-white px-6 font-bold hover:bg-[#F4F4F2]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            className="h-11 rounded-xl bg-red-600 px-6 font-bold text-white hover:bg-red-700"
          >
            Yes, delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}