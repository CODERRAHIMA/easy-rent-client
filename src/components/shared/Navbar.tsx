"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const baseLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/all-equipment" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  const handleSignout = async () => {
    try {
      const { data, error } = await signOut();
      if (error || !data?.success) {
        toast.error("Unable to sign out. Please try again.");
        return;
      }
      toast.success("Signed out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Unable to sign out. Please try again.");
    }
  };

  const navLinks = session?.user
    ? [...baseLinks, { label: "Dashboard", href: "/dashboard" }]
    : baseLinks;

  return (
    <header className="sticky top-0 z-50 bg-[#F4F4F3]">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="shrink-0" aria-label="Easy Rent home">
          <Image
            src="/logo.png"
            alt="Easy Rent"
            width={150}
            height={50}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Middle links: large screens only */}
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {session?.user ? (
          <div className="flex items-center gap-3">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "Profile"}
                title={session.user.name ?? undefined}
                width={10} height={10}
                className="size-10 shrink-0 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <span
                title={session.user.name ?? undefined}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#7CB518] text-sm font-semibold uppercase text-white"
              >
                {session.user.name?.charAt(0) ?? "U"}
              </span>
            )}
            <button
              type="button"
              onClick={handleSignout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold transition-colors bg-[#7CB518] text-white hover:bg-[#679b16] cursor-pointer"
            >
              <LogOut className="size-4" aria-hidden />
              Logout
            </button>
          </div>
        ) : (
          <>
            {/* Logged out: Login / Register on large screens */}
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[#7CB518] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#679b16]"
              >
                Register
              </Link>
            </div>

            {/* Logged out: hamburger on small screens */}
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </>
        )}
      </nav>

      {!session?.user && isMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-slate-100 bg-white px-4 pb-5 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-3 border-t border-slate-100 pt-4">
              <Link
                href="/login"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-[#76B019] text-sm font-semibold text-white transition-colors hover:bg-[#679b16]"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
