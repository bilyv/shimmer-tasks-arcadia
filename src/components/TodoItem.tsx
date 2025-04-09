
import React, { useState } from "react";
import { Todo, Priority } from "@/types/todo";
import { useTodo } from "@/contexts/TodoContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Check, Trash2, Edit, Calendar, AlertCircle, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TodoDialog } from "./TodoDialog";
import { SubtaskManager } from "./SubtaskManager";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

interface TodoItemProps {
  todo: Todo;
  categoryColor: string;
}

export function TodoItem({ todo, categoryColor }: TodoItemProps) {
  const { toggleTodoCompletion, deleteTodo } = useTodo();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    toggleTodoCompletion(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleShare = () => {
    // In a real application, this would open a share dialog or copy a shareable link
    navigator.clipboard.writeText(`Task: ${todo.title} - Due: ${todo.dueDate ? format(new Date(todo.dueDate), "MMM d, yyyy") : "No due date"}`);
    toast.success("Task details copied to clipboard", {
      description: "You can now share it with others",
      duration: 3000,
    });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "bg-arc-red";
      case "medium":
        return "bg-arc-yellow";
      case "low":
        return "bg-arc-green";
      default:
        return "bg-arc-gray";
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };
  
  const completedSubtasks = todo.subtasks.filter(st => st.completed).length;
  const hasSubtasks = todo.subtasks.length > 0;

  return (
    <>
      <div
        className={cn(
          "task-card group relative",
          todo.completed ? "opacity-60" : "",
          "animate-fade-in transition-all duration-300",
          isHovered ? "scale-[1.02] shadow-md" : "scale-100",
          "hover:bg-accent/20"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="category-indicator"
          style={{ backgroundColor: categoryColor }}
        />
        
        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={handleToggle}
              className={cn(
                "transition-all duration-300",
                todo.completed ? "opacity-100" : "opacity-70 group-hover:opacity-100"
              )}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3
                className={cn(
                  "font-medium text-lg mb-1 transition-all duration-300",
                  todo.completed ? "line-through text-muted-foreground" : ""
                )}
              >
                {todo.title}
              </h3>
              
              <div className="flex gap-1">
                <div
                  className={cn(
                    "priority-dot",
                    getPriorityColor(todo.priority),
                    "tooltip-trigger"
                  )}
                  data-tooltip={`Priority: ${getPriorityLabel(todo.priority)}`}
                ></div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="sr-only">Open menu</span>
                      <svg
                        width="15"
                        height="3"
                        viewBox="0 0 15 3"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="scale-125"
                      >
                        <path
                          d="M1.5 1.5C1.5 1.89782 1.65804 2.27936 1.93934 2.56066C2.22064 2.84196 2.60218 3 3 3C3.39782 3 3.77936 2.84196 4.06066 2.56066C4.34196 2.27936 4.5 1.89782 4.5 1.5C4.5 1.10218 4.34196 0.720644 4.06066 0.43934C3.77936 0.158035 3.39782 0 3 0C2.60218 0 2.22064 0.158035 1.93934 0.43934C1.65804 0.720644 1.5 1.10218 1.5 1.5ZM6 1.5C6 1.89782 6.15804 2.27936 6.43934 2.56066C6.72064 2.84196 7.10218 3 7.5 3C7.89782 3 8.27936 2.84196 8.56066 2.56066C8.84196 2.27936 9 1.89782 9 1.5C9 1.10218 8.84196 0.720644 8.56066 0.43934C8.27936 0.158035 7.89782 0 7.5 0C7.10218 0 6.72064 0.158035 6.43934 0.43934C6.15804 0.720644 6 1.10218 6 1.5ZM10.5 1.5C10.5 1.89782 10.658 2.27936 10.9393 2.56066C11.2206 2.84196 11.6022 3 12 3C12.3978 3 12.7794 2.84196 13.0607 2.56066C13.342 2.27936 13.5 1.89782 13.5 1.5C13.5 1.10218 13.342 0.720644 13.0607 0.43934C12.7794 0.158035 12.3978 0 12 0C11.6022 0 11.2206 0.158035 10.9393 0.43934C10.658 0.720644 10.5 1.10218 10.5 1.5Z"
                          fill="currentColor"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {todo.description && (
              <p
                className={cn(
                  "text-sm text-muted-foreground mb-2",
                  todo.completed ? "line-through" : ""
                )}
              >
                {todo.description}
              </p>
            )}
            
            {hasSubtasks && (
              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="my-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Subtasks: {completedSubtasks}/{todo.subtasks.length}
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-5 w-5">
                      {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-2">
                  <SubtaskManager todoId={todo.id} subtasks={todo.subtasks} />
                </CollapsibleContent>
              </Collapsible>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              {todo.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {format(new Date(todo.dueDate), "MMM d, yyyy")}
                  </span>
                </div>
              )}
              
              {todo.priority === "high" && !todo.completed && (
                <div className="flex items-center gap-1 text-arc-red animate-pulse">
                  <AlertCircle className="h-3 w-3" />
                  <span>High Priority</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showEditDialog && (
        <TodoDialog
          mode="edit"
          todo={todo}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}
    </>
  );
}
