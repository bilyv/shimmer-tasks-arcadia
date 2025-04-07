
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function GreetingHeader() {
  const [greeting, setGreeting] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const name = "Brian"; // This could be dynamic based on user data
  
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
    
    // Add animation delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <p className={cn(
      "text-muted-foreground text-lg font-medium",
      "transition-all duration-700 ease-in-out transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
    )}>
      <span className="bg-gradient-to-r from-arc-purple to-arc-blue bg-clip-text text-transparent font-semibold">
        {greeting},
      </span>{" "}
      {name}
    </p>
  );
}
