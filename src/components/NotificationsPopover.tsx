
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export function NotificationsPopover() {
  // Example notifications - in a real app, these would come from a context or API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Task Reminder",
      message: "Your task 'Complete Project Report' is due soon.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      title: "New Message",
      message: "Brian sent you a message about the meeting.",
      time: "Yesterday",
      read: false,
    },
    {
      id: "3",
      title: "System Update",
      message: "Your todo app has been updated to the latest version.",
      time: "3 days ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true,
    })));
  };

  const clearRead = () => {
    setNotifications(notifications.filter(notification => !notification.read));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 p-3">
          <h3 className="text-sm font-medium">Notifications</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            {notifications.some(n => n.read) && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearRead}>
                Clear read
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border/40">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-3 transition-colors hover:bg-muted/50",
                    !notification.read && "bg-muted/20"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-xs mt-1 text-muted-foreground">{notification.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
