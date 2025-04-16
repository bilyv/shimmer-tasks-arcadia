import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, startOfWeek, endOfWeek, isWithinInterval, isBefore, startOfToday, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  List, 
  Clock, 
  ClipboardList,
  InfoIcon,
  CalendarClock,
  Check,
  Edit,
  Filter,
  Plus
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TodoDialog } from "@/components/TodoDialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Schedule = () => {
  const { todos, toggleTodoCompletion, updateTodo } = useTodo();
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [taskFilter, setTaskFilter] = useState<"all" | "overdue" | "upcoming">("all");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [reschedulingTaskId, setReschedulingTaskId] = useState<string | null>(null);
  const [reschedulingDate, setReschedulingDate] = useState<Date | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Handler for date selection that prevents selecting dates before today
  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isBefore(date, today)) {
      setSelectedDate(date);
    }
  };

  // Helper function to get task density color
  const getTaskDensityColor = (count: number): string => {
    if (count > 10) return "bg-red-500";
    if (count > 5) return "bg-yellow-500";
    if (count > 0) return "bg-green-500";
    return "";
  };

  // Custom day content renderer to show task counts and style past dates
  const renderDayContent = (day: Date) => {
    const taskCount = todos.filter(todo => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      return dueDate.getDate() === day.getDate() && 
             dueDate.getMonth() === day.getMonth() && 
             dueDate.getFullYear() === day.getFullYear();
    }).length;

    const isPastDate = isBefore(day, today);
    const densityColor = getTaskDensityColor(taskCount);

    return (
      <div className={`relative w-full h-full flex items-center justify-center ${isPastDate ? 'text-muted-foreground opacity-50' : ''}`}>
        {densityColor && (
          <div 
            className={`absolute inset-0 opacity-20 rounded-md ${densityColor}`}
            aria-hidden="true"
          />
        )}
        <div className="relative z-10">{format(day, "d")}</div>
        {taskCount > 0 && (
          <span className={`absolute bottom-0 right-0 -mr-1 -mb-1 flex items-center justify-center ${densityColor} text-[0.5rem] text-white w-3 h-3 rounded-full z-20`}>
            {taskCount}
          </span>
        )}
      </div>
    );
  };

  // Filter todos for the selected date and apply additional filters
  const getFilteredTodos = () => {
    // Base filtering by date view
    let filtered = todos.filter(todo => {
      if (!todo.dueDate) return false;
      
      if (!selectedDate) return false;
    
    if (viewMode === "day") {
      // For day view, match the exact date
      const todoDate = new Date(todo.dueDate);
      return isSameDay(todoDate, selectedDate);
    } else if (viewMode === "week") {
      // For week view, check if the todo is within the selected week
      const todoDate = new Date(todo.dueDate);
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      return isWithinInterval(todoDate, { start: weekStart, end: weekEnd });
    } else if (viewMode === "month") {
      // For month view, match the month and year
      const todoDate = new Date(todo.dueDate);
      return todoDate.getMonth() === selectedDate.getMonth() && 
             todoDate.getFullYear() === selectedDate.getFullYear();
    }
    
    return false;
  });
    
    // Apply additional filtering based on taskFilter
    if (taskFilter === "overdue") {
      filtered = filtered.filter(todo => {
        if (!todo.dueDate) return false;
        return isBefore(new Date(todo.dueDate), today) && !todo.completed;
      });
    } else if (taskFilter === "upcoming") {
      filtered = filtered.filter(todo => {
        if (!todo.dueDate) return false;
        return !isBefore(new Date(todo.dueDate), today) || todo.completed;
      });
    }
    
    return filtered;
  };

  const filteredTodos = getFilteredTodos();

  // Get category color for a todo
  const getCategoryColor = (categoryId: string) => {
    const category = useTodo().categories.find(c => c.id === categoryId);
    return category?.color || "#9b87f5";
  };

  // Handle rescheduling a task
  const handleReschedule = (taskId: string, newDate: Date) => {
    updateTodo(taskId, { dueDate: newDate });
    setReschedulingTaskId(null);
    setReschedulingDate(null);
    toast.success("Task rescheduled", {
      description: `Task has been rescheduled to ${format(newDate, "MMMM d, yyyy")}`
    });
  };

  // Handle marking a task as complete
  const handleCompleteTask = (taskId: string) => {
    toggleTodoCompletion(taskId);
    toast.success("Task completed", {
      description: "The task has been marked as complete"
    });
  };

  // Handle opening the create task dialog
  const handleCreateTask = () => {
    if (!selectedDate) {
      toast.error("Please select a date first", {
        description: "You need to select a date to create a task"
      });
      return;
    }
    setIsCreatingTask(true);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Schedule</h1>
            <p className="text-muted-foreground">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
            </p>
          </div>
        </div>

        {/* Calendar and Tasks Layout - Grid on large screens, Stack on small */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Card - Takes 1/3 on large screens, full width on small */}
          <Card className="bg-card/60 backdrop-blur-sm col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
              <CardTitle>Calendar</CardTitle>
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" align="end" className="max-w-xs">
                      <div className="space-y-2 p-1">
                        <h4 className="font-semibold text-sm">Task Density Indicators</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-xs">1-5 tasks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-xs">6-10 tasks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-xs">11+ tasks</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center pt-0">
              <div className="w-full">
                <div className="flex flex-wrap items-center gap-2 mb-3 justify-end">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-muted-foreground">1-5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-xs text-muted-foreground">6-10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs text-muted-foreground">11+</span>
                  </div>
                </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md w-full"
                classNames={{
                  month: "space-y-3",
                  table: "w-full border-collapse space-y-1",
                  head_row: "grid grid-cols-7",
                  head_cell: "text-muted-foreground font-normal text-xs text-center",
                  row: "grid grid-cols-7 mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 mx-auto",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:rounded-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_today: "bg-accent text-accent-foreground rounded-md",
                  day_outside: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  caption: "flex justify-center py-1 mb-2 relative items-center text-sm font-medium",
                  caption_label: "text-sm font-medium",
                  caption_dropdowns: "flex justify-center gap-1"
                }}
                components={{
                  DayContent: ({ date }) => renderDayContent(date)
                }}
                disabled={(date) => isBefore(date, today)}
                fromDate={today}
                initialFocus
                />
                </div>
            </CardContent>
          </Card>

          {/* Tasks Card - Takes 2/3 on large screens, full width on small */}
          <Card className="bg-card/60 backdrop-blur-sm col-span-1 lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <CardTitle className="flex items-center gap-2">
                  Tasks for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Selected Date"}
                  {taskFilter !== "all" && (
                    <Badge variant="secondary" className="ml-2">
                      {taskFilter === "overdue" ? "Overdue" : "Upcoming"}
                    </Badge>
                  )}
              </CardTitle>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Tabs 
                    defaultValue="day" 
                    value={viewMode} 
                    onValueChange={(v) => setViewMode(v as "day" | "week" | "month")}
                    className="h-8"
                  >
                    <TabsList className="h-8">
                      <TabsTrigger value="day" className="flex items-center gap-1 text-xs h-7 px-2">
                        <Clock className="h-3 w-3" />
                        <span>Day</span>
                      </TabsTrigger>
                      <TabsTrigger value="week" className="flex items-center gap-1 text-xs h-7 px-2">
                        <List className="h-3 w-3" />
                        <span>Week</span>
                      </TabsTrigger>
                      <TabsTrigger value="month" className="flex items-center gap-1 text-xs h-7 px-2">
                        <CalendarIcon className="h-3 w-3" />
                        <span>Month</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                        <Filter className="h-3 w-3" />
                        <span>Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className={taskFilter === "all" ? "bg-accent" : ""}
                        onClick={() => setTaskFilter("all")}
                      >
                        All Tasks
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={taskFilter === "overdue" ? "bg-accent" : ""}
                        onClick={() => setTaskFilter("overdue")}
                      >
                        Overdue Tasks
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={taskFilter === "upcoming" ? "bg-accent" : ""}
                        onClick={() => setTaskFilter("upcoming")}
                      >
                        Upcoming Tasks
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-7 gap-1 text-xs rounded-full w-7 p-0"
                    onClick={handleCreateTask}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                  
                  <Badge variant="outline" className="text-xs">
                  {filteredTodos.length} task{filteredTodos.length !== 1 ? 's' : ''}
                </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
                  {filteredTodos.length > 0 ? (
                    <div className="space-y-4">
                  {filteredTodos.map(todo => {
                    const isOverdue = todo.dueDate && isBefore(new Date(todo.dueDate), today) && !todo.completed;
                    
                    return (
                    <div 
                          key={todo.id} 
                        className={`flex flex-col bg-background/80 backdrop-blur-sm p-3 rounded-lg border ${isOverdue ? 'border-red-400' : 'border-border/50'}`}
                    >
                        <div className="flex items-start space-x-4">
                      <div 
                            className={`w-4 h-4 mt-1 rounded-full flex-shrink-0 ${todo.completed ? 'opacity-50' : ''}`}
                        style={{ backgroundColor: getCategoryColor(todo.categoryId) }}
                      />
                      <div className="flex-1">
                            <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {todo.title}
                            </h3>
                        {todo.description && (
                              <p className={`text-sm text-muted-foreground mt-1 ${todo.completed ? 'line-through' : ''}`}>
                                {todo.description}
                              </p>
                        )}
                        <div className="flex items-center mt-2 space-x-3">
                          <Badge variant="secondary" className="text-xs">
                            {todo.priority}
                          </Badge>
                          {todo.dueDate && (
                                <span className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                              Due: {format(new Date(todo.dueDate), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <input 
                          type="checkbox" 
                          checked={todo.completed} 
                              onChange={() => handleCompleteTask(todo.id)} 
                          className="h-5 w-5 rounded-md border-2 accent-primary cursor-pointer"
                        />
                      </div>
                    </div>
                        
                        {/* Task action buttons */}
                        <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-border/30">
                          <Popover open={reschedulingTaskId === todo.id} onOpenChange={(open) => {
                            if (!open) setReschedulingTaskId(null);
                          }}>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2 text-xs gap-1"
                                onClick={() => {
                                  setReschedulingTaskId(todo.id);
                                  setReschedulingDate(todo.dueDate || addDays(today, 1));
                                }}
                              >
                                <CalendarClock className="h-3 w-3" />
                                Reschedule
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                              <div className="p-2">
                                <h4 className="text-sm font-medium mb-2">Select new date</h4>
                                <Calendar
                                  mode="single"
                                  selected={reschedulingDate || undefined}
                                  onSelect={(date) => setReschedulingDate(date || null)}
                                  disabled={(date) => isBefore(date, today)}
                                  initialFocus
                                />
                                <div className="flex justify-end gap-2 mt-2 pt-2 border-t">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setReschedulingTaskId(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      if (reschedulingDate) {
                                        handleReschedule(todo.id, reschedulingDate);
                                      }
                                    }}
                                    disabled={!reschedulingDate}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => handleCompleteTask(todo.id)}
                            disabled={todo.completed}
                          >
                            <Check className="h-3 w-3" />
                            Complete
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => setEditingTask(todo.id)}
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                      </div>
                    ) : (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <ClipboardList className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
                  <p className="text-muted-foreground max-w-md">
                    {taskFilter === "all" 
                      ? `There are no tasks scheduled for ${selectedDate ? format(selectedDate, "MMMM d, yyyy") : "this date"}.`
                      : taskFilter === "overdue" 
                        ? "There are no overdue tasks for the selected date."
                        : "There are no upcoming tasks for the selected date."
                    }
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="mt-4 flex items-center gap-2"
                    onClick={handleCreateTask}
                  >
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Button>
                      </div>
                    )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Edit task dialog */}
      {editingTask && (
        <TodoDialog 
          mode="edit"
          todo={todos.find(t => t.id === editingTask) || undefined}
          open={!!editingTask}
          onOpenChange={(open) => {
            if (!open) setEditingTask(null);
          }}
        />
      )}

      {/* Create task dialog */}
      {isCreatingTask && (
        <TodoDialog 
          mode="create"
          open={isCreatingTask}
          onOpenChange={(open) => {
            if (!open) setIsCreatingTask(false);
          }}
          defaultDueDate={selectedDate}
        />
      )}
    </Layout>
  );
};

export default Schedule; 