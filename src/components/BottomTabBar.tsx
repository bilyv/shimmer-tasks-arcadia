
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { navigationItems } from "./NavigationSidebar";

export function BottomTabBar() {
  const isMobile = useIsMobile();
  
  // Only render on mobile
  if (!isMobile) return null;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t border-border/40">
      <div className="grid grid-cols-4 h-14">
        {navigationItems.map((item) => {
          const isCurrentPath = window.location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs",
                isCurrentPath 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-primary/80"
              )}
            >
              <item.icon className={cn("h-5 w-5", isCurrentPath && "text-primary")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
