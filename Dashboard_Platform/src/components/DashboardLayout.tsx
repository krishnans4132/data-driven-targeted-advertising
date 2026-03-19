import { Outlet } from "react-router-dom";
import { TopNavbar } from "@/components/TopNavbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
      <TopNavbar />
      <main className="flex-1 p-6 overflow-auto w-full max-w-[1600px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
