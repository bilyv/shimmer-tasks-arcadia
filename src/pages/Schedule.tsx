import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoItem } from "@/components/TodoItem";
import { EmptyState } from "@/components/EmptyState";
import { Calendar as CalendarIcon, List, Clock, ClipboardList } from "lucide-react";

const Schedule = () => {
  const { todos, categories } = useTodo();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  // Custom day content renderer to show task counts
  const renderDayContent = (day: Date) => {
    const taskCount = todos.filter(todo => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      return dueDate.getDate() === day.getDate() && 
             dueDate.getMonth() === day.getMonth() && 
             dueDate.getFullYear() === day.getFullYear();
    }).length;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
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
    const todoDate = new Date(todo.dueDate);
    return todoDate.getDate() === selectedDate.getDate() && 
           todoDate.getMonth() === selectedDate.getMonth() && 
           todoDate.getFullYear() === selectedDate.getFullYear();
  });

  // Get category color for a todo
  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || "#888888"; // Default color if category not found
  };

  const getTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return timeSlots;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:row-span-2 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
                components={{
                  DayContent: ({ date }) => renderDayContent(date)
                }}
              />
              {selectedDate && (
                <div className="border-t mt-4 pt-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    Tasks for {format(selectedDate, "MMMM d, yyyy")}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {filteredTodos.length} task{filteredTodos.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 md:row-span-2 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                {viewMode === "day" && "Daily Schedule"}
                {viewMode === "week" && "Weekly Schedule"}
                {viewMode === "month" && "Monthly Overview"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TabsContent value="day">
                {filteredTodos.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTodos.map(todo => (
                      <TodoItem 
                        key={todo.id} 
                        todo={todo} 
                        categoryColor={getCategoryColor(todo.categoryId)} 
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title="No tasks scheduled"
                    description="There are no tasks scheduled for this day."
                  />
                )}
              </TabsContent>
              
              <TabsContent value="week">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Weekly view coming soon</p>
                </div>
              </TabsContent>
              
              <TabsContent value="month">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Monthly view coming soon</p>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule; 