import { DashboardSidebar } from "@/components/dashboard/shared/DashBoardSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-[#F4F4F3]">
        <header className="flex h-14 items-center gap-2 border-b border-slate-200 bg-white px-4">
          <SidebarTrigger />
          {/* <span className="text-sm font-medium">Dashboard</span> */}
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}