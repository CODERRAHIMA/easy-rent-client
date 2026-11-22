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

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to log out. Please try again.",
      );
    }
  };

  const userInfo = (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.image || ""} alt={user.name} />
        <AvatarFallback className="rounded-lg bg-[#7CB518] font-semibold text-white">
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold text-slate-900">
          {user.name}
        </span>
        <span className="truncate text-xs text-slate-500">{user.email}</span>
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
                className="cursor-pointer hover:bg-[#7CB518]/10 data-[popup-open]:bg-[#7CB518]/10"
              />
            }
          >
            {userInfo}
            <ChevronsUpDown className="ml-auto size-4 text-slate-500" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  {userInfo}
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href={`/${user.role}/profile`} />}
                className="cursor-pointer gap-2"
              >
                <Settings className="size-4" />
                Profile Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer gap-2 text-red-500 focus:bg-red-50 focus:text-red-600"
              >
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}