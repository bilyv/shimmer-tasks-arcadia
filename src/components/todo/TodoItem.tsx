
import React, { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { cn } from "@/lib/utils";
import { Todo } from "@/types/todo";
import { Checkbox } from "@/components/ui/checkbox";
import { TodoDialog } from "@/components/TodoDialog";
import { TodoItemHeader } from "./TodoItemHeader";
import { TodoItemActions } from "./TodoItemActions";
import { TodoItemSubtasks } from "./TodoItemSubtasks";
import { TodoItemDeleteDialog } from "./TodoItemDeleteDialog";

interface TodoItemProps {
  todo: Todo;
  categoryColor: string;
  onShare?: () => void;
}

export function TodoItem({ todo, categoryColor, onShare }: TodoItemProps) {
  const { toggleTodoCompletion, deleteTodo, getCategoryName } = useTodo();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const handleToggleCompleted = () => {
    toggleTodoCompletion(todo.id);
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
  
  const handleShare = () => {
    if (onShare && typeof onShare === 'function') {
      onShare();
    }
  };
  
  const categoryName = getCategoryName(todo.categoryId);
  
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
        
        <TodoItemHeader
          title={todo.title}
          description={todo.description}
          dueDate={todo.dueDate}
          completed={todo.completed}
          categoryName={categoryName}
          categoryColor={categoryColor}
          priority={todo.priority}
        />
        
        <TodoItemActions
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShare={handleShare}
        />
      </div>
      
      <TodoItemSubtasks subtasks={todo.subtasks} />
      
      <TodoDialog 
        mode="edit"
        todo={todo}
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
      />
      
      <TodoItemDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
