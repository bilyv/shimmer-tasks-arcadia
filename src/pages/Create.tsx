import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Todo, Priority, SubTask } from "@/types/todo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, X, Plus, Check, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const Create = () => {
  const { addTodo, categories, addSubtask } = useTodo();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  
  const today = startOfDay(new Date());
  
  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([
        ...subtasks,
        {
          id: crypto.randomUUID(),
          title: newSubtaskTitle.trim(),
          completed: false,
        },
      ]);
      setNewSubtaskTitle("");
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== subtaskId));
  };

  const handleSubtaskKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubtask();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTodo = {
      title,
      description,
      priority,
      categoryId,
      dueDate,
    };
    
    const newTodoId = addTodo(newTodo);
    
    // Add subtasks after todo creation
    subtasks.forEach(subtask => {
      addSubtask(newTodoId, subtask.title);
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategoryId(categories[0]?.id || "");
    setDueDate(null);
    setSubtasks([]);
    
    toast({
      title: "Task created",
      description: "Your task has been created successfully!",
    });
  };
  
  // This prevents form submission when clicking inside the date picker
  const preventSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">Create New Task</h1>
            <p className="text-muted-foreground">Add details for your new task</p>
          </div>
        </div>
        
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Task Details</CardTitle>
            <CardDescription>Fill out the information below to create a new task</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form id="todo-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-sm font-medium">Task Name</Label>
                <Input
                  id="title"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-md"
                  required
                  autoFocus
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-medium">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add some details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none rounded-md min-h-[100px]"
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-medium">Subtasks</Label>
                
                {/* Subtasks display */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {subtasks.map((subtask) => (
                    <Badge 
                      key={subtask.id} 
                      variant="secondary"
                      className="px-2 py-1 flex items-center gap-1"
                    >
                      {subtask.title}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => handleDeleteSubtask(subtask.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                {/* Subtask input */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={handleSubtaskKeyDown}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSubtask}
                    className="px-3"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Priority</Label>
                  <RadioGroup
                    value={priority}
                    onValueChange={(value: Priority) => setPriority(value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low">Low</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">High</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="rounded-md">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Due Date (optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal rounded-md",
                        !dueDate && "text-muted-foreground"
                      )}
                      onClick={preventSubmit}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "MMMM d, yyyy") : "Select a due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate || undefined}
                      onSelect={(date) => setDueDate(date)}
                      initialFocus
                      disabled={(date) => isBefore(date, today)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <CardFooter className="px-0 pt-6">
                <Button type="submit" className="w-full arc-gradient hover:opacity-90">
                  <Check className="mr-2 h-4 w-4" /> Create Task
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Create; 