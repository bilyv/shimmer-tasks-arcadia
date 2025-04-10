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
import { Plus, CheckSquare, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Todo } from "@/types/todo";
import { TaskCalendarView } from "./TaskCalendarView";
import { format } from "date-fns";
import { getDateGroup, sortDateGroups, type DateGroup } from "@/utils/dateUtils";
import { Separator } from "@/components/ui/separator";
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

export function TodoList() {
  const { todos, categories, filterTodos, clearCompletedTodos } = useTodo();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "priority">("newest");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const isMobile = useIsMobile();
  
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [groupedTodos, setGroupedTodos] = useState<Record<DateGroup, Todo[]>>({});
  
  useEffect(() => {
    let filtered = filterTodos(searchQuery, selectedCategory || undefined, showCompleted ? undefined : false, selectedDate);
    
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
    
    const groups: Record<DateGroup, Todo[]> = {};
    filtered.forEach(todo => {
      const dateGroup = getDateGroup(todo.dueDate);
      if (!groups[dateGroup]) {
        groups[dateGroup] = [];
      }
      groups[dateGroup].push(todo);
    });
    
    setGroupedTodos(groups);
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
  
  const completedCount = todos.filter((todo) => todo.completed).length;
  
  return (
    <div className="min-h-screen pb-6">
      <div className="container mx-auto px-4 py-2 max-w-4xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
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
        
        <div className="mt-6 mb-5">
          <CategorySelect
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        
        <div className="mb-5">
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
          {Object.keys(groupedTodos).length > 0 ? (
            sortDateGroups(Object.keys(groupedTodos) as DateGroup[]).map((dateGroup) => (
              <div key={dateGroup} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-sm font-medium text-muted-foreground px-2 py-1 bg-muted/50 rounded-md">
                    {dateGroup}
                  </div>
                  <Separator className="flex-grow opacity-30" />
                </div>
                <div className="space-y-4">
                  {groupedTodos[dateGroup].map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      categoryColor={getCategoryColor(todo.categoryId)}
                    />
                  ))}
                </div>
              </div>
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
        
        <footer className="mt-12 text-center text-xs text-muted-foreground pb-4">
          Developed by nk_b.r.i.a.n
        </footer>
      </div>
    </div>
  );
}
