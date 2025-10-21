import { Video, Map, BarChart3, Info } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";

const items = [
  { title: "Live Feed", url: "/", icon: Video },
  { title: "Map View", url: "/map", icon: Map },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "System Info", url: "/system", icon: Info },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-2xl font-bold gradient-text">RoadSafe AI</h1>
          <p className="text-xs text-muted-foreground mt-1">Hazard Detection System</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-primary/20 text-primary border-l-2 border-primary" 
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl">
          <div className="text-xs text-muted-foreground">Model Version</div>
          <div className="text-sm font-semibold text-primary">YOLOv11n</div>
          <div className="text-xs text-muted-foreground mt-2">Status</div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow"></div>
            <span className="text-xs font-medium">Active</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
