import { BarChart3, Users, Megaphone, Smartphone, Lightbulb, Star, Zap, Brain } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const sections = [
  { title: "Overview", url: "/", icon: BarChart3 },
  { title: "Demographics", url: "/demographics", icon: Users },
  { title: "Ad Analysis", url: "/ad-analysis", icon: Megaphone },
  { title: "User Behavior", url: "/behavior", icon: Smartphone },
  { title: "Business Insights", url: "/insights", icon: Lightbulb },
  { title: "Secondary Predictor", url: "/secondary/predictor", icon: Zap },
  { title: "AFI Predictor", url: "/afi-predictor", icon: Brain },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 pb-2">
          {!collapsed && (
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              📊 Ad Fatigue
            </h2>
          )}
          {!collapsed && (
            <p className="text-xs text-muted-foreground mt-0.5">Survey Analytics</p>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-primary/15 text-primary font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto p-4">
            <div className="glass-card p-3">
              <p className="text-xs text-muted-foreground">
                Dataset: 411 survey responses analyzing mobile ad fatigue patterns.
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
