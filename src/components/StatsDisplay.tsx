
import { Card, CardContent } from "@/components/ui/card";
import { useTodo } from "@/contexts/TodoContext";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export function StatsDisplay() {
  const { todos, getCompletionRate } = useTodo();
  
  const completedTasksCount = todos.filter(todo => todo.completed).length;
  const pendingTasksCount = todos.filter(todo => !todo.completed).length;
  const urgentTasksCount = todos.filter(todo => !todo.completed && todo.priority === "high").length;
  const completionRate = getCompletionRate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
      <Card className="overflow-hidden rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Completed</h3>
            <p className="text-3xl font-bold">{completedTasksCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-6 w-6 text-arc-green" />
          </div>
        </CardContent>
        <div 
          className="h-1 bg-arc-green" 
          style={{ width: `${(completedTasksCount / Math.max(todos.length, 1)) * 100}%` }}
        />
      </Card>
      
      <Card className="overflow-hidden rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Pending</h3>
            <p className="text-3xl font-bold">{pendingTasksCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <Clock className="h-6 w-6 text-arc-blue" />
          </div>
        </CardContent>
        <div 
          className="h-1 bg-arc-blue" 
          style={{ width: `${(pendingTasksCount / Math.max(todos.length, 1)) * 100}%` }}
        />
      </Card>
      
      <Card className="overflow-hidden rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Urgent</h3>
            <p className="text-3xl font-bold">{urgentTasksCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="h-6 w-6 text-arc-red" />
          </div>
        </CardContent>
        <div 
          className="h-1 bg-arc-red" 
          style={{ width: `${(urgentTasksCount / Math.max(todos.length, 1)) * 100}%` }}
        />
      </Card>
      
      <Card className="overflow-hidden rounded-xl md:col-span-3">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Overall Progress</h3>
            <span className="text-xl font-bold">{completionRate.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="h-full arc-gradient animate-pulse transition-all duration-1000 ease-in-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
