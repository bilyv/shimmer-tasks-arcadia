
import React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { Todo } from "@/types/todo";

interface TodoItemHeaderProps {
  title: string;
  description?: string;
  dueDate: Date | null;
  completed: boolean;
  categoryName: string;
  categoryColor: string;
  priority: "low" | "medium" | "high";
}

export function TodoItemHeader({
  title,
  description,
  dueDate,
  completed,
  categoryName,
  categoryColor,
  priority
}: TodoItemHeaderProps) {
  const priorityColor = {
    low: "bg-green-500/10 text-green-600 border-green-500/20",
    medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    high: "bg-red-500/10 text-red-600 border-red-500/30",
  }[priority];
  
  const priorityLabel = {
    low: "Low",
    medium: "Medium",
    high: "High",
  }[priority];

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
        <h3 className={cn(
          "font-medium text-base break-words",
          completed && "line-through text-muted-foreground"
        )}>
          {title}
        </h3>
        
        <div className="flex items-center gap-2 flex-wrap mt-1 sm:mt-0">
          <div 
            className="text-xs px-2 py-0.5 rounded-full" 
            style={{ backgroundColor: `${categoryColor}20`, color: categoryColor, borderColor: `${categoryColor}40` }}
          >
            {categoryName}
          </div>
          
          <div className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            priorityColor
          )}>
            {priorityLabel}
          </div>
        </div>
      </div>
      
      {description && (
        <p className={cn(
          "text-sm text-muted-foreground break-words mr-6 mb-2",
          completed && "line-through"
        )}>
          {description}
        </p>
      )}
      
      <div className="flex items-center text-xs text-muted-foreground mt-2">
        <Clock className="h-3 w-3 mr-1" />
        <span>
          {dueDate 
            ? format(new Date(dueDate), "dd MMM yyyy") 
            : "No due date"}
        </span>
      </div>
    </div>
  );
}
