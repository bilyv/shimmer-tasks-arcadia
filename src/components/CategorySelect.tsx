
import { Button } from "@/components/ui/button";
import { useTodo } from "@/contexts/TodoContext";
import { ChevronDown, Check, FolderIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategorySelectProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategorySelect({ selectedCategory, onCategoryChange }: CategorySelectProps) {
  const { categories, getTodosByCategory } = useTodo();
  
  // Get the selected category name or "All Tasks" if none is selected
  const getSelectedCategoryName = () => {
    if (!selectedCategory) return "All Tasks";
    const category = categories.find((cat) => cat.id === selectedCategory);
    return category ? category.name : "All Tasks";
  };

  return (
    <div className="w-full mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full md:w-auto justify-between border rounded-xl py-2.5 px-4 text-base font-medium transition-all duration-200 hover:bg-accent"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${!selectedCategory ? "bg-primary" : ""}`}
                style={{ 
                  backgroundColor: selectedCategory 
                    ? categories.find(cat => cat.id === selectedCategory)?.color 
                    : "" 
                }}
              />
              {getSelectedCategoryName()}
              <span className="ml-1 text-xs opacity-70 px-1.5 py-0.5 rounded-full bg-muted">
                {selectedCategory 
                  ? getTodosByCategory(selectedCategory).length 
                  : "All"}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px] p-2 rounded-xl">
          <DropdownMenuItem 
            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
            onClick={() => onCategoryChange(null)}
          >
            <div className="flex items-center gap-2 w-full">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="flex-1">All Tasks</span>
              {!selectedCategory && <Check className="h-4 w-4 text-primary" />}
            </div>
          </DropdownMenuItem>
          
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
              onClick={() => onCategoryChange(category.id)}
            >
              <div className="flex items-center gap-2 w-full">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="flex-1">{category.name}</span>
                <span className="text-xs opacity-70 px-1.5 py-0.5 rounded-full bg-muted/50">
                  {getTodosByCategory(category.id).length}
                </span>
                {selectedCategory === category.id && <Check className="h-4 w-4 text-primary" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
