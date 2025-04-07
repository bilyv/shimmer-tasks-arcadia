
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Users, LogOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { FeedbackDialog } from "./FeedbackDialog";

export function Navbar() {
  const isMobile = useIsMobile();
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  
  // This would come from your auth context in a real app
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://github.com/shadcn.png",
  };

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
        
        <div className="flex items-center gap-2 pr-3 md:pr-5">
          <Button 
            variant="ghost" 
            size="icon"
            className="relative h-9 w-9 rounded-full"
            onClick={() => setShowFeedbackDialog(true)}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Feedback</span>
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-7 w-7 md:h-8 md:w-8 rounded-full p-0">
                <Avatar className="h-7 w-7 md:h-8 md:w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>
                    <UserCircle className="h-5 w-5 md:h-6 md:w-6" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px] md:w-[200px]" align="end" forceMount>
              <DropdownMenuLabel className="font-normal py-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-xs md:text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-[10px] md:text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs md:text-sm py-1.5">
                <Users className="mr-2 h-3.5 w-3.5" />
                <span>Invite Friends</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs md:text-sm py-1.5 text-red-600">
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <FeedbackDialog 
        open={showFeedbackDialog} 
        onOpenChange={setShowFeedbackDialog} 
      />
    </nav>
  );
}
