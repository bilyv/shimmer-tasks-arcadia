import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sun, Moon, Coffee, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function GreetingHeader() {
  const [greeting, setGreeting] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("morning");
  const [isVisible, setIsVisible] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const { user } = useAuth();
  const name = user?.username || "there"; // Use username or fallback to "there"
  
  const randomDelay = useRef<number>(Math.random() * 0.5);
  
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
      setTimeOfDay("morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
      setTimeOfDay("afternoon");
    } else {
      setGreeting("Good evening");
      setTimeOfDay("evening");
    }
    
    // Staggered animation
    const visibleTimer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    
    const emojiTimer = setTimeout(() => {
      setShowEmoji(true);
    }, 600);
    
    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(emojiTimer);
    };
  }, []);
  
  // Get icon based on time of day
  const getIcon = () => {
    switch (timeOfDay) {
      case "morning":
        return <Coffee className="h-5 w-5 text-amber-400 animate-pulse" />;
      case "afternoon":
        return <Sun className="h-5 w-5 text-yellow-400 animate-spin-slow" />;
      case "evening":
        return <Moon className="h-5 w-5 text-indigo-400 animate-pulse" />;
      default:
        return <Sparkles className="h-5 w-5 text-primary animate-pulse" />;
    }
  };
  
  return (
    <div className="relative mb-3">
      {/* Decorative elements that float around */}
      <div 
        className={cn(
          "absolute -top-2 -left-2 transition-all duration-700 ease-out",
          showEmoji ? "opacity-100 scale-100" : "opacity-0 scale-0",
          "animate-float-slow"
        )}
        style={{ animationDelay: `${randomDelay.current}s` }}
      >
        <Star className="h-3 w-3 text-amber-300 fill-amber-300" />
      </div>
      
      <div 
        className={cn(
          "absolute -top-1 left-20 transition-all duration-700 ease-out",
          showEmoji ? "opacity-100 scale-100" : "opacity-0 scale-0",
          "animate-float"
        )}
        style={{ animationDelay: `${randomDelay.current + 0.2}s` }}
      >
        <Sparkles className="h-4 w-4 text-purple-400" />
      </div>
      
      <div 
        className={cn(
          "absolute top-4 -right-2 transition-all duration-700 ease-out",
          showEmoji ? "opacity-100 scale-100" : "opacity-0 scale-0",
          "animate-float-slow"
        )}
        style={{ animationDelay: `${randomDelay.current + 0.3}s` }}
      >
        <Star className="h-3 w-3 text-blue-300 fill-blue-300" />
      </div>
      
      {/* Main greeting */}
      <div 
        className={cn(
          "inline-flex items-center gap-2 py-1 px-3 rounded-full text-lg font-medium mb-1",
          "bg-gradient-to-r from-background/50 to-muted/30 backdrop-blur-sm border border-border/30 shadow-sm",
          "transition-all duration-500 ease-out transform",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        )}
      >
        <span className="animate-bounce-slow">{getIcon()}</span>
        <span className="text-gradient-animated">
          {greeting},
        </span>{" "}
        <span 
          className={cn(
            "bg-gradient-to-r from-arc-cyan via-arc-blue to-arc-purple bg-clip-text text-transparent",
            "transition-opacity duration-500 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          {name}!
        </span>
      </div>

      {/* Motivational tagline */}
      <p 
        className={cn(
          "text-sm text-muted-foreground ml-2 mt-1",
          "transition-all duration-500 delay-300 ease-out transform",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        )}
      >
        Ready to make today amazing?
      </p>
    </div>
  );
}
