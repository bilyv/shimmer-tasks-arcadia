
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BellRing, Info, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface NotificationsDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

// Sample notifications data
const notifications = [
  {
    id: "1",
    title: "Task deadline approaching",
    description: "Project proposal is due tomorrow",
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    type: "deadline" as const,
  },
  {
    id: "2",
    title: "Task assigned to you",
    description: "Sarah assigned you to Design Review",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    type: "assignment" as const,
  },
  {
    id: "3",
    title: "Task completed",
    description: "You completed Backend API Integration",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    type: "completion" as const,
  },
];

export function NotificationsDropdown({
  open,
  onOpenChange,
  trigger,
}: NotificationsDropdownProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <Info className="h-4 w-4 text-arc-yellow" />;
      case "assignment":
        return <BellRing className="h-4 w-4 text-arc-blue" />;
      case "completion":
        return <Check className="h-4 w-4 text-arc-green" />;
      default:
        return <BellRing className="h-4 w-4" />;
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const mins = Math.round(diffInHours * 60);
      return `${mins} min${mins !== 1 ? 's' : ''} ago`;
    }
    
    if (diffInHours < 24) {
      const hours = Math.round(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    return format(date, 'MMM d');
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-xl" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium text-md">Notifications</h3>
          {unreadCount > 0 && (
            <div className="bg-arc-red/10 text-arc-red text-xs font-medium rounded-full px-2 py-0.5">
              {unreadCount} new
            </div>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No notifications yet
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "flex p-3 border-b last:border-0 gap-3 hover:bg-accent/50 transition-colors",
                  notification.read ? "" : "bg-accent/20"
                )}
              >
                <div className="mt-1 h-8 w-8 rounded-full flex items-center justify-center bg-background border">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className={cn(
                      "text-sm font-medium",
                      notification.read ? "" : "text-foreground"
                    )}>
                      {notification.title}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatNotificationTime(notification.date)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {notification.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
