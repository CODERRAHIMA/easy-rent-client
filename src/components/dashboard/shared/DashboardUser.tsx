"use client";

import Link from "next/link";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut } from "@/lib/auth-client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { DashboardRole } from "@/types/type";

export type NavUserData = {
  name: string;
  email: string;
  image?: string | null;
  role: DashboardRole;
};

export function DashboardUser({ user }: { user: NavUserData }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();

      if (error) {
        toast.error(error.message || "Unable to log out. Please try again.");
        return;
      }

      toast.success("Logged out successfully.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to log out. Please try again.",
      );
    }
  };

  const userInfo = (
    <>
      <div className="relative">
        <Avatar className="h-9 w-9 rounded-xl border border-[#7CB518]/30 shadow-xs ring-2 ring-[#7CB518]/10 transition-all group-hover/user:ring-[#7CB518]/25">
          <AvatarImage src={user.image || ""} alt={user.name} />
          <AvatarFallback className="rounded-xl bg-gradient-to-br from-[#7CB518]/20 to-[#3F6212]/15 font-bold text-[#3F6212]">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#7CB518]" />
      </div>

      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold text-[#1B1F16] transition-colors group-hover/user:text-[#3F6212]">
          {user.name}
        </span>
        <span className="mt-0.5 truncate text-xs text-slate-500">
          {user.email}
        </span>
      </div>
    </>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* Collapsed sidebar: the button shrinks to the avatar only */}
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={user.name}
                className="group/user h-14 cursor-pointer rounded-2xl border border-slate-200/70 bg-white/70 px-2.5 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:border-[#7CB518]/35 hover:bg-[#7CB518]/10 hover:shadow-sm data-[popup-open]:border-[#7CB518]/40 data-[popup-open]:bg-[#7CB518]/10"
              />
            }
          >
            {userInfo}
            <ChevronsUpDown className="ml-auto size-4 text-slate-400 transition-transform duration-200 group-hover/user:text-[#3F6212] group-data-[popup-open]/user:rotate-180" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-68 rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-xl shadow-slate-900/10 backdrop-blur-md"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={10}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 rounded-xl border border-[#7CB518]/20 bg-gradient-to-br from-[#7CB518]/10 via-[#7CB518]/5 to-transparent p-3">
                  <Avatar className="h-11 w-11 rounded-xl border border-[#7CB518]/30 shadow-xs">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback className="rounded-xl bg-[#7CB518]/20 font-bold text-[#3F6212]">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid min-w-0 flex-1 text-left leading-tight">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-[#1B1F16]">
                        {user.name}
                      </span>
                      <span className="shrink-0 rounded-full bg-[#3F6212]/10 px-2 py-0.5 text-[10px] font-semibold capitalize text-[#3F6212]">
                        {user.role}
                      </span>
                    </div>
                    <span className="mt-1 truncate text-xs text-slate-500">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2 bg-slate-100" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href={`/${user.role}/profile`} />}
                className="group/item cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors focus:bg-[#7CB518]/12 focus:text-[#3F6212]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-focus/item:bg-[#7CB518]/20 group-focus/item:text-[#3F6212]">
                  <Settings className="size-4" />
                </span>
                Profile Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2 bg-slate-100" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="group/logout cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors focus:bg-red-50 focus:text-red-700"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors group-focus/logout:bg-red-100 group-focus/logout:text-red-600">
                  <LogOut className="size-4" />
                </span>
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
