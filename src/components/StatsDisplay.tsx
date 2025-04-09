
import { Card, CardContent } from "@/components/ui/card";
import { useTodo } from "@/contexts/TodoContext";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 transform transition-all duration-500">
      <Card className={cn(
        "overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
        "transform",
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )} style={{ transitionDelay: "50ms" }}>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Completed</h3>
            <p className="text-3xl font-bold bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent">
              {completedTasksCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 shadow-inner">
            <CheckCircle className="h-6 w-6 text-arc-green" />
          </div>
        </CardContent>
        <Progress 
          value={(completedTasksCount / Math.max(todos.length, 1)) * 100} 
          className="h-1.5 rounded-none bg-muted/50" 
          indicatorClassName="bg-arc-green/90 rounded-r-xl" 
        />
      </Card>
      
      <Card className={cn(
        "overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
        "transform",
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )} style={{ transitionDelay: "150ms" }}>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Pending</h3>
            <p className="text-3xl font-bold bg-gradient-to-br from-arc-blue to-blue-500 bg-clip-text text-transparent">
              {pendingTasksCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 shadow-inner">
            <Clock className="h-6 w-6 text-arc-blue" />
          </div>
        </CardContent>
        <Progress 
          value={(pendingTasksCount / Math.max(todos.length, 1)) * 100} 
          className="h-1.5 rounded-none bg-muted/50" 
          indicatorClassName="bg-arc-blue/90 rounded-r-xl" 
        />
      </Card>
      
      <Card className={cn(
        "overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
        "transform",
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )} style={{ transitionDelay: "250ms" }}>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Urgent</h3>
            <p className="text-3xl font-bold bg-gradient-to-br from-arc-red to-red-500 bg-clip-text text-transparent">
              {urgentTasksCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30 shadow-inner">
            <AlertCircle className="h-6 w-6 text-arc-red" />
          </div>
        </CardContent>
        <Progress 
          value={(urgentTasksCount / Math.max(todos.length, 1)) * 100} 
          className="h-1.5 rounded-none bg-muted/50" 
          indicatorClassName="bg-arc-red/90 rounded-r-xl" 
        />
      </Card>
      
      <Card className={cn(
        "overflow-hidden rounded-xl md:col-span-3 shadow-sm hover:shadow-md transition-all duration-300",
        "transform",
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )} style={{ transitionDelay: "350ms" }}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Overall Progress</h3>
            <span className="text-xl font-bold bg-gradient-to-r from-arc-purple to-arc-blue bg-clip-text text-transparent">
              {completionRate.toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={completionRate} 
            className="h-2.5 rounded-full bg-muted/70"
            indicatorClassName="arc-gradient rounded-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to conditionally join classNames
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
