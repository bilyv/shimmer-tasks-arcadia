
import React, { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { cn } from "@/lib/utils";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Check, Pencil, Trash, MoreHorizontal, Clock, Share2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TodoDialog } from "@/components/TodoDialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TodoItemProps {
  todo: Todo;
  categoryColor: string;
  onShare?: () => void;
}

export function TodoItem({ todo, categoryColor, onShare }: TodoItemProps) {
  const { toggleTodoCompleted, deleteTodo, getCategoryName } = useTodo();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const handleToggleCompleted = () => {
    toggleTodoCompleted(todo.id);
  };
  
  const handleDelete = () => {
    setShowDeleteDialog(true);
  };
  
  const handleEdit = () => {
    setShowEditDialog(true);
  };
  
  const handleDeleteConfirm = () => {
    deleteTodo(todo.id);
    setShowDeleteDialog(false);
  };
  
  const categoryName = getCategoryName(todo.categoryId);
  
  const priorityColor = {
    low: "bg-green-500/10 text-green-600 border-green-500/20",
    medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    high: "bg-red-500/10 text-red-600 border-red-500/30",
  }[todo.priority];
  
  const priorityLabel = {
    low: "Low",
    medium: "Medium",
    high: "High",
  }[todo.priority];
  
  return (
    <div className={cn(
      "flex flex-col rounded-xl border border-border/50 bg-card hover:border-border transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden",
      todo.completed && "opacity-80"
    )}>
      <div className="flex items-start gap-3 p-4">
        <div className="pt-1">
          <Checkbox 
            checked={todo.completed} 
            onCheckedChange={handleToggleCompleted}
            className="w-5 h-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
            <h3 className={cn(
              "font-medium text-base break-words",
              todo.completed && "line-through text-muted-foreground"
            )}>
              {todo.title}
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
          
          <p className={cn(
            "text-sm text-muted-foreground break-words mr-6 mb-2",
            todo.completed && "line-through"
          )}>
            {todo.description}
          </p>
          
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {todo.dueDate 
                ? format(new Date(todo.dueDate), "dd MMM yyyy") 
                : "No due date"}
            </span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {todo.subtasks.length > 0 && (
        <div className="px-4 pb-3 pt-0">
          <div className="text-xs font-medium mb-2">Subtasks ({todo.subtasks.filter(s => s.completed).length}/{todo.subtasks.length})</div>
          <div className="space-y-2">
            {todo.subtasks.map((subtask) => (
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
      )}
      
      <TodoDialog 
        mode="edit"
        todo={todo}
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
      />
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-xl animate-fade-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
