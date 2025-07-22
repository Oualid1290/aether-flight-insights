import { 
  BarChart3, 
  Plane, 
  Upload, 
  Settings, 
  FileText, 
  Wrench,
  Shield,
  Activity,
  Map,
  TrendingUp
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Flight Analysis",
    url: "/analysis",
    icon: Upload,
    badge: null,
  },
  {
    title: "Fleet Management",
    url: "/fleet",
    icon: Plane,
    badge: "3",
  },
  {
    title: "Telemetry",
    url: "/telemetry",
    icon: Activity,
    badge: null,
  },
  {
    title: "Flight Maps",
    url: "/maps",
    icon: Map,
    badge: null,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    badge: null,
  },
  {
    title: "Maintenance",
    url: "/maintenance",
    icon: Wrench,
    badge: "2",
  },
  {
    title: "Risk Assessment",
    url: "/risk",
    icon: Shield,
    badge: null,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: TrendingUp,
    badge: null,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    badge: null,
  },
];

export function AppSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-border/40 bg-card/50 backdrop-blur-md">
      <SidebarHeader className="border-b border-border/40 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-aviation-blue text-primary-foreground">
            <Plane className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-aviation-blue">FlightIQ</h2>
            <p className="text-xs text-muted-foreground">Aviation Analytics</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                        isActive(item.url)
                          ? "bg-aviation-blue text-primary-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-aviation-blue text-xs text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                        isActive(item.url)
                          ? "bg-aviation-blue text-primary-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}