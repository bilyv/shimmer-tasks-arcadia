import { Card, CardContent } from "@/components/ui/card";
import { useTodo } from "@/contexts/TodoContext";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function StatsDisplay() {
  const { todos, getCompletionRate } = useTodo();
  const [animate, setAnimate] = useState(false);
  
  const completedTasksCount = todos.filter(todo => todo.completed).length;
  const pendingTasksCount = todos.filter(todo => !todo.completed).length;
  const urgentTasksCount = todos.filter(todo => !todo.completed && todo.priority === "high").length;
  const completionRate = getCompletionRate();
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 400);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="grid grid-cols-3 gap-3 transform transition-all duration-500 mb-4">
      <Card className={cn(
        "overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
        "transform h-auto",
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )} style={{ transitionDelay: "50ms" }}>
        <CardContent className="p-2 sm:p-3 flex items-center h-full">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 shadow-inner mr-2">
            <CheckCircle className="h-4 w-4 text-arc-green" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-medium mb-0.5">Completed</h3>
            <p className="text-lg sm:text-xl font-bold bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent">
              {completedTasksCount}
            </p>
          </div>
        </CardContent>
        <Progress 
          value={(completedTasksCount / Math.max(todos.length, 1)) * 100} 
          className="h-1 rounded-none bg-muted/50" 
          indicatorClassName="bg-arc-green/90 rounded-r-xl" 
        />
      </Card>
      
      <Card className={cn(
        "overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
        "transform h-auto",
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )} style={{ transitionDelay: "150ms" }}>
        <CardContent className="p-2 sm:p-3 flex items-center h-full">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 shadow-inner mr-2">
            <Clock className="h-4 w-4 text-arc-blue" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-medium mb-0.5">Pending</h3>
            <p className="text-lg sm:text-xl font-bold bg-gradient-to-br from-arc-blue to-blue-500 bg-clip-text text-transparent">
              {pendingTasksCount}
            </p>
          </div>
        </CardContent>
        <Progress 
          value={(pendingTasksCount / Math.max(todos.length, 1)) * 100} 
          className="h-1 rounded-none bg-muted/50" 
          indicatorClassName="bg-arc-blue/90 rounded-r-xl" 
        />
      </Card>
      
      <Card className={cn(
        "overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
        "transform h-auto",
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )} style={{ transitionDelay: "250ms" }}>
        <CardContent className="p-2 sm:p-3 flex items-center h-full">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30 shadow-inner mr-2">
            <AlertCircle className="h-4 w-4 text-arc-red" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-medium mb-0.5">Urgent</h3>
            <p className="text-lg sm:text-xl font-bold bg-gradient-to-br from-arc-red to-red-500 bg-clip-text text-transparent">
              {urgentTasksCount}
            </p>
          </div>
        </CardContent>
        <Progress 
          value={(urgentTasksCount / Math.max(todos.length, 1)) * 100} 
          className="h-1 rounded-none bg-muted/50" 
          indicatorClassName="bg-arc-red/90 rounded-r-xl" 
        />
      </Card>
      
      <Card className={cn(
        "overflow-hidden rounded-xl col-span-3 shadow-sm hover:shadow-md transition-all duration-300",
        "transform h-auto",
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )} style={{ transitionDelay: "350ms" }}>
        <CardContent className="p-2 sm:p-3">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-xs sm:text-sm font-medium">Overall Progress</h3>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-arc-purple to-arc-blue bg-clip-text text-transparent">
              {completionRate.toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={completionRate} 
            className="h-1.5 rounded-full bg-muted/70"
            indicatorClassName="arc-gradient rounded-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
