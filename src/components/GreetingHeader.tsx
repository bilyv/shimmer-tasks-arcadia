
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function GreetingHeader() {
  const [greeting, setGreeting] = useState("");
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
  }, []);
  
  return (
    <p className={cn(
      "text-muted-foreground text-lg",
      "animate-fade-in opacity-100"
    )}>
      {greeting}, {name}
    </p>
  );
}
