
import { Home, Plus, Users, User } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

// Navigation items for both sidebar and bottom tab bar
export const navigationItems = [
  {
    name: "Home",
    icon: Home,
    path: "/",
  },
  {
    name: "Create",
    icon: Plus,
    path: "/create",
  },
  {
    name: "Connections",
    icon: Users,
    path: "/connections",
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
];

export function NavigationSidebar() {
  const isMobile = useIsMobile();
  
  // Don't render the sidebar on mobile
  if (isMobile) return null;
  
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar side="left" collapsible="icon" variant="floating" className="top-16 h-[calc(100vh-4rem)]">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="h-5 w-5" />
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
