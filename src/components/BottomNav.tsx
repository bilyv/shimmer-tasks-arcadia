import { useState } from "react";
import { cn } from "@/lib/utils";
import { Home, PlusCircle, Users, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

type TabItem = {
  icon: JSX.Element;
  label: string;
  path: string;
};

export function BottomNav() {
  const [activeTab, setActiveTab] = useState<string>("home");

  const tabs: TabItem[] = [
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
      icon: <UserCircle className="h-5 w-5" />,
      label: "Profile",
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background/90 backdrop-blur-md border-t border-border/40 md:hidden">
      <div className="grid h-full grid-cols-4">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            to={tab.path}
            className={cn(
              "flex flex-col items-center justify-center",
              activeTab === tab.label.toLowerCase() 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
            onClick={() => setActiveTab(tab.label.toLowerCase())}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
} 