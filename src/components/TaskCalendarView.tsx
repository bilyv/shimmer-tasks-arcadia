import { format, isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useTodo } from "@/contexts/TodoContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DayContentProps } from "react-day-picker";
import { InfoIcon, Filter } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TaskCalendarViewProps {
  onSelectDate: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

export function TaskCalendarView({ onSelectDate, selectedDate }: TaskCalendarViewProps) {
  const { getTodoCountForDate } = useTodo();
  const today = new Date();
  const [taskFilter, setTaskFilter] = useState<"all" | "overdue" | "upcoming">("all");

  // Helper function to get task density color
  const getTaskDensityColor = (count: number): string => {
    if (count > 10) return "bg-red-500";
    if (count > 5) return "bg-yellow-500";
    if (count > 0) return "bg-green-500";
    return "";
  };

  // Custom day content renderer
  const renderDayContent = (props: DayContentProps) => {
    const date = props.date;
    // Get tasks based on filter
    let taskCount = 0;
    
    if (taskFilter === "all") {
      taskCount = getTodoCountForDate(date);
    } else if (taskFilter === "overdue") {
      // Only count overdue tasks
      taskCount = getTodoCountForDate(date, (todo) => 
        isBefore(new Date(todo.dueDate), today) && !todo.completed
      );
    } else if (taskFilter === "upcoming") {
      // Only count upcoming tasks
      taskCount = getTodoCountForDate(date, (todo) =>
        !isBefore(new Date(todo.dueDate), today) || todo.completed
      );
    }
    
    const densityColor = getTaskDensityColor(taskCount);

    return (
      <div className="relative">
        {densityColor && (
          <div 
            className={`absolute inset-0 opacity-20 rounded-md ${densityColor}`}
            aria-hidden="true"
          />
        )}
        <div className="relative z-10">{format(date, "d")}</div>
        {taskCount > 0 && (
          <span className={`absolute bottom-0 right-0 -mr-1 -mb-1 flex items-center justify-center ${densityColor} text-[0.5rem] text-white w-3 h-3 rounded-full z-20`}>
            {taskCount}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border rounded-xl p-2 my-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Tasks Calendar</h3>
          {taskFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {taskFilter === "overdue" ? "Overdue" : "Upcoming"}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-xs px-2 ml-1">
                <Filter className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem 
                className={taskFilter === "all" ? "bg-accent text-xs" : "text-xs"}
                onClick={() => setTaskFilter("all")}
              >
                All Tasks
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={taskFilter === "overdue" ? "bg-accent text-xs" : "text-xs"}
                onClick={() => setTaskFilter("overdue")}
              >
                Overdue Tasks
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={taskFilter === "upcoming" ? "bg-accent text-xs" : "text-xs"}
                onClick={() => setTaskFilter("upcoming")}
              >
                Upcoming Tasks
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
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
      </div>
      
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="rounded-md"
        components={{
          DayContent: renderDayContent
        }}
      />
      {selectedDate && (
        <div className="border-t mt-2 pt-2 text-center">
          <Badge variant="outline" className="cursor-pointer" onClick={() => onSelectDate(undefined)}>
            Clear date filter
          </Badge>
        </div>
      )}
    </div>
  );
}
