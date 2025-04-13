import React, { useState, useEffect } from "react";
import { X, Search, Check, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Mock data for connections - in a real app, this would come from an API or context
const MOCK_CONNECTIONS = [
  { id: "1", name: "Alex Johnson", avatar: "/avatars/alex.png", status: "online" },
  { id: "2", name: "Sarah Williams", avatar: "/avatars/sarah.png", status: "offline" },
  { id: "3", name: "Michael Brown", avatar: "/avatars/michael.png", status: "away" },
  { id: "4", name: "Jessica Taylor", avatar: "/avatars/jessica.png", status: "online" },
  { id: "5", name: "David Miller", avatar: "/avatars/david.png", status: "online" },
  { id: "6", name: "Emily Davis", avatar: "/avatars/emily.png", status: "offline" },
  { id: "7", name: "John Wilson", avatar: "/avatars/john.png", status: "away" },
  { id: "8", name: "Rebecca Smith", avatar: "/avatars/rebecca.png", status: "online" },
];

interface ConnectionSearchDialogProps {
  taskTitle: string;
  taskDueDate?: Date | null;
  taskPriority?: string;
  onClose: () => void;
  onShare: (connectionIds: string[]) => void;
}

export function ConnectionSearchDialog({
  taskTitle,
  taskDueDate,
  taskPriority,
  onClose,
  onShare,
}: ConnectionSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [filteredConnections, setFilteredConnections] = useState(MOCK_CONNECTIONS);

  // Filter connections based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConnections(MOCK_CONNECTIONS);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = MOCK_CONNECTIONS.filter((connection) =>
      connection.name.toLowerCase().includes(query)
    );
    setFilteredConnections(filtered);
  }, [searchQuery]);

  // Toggle connection selection
  const toggleConnectionSelection = (connectionId: string) => {
    setSelectedConnections((prev) => {
      if (prev.includes(connectionId)) {
        return prev.filter((id) => id !== connectionId);
      } else {
        return [...prev, connectionId];
      }
    });
  };

  // Handle share button click
  const handleShare = () => {
    onShare(selectedConnections);
  };

  // Get connection status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-arc-green";
      case "away":
        return "bg-arc-yellow";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-card rounded-xl shadow-lg w-full max-w-md animate-scale-in-out mx-4">
        <div className="px-4 py-3 flex justify-between items-center border-b">
          <h3 className="font-semibold text-base">Share with Connections</h3>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-lg"
              />
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Task Summary</h4>
            <div className="bg-muted/40 p-3 rounded-lg text-sm">
              <p className="font-medium">{taskTitle}</p>
              {taskDueDate && (
                <p className="text-muted-foreground text-xs mt-1">
                  Due: {taskDueDate.toLocaleDateString()}
                </p>
              )}
              {taskPriority && (
                <p className="text-muted-foreground text-xs">
                  Priority: {taskPriority.charAt(0).toUpperCase() + taskPriority.slice(1)}
                </p>
              )}
            </div>
          </div>

          <ScrollArea className="h-64 rounded-md border">
            <div className="p-1">
              {filteredConnections.length > 0 ? (
                filteredConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className={cn(
                      "flex items-center p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors gap-3",
                      selectedConnections.includes(connection.id) ? "bg-accent/70" : ""
                    )}
                    onClick={() => toggleConnectionSelection(connection.id)}
                  >
                    <Checkbox
                      checked={selectedConnections.includes(connection.id)}
                      onCheckedChange={() => toggleConnectionSelection(connection.id)}
                      className="mr-1"
                    />
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={connection.avatar} alt={connection.name} />
                        <AvatarFallback>
                          {connection.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                          getStatusColor(connection.status)
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{connection.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {connection.status}
                      </p>
                    </div>
                    {selectedConnections.includes(connection.id) && (
                      <UserCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">No connections found</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={selectedConnections.length === 0}
              className={
                selectedConnections.length ? "bg-primary hover:bg-primary/90" : "opacity-50"
              }
            >
              <Check className="mr-2 h-4 w-4" />
              Share ({selectedConnections.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 