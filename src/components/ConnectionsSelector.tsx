import React, { useState, useEffect } from "react";
import { Connection, Todo } from "@/types/todo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, CheckCircle2, User, Calendar, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ConnectionsSelectorProps {
  onSelectConnections: (connections: Connection[]) => void;
  onClose: () => void;
  todo: Todo; // Add todo prop to show task information
}

// Mock connections data - in a real app, this would come from an API or context
const MOCK_CONNECTIONS: Connection[] = [
  { id: "c1", name: "Alex Johnson", email: "alex@example.com", avatar: "https://i.pravatar.cc/150?u=alex" },
  { id: "c2", name: "Jamie Smith", email: "jamie@example.com", avatar: "https://i.pravatar.cc/150?u=jamie" },
  { id: "c3", name: "Taylor Brown", email: "taylor@example.com", avatar: "https://i.pravatar.cc/150?u=taylor" },
  { id: "c4", name: "Morgan Lee", email: "morgan@example.com", avatar: "https://i.pravatar.cc/150?u=morgan" },
  { id: "c5", name: "Casey Wilson", email: "casey@example.com", avatar: "https://i.pravatar.cc/150?u=casey" },
  { id: "c6", name: "Jordan Davis", email: "jordan@example.com", avatar: "https://i.pravatar.cc/150?u=jordan" },
];

export function ConnectionsSelector({ onSelectConnections, onClose, todo }: ConnectionsSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [connections, setConnections] = useState<Connection[]>(MOCK_CONNECTIONS);
  const [selectedConnectionIds, setSelectedConnectionIds] = useState<Set<string>>(new Set());
  
  // Filter connections based on search query
  const filteredConnections = connections.filter(connection => 
    connection.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    connection.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleToggleConnection = (connectionId: string) => {
    setSelectedConnectionIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(connectionId)) {
        newSet.delete(connectionId);
      } else {
        newSet.add(connectionId);
      }
      return newSet;
    });
  };
  
  const handleShare = () => {
    const selectedConnections = connections.filter(c => selectedConnectionIds.has(c.id));
    onSelectConnections(selectedConnections);
  };
  
  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
        <Input
          placeholder="Search connections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 py-1 h-8 text-sm"
        />
      </div>
      
      {/* Task summary card */}
      <div className="rounded-md bg-muted/50 p-2 text-xs">
        <div className="flex items-start">
          <Info className="h-3.5 w-3.5 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">You'll share:</h4>
            <div className="space-y-1 text-muted-foreground">
              <div className="flex items-center gap-1 truncate">
                <span className="font-medium">Task:</span> {todo.title}
              </div>
              {todo.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(todo.dueDate), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-40 overflow-y-auto pr-1">
        {filteredConnections.length > 0 ? (
          <ul className="space-y-1">
            {filteredConnections.map((connection) => {
              const isSelected = selectedConnectionIds.has(connection.id);
              return (
                <li key={connection.id}>
                  <button
                    className={cn(
                      "w-full flex items-center py-1.5 px-2 rounded-md text-sm",
                      "transition-colors duration-200",
                      isSelected 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-accent"
                    )}
                    onClick={() => handleToggleConnection(connection.id)}
                  >
                    <div className="flex items-center flex-1">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={connection.avatar} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(connection.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{connection.name}</span>
                        <span className="text-xs text-muted-foreground">{connection.email}</span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted" />
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-muted-foreground text-sm">
            <User className="h-8 w-8 mb-2 opacity-40" />
            <p>No connections found</p>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-2 pt-2 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          disabled={selectedConnectionIds.size === 0}
          onClick={handleShare}
        >
          Share ({selectedConnectionIds.size})
        </Button>
      </div>
    </div>
  );
} 