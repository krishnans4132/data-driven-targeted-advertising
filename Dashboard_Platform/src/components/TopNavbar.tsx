import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, BookOpen, Database } from "lucide-react";

export function TopNavbar() {
  const location = useLocation();
  const isSurveyRoute = location.pathname !== "/" && location.pathname !== "/secondary";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0f172a] text-white">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-[1600px] mx-auto overflow-x-auto no-scrollbar">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mr-8 shrink-0">
          <div className="flex items-center justify-center p-1.5 bg-white/10 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight whitespace-nowrap">Ad Fatigue Analytics</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 md:gap-4 ml-auto lg:ml-0">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive ? "bg-white/15 text-white shadow-sm" : "text-slate-300 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <BookOpen className="w-4 h-4" />
            Project Overview
          </NavLink>

          <NavLink
            to="/survey"
            className={() =>
              `px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-2 ${
                isSurveyRoute ? "bg-white/15 text-white shadow-sm" : "text-slate-300 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <BarChart3 className="w-4 h-4" />
            Survey Dashboard
          </NavLink>

          <NavLink
            to="/secondary"
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive ? "bg-white/15 text-white shadow-sm" : "text-slate-300 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <Database className="w-4 h-4" />
            Secondary Dataset
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
