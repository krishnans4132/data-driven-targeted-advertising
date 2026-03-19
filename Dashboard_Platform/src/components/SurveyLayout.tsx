import { Outlet } from "react-router-dom";
import { SurveySubNav } from "@/components/SurveySubNav";

export default function SurveyLayout() {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <SurveySubNav />
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}
