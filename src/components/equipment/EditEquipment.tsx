"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const API_URL = `${process.env.API_URL}/equipments`;

type Item = {
  _id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  image: string;
  rentalPrice: number;
  rentalType: "Daily" | "Weekly" | "Monthly";
  availableQuantity: number;
  status: "pending" | "approved" | "rejected";
};

type Props = {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (updatedItem: Item) => void;
};

export default function EditEquipmentDialog({
  item,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: item.name,
    brand: item.brand,
    model: item.model,
    category: item.category,
    image: item.image,
    rentalPrice: item.rentalPrice,
    rentalType: item.rentalType,
    availableQuantity: item.availableQuantity,
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = session?.user?.email;

    if (!email) {
      console.log("Please login first");
      return;
    }

    setLoading(true);

    try {
      const token = await getTokenFromClient();
      const response = await fetch(
        `${API_URL}/${item._id}?email=${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            rentalPrice: Number(formData.rentalPrice),
            availableQuantity: Number(formData.availableQuantity),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update equipment");
      }

      onUpdated({
        ...item,
        ...formData,
        rentalPrice: Number(formData.rentalPrice),
        availableQuantity: Number(formData.availableQuantity),
      });

      console.log("Equipment updated successfully");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.log(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>
            Update your equipment information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label>Equipment Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Input
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rental Price</Label>
              <Input
                type="number"
                min="0"
                value={formData.rentalPrice}
                onChange={(e) => handleChange("rentalPrice", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rental Type</Label>
              <Select
                value={formData.rentalType}
                onValueChange={(value) =>
                  handleChange("rentalType", value ?? "")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rental type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available Quantity</Label>
            <Input
              type="number"
              min="0"
              value={formData.availableQuantity}
              onChange={(e) =>
                handleChange("availableQuantity", e.target.value)
              }
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
