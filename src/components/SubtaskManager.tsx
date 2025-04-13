import { useState } from "react";
import { SubTask } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, Lock } from "lucide-react";
import { useTodo } from "@/contexts/TodoContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubtaskManagerProps {
  todoId: string;
  subtasks: SubTask[];
  isEditing?: boolean;
}

export function SubtaskManager({ todoId, subtasks, isEditing = false }: SubtaskManagerProps) {
  const { addSubtask, deleteSubtask, toggleSubtaskCompletion } = useTodo();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      addSubtask(todoId, newSubtaskTitle);
      setNewSubtaskTitle("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSubtask();
    }
  };

  // Determine if a subtask is locked based on previous subtasks completion status
  const isSubtaskLocked = (index: number) => {
    if (index === 0) return false; // First subtask is never locked
    
    // Check if all previous subtasks are completed
    for (let i = 0; i < index; i++) {
      if (!subtasks[i].completed) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="space-y-3">
      {subtasks.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {subtasks.map((subtask, index) => {
            const locked = isSubtaskLocked(index);
            return (
              <div key={subtask.id} className="flex items-center">
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="relative mr-2">
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={() => {
                            if (!locked) {
                              toggleSubtaskCompletion(todoId, subtask.id);
                            }
                          }}
                          className={cn(
                            "transition-all duration-300",
                            locked ? "opacity-50 cursor-not-allowed" : ""
                          )}
                          disabled={locked}
                        />
                        {locked && (
                          <div className="absolute -top-2 -right-2 bg-secondary rounded-full p-0.5 shadow-sm">
                            <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    {locked && (
                      <TooltipContent side="top" className="text-xs">
                        <p>Complete previous subtasks first</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <Badge 
                  variant="secondary"
                  className={cn(
                    "px-2 py-1 flex items-center gap-1 text-xs",
                    subtask.completed ? "opacity-60" : "",
                    locked ? "bg-muted/50" : ""
                  )}
                >
                  <span className={cn(
                    subtask.completed ? "line-through text-muted-foreground" : "",
                    locked ? "text-muted-foreground" : ""
                  )}>
                    {subtask.title}
                  </span>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => deleteSubtask(todoId, subtask.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
      
      {isEditing && (
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="Add a subtask..."
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 text-sm"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleAddSubtask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
