
import React from "react";
import { cn } from "@/lib/utils";
import { SubTask } from "@/types/todo";
import { Check } from "lucide-react";

interface TodoItemSubtasksProps {
  subtasks: SubTask[];
}

export function TodoItemSubtasks({ subtasks }: TodoItemSubtasksProps) {
  if (subtasks.length === 0) {
    return null;
  }

  return (
    <div className="px-4 pb-3 pt-0">
      <div className="text-xs font-medium mb-2">
        Subtasks ({subtasks.filter(s => s.completed).length}/{subtasks.length})
      </div>
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              {subtask.completed ? (
                <Check className="h-3 w-3 text-muted-foreground" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              )}
            </div>
            <span className={cn(
              "text-xs",
              subtask.completed && "line-through text-muted-foreground"
            )}>
              {subtask.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
