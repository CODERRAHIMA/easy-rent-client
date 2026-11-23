
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CalendarClock } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { EquipmentDetails, EquipmentRentalType } from "@/types/type";
import { useSession } from "@/lib/auth-client";
import { createBooking } from "@/lib/booking";

const CURRENCY = "৳";
const MS_PER_DAY = 86_400_000;

const unit: Record<EquipmentRentalType, string> = {
  Daily: "day",
  Weekly: "week",
  Monthly: "month",
};

const unitPlural: Record<EquipmentRentalType, string> = {
  Daily: "days",
  Weekly: "weeks",
  Monthly: "months",
};

const daysPerPeriod: Record<EquipmentRentalType, number> = {
  Daily: 1,
  Weekly: 7,
  Monthly: 30,
};

const fieldCls =
  "h-11 rounded-xl border-[#1B1F16]/15 bg-white focus-visible:border-[#7CB518] focus-visible:ring-[#7CB518]/25";

const emptyBooking = {
  startDate: "",
  endDate: "",
  quantity: "1",
  phone: "",
  address: "",
  notes: "",
};

type BookingForm = typeof emptyBooking;

function getPeriods(
  startDate: string,
  endDate: string,
  rentalType: EquipmentRentalType,
) {
  if (!startDate || !endDate) return 0;

  const days =
    Math.round(
      (+new Date(endDate) - +new Date(startDate)) / MS_PER_DAY,
    ) + 1;

  return days > 0 ? Math.ceil(days / daysPerPeriod[rentalType]) : 0;
}

export default function EquipmentBookingDialog({
  equipment,
  disabled,
}: {
  equipment: EquipmentDetails;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [booking, setBooking] = useState<BookingForm>(emptyBooking);
  const [bookingError, setBookingError] = useState("");
  const [today, setToday] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;

  const handleOpen = () => {
    setBookingError("");
    setToday(new Date().toISOString().split("T")[0]);
    setOpen(true);
  };

  const setField =
    (key: keyof BookingForm) =>
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setBooking((current) => ({
        ...current,
        [key]: ev.target.value,
      }));
    };

  const periods = getPeriods(
    booking.startDate,
    booking.endDate,
    equipment.rentalType,
  );

  const quantity = Number(booking.quantity) || 0;

  const estimatedTotal =
    periods * quantity * equipment.rentalPrice;

  const handleCreateBooking = async (ev: FormEvent) => {
    ev.preventDefault();
    setBookingError("");

    // Check authentication
    if (!user) {
      setBookingError("Please login before booking.");
      return;
    }

    if (!user.id || !user.email) {
      setBookingError("Unable to identify your account. Please login again.");
      return;
    }

    // Validate dates
    if (!booking.startDate || !booking.endDate) {
      setBookingError("Please select your rental dates.");
      return;
    }

    if (
      new Date(booking.endDate) < new Date(booking.startDate)
    ) {
      setBookingError("End date must be after the start date.");
      return;
    }

    // Validate quantity
    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      setBookingError("Please enter a valid quantity.");
      return;
    }

    if (quantity > equipment.availableQuantity) {
      setBookingError(
        `Only ${equipment.availableQuantity} available.`,
      );
      return;
    }

    if (periods <= 0) {
      setBookingError("Please select valid rental dates.");
      return;
    }

    if (!booking.phone.trim() || !booking.address.trim()) {
      setBookingError(
        "Please provide your contact number and delivery address.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const bookingData = {
        equipmentId: equipment._id,
        userId: user.id,
        userEmail: user.email,
        quantity,
        startDate: booking.startDate,
        endDate: booking.endDate,
        contactNumber: booking.phone.trim(),
        deliveryAddress: booking.address.trim(),
        additionalNotes: booking.notes.trim(),
      };

      const result = await createBooking(bookingData);

      if (!result.success) {
        const message = result.message || "Unable to create booking. Please try again.";
        setBookingError(message);
        toast.error(message);
        return;
      }

      if (!result.url) {
        setBookingError("Stripe checkout URL was not received.");
        toast.error("Stripe checkout URL was not received.");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = result.url;
    } catch (error) {
      console.error("Booking submission error:", error);
      const message = "Something went wrong. Please try again.";
      setBookingError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className="h-12 flex-1 cursor-pointer rounded-xl bg-[#7CB518] text-sm font-bold text-[#1B1F16] hover:bg-[#6aa00f] disabled:cursor-not-allowed disabled:opacity-70 disabled:border disabled:border-gray-500"
      >
        <CalendarClock className="h-4 w-4" aria-hidden />
        Book now
      </Button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!isSubmitting) setOpen(value);
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:max-w-xl sm:p-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-tight">
              Book this equipment
            </DialogTitle>

            <DialogDescription className="text-sm text-[#1B1F16]/70">
              {equipment.name}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleCreateBooking}
            className="mt-1 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="startDate"
                  className="text-sm font-semibold"
                >
                  Rental start date
                </Label>

                <Input
                  id="startDate"
                  type="date"
                  required
                  min={today}
                  value={booking.startDate}
                  onChange={setField("startDate")}
                  className={fieldCls}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="endDate"
                  className="text-sm font-semibold"
                >
                  Rental end date
                </Label>

                <Input
                  id="endDate"
                  type="date"
                  required
                  min={booking.startDate || today}
                  value={booking.endDate}
                  onChange={setField("endDate")}
                  className={fieldCls}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="quantity"
                  className="text-sm font-semibold"
                >
                  Quantity (max: {equipment.availableQuantity})
                </Label>

                <Input
                  id="quantity"
                  type="number"
                  required
                  min={1}
                  max={equipment.availableQuantity}
                  step={1}
                  value={booking.quantity}
                  onChange={setField("quantity")}
                  className={fieldCls}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold"
                >
                  Contact number
                </Label>

                <Input
                  id="phone"
                  type="tel"
                  required
                  value={booking.phone}
                  onChange={setField("phone")}
                  placeholder="+880 1XXX XXXXXX"
                  className={fieldCls}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="address"
                className="text-sm font-semibold"
              >
                Delivery address
              </Label>

              <Input
                id="address"
                required
                value={booking.address}
                onChange={setField("address")}
                placeholder="House, road, area, city"
                className={fieldCls}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="notes"
                className="text-sm font-semibold"
              >
                Additional notes{" "}
                <span className="font-normal text-[#1B1F16]/50">
                  (optional)
                </span>
              </Label>

              <Textarea
                id="notes"
                rows={3}
                value={booking.notes}
                onChange={setField("notes")}
                placeholder="Anything the owner should know?"
                className="rounded-xl border-[#1B1F16]/15 bg-white focus-visible:border-[#7CB518] focus-visible:ring-[#7CB518]/25"
              />
            </div>

            <div className="rounded-2xl bg-[#EEF4E0] p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#1B1F16]/70">
                  {periods > 0
                    ? `${periods} ${
                        periods === 1
                          ? unit[equipment.rentalType]
                          : unitPlural[equipment.rentalType]
                      } x ${quantity} x ${CURRENCY}${equipment.rentalPrice.toLocaleString()}`
                    : "Select your dates"}
                </span>

                <span className="text-xl font-extrabold">
                  {CURRENCY}
                  {estimatedTotal.toLocaleString()}
                </span>
              </div>

              <p className="mt-1 text-xs text-[#1B1F16]/60">
                Estimated total. The final amount is confirmed at checkout.
              </p>
            </div>

            {bookingError && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {bookingError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setOpen(false)}
                className="h-12 rounded-xl border-[#1B1F16]/15 bg-white px-6 font-bold hover:bg-[#F4F4F2]"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-xl bg-[#7CB518] px-8 text-sm font-bold text-[#1B1F16] hover:bg-[#6aa00f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Processing..." : "Confirm and pay"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
