import { format, isToday, isYesterday, isTomorrow, isThisMonth, differenceInDays } from "date-fns";

export type DateGroup =
  | "Today"
  | "Yesterday"
  | "Tomorrow"
  | "Previous 7 Days"
  | "This Month"
  | string; // For specific dates and months

export const getDateGroup = (date: Date | null): DateGroup => {
  if (!date) return "No Due Date";
  
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isTomorrow(date)) return "Tomorrow";
  
  const daysDifference = differenceInDays(date, new Date());
  
  if (daysDifference < 0 && daysDifference > -7) return "Previous 7 Days";
  if (isThisMonth(date)) return "This Month";
  
  // For dates beyond this month, return the month name
  return format(date, "MMMM yyyy");
};

export const sortDateGroups = (groups: DateGroup[]): DateGroup[] => {
  const order: Record<string, number> = {
    "Today": 0,
    "Tomorrow": 1,
    "Yesterday": 2,
    "Previous 7 Days": 3,
    "This Month": 4,
    // Other groups will be sorted alphabetically
  };

  return groups.sort((a, b) => {
    if (a in order && b in order) {
      return order[a] - order[b];
    }
    if (a in order) return -1;
    if (b in order) return 1;
    return a.localeCompare(b);
  });
};
