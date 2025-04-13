import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Todo, Priority, SubTask } from "@/types/todo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, X, Plus, Check, Sparkles, Camera, Scan, ScanLine, Bot, BrainCircuit } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Create = () => {
  const { addTodo, categories, addSubtask } = useTodo();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  
  // States for OCR and AI
  const [showOcrDialog, setShowOcrDialog] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [ocrImagePreview, setOcrImagePreview] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  
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
  
  // Handle OCR image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOcrImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Mock OCR processing
  const processOcrImage = () => {
    if (!ocrImagePreview) return;
    
    setIsProcessingOcr(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      // Mock OCR result
      setTitle("Meeting with marketing team");
      setDescription("Discuss Q3 campaign strategy and budget allocation");
      setPriority("high");
      
      // Add mock subtasks
      setSubtasks([
        { id: crypto.randomUUID(), title: "Prepare presentation slides", completed: false },
        { id: crypto.randomUUID(), title: "Review campaign metrics", completed: false }
      ]);
      
      setIsProcessingOcr(false);
      setShowOcrDialog(false);
      setOcrImagePreview(null);
      
      toast({
        title: "OCR scan complete",
        description: "Task details extracted successfully!",
      });
    }, 2000);
  };
  
  // Mock AI generation
  const generateTaskWithAi = () => {
    if (!aiPrompt.trim()) return;
    
    setIsGeneratingAi(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock AI result based on the prompt
      if (aiPrompt.toLowerCase().includes("meeting")) {
        setTitle("Team sync meeting");
        setDescription("Weekly project status update with the development team");
        setPriority("medium");
        setSubtasks([
          { id: crypto.randomUUID(), title: "Prepare progress report", completed: false },
          { id: crypto.randomUUID(), title: "List blockers to discuss", completed: false },
          { id: crypto.randomUUID(), title: "Update project timeline", completed: false }
        ]);
      } else if (aiPrompt.toLowerCase().includes("email") || aiPrompt.toLowerCase().includes("write")) {
        setTitle("Write weekly newsletter");
        setDescription("Draft and send the company newsletter to all stakeholders");
        setPriority("medium");
        setSubtasks([
          { id: crypto.randomUUID(), title: "Gather content from teams", completed: false },
          { id: crypto.randomUUID(), title: "Draft newsletter layout", completed: false },
          { id: crypto.randomUUID(), title: "Get approval from marketing", completed: false }
        ]);
      } else {
        setTitle("Task from AI prompt");
        setDescription(aiPrompt);
        setPriority("low");
      }
      
      setIsGeneratingAi(false);
      setShowAiDialog(false);
      setAiPrompt("");
      
      toast({
        title: "AI generation complete",
        description: "Task details generated successfully!",
      });
    }, 2000);
  };
  
  // This prevents form submission when clicking inside the date picker
  const preventSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto px-4 py-4 pb-20 md:pb-6">
        <div className="flex items-center mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold">Create New Task</h1>
            <p className="text-sm text-muted-foreground">Add details for your new task</p>
          </div>
        </div>
        
        {/* Create options */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1.5 bg-background/80"
            onClick={() => setShowOcrDialog(true)}
          >
            <ScanLine className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs">Create with OCR</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1.5 bg-background/80"
            onClick={() => setShowAiDialog(true)}
          >
            <BrainCircuit className="h-3.5 w-3.5 text-purple-500" />
            <span className="text-xs">Create with AI</span>
          </Button>
        </div>
        
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-lg">Task Details</CardTitle>
            <CardDescription className="text-xs">Fill out the information below to create a new task</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form id="todo-form" onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-1">
                <Label htmlFor="title" className="text-sm font-medium">Task Name</Label>
                <Input
                  id="title"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-md h-8"
                  required
                  autoFocus
                />
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="description" className="text-sm font-medium">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add some details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none rounded-md min-h-[60px]"
                  rows={2}
                />
              </div>

              <div className="grid gap-1">
                <Label className="text-sm font-medium">Subtasks</Label>
                
                {/* Subtasks display */}
                <div className="flex flex-wrap gap-1 mb-1">
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
                <div className="flex items-center gap-1">
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
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label className="text-sm font-medium">Priority</Label>
                  <RadioGroup
                    value={priority}
                    onValueChange={(value: Priority) => setPriority(value)}
                    className="flex gap-3"
                  >
                    <div className="flex items-center gap-1">
                      <RadioGroupItem value="low" id="low" className="h-3 w-3" />
                      <Label htmlFor="low" className="text-xs">Low</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem value="medium" id="medium" className="h-3 w-3" />
                      <Label htmlFor="medium" className="text-xs">Medium</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem value="high" id="high" className="h-3 w-3" />
                      <Label htmlFor="high" className="text-xs">High</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="grid gap-1">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="rounded-md h-8 text-xs">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-xs">
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
              
              <div className="grid gap-1">
                <Label className="text-sm font-medium">Due Date (optional)</Label>
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
                      classNames={{
                        day: "h-7 w-7 text-xs p-0 font-normal",
                        caption: "text-sm"
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <CardFooter className="px-0 pt-3">
                <Button type="submit" className="w-full arc-gradient hover:opacity-90 h-8 text-sm">
                  <Check className="mr-2 h-3 w-3" /> Create Task
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* OCR Dialog */}
      <Dialog open={showOcrDialog} onOpenChange={setShowOcrDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Create Task from Image</DialogTitle>
            <DialogDescription className="text-center text-xs">
              Upload an image containing task information to extract details automatically
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-2">
            <div className="flex flex-col gap-3 items-center justify-center">
              {ocrImagePreview ? (
                <div className="relative w-full max-h-[200px] overflow-hidden rounded-lg border">
                  <img 
                    src={ocrImagePreview} 
                    alt="Preview" 
                    className="object-contain w-full h-full"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                    onClick={() => setOcrImagePreview(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center w-full flex flex-col items-center gap-2">
                  <Camera className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Drag & drop an image here or click to browse</p>
                  
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="ocr-image-upload"
                    onChange={handleImageUpload}
                  />
                  <Label 
                    htmlFor="ocr-image-upload" 
                    className="bg-primary/10 hover:bg-primary/20 text-primary text-xs py-1 px-3 rounded-full cursor-pointer mt-2"
                  >
                    Select Image
                  </Label>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOcrDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={!ocrImagePreview || isProcessingOcr}
              onClick={processOcrImage}
              className="w-full sm:w-auto arc-gradient"
            >
              {isProcessingOcr ? (
                <>
                  <span className="animate-pulse mr-2">Processing...</span>
                </>
              ) : (
                <>
                  <ScanLine className="mr-2 h-3.5 w-3.5" />
                  Extract Task
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AI Dialog */}
      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Create Task with AI</DialogTitle>
            <DialogDescription className="text-center text-xs">
              Describe the task you want to create and AI will generate the details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 py-2">
            <Textarea
              placeholder="Describe your task... (e.g., 'Set up a weekly team meeting for project status updates')"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="resize-none min-h-[100px]"
            />
            
            <div className="bg-muted/50 p-2 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">The AI can help you create:</p>
              <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
                <li>Fully detailed tasks with appropriate priorities</li>
                <li>Multiple subtasks based on your description</li>
                <li>Suggested due dates for time-sensitive tasks</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAiDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={!aiPrompt.trim() || isGeneratingAi}
              onClick={generateTaskWithAi}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
            >
              {isGeneratingAi ? (
                <>
                  <span className="animate-pulse mr-2">Generating...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-3.5 w-3.5" />
                  Generate Task
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Create; 