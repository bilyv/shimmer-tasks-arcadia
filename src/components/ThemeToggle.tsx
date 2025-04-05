
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full transition-all duration-200 hover:bg-accent/50"
    >
      <Sun className={cn(
        "h-5 w-5 transition-all",
        theme === "dark" ? "opacity-0 scale-0 rotate-90" : "opacity-100 scale-100 rotate-0"
      )} />
      <Moon className={cn(
        "absolute h-5 w-5 transition-all",
        theme === "dark" ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 rotate-90"
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
