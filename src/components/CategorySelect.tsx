
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTodo } from "@/contexts/TodoContext";

interface CategorySelectProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategorySelect({ selectedCategory, onCategoryChange }: CategorySelectProps) {
  const { categories, getTodosByCategory } = useTodo();
  
  return (
    <div className="w-full overflow-x-auto hide-scrollbar pb-2">
      <Tabs
        value={selectedCategory || "all"}
        onValueChange={(value) => onCategoryChange(value === "all" ? null : value)}
        className="w-full"
      >
        <TabsList className="flex w-max space-x-1 rounded-xl bg-muted p-1">
          <TabsTrigger
            value="all"
            className="rounded-lg data-[state=active]:arc-gradient data-[state=active]:text-white animate-fade-in"
          >
            All Tasks
          </TabsTrigger>
          
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="rounded-lg data-[state=active]:text-white animate-fade-in flex items-center gap-2"
              style={{
                backgroundColor:
                  selectedCategory === category.id ? category.color : "transparent",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
              <span className="ml-1 text-xs opacity-70 px-1.5 py-0.5 rounded-full bg-background/10">
                {getTodosByCategory(category.id).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
