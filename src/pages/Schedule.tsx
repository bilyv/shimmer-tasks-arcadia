import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, startOfWeek, endOfWeek, isWithinInterval, isBefore, startOfToday } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  List, 
  Clock, 
  ClipboardList
} from "lucide-react";

const Schedule = () => {
  const { todos } = useTodo();
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  // Handler for date selection that prevents selecting dates before today
  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isBefore(date, today)) {
      setSelectedDate(date);
    }
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

    return (
      <div className={`relative w-full h-full flex items-center justify-center ${isPastDate ? 'text-muted-foreground opacity-50' : ''}`}>
        <div>{format(day, "d")}</div>
        {taskCount > 0 && (
          <span className="absolute bottom-0 right-0 -mr-1 -mb-1 flex items-center justify-center bg-primary text-[0.5rem] text-primary-foreground w-3 h-3 rounded-full">
            {taskCount}
          </span>
        )}
      </div>
    );
  };

  // Filter todos for the selected date
  const filteredTodos = todos.filter(todo => {
    if (!todo.dueDate || !selectedDate) return false;
    
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

  // Get category color for a todo
  const getCategoryColor = (categoryId: string) => {
    const category = useTodo().categories.find(c => c.id === categoryId);
    return category?.color || "#9b87f5";
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Schedule</h1>
            <p className="text-muted-foreground">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
            </p>
          </div>
          
          <Tabs 
            defaultValue="day" 
            value={viewMode} 
            onValueChange={(v) => setViewMode(v as "day" | "week" | "month")}
            className="mt-4 md:mt-0"
          >
            <TabsList>
              <TabsTrigger value="day" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Day</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Week</span>
              </TabsTrigger>
              <TabsTrigger value="month" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Month</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Calendar and Tasks Layout - Grid on large screens, Stack on small */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Card - Takes 1/3 on large screens, full width on small */}
          <Card className="bg-card/60 backdrop-blur-sm col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full">
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
              <div className="flex items-center justify-between">
              <CardTitle>
                  Tasks for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Selected Date"}
              </CardTitle>
                <Badge variant="outline">
                  {filteredTodos.length} task{filteredTodos.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
                  {filteredTodos.length > 0 ? (
                    <div className="space-y-4">
                      {filteredTodos.map(todo => (
                    <div 
                          key={todo.id} 
                      className="flex items-start space-x-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/50"
                    >
                      <div 
                        className="w-4 h-4 mt-1 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: getCategoryColor(todo.categoryId) }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{todo.title}</h3>
                        {todo.description && (
                          <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>
                        )}
                        <div className="flex items-center mt-2 space-x-3">
                          <Badge variant="secondary" className="text-xs">
                            {todo.priority}
                          </Badge>
                          {todo.dueDate && (
                            <span className="text-xs text-muted-foreground">
                              Due: {format(new Date(todo.dueDate), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <input 
                          type="checkbox" 
                          checked={todo.completed} 
                          onChange={() => {}} 
                          className="h-5 w-5 rounded-md border-2 accent-primary cursor-pointer"
                        />
                      </div>
                    </div>
                        ))}
                      </div>
                    ) : (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <ClipboardList className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No tasks for this day</h3>
                  <p className="text-muted-foreground max-w-md">
                    There are no tasks scheduled for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "this date"}.
                  </p>
                      </div>
                    )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule; 