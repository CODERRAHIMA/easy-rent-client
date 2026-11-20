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

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navByRole: Record<DashboardRole, NavItem[]> = {
  customer: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Rentals", href: "/dashboard/my-rentals", icon: CalendarCheck },
    { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ],
  owner: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      label: "Add Equipment",
      href: "/dashboard/add-equipment",
      icon: PlusCircle,
    },
    { label: "My Equipment", href: "/dashboard/my-equipment", icon: Package },
    {
      label: "My Equipment Rental",
      href: "/dashboard/my-equipment-rentals",
      icon: ClipboardList,
    },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "All Users", href: "/dashboard/users", icon: Users },
    { label: "All Equipment", href: "/dashboard/equipment", icon: Boxes },
    { label: "All Rentals", href: "/dashboard/rentals", icon: Receipt },
    { label: "My Profile", href: "/dashboard/profile", icon: User },
  ],
};

const roleLabel: Record<DashboardRole, string> = {
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
};

type DashboardSidebarProps = React.ComponentProps<typeof Sidebar> & {
  role?: DashboardRole;
};

export function DashboardSidebar({
  role,
  ...props
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const user = session?.user;
  const activeRole: DashboardRole =
    role ?? (user?.role as DashboardRole) ?? "customer";
  const items = navByRole[activeRole];

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/" aria-label="Easy Rent home" className="block">
          <Image
            src="/logo.png"
            alt="Easy Rent"
            width={150}
            height={50}
            className="h-10 w-auto object-contain"
          />
        </Link>
      </SidebarHeader> */}
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
                      className="h-10 rounded-lg px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-[#7CB518]/10 hover:text-[#3F6212] data-[active=true]:bg-[#7CB518] data-[active=true]:text-white data-[active=true]:hover:bg-[#679b16] data-[active=true]:hover:text-white"
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
            }}
          />
        ) : null}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
