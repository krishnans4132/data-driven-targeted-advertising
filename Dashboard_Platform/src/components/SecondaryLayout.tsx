import { Outlet } from "react-router-dom";
import { SecondarySubNav } from "@/components/SecondarySubNav";

export default function SecondaryLayout() {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <SecondarySubNav />
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}
