"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
const PHONE_PATTERN = /^\+?[0-9\s-]{7,15}$/;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB

type Profile = { name: string; image: string; phone: string; address: string };
type SessionUser = {
  name: string;
  email: string;
  image: string;
  role?: string;
};
type LoadResult = {
  email: string;
  phone: string;
  address: string;
  failed: boolean;
};
type Status = { type: "success" | "error"; text: string } | null;

type ApiResult = { data?: unknown; message?: string };

async function requestJson(
  url: string,
  init: RequestInit,
  fallbackMessage: string,
): Promise<ApiResult> {
  const token = await getTokenFromClient();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(url, { ...init, headers });

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error(fallbackMessage);
  }

  const result: ApiResult = await response.json();

  if (!response.ok) {
    throw new Error(result.message || fallbackMessage);
  }

  return result;
}

// TODO: imgbb upload (implement later). Returns the uploaded image URL.
// async function uploadToImgbb(file: File): Promise<string> {
//   const body = new FormData();
//   body.append("image", file);
//   const response = await fetch(
//     `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
//     { method: "POST", body },
//   );
//   const json = await response.json();
//   if (!json?.success) throw new Error("Photo upload failed. Please try again.");
//   return json.data.url as string;
// }

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const fieldCls =
  "h-11 rounded-xl border-[#1B1F16]/15 bg-white pl-10 focus-visible:border-[#7CB518] focus-visible:ring-[#7CB518]/25";

function InputField({
  id,
  label,
  icon: Icon,
  rightIcon: RightIcon,
  wrapperClassName = "",
  className = "",
  ...props
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  rightIcon?: LucideIcon;
  wrapperClassName?: string;
} & ComponentProps<typeof Input>) {
  return (
    <div className={`space-y-1.5 ${wrapperClassName}`}>
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      <div className="relative">
        <Icon
          className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#3F6212]"
          aria-hidden
        />
        <Input id={id} className={`${fieldCls} ${className}`} {...props} />
        {RightIcon && (
          <RightIcon
            className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#1B1F16]/40"
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  value,
  empty,
}: {
  icon: LucideIcon;
  value: string;
  empty: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-[#7CB518]" aria-hidden />
      <span className={value ? "text-[#F4F4F2]/85" : "text-[#F4F4F2]/40"}>
        {value || empty}
      </span>
    </li>
  );
}

function StatusMessage({ status }: { status: NonNullable<Status> }) {
  const success = status.type === "success";
  const Icon = success ? CheckCircle2 : AlertCircle;

  return (
    <p
      role={success ? "status" : "alert"}
      className={`mt-6 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
        success
          ? "border-[#7CB518]/40 bg-[#EEF4E0] text-[#3F6212]"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      {status.text}
    </p>
  );
}

function ProfileSkeleton() {
  return (
    <div
      className="grid gap-6 lg:grid-cols-[340px_1fr]"
      aria-label="Loading profile"
    >
      <div className="h-[380px] animate-pulse rounded-3xl bg-[#1B1F16]/10" />
      <div className="h-[460px] animate-pulse rounded-3xl bg-[#1B1F16]/5" />
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-3xl border border-red-200 bg-white px-5 py-12 text-center"
    >
      <AlertCircle className="size-10 text-red-500" aria-hidden />
      <p className="mt-3 text-sm font-semibold text-red-700">
        Could not load your profile.
      </p>
      <Button
        type="button"
        onClick={onRetry}
        className="mt-4 h-10 rounded-xl bg-[#1B1F16] px-5 text-sm font-bold text-white hover:bg-[#2d3326]"
      >
        Try again
      </Button>
    </div>
  );
}

function ProfileEditor({
  user,
  initial,
}: {
  user: SessionUser;
  initial: { phone: string; address: string };
}) {
  const [saved, setSaved] = useState<Profile>({
    name: user.name,
    image: user.image,
    phone: initial.phone,
    address: initial.address,
  });
  const [form, setForm] = useState({
    name: saved.name,
    phone: saved.phone,
    address: saved.address,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const next = {
    name: form.name.trim(),
    phone: form.phone.trim(),
    address: form.address.trim(),
  };
  const dirty =
    !!photo ||
    next.name !== saved.name ||
    next.phone !== saved.phone ||
    next.address !== saved.address;

  const fail = (text: string) => setStatus({ type: "error", text });

  // Set (or clear) the selected photo and free the previous preview from memory
  const replacePhoto = (file: File | null) => {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const setField =
    (key: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setStatus(null);
    };

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return fail("Please choose an image file.");
    if (file.size > MAX_PHOTO_SIZE)
      return fail("Image must be smaller than 5 MB.");
    setStatus(null);
    replacePhoto(file);
  };

  const handleReset = () => {
    setForm({ name: saved.name, phone: saved.phone, address: saved.address });
    replacePhoto(null);
    setStatus(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!next.name) return fail("Name is required.");
    if (next.phone && !PHONE_PATTERN.test(next.phone)) {
      return fail(
        "Enter a valid phone number (7-15 digits, + - and spaces allowed).",
      );
    }

    try {
      setSaving(true);

      // TODO: imgbb. Upload the selected `photo` and use the returned URL as `image`:
      // const image = photo ? await uploadToImgbb(photo) : saved.image;
      const image = saved.image; // placeholder until imgbb is connected (the selected photo is not saved yet)

      await requestJson(
        `${API_URL}/users/profile?email=${encodeURIComponent(user.email)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: next.phone,
            address: next.address,
          }),
        },
        "Failed to update profile",
      );

      // Keep the logged-in session (navbar name / photo) in sync. A failure here should not fail the save.
      await authClient
        .updateUser({
          name: next.name,
          ...(image !== saved.image && { image }),
        })
        .catch(() => {});

      setSaved({ ...next, image });
      setForm(next);
      replacePhoto(null);
      setStatus({ type: "success", text: "Your profile has been updated." }); // replace with a toast if you like
    } catch (err) {
      console.error("Update profile error:", err);
      fail(getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const avatar = preview ?? saved.image;

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
      {/* Summary card */}
      <aside className="rounded-3xl bg-[#1B1F16] p-6 text-[#F4F4F2] sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt={saved.name}
                className="size-28 rounded-full object-cover ring-4 ring-[#7CB518]"
              />
            ) : (
              <span className="flex size-28 items-center justify-center rounded-full bg-[#7CB518] text-3xl font-extrabold text-[#1B1F16]">
                {initials(saved.name)}
              </span>
            )}
            <label
              htmlFor="profile-photo"
              title="Change photo"
              className="absolute -bottom-1 -right-1 flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#7CB518] text-[#1B1F16] ring-4 ring-[#1B1F16] transition hover:bg-[#6aa00f]"
            >
              <Camera className="size-5" aria-hidden />
              <span className="sr-only">Change profile photo</span>
            </label>
            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="sr-only"
            />
          </div>

          <h2 className="mt-5 text-xl font-extrabold">{saved.name}</h2>
          <p className="mt-1 break-all text-sm text-[#F4F4F2]/70">
            {user.email}
          </p>
          {user.role && (
            <span className="mt-3 rounded-full bg-[#7CB518]/20 px-3 py-1 text-xs font-bold text-[#7CB518]">
              {capitalize(user.role)}
            </span>
          )}
          {photo && (
            <p className="mt-3 text-xs text-[#F4F4F2]/60">
              New photo selected. Save to apply it.
            </p>
          )}
        </div>

        <ul className="mt-6 space-y-4 border-t border-[#F4F4F2]/10 pt-6 text-sm">
          <InfoRow
            icon={Phone}
            value={saved.phone}
            empty="No phone number added"
          />
          <InfoRow
            icon={MapPin}
            value={saved.address}
            empty="No address added"
          />
        </ul>
      </aside>

      {/* Edit form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-3xl border border-[#1B1F16]/10 bg-white p-6 sm:p-8"
      >
        <h2 className="text-lg font-extrabold">Edit profile</h2>
        <p className="mt-1 text-sm text-[#1B1F16]/60">
          Update your personal information below.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <InputField
            id="name"
            label="Full name"
            icon={User}
            value={form.name}
            onChange={setField("name")}
            placeholder="Your name"
            autoComplete="name"
          />
          <InputField
            id="email"
            label="Email"
            icon={Mail}
            rightIcon={Lock}
            value={user.email}
            disabled
            readOnly
            className="pr-10 disabled:opacity-70"
          />
          <InputField
            id="phone"
            label="Phone number"
            icon={Phone}
            type="tel"
            value={form.phone}
            onChange={setField("phone")}
            placeholder="+880 1XXX XXXXXX"
            autoComplete="tel"
            wrapperClassName="sm:col-span-2"
          />

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address" className="text-sm font-semibold">
              Address
            </Label>
            <Textarea
              id="address"
              rows={3}
              value={form.address}
              onChange={setField("address")}
              placeholder="House, road, area, city"
              autoComplete="street-address"
              className="rounded-xl border-[#1B1F16]/15 bg-white focus-visible:border-[#7CB518] focus-visible:ring-[#7CB518]/25"
            />
          </div>
        </div>

        {status && <StatusMessage status={status} />}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!dirty || saving}
            className="h-12 rounded-xl border-[#1B1F16]/15 bg-white px-6 font-bold hover:bg-[#F4F4F2] disabled:border-gray-700"
          >
            Discard changes
          </Button>
          <Button
            type="submit"
            disabled={!dirty || saving}
            className="h-12 rounded-xl bg-[#7CB518] px-8 text-sm font-bold text-[#1B1F16] hover:bg-[#6aa00f] disabled:border-gray-700"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />{" "}
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function useProfileData(email: string | undefined, isPending: boolean) {
  const [result, setResult] = useState<LoadResult | null>(null);
  const [reloadKey, setReloadKey] = useState(0); // bump it to fetch again ("Try again")

  useEffect(() => {
    if (!email) return;

    const controller = new AbortController();

    requestJson(
      `${API_URL}/users/profile?email=${encodeURIComponent(email)}`,
      { signal: controller.signal },
      "Failed to fetch profile",
    )
      .then(({ data }) => {
        const profile = (data ?? {}) as { phone?: string; address?: string };
        setResult({
          email,
          phone: profile.phone ?? "",
          address: profile.address ?? "",
          failed: false,
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch profile:", err);
        setResult({ email, phone: "", address: "", failed: true });
      });

    return () => controller.abort();
  }, [email, reloadKey]);

  const current = result?.email === email ? result : null;

  return {
    loading: isPending || (!!email && !current),
    failed: !!current?.failed,
    profile: current,
    reload: () => {
      setResult(null);
      setReloadKey((key) => key + 1);
    },
  };
}

export default function ProfileDetails() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const { loading, failed, profile, reload } = useProfileData(
    user?.email,
    isPending,
  );

  return (
    <section className="space-y-6 text-[#1B1F16]">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          My profile
        </h1>
        <p className="mt-2 text-sm text-[#1B1F16]/60">
          View and update your personal information.
        </p>
      </div>

      {loading ? (
        <ProfileSkeleton />
      ) : !user ? (
        <div className="py-20 text-center">
          <h2 className="text-xl font-bold">Please login first</h2>
        </div>
      ) : failed ? (
        <ErrorState onRetry={reload} />
      ) : (
        profile && (
          <ProfileEditor
            key={user.email}
            user={{
              name: user.name ?? "",
              email: user.email,
              image: user.image ?? "",
              role: (user as { role?: string }).role,
            }}
            initial={{ phone: profile.phone, address: profile.address }}
          />
        )
      )}
    </section>
  );
}
