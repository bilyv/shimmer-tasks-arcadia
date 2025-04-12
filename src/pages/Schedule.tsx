import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isSameDay, startOfWeek, endOfWeek, isWithinInterval, addWeeks, addMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoItem } from "@/components/TodoItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { 
  Calendar as CalendarIcon, 
  List, 
  Clock, 
  Plus, 
  ClipboardList, 
  Bell, 
  Brain, 
  Calendar as CalendarCheck, 
  Timer,
  Calendar as SmartSchedule,
  Check
} from "lucide-react";
import { ClipboardList as ClipboardListIcon } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

const Schedule = () => {
  const { todos, addTodo, updateTodo } = useTodo();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [reminder, setReminder] = useState("");
  const [reminderDate, setReminderDate] = useState<Date | undefined>(new Date());
  const [reminderPriority, setReminderPriority] = useState<string>("medium");
  const [reminderCategory, setReminderCategory] = useState<string>("personal");
  const [reminders, setReminders] = useState<any[]>([]);
  const [pomodoroEnabled, setPomodoroEnabled] = useState(false);
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [autoSchedule, setAutoSchedule] = useState(false);
  
  // Load reminders from localStorage
  useEffect(() => {
    const savedReminders = localStorage.getItem("reminders");
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);
  
  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

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

  // Add a new reminder
  const addReminder = () => {
    if (!reminder || !reminderDate) {
      toast.error("Please enter a reminder and select a date");
      return;
    }
    
    const newReminder = {
      id: crypto.randomUUID(),
      text: reminder,
      date: reminderDate,
      priority: reminderPriority,
      category: reminderCategory,
      completed: false,
    };
    
    setReminders([...reminders, newReminder]);
    
    // Create a corresponding todo
    addTodo({
      title: reminder,
      description: "Reminder created from schedule",
      dueDate: reminderDate,
      priority: reminderPriority as any,
      categoryId: reminderCategory,
    });
    
    // Reset form
    setReminder("");
    toast.success("Reminder added");
  };
  
  // Smart plan generator
  const generateSmartPlan = () => {
    if (!selectedDate) return;
    
    // Get all tasks for the next 7 days
    const nextWeekTasks = todos.filter(todo => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      const nextWeek = addDays(new Date(), 7);
      return dueDate <= nextWeek && !todo.completed;
    });
    
    // Sort by priority (high first)
    const sortedTasks = [...nextWeekTasks].sort((a, b) => {
      const priorityValue = { high: 3, medium: 2, low: 1 };
      return priorityValue[b.priority as keyof typeof priorityValue] - 
             priorityValue[a.priority as keyof typeof priorityValue];
    });
    
    // Distribute tasks across days (simple algorithm)
    let currentDate = new Date();
    sortedTasks.forEach((task, index) => {
      // Update the due date based on priority and even distribution
      const newDueDate = addDays(currentDate, index % 7);
      updateTodo(task.id, { dueDate: newDueDate });
    });
    
    toast.success("Smart plan generated", {
      description: "Your tasks have been optimally scheduled"
    });
  };

  // Get category color for a todo
  const getCategoryColor = (categoryId: string) => {
    const category = useTodo().categories.find(c => c.id === categoryId);
    return category?.color || "#9b87f5";
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-4xl">
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
          {/* Calendar Card */}
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

          {/* Main Content Area */}
          <Card className="col-span-1 md:col-span-2 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                {viewMode === "day" && "Daily Schedule"}
                {viewMode === "week" && "Weekly Schedule"}
                {viewMode === "month" && "Monthly Overview"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tasks">
                <TabsList className="mb-4">
                  <TabsTrigger value="tasks" className="flex items-center gap-1">
                    <ClipboardList className="h-4 w-4" />
                    <span>Tasks</span>
                  </TabsTrigger>
                  <TabsTrigger value="reminders" className="flex items-center gap-1">
                    <Bell className="h-4 w-4" />
                    <span>Reminders</span>
                  </TabsTrigger>
                  <TabsTrigger value="smart" className="flex items-center gap-1">
                    <Brain className="h-4 w-4" />
                    <span>Smart Planning</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="tasks">
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
                    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                      <div className="rounded-full bg-muted p-6 mb-4">
                        <ClipboardListIcon className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No tasks scheduled</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">There are no tasks scheduled for this time period.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="reminders">
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <Input 
                        placeholder="Add a reminder..." 
                        value={reminder} 
                        onChange={(e) => setReminder(e.target.value)}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="reminder-date">Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal mt-1"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {reminderDate ? format(reminderDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={reminderDate}
                                onSelect={setReminderDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <Label htmlFor="reminder-priority">Priority</Label>
                          <Select 
                            value={reminderPriority} 
                            onValueChange={setReminderPriority}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="reminder-category">Category</Label>
                        <Select 
                          value={reminderCategory} 
                          onValueChange={setReminderCategory}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {useTodo().categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button onClick={addReminder} className="mt-2">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Reminder
                      </Button>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-lg font-medium mb-4">Your Reminders</h3>
                    {reminders.length > 0 ? (
                      <div className="space-y-3">
                        {reminders.map((rem) => (
                          <Card key={rem.id} className="bg-card/30">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{rem.text}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(rem.date), "PPP")} • {rem.priority} priority
                                  </p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setReminders(reminders.filter(r => r.id !== rem.id));
                                    toast.success("Reminder removed");
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No reminders yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="smart">
                  <div className="space-y-6">
                    <Card className="bg-card/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Smart Planning</CardTitle>
                        <CardDescription>
                          Let AI optimize your schedule based on priorities and deadlines
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          onClick={generateSmartPlan}
                          className="w-full mt-2"
                        >
                          <SmartSchedule className="mr-2 h-4 w-4" />
                          Generate Smart Plan
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-card/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Auto-Schedule</CardTitle>
                        <CardDescription>
                          Automatically assign optimal times to your tasks
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto-schedule">Enable Auto-Schedule</Label>
                          <Switch 
                            id="auto-schedule" 
                            checked={autoSchedule}
                            onCheckedChange={setAutoSchedule}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-card/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Pomodoro Timer</CardTitle>
                        <CardDescription>
                          Focus on tasks using the Pomodoro technique
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pomodoro">Enable Pomodoro</Label>
                          <Switch 
                            id="pomodoro" 
                            checked={pomodoroEnabled}
                            onCheckedChange={setPomodoroEnabled}
                          />
                        </div>
                        
                        {pomodoroEnabled && (
                          <>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label htmlFor="focus-time">Focus Time: {pomodoroMinutes} minutes</Label>
                              </div>
                              <Slider
                                id="focus-time"
                                min={5}
                                max={60}
                                step={5}
                                value={[pomodoroMinutes]}
                                onValueChange={(value) => setPomodoroMinutes(value[0])}
                              />
                            </div>
                            <Button variant="outline" className="w-full">
                              <Timer className="mr-2 h-4 w-4" />
                              Start Pomodoro
                            </Button>
                          </>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="tips">
                        <AccordionTrigger>Productivity Tips</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li>• Focus on one task at a time for better results</li>
                            <li>• Take regular breaks to maintain productivity</li>
                            <li>• Plan your most challenging tasks during your peak energy hours</li>
                            <li>• Group similar tasks together to reduce context switching</li>
                            <li>• Use the 2-minute rule: if it takes less than 2 minutes, do it now</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule; 