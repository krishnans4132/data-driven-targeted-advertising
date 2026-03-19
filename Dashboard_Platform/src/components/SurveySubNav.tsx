import { NavLink } from "react-router-dom";
import { Users, Megaphone, Smartphone, Lightbulb, Brain, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const surveyNavItems = [
  { title: "Overview", url: "/survey", icon: LayoutDashboard },
  { title: "Demographics", url: "/demographics", icon: Users },
  { title: "Ad Analysis", url: "/ad-analysis", icon: Megaphone },
  { title: "User Behavior", url: "/behavior", icon: Smartphone },
  { title: "Insights", url: "/insights", icon: Lightbulb },
  { title: "Ad Fatigue Predictor", url: "/afi-predictor", icon: Brain },
];

export function SurveySubNav() {
  return (
    <nav className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5 overflow-x-auto no-scrollbar">
      {surveyNavItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
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
