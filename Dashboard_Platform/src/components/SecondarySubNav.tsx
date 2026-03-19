import { NavLink } from "react-router-dom";
import { LayoutDashboard, Compass, Trophy, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const secondaryNavItems = [
  { title: "Overview & Sentiment", url: "/secondary", icon: LayoutDashboard },
  { title: "Category Insights", url: "/secondary/insights", icon: Compass },
  { title: "App Leaderboard", url: "/secondary/apps", icon: Trophy },
  { title: "Rating Predictor", url: "/secondary/predictor", icon: Brain },
];

export function SecondarySubNav() {
  return (
    <nav className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5 overflow-x-auto no-scrollbar">
      {secondaryNavItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          end={item.url === "/secondary"}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
              isActive
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )
          }
        >
          <item.icon className="w-4 h-4" />
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}
