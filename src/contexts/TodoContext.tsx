import React, { createContext, useContext, useState, useEffect } from "react";
import { Todo, SubTask, Category, Priority, DEFAULT_CATEGORIES } from "@/types/todo";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Define the context type
interface TodoContextType {
  todos: Todo[];
  categories: Category[];
  addTodo: (todo: Omit<Todo, "id" | "completed" | "createdAt" | "subtasks" | "updatedAt">) => string;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompletion: (id: string) => void;
  clearCompletedTodos: () => void;
  addSubtask: (todoId: string, title: string) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;
  toggleSubtaskCompletion: (todoId: string, subtaskId: string) => void;
  filterTodos: (
    searchQuery?: string,
    categoryId?: string,
    completed?: boolean,
    date?: Date | undefined
  ) => Todo[];
  getTodosByCategory: (categoryId: string) => Todo[];
  getCompletionRate: () => number;
  getTodoCountForDate: (date: Date) => number;
  getCategoryName: (categoryId: string) => string;
}

// Create the context
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Create the provider component
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    if (!savedTodos) return [];
    
    // Parse todos and convert date strings to Date objects
    try {
      const parsedTodos = JSON.parse(savedTodos);
      return parsedTodos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null
      }));
    } catch (e) {
      console.error("Error parsing todos from localStorage:", e);
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // Add a new todo
  const addTodo = (todo: Omit<Todo, "id" | "completed" | "createdAt" | "subtasks" | "updatedAt">) => {
    const now = new Date();
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: now,
      updatedAt: now,
      subtasks: [],
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    
    toast({
      title: "Task created",
      description: "Your task has been created successfully.",
    });

    return newTodo.id;
  };

  // Update an existing todo
  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prevTodos) => 
      prevTodos.map((todo) => 
        todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
      )
    );
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted.",
    });
  };

  // Toggle todo completion
  const toggleTodoCompletion = (id: string) => {
    setTodos((prevTodos) => 
      prevTodos.map((todo) => {
        if (todo.id === id) {
          // Only toggle the main task without affecting subtasks
          return {
            ...todo,
            completed: !todo.completed,
            updatedAt: new Date()
          };
        }
        return todo;
      })
    );
  };

  // Clear all completed todos
  const clearCompletedTodos = () => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    
    toast({
      title: "Completed tasks cleared",
      description: "All completed tasks have been removed.",
    });
  };

  // Add a subtask to a todo
  const addSubtask = (todoId: string, title: string) => {
    const newSubtask: SubTask = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };

    setTodos((prevTodos) => 
      prevTodos.map((todo) => 
        todo.id === todoId 
          ? { ...todo, subtasks: [...todo.subtasks, newSubtask], updatedAt: new Date() } 
          : todo
      )
    );
  };

  // Delete a subtask from a todo
  const deleteSubtask = (todoId: string, subtaskId: string) => {
    setTodos((prevTodos) => 
      prevTodos.map((todo) => 
        todo.id === todoId 
          ? { 
              ...todo, 
              subtasks: todo.subtasks.filter((st) => st.id !== subtaskId),
              updatedAt: new Date() 
            } 
          : todo
      )
    );
  };

  // Toggle subtask completion - REVERTED to previous behavior
  const toggleSubtaskCompletion = (todoId: string, subtaskId: string) => {
    setTodos((prevTodos) => 
      prevTodos.map((todo) => {
        if (todo.id === todoId) {
          // Toggle only the specified subtask without affecting parent todo
          const updatedSubtasks = todo.subtasks.map((st) => 
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          
          return { 
            ...todo, 
            subtasks: updatedSubtasks,
            updatedAt: new Date()
          };
        }
        return todo;
      })
    );
  };

  // Filter todos based on search query, category, and completion status
  const filterTodos = (
    searchQuery?: string,
    categoryId?: string,
    completed?: boolean,
    date?: Date | undefined
  ): Todo[] => {
    return todos.filter((todo) => {
      // Filter by search query
      const matchesSearch = !searchQuery || 
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by category
      const matchesCategory = !categoryId || todo.categoryId === categoryId;

      // Filter by completion status
      const matchesCompletion = completed === undefined || todo.completed === completed;
      
      // Filter by date
      const matchesDate = !date || (todo.dueDate && 
        format(todo.dueDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

      return matchesSearch && matchesCategory && matchesCompletion && 
        (date ? matchesDate : true);
    });
  };

  // Get todos by category
  const getTodosByCategory = (categoryId: string): Todo[] => {
    return todos.filter((todo) => todo.categoryId === categoryId);
  };

  // Calculate completion rate (percentage of completed todos)
  const getCompletionRate = (): number => {
    if (todos.length === 0) return 0;
    return (todos.filter((todo) => todo.completed).length / todos.length) * 100;
  };

  // Get todo count for a specific date
  const getTodoCountForDate = (date: Date): number => {
    return todos.filter((todo) => {
      if (!todo.dueDate) return false;
      return format(todo.dueDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }).length;
  };

  // Add the new getCategoryName function
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const value = {
    todos,
    categories,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
    clearCompletedTodos,
    addSubtask,
    deleteSubtask,
    toggleSubtaskCompletion,
    filterTodos,
    getTodosByCategory,
    getCompletionRate,
    getTodoCountForDate,
    getCategoryName,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

// Custom hook to use the context
export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};
