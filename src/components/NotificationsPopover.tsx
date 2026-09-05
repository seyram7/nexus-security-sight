import { useState } from "react";
import { Bell, AlertTriangle, Shield, Info, CheckCheck, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "critical",
    title: "Intrusion attempt blocked",
    message: "SQL injection attempt from 45.227.98.156 targeting web-server-01 was blocked.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "warning",
    title: "Unusual login activity",
    message: "Multiple failed login attempts detected on VPN gateway from unknown location.",
    time: "18 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "info",
    title: "Quick scan completed",
    message: "Force quick scan finished on 24 devices. No new threats found.",
    time: "1 hr ago",
    read: true,
  },
];

const typeConfig = {
  critical: { icon: AlertTriangle, color: "text-security-critical", badge: "bg-security-critical text-white" },
  warning: { icon: Shield, color: "text-security-warning", badge: "bg-security-warning text-black" },
  info: { icon: Info, color: "text-security-info", badge: "bg-security-info text-white" },
};

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-security-critical flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={markAllRead} disabled={unreadCount === 0}>
              <CheckCheck className="h-3 w-3 mr-1" />
              Read all
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={clearAll} disabled={notifications.length === 0}>
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((n) => {
              const config = typeConfig[n.type];
              const Icon = config.icon;
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start space-x-3 px-4 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 transition-colors",
                    !n.read && "bg-muted/30"
                  )}
                  onClick={() => markAsRead(n.id)}
                >
                  <Icon className={cn("h-4 w-4 mt-1 shrink-0", config.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className={cn("text-sm truncate", !n.read ? "font-semibold" : "font-medium")}>{n.title}</p>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(n.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              );
            })
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
