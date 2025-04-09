
import React, { useState, useRef } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
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

  // Track touch/swipe events
  const touchStartX = useRef<number | null>(null);
  const swipingItemId = useRef<string | null>(null);
  const swipeThreshold = 80; // Pixels to trigger deletion

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast({
      title: "All read",
      description: "All notifications marked as read",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast({
      title: "Notification deleted",
      description: "Notification has been removed",
    });
  };

  const clearReadNotifications = () => {
    const readNotifications = notifications.filter((n) => n.read);
    if (readNotifications.length === 0) {
      toast({
        title: "No read notifications",
        description: "There are no read notifications to clear",
      });
      return;
    }
    
    setNotifications(notifications.filter((n) => !n.read));
    toast({
      title: "Cleared",
      description: `${readNotifications.length} read notification(s) cleared`,
    });
  };

  // Handle touch events for swipe-to-delete
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    touchStartX.current = e.touches[0].clientX;
    swipingItemId.current = id;
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    if (!touchStartX.current || swipingItemId.current !== id) return;
    
    const touchX = e.touches[0].clientX;
    const diff = touchStartX.current - touchX;
    
    const element = e.currentTarget as HTMLElement;
    
    // Limit swipe distance
    if (Math.abs(diff) > swipeThreshold) {
      const direction = diff > 0 ? -swipeThreshold : swipeThreshold;
      element.style.transform = `translateX(${direction}px)`;
      element.style.opacity = "0.5";
    } else {
      element.style.transform = `translateX(${-diff}px)`;
      element.style.opacity = "1";
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, id: string) => {
    if (!touchStartX.current || swipingItemId.current !== id) return;
    
    const element = e.currentTarget as HTMLElement;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Reset styles
    element.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    
    // If swiped far enough, delete the notification
    if (Math.abs(diff) > swipeThreshold) {
      if (notifications.find(n => n.id === id)?.read) {
        element.style.transform = `translateX(${diff > 0 ? "-100%" : "100%"})`;
        element.style.opacity = "0";
        setTimeout(() => {
          deleteNotification(id);
        }, 300);
      } else {
        element.style.transform = "translateX(0)";
        element.style.opacity = "1";
        toast({
          title: "Cannot delete",
          description: "Mark notification as read before deleting",
        });
      }
    } else {
      element.style.transform = "translateX(0)";
      element.style.opacity = "1";
    }
    
    touchStartX.current = null;
    swipingItemId.current = null;
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
        className="w-72 p-0 rounded-xl"
        sideOffset={8}
      >
        <div className="flex items-center justify-between bg-muted/40 p-2 border-b">
          <h3 className="font-semibold text-sm pl-2">Notifications</h3>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Check className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearReadNotifications}
              className="h-7 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Clear read
            </Button>
          </div>
        </div>
        <div className="max-h-[280px] overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={cn(
                    "flex flex-col text-left p-2 border-b last:border-0 hover:bg-muted/30 transition-colors relative",
                    !notification.read && "bg-muted/20"
                  )}
                  onClick={() => markAsRead(notification.id)}
                  onTouchStart={(e) => handleTouchStart(e, notification.id)}
                  onTouchMove={(e) => handleTouchMove(e, notification.id)}
                  onTouchEnd={(e) => handleTouchEnd(e, notification.id)}
                  style={{ touchAction: "pan-x", transition: "transform 0.2s ease" }}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-xs">
                      {notification.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-1">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 pr-4 line-clamp-2">
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-arc-purple absolute top-2 right-2"></span>
                  )}
                  {notification.read && (
                    <span className="text-[10px] text-muted-foreground absolute bottom-2 right-2 italic">
                      Swipe to delete
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
              <p className="text-muted-foreground text-sm mb-1">All clear!</p>
              <p className="text-xs text-muted-foreground">
                You don't have any notifications.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
