"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

const baseLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/all-equipment" },
];

const Navbar = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = useSession();

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

        {isPending ? (
          <div
            className="flex h-11 items-center justify-center px-4"
            aria-label="Loading session"
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />
            </div>
          </div>
        ) : session?.user ? (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger
              nativeButton={false}
              title={session.user.name ?? undefined}
              render={
                <div className="group flex cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-[#282927] py-1.5 px-2 pr-3 transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <AvatarBadge className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500" />
                  </div>

                  <ChevronDown className="h-4 w-4 text-white transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-white" />
                </div>
              }
            ></PopoverTrigger>

            <PopoverContent
              align="end"
              sideOffset={12}
              className="w-[220px] overflow-hidden rounded-2xl border-slate-200 bg-slate-100 p-0 shadow-xl shadow-slate-900/10"
            >
              <PopoverHeader className="border-b border-slate-200 px-4 py-3 text-left">
                <PopoverTitle className="text-sm font-bold text-slate-900">
                  {session.user.name}
                </PopoverTitle>
                <PopoverDescription className="mt-1 break-all text-xs text-slate-500">
                  {session.user.email}
                </PopoverDescription>
              </PopoverHeader>

              {/* Menu items */}
              <div className="px-2">
                <Link
                  href="/profile"
                  onClick={() => setIsPopoverOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-[#7CB518]/10 hover:text-[#3F6212]"
                >
                  <User className="h-[18px] w-[18px] text-[#7CB518]" />
                  Profile
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setIsPopoverOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-[#7CB518]/10 hover:text-[#3F6212] lg:hidden"
                >
                  <LayoutDashboard className="h-[18px] w-[18px] text-[#7CB518]" />
                  Dashboard
                </Link>
              </div>

              <div className="border-t border-slate-200 p-2">
                <button
                  type="button"
                  onClick={handleSignout}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex items-center gap-2 lg:gap-3">
            <Link
              href="/login"
              aria-label="Login"
              title="Login"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 lg:h-11 lg:w-auto lg:border-0 lg:px-5 lg:hover:bg-transparent"
            >
              <LogIn className="size-[18px] lg:mr-1 lg:size-[14px]" />
              <span className="hidden lg:inline">Login</span>
            </Link>
            <Link
              href="/register"
              aria-label="Register"
              title="Register"
              className="inline-flex size-10 items-center justify-center rounded-lg bg-[#7CB518] text-sm font-semibold text-white transition-colors hover:bg-[#679b16] lg:h-11 lg:w-auto lg:px-5"
            >
              <UserRoundPlus className="size-[18px] lg:mr-1 lg:size-4" />
              <span className="hidden lg:inline">Register</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;