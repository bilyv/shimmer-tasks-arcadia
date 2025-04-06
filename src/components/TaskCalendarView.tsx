
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useTodo } from "@/contexts/TodoContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DayContentProps } from "react-day-picker";

interface TaskCalendarViewProps {
  onSelectDate: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

export function TaskCalendarView({ onSelectDate, selectedDate }: TaskCalendarViewProps) {
  const { getTodoCountForDate } = useTodo();
  const today = new Date();

  // Custom day content renderer
  const renderDayContent = (props: DayContentProps) => {
    const date = props.date;
    const taskCount = getTodoCountForDate(date);

    return (
      <div className="relative">
        <div>{format(date, "d")}</div>
        {taskCount > 0 && (
          <span className="absolute bottom-0 right-0 -mr-1 -mb-1 flex items-center justify-center bg-primary text-[0.5rem] text-primary-foreground w-3 h-3 rounded-full">
            {taskCount}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border rounded-xl p-2 my-4 shadow-sm">
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
