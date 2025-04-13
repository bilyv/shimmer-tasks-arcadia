import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { CategorySelect } from "./CategorySelect";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  showCompleted: boolean;
  onShowCompletedChange: (show: boolean) => void;
  sortOrder: "newest" | "oldest" | "priority";
  onSortOrderChange: (order: "newest" | "oldest" | "priority") => void;
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function SearchAndFilters({
  searchQuery,
  onSearchQueryChange,
  showCompleted,
  onShowCompletedChange,
  sortOrder,
  onSortOrderChange,
  selectedCategory,
  onCategoryChange
}: SearchAndFiltersProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="flex gap-2">
      <div className={`relative flex-1 transition-all ${isFocused ? 'ring-2 ring-primary/20 rounded-lg' : ''}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="pl-9 rounded-lg border-muted"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      
      <div className="w-auto">
        <CategorySelect 
          selectedCategory={selectedCategory} 
          onCategoryChange={onCategoryChange} 
          isCompact={true}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-lg">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-lg animate-fade-in">
          <DropdownMenuCheckboxItem
            checked={showCompleted}
            onCheckedChange={onShowCompletedChange}
          >
            Show completed tasks
          </DropdownMenuCheckboxItem>
          
          <div className="px-2 py-1.5 text-sm font-semibold">Sort by</div>
          
          <DropdownMenuCheckboxItem
            checked={sortOrder === "newest"}
            onCheckedChange={(checked) => checked && onSortOrderChange("newest")}
          >
            Newest first
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuCheckboxItem
            checked={sortOrder === "oldest"}
            onCheckedChange={(checked) => checked && onSortOrderChange("oldest")}
          >
            Oldest first
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuCheckboxItem
            checked={sortOrder === "priority"}
            onCheckedChange={(checked) => checked && onSortOrderChange("priority")}
          >
            Priority
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
