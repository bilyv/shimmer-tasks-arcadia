import { z } from "zod";

export type Priority = "low" | "medium" | "high";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Connection {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: Priority;
  categoryId: string;
  dueDate: Date | null;
  subtasks: SubTask[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "personal", name: "Personal", color: "#9b87f5" },
  { id: "work", name: "Work", color: "#33C3F0" },
  { id: "shopping", name: "Shopping", color: "#10B981" },
  { id: "health", name: "Health", color: "#FBBF24" },
  { id: "others", name: "Others", color: "#8E9196" },
];
