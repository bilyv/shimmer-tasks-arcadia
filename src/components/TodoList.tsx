
import { useState, useEffect } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { TodoItem } from "./TodoItem";
import { EmptyState } from "./EmptyState";
import { CategorySelect } from "./CategorySelect";
import { SearchAndFilters } from "./SearchAndFilters";
import { StatsDisplay } from "./StatsDisplay";
import { TodoDialog } from "./TodoDialog";
import { GreetingHeader } from "./GreetingHeader";
import { Button } from "@/components/ui/button";
import { Plus, CheckSquare, Calendar, Share2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Todo } from "@/types/todo";
import { TaskCalendarView } from "./TaskCalendarView";
import { format } from "date-fns";
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
import { useToast } from "@/hooks/use-toast";

export function TodoList() {
  const { todos, categories, filterTodos, clearCompletedTodos } = useTodo();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "priority">("newest");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  
  useEffect(() => {
    // First, filter the todos
    let filtered = filterTodos(searchQuery, selectedCategory || undefined, showCompleted ? undefined : false, selectedDate);
    
    // Then, sort them
    filtered = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "priority": {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        default:
          return 0;
      }
    });
    
    setFilteredTodos(filtered);
  }, [todos, selectedCategory, searchQuery, showCompleted, sortOrder, filterTodos, selectedDate]);
  
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.color || "#8E9196";
  };
  
  const handleAddTask = () => {
    setShowAddDialog(true);
  };
  
  const handleClearCompleted = () => {
    setShowClearDialog(true);
  };
  
  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleShareTask = (todo: Todo) => {
    setSelectedTodo(todo);
    setShowShareDialog(true);
  };

  const handleShare = () => {
    if (selectedTodo) {
      // In a real app, this would generate and copy a sharing link
      // For now, we'll just show a toast
      navigator.clipboard.writeText(`Task: ${selectedTodo.title} - Share this to collaborate!`)
        .then(() => {
          toast({
            title: "Link copied!",
            description: "Share link has been copied to clipboard",
          });
          setShowShareDialog(false);
        })
        .catch(err => {
          toast({
            title: "Failed to copy link",
            description: "Please try again",
            variant: "destructive",
          });
        });
    }
  };
  
  const completedCount = todos.filter((todo) => todo.completed).length;
  
  return (
    <div className="min-h-screen pb-6">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
            <GreetingHeader />
            {selectedDate && (
              <div className="text-sm text-muted-foreground mt-1">
                Showing tasks for {format(selectedDate, "MMMM d, yyyy")}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {completedCount > 0 && (
              <Button
                variant="outline"
                onClick={handleClearCompleted}
                className="gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Clear Completed
                <span className="ml-1 text-xs bg-muted rounded-full px-1.5 py-0.5">
                  {completedCount}
                </span>
              </Button>
            )}
            
            <Button onClick={handleAddTask} className="arc-gradient hover:opacity-90 gap-2">
              <Plus className="h-4 w-4" />
              {isMobile ? "Add" : "Add Task"}
            </Button>
          </div>
        </header>
        
        <StatsDisplay />
        
        <div className="mt-5 mb-4">
          <CategorySelect
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        
        <div className="mb-4">
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            showCompleted={showCompleted}
            onShowCompletedChange={setShowCompleted}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onCalendarToggle={handleCalendarToggle}
            isCalendarVisible={showCalendar}
          />
        </div>
        
        {showCalendar && (
          <TaskCalendarView 
            onSelectDate={handleDateSelect}
            selectedDate={selectedDate}
          />
        )}
        
        <div className="space-y-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                categoryColor={getCategoryColor(todo.categoryId)}
                onShare={() => handleShareTask(todo)}
              />
            ))
          ) : (
            <EmptyState
              title={selectedDate ? "No tasks for this date" : "No tasks found"}
              description={
                selectedDate 
                  ? `There are no tasks scheduled for ${format(selectedDate, "MMMM d, yyyy")}.`
                  : searchQuery
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "You don't have any tasks yet. Add your first task to get started!"
              }
              actionLabel={searchQuery || selectedDate ? undefined : "Add Your First Task"}
              onAction={searchQuery || selectedDate ? undefined : handleAddTask}
            />
          )}
        </div>
        
        <TodoDialog
          mode="create"
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
        />
        
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent className="rounded-xl animate-fade-in">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear completed tasks?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all completed tasks. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  clearCompletedTodos();
                  setShowClearDialog(false);
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <AlertDialogContent className="rounded-xl animate-fade-in">
            <AlertDialogHeader>
              <AlertDialogTitle>Share this task</AlertDialogTitle>
              <AlertDialogDescription>
                Share this task with your team members or friends to collaborate.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-md my-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm truncate">
                {selectedTodo?.title}
              </span>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleShare}
                className="bg-primary hover:bg-primary/90"
              >
                Copy Link
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <footer className="mt-12 text-center text-xs text-muted-foreground pb-4">
          Developed by nk_b.r.i.a.n
        </footer>
      </div>
    </div>
  );
}
