"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  CalendarCheck,
  ClipboardList,
  Heart,
  LayoutDashboard,
  Package,
  PlusCircle,
  Receipt,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DashboardRole } from "@/types/type";
import { DashboardUser } from "./DashboardUser";
import { useSession } from "@/lib/auth-client";

type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const roleBasedSidebarItems: Record<DashboardRole, SidebarItem[]> = {
  customer: [
    { label: "Overview", href: "/customer/dashboard", icon: LayoutDashboard },
    { label: "My Rentals", href: "/customer/my-rentals", icon: CalendarCheck },
    { label: "Favorites", href: "/customer/favorites", icon: Heart },
    { label: "Profile", href: "/customer/profile", icon: User },
  ],
  owner: [
    { label: "Overview", href: "/owner/dashboard", icon: LayoutDashboard },
    { label: "Add Equipment", href: "/owner/add-equipment", icon: PlusCircle },
    { label: "My Equipments", href: "/owner/my-equipment", icon: Package },
    {
      label: "My Equipment Rentals",
      href: "/owner/my-equipment-rentals",
      icon: ClipboardList,
    },
    { label: "Profile", href: "/owner/profile", icon: User },
  ],
  admin: [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "All Users", href: "/admin/all-users", icon: Users },
    { label: "All Equipments", href: "/admin/all-equipments", icon: Boxes },
    { label: "All Rentals", href: "/admin/all-rentals", icon: Receipt },
    { label: "My Profile", href: "/admin/profile", icon: User },
  ],
};

const roleLabel: Record<DashboardRole, string> = {
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
};

export function DashboardSidebar() {
  const pathname = usePathname();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const activeRole: DashboardRole = (user?.role as DashboardRole) ?? "customer";

  const items = roleBasedSidebarItems[activeRole];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4 group-data-[collapsible=icon]:px-2">
        <Link
          href="/"
          aria-label="Easy Rent home"
          className="flex items-center justify-start group-data-[collapsible=icon]:justify-center"
        >
          <Image
            src="/logo.png"
            alt="Easy Rent"
            width={150}
            height={50}
            className="h-10 w-auto object-contain group-data-[collapsible=icon]:hidden"
            priority
          />
          <Image
            src="/dashboardMiniLogo.png"
            alt="Easy Rent"
            width={40}
            height={40}
            className="hidden size-8 object-contain group-data-[collapsible=icon]:block"
            priority
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {isPending ? (
            <>
              <div className="mb-2 h-4 w-24 animate-pulse rounded bg-slate-200 px-3" />
              <SidebarMenu className="gap-1.5">
                {[1, 2, 3, 4].map((n) => (
                  <SidebarMenuItem key={n}>
                    <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200/70" />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </>
          ) : (
            <>
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {roleLabel[activeRole]} Panel
              </SidebarGroupLabel>
              <SidebarMenu className="gap-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                      style={
                        isActive(item.href)
                          ? {
                              backgroundColor: "#000000",
                              color: "#ffffff",
                            }
                          : undefined
                      }
                      className="h-10 rounded-lg px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-[#7CB518]/10 hover:text-[#3F6212]"
                    >
                      <item.icon className="size-[18px]" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {isPending ? (
          <div className="flex items-center gap-2 p-1.5">
            <div className="size-8 animate-pulse rounded-lg bg-slate-200" />
            <div className="grid flex-1 gap-1.5 group-data-[collapsible=icon]:hidden">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ) : user ? (
          <DashboardUser
            user={{
              name: user.name,
              email: user.email,
              image: user.image,
              role: activeRole,
            }}
          />
        ) : null}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
