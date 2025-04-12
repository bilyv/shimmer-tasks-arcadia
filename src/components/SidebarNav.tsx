import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle, Users, Calendar } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavItem = {
  icon: JSX.Element;
  label: string;
  path: string;
};

export function SidebarNav() {
  const [activeItem, setActiveItem] = useState<string>("home");
  const location = useLocation();

  // Map path to item name
  const pathToItemMap: Record<string, string> = {
    "/": "home",
    "/create": "create",
    "/connections": "connections",
    "/schedule": "schedule",
  };

  // Update active item when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    if (pathToItemMap[currentPath]) {
      setActiveItem(pathToItemMap[currentPath]);
    }
  }, [location.pathname]);

  const navItems: NavItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Home",
      path: "/",
    },
    {
      icon: <PlusCircle className="h-5 w-5" />,
      label: "Create",
      path: "/create",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Connections",
      path: "/connections",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Schedule",
      path: "/schedule",
    },
  ];

  return (
    <div className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 flex-col items-center border-r border-border/40 bg-background/90 backdrop-blur-md py-4 z-40">
      <TooltipProvider>
        <div className="flex flex-col items-center gap-4">
          {navItems.map((item) => (
            <Tooltip key={item.label} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  onClick={() => setActiveItem(item.label.toLowerCase())}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10 rounded-md",
                      activeItem === item.label.toLowerCase()
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    {item.icon}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
} 