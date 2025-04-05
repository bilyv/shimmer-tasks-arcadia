
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Navbar() {
  const isMobile = useIsMobile();
  
  return (
    <nav className={cn(
      "fixed top-0 w-full z-50",
      "backdrop-blur-md bg-background/70 dark:bg-background/60",
      "border-b border-border/40",
      "transition-all duration-300"
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-arc-purple to-arc-blue bg-clip-text text-transparent animate-fade-in">
            Arce Todo
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
