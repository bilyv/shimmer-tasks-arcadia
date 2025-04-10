
import { format, isToday, isYesterday, isTomorrow, isThisMonth, differenceInDays, isSameMonth, isSameYear } from 'date-fns';

export type DateGroup = 
  | 'Today'
  | 'Yesterday'
  | 'Tomorrow'
  | 'Previous 7 Days'
  | 'This Month'
  | string;

export function getDateGroup(date: Date): DateGroup {
  if (isToday(date)) {
    return 'Today';
  }
  
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  
  const daysDiff = differenceInDays(new Date(), date);
  if (daysDiff > 0 && daysDiff <= 7) {
    return 'Previous 7 Days';
  }
  
  if (isThisMonth(date)) {
    return 'This Month';
  }
  
  const now = new Date();
  if (isSameYear(date, now)) {
    return format(date, 'MMMM');
  }
  
  return format(date, 'MMMM yyyy');
}

export function groupTodosByDate<T extends { createdAt: Date }>(todos: T[]): Map<DateGroup, T[]> {
  const groupedTodos = new Map<DateGroup, T[]>();
  
  todos.forEach(todo => {
    const dateGroup = getDateGroup(new Date(todo.createdAt));
    
    if (!groupedTodos.has(dateGroup)) {
      groupedTodos.set(dateGroup, []);
    }
    
    groupedTodos.get(dateGroup)?.push(todo);
  });
  
  // Sort the groups in a logical order
  const orderedGroups = new Map<DateGroup, T[]>();
  const groupOrder: DateGroup[] = [
    'Today',
    'Yesterday',
    'Tomorrow',
    'Previous 7 Days',
    'This Month'
  ];
  
  // First add predefined groups in our desired order
  groupOrder.forEach(group => {
    if (groupedTodos.has(group)) {
      orderedGroups.set(group, groupedTodos.get(group)!);
      groupedTodos.delete(group);
    }
  });
  
  // Then add remaining month groups
  Array.from(groupedTodos.keys())
    .sort((a, b) => {
      // For month names, we want the most recent first
      try {
        const dateA = new Date(`${a} 1, 2000`);
        const dateB = new Date(`${b} 1, 2000`);
        return dateB.getTime() - dateA.getTime();
      } catch {
        return 0;
      }
    })
    .forEach(group => {
      orderedGroups.set(group, groupedTodos.get(group)!);
    });
  
  return orderedGroups;
}
