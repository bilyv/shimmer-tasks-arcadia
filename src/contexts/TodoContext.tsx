
import React, { createContext, useContext, useState, useEffect } from "react";
import { Todo, Category, Priority, DEFAULT_CATEGORIES } from "@/types/todo";
import { useToast } from "@/hooks/use-toast";

interface TodoContextType {
  todos: Todo[];
  categories: Category[];
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "updatedAt">) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompletion: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  moveTodoToCategory: (todoId: string, categoryId: string) => void;
  clearCompletedTodos: () => void;
  getCompletionRate: () => number;
  getTodosByCategory: (categoryId: string) => Todo[];
  filterTodos: (searchQuery: string, categoryId?: string, showCompleted?: boolean) => Todo[];
  reorderTodo: (fromIndex: number, toIndex: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        return JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
        }));
      } catch (e) {
        console.error("Failed to parse saved todos", e);
        return [];
      }
    }
    return [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const addTodo = (todo: Omit<Todo, "id" | "createdAt" | "updatedAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    toast({
      title: "Task added",
      description: `"${todo.title}" has been added to your tasks.`,
    });
  };

  const updateTodo = (id: string, todo: Partial<Todo>) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id
          ? { ...t, ...todo, updatedAt: new Date() }
          : t
      )
    );
  };

  const deleteTodo = (id: string) => {
    const todoToDelete = todos.find(t => t.id === id);
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
    toast({
      title: "Task deleted",
      description: todoToDelete ? `"${todoToDelete.title}" has been deleted.` : "Task has been deleted.",
      variant: "destructive"
    });
  };

  const toggleTodoCompletion = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: new Date() }
          : t
      )
    );
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    setCategories((prevCategories) => [...prevCategories, newCategory]);
    toast({
      title: "Category added",
      description: `"${category.name}" category has been created.`,
    });
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories((prevCategories) =>
      prevCategories.map((c) =>
        c.id === id ? { ...c, ...category } : c
      )
    );
  };

  const deleteCategory = (id: string) => {
    // Check if there are todos in this category
    const todosInCategory = todos.filter(t => t.categoryId === id);
    
    if (todosInCategory.length > 0) {
      toast({
        title: "Cannot delete category",
        description: "This category contains tasks. Move or delete them first.",
        variant: "destructive"
      });
      return;
    }
    
    const categoryToDelete = categories.find(c => c.id === id);
    setCategories((prevCategories) => prevCategories.filter((c) => c.id !== id));
    
    if (categoryToDelete) {
      toast({
        title: "Category deleted",
        description: `"${categoryToDelete.name}" category has been deleted.`,
      });
    }
  };

  const moveTodoToCategory = (todoId: string, categoryId: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === todoId
          ? { ...t, categoryId, updatedAt: new Date() }
          : t
      )
    );
  };

  const clearCompletedTodos = () => {
    const completedCount = todos.filter(t => t.completed).length;
    setTodos((prevTodos) => prevTodos.filter((t) => !t.completed));
    toast({
      title: "Tasks cleared",
      description: `${completedCount} completed ${completedCount === 1 ? 'task has' : 'tasks have'} been cleared.`,
    });
  };

  const getCompletionRate = () => {
    if (todos.length === 0) return 0;
    return (todos.filter((t) => t.completed).length / todos.length) * 100;
  };

  const getTodosByCategory = (categoryId: string) => {
    return todos.filter((t) => t.categoryId === categoryId);
  };

  const filterTodos = (searchQuery: string, categoryId?: string, showCompleted?: boolean) => {
    return todos.filter((todo) => {
      const matchesSearch = 
        !searchQuery || 
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !categoryId || todo.categoryId === categoryId;
      
      const matchesCompletion = showCompleted !== undefined ? todo.completed === showCompleted : true;
      
      return matchesSearch && matchesCategory && matchesCompletion;
    });
  };

  const reorderTodo = (fromIndex: number, toIndex: number) => {
    setTodos((prevTodos) => {
      const result = Array.from(prevTodos);
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        categories,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodoCompletion,
        addCategory,
        updateCategory,
        deleteCategory,
        moveTodoToCategory,
        clearCompletedTodos,
        getCompletionRate,
        getTodosByCategory,
        filterTodos,
        reorderTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};
