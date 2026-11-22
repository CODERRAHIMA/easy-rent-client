"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  BadgeCheck,
  CheckCircle2,
  Mail,
  Phone,
  Package,
  Wrench,
} from "lucide-react";
import type { EquipmentDetails, EquipmentRentalType } from "@/types/type";
import { useSession } from "@/lib/auth-client";
import EquipmentBookingDialog from "@/app/(root)/booking/EquipmentBookingDialog";

const CURRENCY = "৳";

const unit: Record<EquipmentRentalType, string> = {
  Daily: "day",
  Weekly: "week",
  Monthly: "month",
};
function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#1B1F16]/10 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-extrabold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function EquipmentDetailsView({
  equipment,
}: {
  equipment: EquipmentDetails;
}) {
  const { data: session } = useSession();

  const isCustomer = session?.user?.role === "customer";

  const available = equipment.availableQuantity > 0;
  const ownerPhoto = equipment.owner.photo || equipment.owner.image;

  const specs = [
    { label: "Brand", value: equipment.brand },
    { label: "Model", value: equipment.model },
    { label: "Condition", value: equipment.condition },
    { label: "Rental type", value: equipment.rentalType },
  ];

  return (
    <main className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <Link
          href="/all-equipment"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#3F6212] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to all equipment
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* Left: image, description, terms */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#1B1F16]">
              {equipment.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/40">
                  <Wrench className="size-16" aria-hidden="true" />
                </div>
              )}
              <span className="absolute left-4 top-4 rounded-full bg-[#F4F4F2] px-3.5 py-1.5 text-xs font-semibold">
                {equipment.category}
              </span>
            </div>

            <Card title="About this equipment">
              <p className="text-sm leading-relaxed text-[#1B1F16]/75 sm:text-base">
                {equipment.description}
              </p>
            </Card>

            <Card title="Rental terms and conditions">
              <ul className="space-y-3">
                {equipment.rentalTerms.map((term) => (
                  <li
                    key={term}
                    className="flex items-start gap-3 text-sm text-[#1B1F16]/80"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#3F6212]"
                      aria-hidden
                    />
                    {term}
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
                    available
                      ? "bg-[#7CB518] text-[#1B1F16]"
                      : "bg-[#1B1F16] text-[#F4F4F2]"
                  }`}
                >
                  {available ? "Available" : "Unavailable"}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1B1F16]/60">
                  <Package className="h-4 w-4" aria-hidden />{" "}
                  {equipment.availableQuantity} in stock
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                {equipment.name}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-[#1B1F16]/70">
                <MapPin
                  className="h-4 w-4 shrink-0 text-[#3F6212]"
                  aria-hidden
                />{" "}
                {equipment.location}
              </p>

              <p className="mt-6 text-4xl font-extrabold leading-none">
                {CURRENCY}
                {equipment.rentalPrice.toLocaleString()}
                <span className="text-base font-semibold text-[#1B1F16]/60">
                  {" "}
                  / {unit[equipment.rentalType]}
                </span>
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-3">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl bg-[#F4F4F2] px-4 py-3"
                  >
                    <dt className="text-xs text-[#1B1F16]/60">{s.label}</dt>
                    <dd className="mt-0.5 text-sm font-bold">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <EquipmentBookingDialog
                  equipment={equipment}
                  disabled={!available || !isCustomer}
                />
              </div>
            </section>

            {/* Owner */}
            <section className="rounded-3xl bg-[#1B1F16] p-6 text-[#F4F4F2] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#7CB518]">
                Equipment owner
              </p>
              <div className="mt-4 flex items-center gap-4">
                {ownerPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ownerPhoto}
                    alt={equipment.owner.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7CB518] text-lg font-extrabold text-[#1B1F16]">
                    {equipment.owner.name[0]}
                  </span>
                )}
                <div>
                  <p className="text-lg font-extrabold">
                    {equipment.owner.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[#7CB518]">
                    <BadgeCheck className="h-4 w-4" aria-hidden /> Verified
                    owner
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-3 border-t border-[#F4F4F2]/10 pt-5 text-sm text-[#F4F4F2]/75">
                <li className="flex items-center gap-3">
                  <Mail
                    className="h-4 w-4 shrink-0 text-[#7CB518]"
                    aria-hidden
                  />{" "}
                  {equipment.owner.email}
                </li>
                {equipment.owner.phone && (
                  <li className="flex items-center gap-3">
                    <Phone
                      className="h-4 w-4 shrink-0 text-[#7CB518]"
                      aria-hidden
                    />{" "}
                    {equipment.owner.phone}
                  </li>
                )}
              </ul>
            </section>
          </aside>
        </div>
      </div>

    </main>
  );
}
