
import { TodoList } from "@/components/TodoList";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/contexts/ThemeContext";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { BottomTabBar } from "@/components/BottomTabBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Index = () => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 relative">
      {/* Background design for light mode with increased visibility */}
      {theme === "light" && (
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-30 blur-[100px]"></div>
        </div>
      )}
      
      {/* Background design for dark mode with matching visibility */}
      {theme === "dark" && (
        <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-600 opacity-30 blur-[100px]"></div>
        </div>
      )}
      
      <Navbar />
      <NavigationSidebar />
      <main className={cn(
        "container mx-auto px-4 pt-16",
        isMobile ? "pb-20" : "md:pl-20"  // Add padding for sidebar/bottom bar
      )}>
        <TodoList />
      </main>
      <BottomTabBar />
    </div>
  );
};

export default Index;
