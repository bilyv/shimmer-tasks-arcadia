import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, X, Plus, Link as LinkIcon, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useTodo } from "@/contexts/TodoContext";
import { Todo, Priority, SubTask, TodoLink } from "@/types/todo";
import { Badge } from "@/components/ui/badge";

interface TodoDialogProps {
  mode: "create" | "edit";
  todo?: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TodoDialog({ mode, todo, open, onOpenChange }: TodoDialogProps) {
  const { addTodo, updateTodo, categories, addSubtask, todos } = useTodo();
  
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [priority, setPriority] = useState<Priority>(todo?.priority || "medium");
  const [categoryId, setCategoryId] = useState(todo?.categoryId || categories[0]?.id || "");
  const [dueDate, setDueDate] = useState<Date | null>(todo?.dueDate || null);
  const [subtasks, setSubtasks] = useState<SubTask[]>(todo?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  
  // New state for links
  const [links, setLinks] = useState<TodoLink[]>(todo?.links || []);
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  
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
  
  // New functions for links
  const handleAddLink = () => {
    if (newLinkUrl.trim()) {
      // Basic URL validation
      let url = newLinkUrl.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      
      setLinks([
        ...links,
        {
          id: crypto.randomUUID(),
          url: url,
          title: newLinkTitle.trim() || url,
        },
      ]);
      setNewLinkUrl("");
      setNewLinkTitle("");
      setShowLinkInput(false);
    }
  };

  const handleDeleteLink = (linkId: string) => {
    setLinks(links.filter((link) => link.id !== linkId));
  };

  const handleLinkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLink();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    if (mode === "create") {
      const newTodo = {
        title,
        description,
        priority,
        categoryId,
        dueDate,
        links: links.length > 0 ? links : undefined,
      };
      
      const newTodoId = addTodo(newTodo);
      
      // Add subtasks after todo creation
      subtasks.forEach(subtask => {
        addSubtask(newTodoId, subtask.title);
      });
    } else if (mode === "edit" && todo) {
      updateTodo(todo.id, {
        title,
        description,
        priority,
        categoryId,
        dueDate,
        subtasks,
        links: links.length > 0 ? links : undefined,
      });
    }
    
    onOpenChange(false);
  };
  
  // This prevents form submission when clicking inside the date picker
  const preventSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Function to get todos count for a specific date
  const getTodosForDate = (date: Date) => {
    return todos.filter(t => {
      if (!t.dueDate) return false;
      return format(new Date(t.dueDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }).length;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-[400px] animate-fade-in rounded-lg p-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-semibold">
            {mode === "create" ? "Create Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        
        <form id="todo-form" onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor="title" className="text-sm">Task Name</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-md h-8 text-sm"
              required
              autoFocus
            />
          </div>
          
          <div className="grid gap-1.5">
            <Label htmlFor="description" className="text-sm">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add some details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none rounded-md text-sm min-h-[60px]"
              rows={2}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm">Subtasks</Label>
            
            {/* Subtasks display */}
            <div className="flex flex-wrap gap-1.5 mb-1">
              {subtasks.map((subtask) => (
                <Badge 
                  key={subtask.id} 
                  variant="secondary"
                  className="px-2 py-0.5 flex items-center gap-1 text-xs"
                >
                  {subtask.title}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-3 w-3 ml-1 p-0"
                    onClick={() => handleDeleteSubtask(subtask.id)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
            
            {/* Subtask input */}
            <div className="flex items-center gap-1.5">
              <Input
                placeholder="Add a subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={handleSubtaskKeyDown}
                className="flex-1 h-7 text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubtask}
                className="px-2 h-7 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          {/* Links section */}
          <div className="grid gap-1.5">
            <Label className="text-sm">Links</Label>
            
            {/* Links display */}
            <div className="flex flex-wrap gap-1.5 mb-1">
              {links.map((link) => (
                <Badge 
                  key={link.id} 
                  variant="secondary"
                  className="px-2 py-0.5 flex items-center gap-1 text-xs"
                >
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon className="h-2.5 w-2.5 text-primary" />
                    {link.title}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-3 w-3 ml-1 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteLink(link.id);
                    }}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
            
            {/* Link input */}
            {showLinkInput ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Input
                    placeholder="URL (e.g., https://example.com)"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    onKeyDown={handleLinkKeyDown}
                    className="flex-1 h-7 text-sm"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLinkInput(false)}
                    className="px-2 h-7 text-xs"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-1.5">
                  <Input
                    placeholder="Link title (optional)"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    onKeyDown={handleLinkKeyDown}
                    className="flex-1 h-7 text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddLink}
                    className="px-2 h-7 text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowLinkInput(true)}
                className="px-2 h-7 text-xs w-full"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Link
              </Button>
            )}
          </div>
          
          <div className="grid gap-1.5">
            <Label className="text-sm">Priority</Label>
            <RadioGroup
              value={priority}
              onValueChange={(value: Priority) => setPriority(value)}
              className="flex gap-3"
            >
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="low" id="low" className="h-3.5 w-3.5" />
                <Label htmlFor="low" className="text-xs">Low</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="medium" id="medium" className="h-3.5 w-3.5" />
                <Label htmlFor="medium" className="text-xs">Medium</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="high" id="high" className="h-3.5 w-3.5" />
                <Label htmlFor="high" className="text-xs">High</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-1.5">
            <Label className="text-sm">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="rounded-md h-8 text-xs">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-1.5">
            <Label className="text-sm">Due Date (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal rounded-md h-8 text-xs",
                    !dueDate && "text-muted-foreground"
                  )}
                  onClick={preventSubmit}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {dueDate ? format(dueDate, "MMM d, yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate || undefined}
                  onSelect={setDueDate}
                  initialFocus
                  className="rounded-md pointer-events-auto"
                  disabled={(date) => isBefore(date, today) && !format(date, 'yyyy-MM-dd').includes(format(today, 'yyyy-MM-dd'))}
                  components={{
                    DayContent: (props) => {
                      const date = props.date;
                      const todosCount = getTodosForDate(date);

                      return (
                        <div className="relative">
                          <div>{props.date.getDate()}</div>
                          {todosCount > 0 && (
                            <span className="absolute bottom-0 right-0 -mr-1 -mb-1 flex items-center justify-center bg-primary text-[0.5rem] text-primary-foreground w-3 h-3 rounded-full">
                              {todosCount}
                            </span>
                          )}
                        </div>
                      );
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </form>
        
        <DialogFooter className="pt-3 space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs rounded-md"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="todo-form" 
            className="arc-gradient hover:opacity-90 h-8 text-xs rounded-md"
          >
            {mode === "create" ? "Create Task" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
