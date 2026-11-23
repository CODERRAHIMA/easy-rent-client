"use client";

import {
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Info,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { uploadImage } from "@/lib/uploadImage";

const categories = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];
const rentalTypes = ["Daily", "Weekly", "Monthly"];
const conditions = ["Excellent", "Good", "Fair"];

const initialForm = {
  name: "",
  description: "",
  category: "",
  brand: "",
  model: "",
  condition: "",
  location: "",
  rentalPrice: "",
  rentalType: "",
  availableQuantity: "",
};

const inputCls =
  "h-11 rounded-xl border-[#1B1F16]/15 bg-white focus-visible:border-[#7CB518] focus-visible:ring-[#7CB518]/25";
const triggerCls = `${inputCls} w-full data-[placeholder]:text-[#1B1F16]/40`;

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[#1B1F16]/10 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-extrabold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-[#1B1F16]/60">{hint}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function OwnerAddequipmentPage() {
  const [form, setForm] = useState(initialForm);
  const [terms, setTerms] = useState<string[]>([""]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // value can be null with the newer shadcn Select (Base UI), so fall back to ""
  const set = (key: keyof typeof initialForm) => (value: string | null) =>
    setForm((f) => ({ ...f, [key]: value ?? "" }));

  const onText =
    (key: keyof typeof initialForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(key)(e.target.value);

  // Image
  const pickFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setError("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024)
      return setError("Image must be smaller than 5 MB.");
    setError("");
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    pickFile(e.dataTransfer.files?.[0]);
  };

  // Rental terms
  const updateTerm = (i: number, v: string) =>
    setTerms((t) => t.map((x, idx) => (idx === i ? v : x)));

  const addTerm = () => setTerms((t) => [...t, ""]);

  const removeTerm = (i: number) =>
    setTerms((t) => (t.length === 1 ? [""] : t.filter((_, idx) => idx !== i)));

  const { data: session, isPending: sessionPending } = useSession();
  const owner = session?.user;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (sessionPending) return setError("Please wait while your account loads.");
    if (!owner) return setError("Please sign in to add equipment.");

    const required: [string, string][] = [
      [form.name, "Equipment name"],
      [form.description, "Description"],
      [form.category, "Category"],
      [form.brand, "Brand"],
      [form.model, "Model"],
      [form.condition, "Condition"],
      [form.location, "Location"],
      [form.rentalPrice, "Rental price"],
      [form.rentalType, "Rental type"],
      [form.availableQuantity, "Available quantity"],
    ];

    const missing = required.find(([v]) => !v.trim());
    if (missing) return setError(`${missing[1]} is required.`);

    if (Number(form.rentalPrice) <= 0)
      return setError("Rental price must be greater than 0.");

    if (
      !Number.isInteger(Number(form.availableQuantity)) ||
      Number(form.availableQuantity) < 1
    )
      return setError("Available quantity must be at least 1.");

    if (!photo) return setError("Please upload an equipment image.");

    const cleanTerms = terms.map((t) => t.trim()).filter(Boolean);
    if (!cleanTerms.length) return setError("Add at least one rental term.");

    setLoading(true);

    try {
      // Upload equipment image to ImgBB
      const image = await uploadImage(photo);

      const now = new Date().toISOString();

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        image,
        location: form.location.trim(),
        rentalPrice: Number(form.rentalPrice),
        rentalType: form.rentalType,
        availableQuantity: Number(form.availableQuantity),
        condition: form.condition,
        brand: form.brand.trim(),
        model: form.model.trim(),
        rentalTerms: cleanTerms,
        status: "pending", // admin approves later
        owner: {
          id: owner.id,
          name: owner.name,
          email: owner.email,
          image: owner.image,
        },
        createdAt: now,
        updatedAt: now,
      };

      const token = await getTokenFromClient();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/equipments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(
          detail || `Unable to add equipment (HTTP ${response.status}).`,
        );
      }

      // alert("Equipment added! It will go live after admin approval.");
      setForm(initialForm);
      setTerms([""]);
      setPhoto(null);
      setPreview(null);
      router.push("/owner/my-equipment");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-6xl">
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Add new equipment
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[#1B1F16]/70">
          Fill in the details below to list your equipment for rent.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start"
        >
          {/* Left: details */}
          <div className="space-y-6">
            <Section
              title="Equipment details"
              hint="Tell customers what they are renting."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Equipment name" htmlFor="name">
                    <Input
                      id="name"
                      value={form.name}
                      onChange={onText("name")}
                      placeholder="e.g. Caterpillar Excavator 320D"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Description" htmlFor="description">
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={onText("description")}
                      rows={4}
                      placeholder="Describe the equipment, what it is best for, and its features."
                      className="rounded-xl border-[#1B1F16]/15 bg-white focus-visible:border-[#7CB518] focus-visible:ring-[#7CB518]/25"
                    />
                  </Field>
                </div>

                <Field label="Category">
                  <Select value={form.category} onValueChange={set("category")}>
                    <SelectTrigger className={triggerCls}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Condition">
                  <Select
                    value={form.condition}
                    onValueChange={set("condition")}
                  >
                    <SelectTrigger className={triggerCls}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Brand" htmlFor="brand">
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={onText("brand")}
                    placeholder="e.g. Caterpillar"
                    className={inputCls}
                  />
                </Field>

                <Field label="Model" htmlFor="model">
                  <Input
                    id="model"
                    value={form.model}
                    onChange={onText("model")}
                    placeholder="e.g. 320D"
                    className={inputCls}
                  />
                </Field>
              </div>
            </Section>

            <Section
              title="Pricing and availability"
              hint="Set how much and how long customers can rent."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Rental price" htmlFor="rentalPrice">
                  <Input
                    id="rentalPrice"
                    type="number"
                    min={0}
                    value={form.rentalPrice}
                    onChange={onText("rentalPrice")}
                    placeholder="e.g. 12000"
                    className={inputCls}
                  />
                </Field>

                <Field label="Rental type">
                  <Select
                    value={form.rentalType}
                    onValueChange={set("rentalType")}
                  >
                    <SelectTrigger className={triggerCls}>
                      <SelectValue placeholder="Select rental type" />
                    </SelectTrigger>
                    <SelectContent>
                      {rentalTypes.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Available quantity" htmlFor="availableQuantity">
                  <Input
                    id="availableQuantity"
                    type="number"
                    min={1}
                    value={form.availableQuantity}
                    onChange={onText("availableQuantity")}
                    placeholder="e.g. 3"
                    className={inputCls}
                  />
                </Field>

                <Field label="Location" htmlFor="location">
                  <Input
                    id="location"
                    value={form.location}
                    onChange={onText("location")}
                    placeholder="City, Country"
                    className={inputCls}
                  />
                </Field>
              </div>
            </Section>

            <Section
              title="Rental terms and conditions"
              hint="Add one rule per line. Customers see these before booking."
            >
              <ul className="space-y-3">
                {terms.map((t, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF4E0] text-xs font-bold text-[#3F6212]">
                      {i + 1}
                    </span>

                    <Input
                      value={t}
                      onChange={(e) => updateTerm(i, e.target.value)}
                      placeholder="e.g. A security deposit is required."
                      aria-label={`Rental term ${i + 1}`}
                      className={inputCls}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTerm(i)}
                      aria-label={`Remove term ${i + 1}`}
                      className="shrink-0 text-[#1B1F16]/60 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>

              <Button
                type="button"
                variant="outline"
                onClick={addTerm}
                className="mt-4 rounded-xl border-[#1B1F16]/15 bg-white font-bold hover:border-[#7CB518] hover:bg-white"
              >
                <Plus className="h-4 w-4 text-[#3F6212]" aria-hidden /> Add
                another term
              </Button>
            </Section>
          </div>

          {/* Right: image + publish */}
          <aside className="space-y-6 lg:sticky lg:top-6">
            <Section title="Equipment image">
              <label
                htmlFor="image"
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#1B1F16]/20 bg-[#F4F4F2] text-center transition hover:border-[#7CB518]"
              >
                {preview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Equipment preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <span className="absolute inset-x-0 bottom-0 bg-[#1B1F16]/70 py-2 text-xs font-bold text-[#F4F4F2] opacity-0 transition group-hover:opacity-100">
                      Click to change
                    </span>
                  </>
                ) : (
                  <div className="px-4">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4E0] text-[#3F6212]">
                      <UploadCloud className="h-6 w-6" aria-hidden />
                    </span>

                    <p className="mt-3 text-sm font-bold">
                      Click or drag an image here
                    </p>

                    <p className="mt-1 text-xs text-[#1B1F16]/60">
                      JPG or PNG, up to 5 MB
                    </p>
                  </div>
                )}

                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => pickFile(e.target.files?.[0])}
                  className="sr-only"
                />
              </label>

              {photo && (
                <p className="mt-3 flex items-center gap-2 truncate text-xs text-[#1B1F16]/60">
                  <ImagePlus
                    className="h-4 w-4 shrink-0 text-[#3F6212]"
                    aria-hidden
                  />{" "}
                  {photo.name}
                </p>
              )}
            </Section>

            <section className="rounded-3xl bg-[#1B1F16] p-6 text-[#F4F4F2]">
              <div className="flex items-start gap-3">
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#7CB518]"
                  aria-hidden
                />

                <p className="text-sm leading-relaxed text-[#F4F4F2]/75">
                  Your owner details are added automatically from your account.
                  New listings start as{" "}
                  <span className="rounded-full bg-[#7CB518]/20 px-2 py-0.5 text-xs font-bold text-[#7CB518]">
                    Pending
                  </span>{" "}
                  until an admin approves them.
                </p>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-5 h-12 w-full rounded-xl bg-[#7CB518] text-sm font-bold text-[#1B1F16] hover:bg-[#6aa00f]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />{" "}
                    Adding equipment...
                  </>
                ) : (
                  "Add equipment"
                )}
              </Button>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
}
