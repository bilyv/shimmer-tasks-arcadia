
import React, { useState } from "react";
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
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Task Assigned",
      message: "You have been assigned a new high priority task.",
      time: "Just now",
      read: false,
    },
    {
      id: "2",
      title: "Task Completed",
      message: "Great job! You've completed all your tasks for yesterday.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "3",
      title: "Reminder",
      message: "Don't forget about your meeting at 3 PM today.",
      time: "5 hours ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-arc-purple text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 rounded-xl"
        sideOffset={8}
      >
        <div className="flex items-center justify-between bg-muted/40 p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[350px] overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={cn(
                    "flex flex-col text-left p-3 border-b last:border-0 hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-muted/30"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">
                      {notification.title}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-arc-purple absolute top-3 right-3"></span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <p className="text-muted-foreground text-sm mb-1">No notifications</p>
              <p className="text-xs text-muted-foreground">
                When you get notifications, they'll show up here.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
