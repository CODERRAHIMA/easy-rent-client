"use client";

import { Suspense, useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, MapPin, Heart, CalendarClock, BadgeCheck, CheckCircle2, Mail, Phone, Package, Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { EquipmentDetails, EquipmentRentalType } from "@/types/type";

const CURRENCY = "৳";
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

const unit: Record<string, string> = { Daily: "day", Weekly: "week", Monthly: "month" };
const unitPlural: Record<string, string> = { Daily: "days", Weekly: "weeks", Monthly: "months" };
const daysPerPeriod: Record<string, number> = { Daily: 1, Weekly: 7, Monthly: 30 };

const fieldCls =
  "h-11 rounded-xl border-[#1B1F16]/15 bg-white focus-visible:border-[#7CB518] focus-visible:ring-[#7CB518]/25";

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#1B1F16]/10 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-extrabold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-[#F4F4F2] px-5 py-10 text-[#1B1F16] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 animate-pulse rounded-xl bg-[#1B1F16]/10" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-[#1B1F16]/10" />
          <div className="h-96 animate-pulse rounded-3xl bg-[#1B1F16]/10" />
        </div>
      </div>
    </main>
  );
}

const emptyBooking = {
  startDate: "",
  endDate: "",
  quantity: "1",
  phone: "",
  address: "",
  notes: "",
};

function EquipmentDetailsContent() {
  const { equipmentId } = useParams<{ equipmentId: string }>();
  const [equipment, setEquipment] = useState<EquipmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [open, setOpen] = useState(false);
  const [booking, setBooking] = useState(emptyBooking);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadEquipment = async () => {
      setLoading(true);
      setFetchError("");
      setEquipment(null);

      try {
        const response = await fetch(
          `${EQUIPMENT_API_URL}/${encodeURIComponent(equipmentId)}`,
          { signal: controller.signal, cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Equipment not found."
              : `Unable to load equipment (HTTP ${response.status}).`,
          );
        }

        const details = getEquipmentDetails(await response.json());
        if (!details) {
          throw new Error("The equipment API returned unexpected data.");
        }

        setEquipment(details);
      } catch (error) {
        if (controller.signal.aborted) return;
        setFetchError(
          error instanceof Error
            ? error.message
            : "Unable to load equipment. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadEquipment();
    return () => controller.abort();
  }, [equipmentId]);

  if (loading) {
    return <LoadingState />;
  }

  if (fetchError || !equipment) {
    return (
      <main className="min-h-screen bg-[#F4F4F2] px-5 py-20 text-center text-[#1B1F16]">
        <p role="alert" className="text-sm font-semibold text-red-700">
          {fetchError || "Equipment not found."}
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

  const e = equipment;
  const available = e.availableQuantity > 0;
  const today = new Date().toISOString().split("T")[0];
  const setField = (k: keyof typeof emptyBooking) =>
    (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setBooking((b) => ({ ...b, [k]: ev.target.value }));

  // Display-only estimate for the modal. The backend must calculate the real total again.
  const periods = (() => {
    if (!booking.startDate || !booking.endDate) return 0;
    const days = Math.round((+new Date(booking.endDate) - +new Date(booking.startDate)) / 86400000) + 1;
    return days > 0 ? Math.ceil(days / daysPerPeriod[e.rentalType]) : 0;
  })();
  const estimatedTotal = periods * (Number(booking.quantity) || 0) * e.rentalPrice;

  const handleFavorite = () => {
    // TODO: save / remove this equipment in the customer's favorites (database), for example:
    //   POST   /favorites   { equipmentId }
    //   DELETE /favorites/:equipmentId
    // Favorites should show in Customer Dashboard > Favorites.
    setIsFavorite((f) => !f);
  };

  const handleBooking = (ev: FormEvent) => {
    ev.preventDefault();
    setBookingError("");
    if (new Date(booking.endDate) < new Date(booking.startDate)) {
      return setBookingError("End date must be after the start date.");
    }
    if (Number(booking.quantity) > e.availableQuantity) {
      return setBookingError(`Only ${e.availableQuantity} available.`);
    }

    const bookingData = {
      equipmentId: e._id,
      startDate: booking.startDate,
      endDate: booking.endDate,
      requiredQuantity: Number(booking.quantity),
      contactNumber: booking.phone.trim(),
      deliveryAddress: booking.address.trim(),
      additionalNotes: booking.notes.trim(),
      // TODO: add customer info from the session (customerId, name, email)
    };
    console.log("Booking data ready to send:", bookingData);

    // TODO (after confirm):
    // 1. Send bookingData to the backend, which checks availability for these dates and quantity
    // 2. Backend calculates the total amount (rental duration x quantity x price)
    // 3. Create a Stripe Checkout session and redirect the customer to the payment page
    // 4. After successful payment: create the booking record, save the transaction
    //    in the payments collection, and redirect to the payment success page
    setOpen(false);
  };

  const specs = [
    { label: "Brand", value: e.brand },
    { label: "Model", value: e.model },
    { label: "Condition", value: e.condition },
    { label: "Rental type", value: e.rentalType },
  ];

  return (
    <main className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <Link href="/all-equipment" className="inline-flex items-center gap-2 text-sm font-bold text-[#3F6212] hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to all equipment
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* Left: image, description, terms */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#1B1F16]">
              {e.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={e.image}
                  alt={e.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/40">
                  <Wrench className="size-16" aria-hidden="true" />
                </div>
              )}
              <span className="absolute left-4 top-4 rounded-full bg-[#F4F4F2] px-3.5 py-1.5 text-xs font-semibold">
                {e.category}
              </span>
            </div>

            <Card title="About this equipment">
              <p className="text-sm leading-relaxed text-[#1B1F16]/75 sm:text-base">{e.description}</p>
            </Card>

            <Card title="Rental terms and conditions">
              <ul className="space-y-3">
                {e.rentalTerms.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-[#1B1F16]/80">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Right: booking panel + owner */}
          <aside className="space-y-6 lg:sticky lg:top-6">
            <section className="rounded-3xl border border-[#1B1F16]/10 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    available ? "bg-[#7CB518] text-[#1B1F16]" : "bg-[#1B1F16] text-[#F4F4F2]"
                  }`}
                >
                  {available ? "Available" : "Unavailable"}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1B1F16]/60">
                  <Package className="h-4 w-4" aria-hidden /> {e.availableQuantity} in stock
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{e.name}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-[#1B1F16]/70">
                <MapPin className="h-4 w-4 shrink-0 text-[#3F6212]" aria-hidden /> {e.location}
              </p>

              <p className="mt-6 text-4xl font-extrabold leading-none">
                {CURRENCY}{e.rentalPrice.toLocaleString()}
                <span className="text-base font-semibold text-[#1B1F16]/60"> / {unit[e.rentalType]}</span>
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-3">
                {specs.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-[#F4F4F2] px-4 py-3">
                    <dt className="text-xs text-[#1B1F16]/60">{s.label}</dt>
                    <dd className="mt-0.5 text-sm font-bold">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button
                  type="button"
                  disabled={!available}
                  onClick={() => setOpen(true)}
                  className="h-12 flex-1 rounded-xl bg-[#7CB518] text-sm font-bold text-[#1B1F16] hover:bg-[#6aa00f]"
                >
                  <CalendarClock className="h-4 w-4" aria-hidden /> Book now
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFavorite}
                  aria-pressed={isFavorite}
                  className="h-12 flex-1 rounded-xl border-[#1B1F16]/15 bg-white text-sm font-bold hover:border-[#7CB518] hover:bg-white"
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-[#7CB518] text-[#7CB518]" : "text-[#3F6212]"}`} aria-hidden />
                  {isFavorite ? "Saved" : "Add to favorites"}
                </Button>
              </div>
            </section>

            {/* Owner */}
            <section className="rounded-3xl bg-[#1B1F16] p-6 text-[#F4F4F2] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#7CB518]">Equipment owner</p>
              <div className="mt-4 flex items-center gap-4">
                {e.owner.photo || e.owner.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.owner.photo || e.owner.image || ""}
                    alt={e.owner.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7CB518] text-lg font-extrabold text-[#1B1F16]">
                    {e.owner.name[0]}
                  </span>
                )}
                <div>
                  <p className="text-lg font-extrabold">{e.owner.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[#7CB518]">
                    <BadgeCheck className="h-4 w-4" aria-hidden /> Verified owner
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-3 border-t border-[#F4F4F2]/10 pt-5 text-sm text-[#F4F4F2]/75">
                <li className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-[#7CB518]" aria-hidden /> {e.owner.email}</li>
                {e.owner.phone && (
                  <li className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-[#7CB518]" aria-hidden /> {e.owner.phone}</li>
                )}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {/* Booking modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:max-w-xl sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-tight">Book this equipment</DialogTitle>
            <DialogDescription className="text-sm text-[#1B1F16]/70">{e.name}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBooking} className="mt-2 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="startDate" className="text-sm font-semibold">Rental start date</Label>
                <Input id="startDate" type="date" required min={today} value={booking.startDate} onChange={setField("startDate")} className={fieldCls} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate" className="text-sm font-semibold">Rental end date</Label>
                <Input id="endDate" type="date" required min={booking.startDate || today} value={booking.endDate} onChange={setField("endDate")} className={fieldCls} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quantity" className="text-sm font-semibold">Required quantity</Label>
                <Input id="quantity" type="number" required min={1} max={e.availableQuantity} value={booking.quantity} onChange={setField("quantity")} className={fieldCls} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-semibold">Contact number</Label>
                <Input id="phone" type="tel" required value={booking.phone} onChange={setField("phone")} placeholder="+880 1XXX XXXXXX" className={fieldCls} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-sm font-semibold">Delivery address</Label>
              <Input id="address" required value={booking.address} onChange={setField("address")} placeholder="House, road, area, city" className={fieldCls} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm font-semibold">
                Additional notes <span className="font-normal text-[#1B1F16]/50">(optional)</span>
              </Label>
              <Textarea id="notes" rows={3} value={booking.notes} onChange={setField("notes")} placeholder="Anything the owner should know?" className="rounded-xl border-[#1B1F16]/15 bg-white focus-visible:border-[#7CB518] focus-visible:ring-[#7CB518]/25" />
            </div>

            {/* Summary */}
            <div className="rounded-2xl bg-[#EEF4E0] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#1B1F16]/70">
                  {periods > 0 ? `${periods} ${periods === 1 ? unit[e.rentalType] : unitPlural[e.rentalType]} x ${booking.quantity || 0} x ${CURRENCY}${e.rentalPrice.toLocaleString()}` : "Select your dates"}
                </span>
                <span className="text-xl font-extrabold">{CURRENCY}{estimatedTotal.toLocaleString()}</span>
              </div>
              <p className="mt-1 text-xs text-[#1B1F16]/60">Estimated total. The final amount is confirmed at checkout.</p>
            </div>

            {bookingError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {bookingError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-12 rounded-xl border-[#1B1F16]/15 bg-white px-6 font-bold hover:bg-[#F4F4F2]">
                Cancel
              </Button>
              <Button type="submit" className="h-12 rounded-xl bg-[#7CB518] px-8 text-sm font-bold text-[#1B1F16] hover:bg-[#6aa00f]">
                Confirm and pay
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function EquipmentDetailsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EquipmentDetailsContent />
    </Suspense>
  );
}