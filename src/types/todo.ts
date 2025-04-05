
export type Priority = "high" | "medium" | "low";

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  priority: Priority;
  categoryId: string;
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "personal", name: "Personal", color: "#9b87f5" },
  { id: "work", name: "Work", color: "#33C3F0" },
  { id: "shopping", name: "Shopping", color: "#10B981" },
  { id: "health", name: "Health", color: "#FBBF24" },
  { id: "others", name: "Others", color: "#8E9196" },
];
