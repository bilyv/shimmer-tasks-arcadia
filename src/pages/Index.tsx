
import { TodoList } from "@/components/TodoList";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 relative">
      {/* Background animation for light mode only */}
      {theme === "light" && (
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
        </div>
      )}
      
      <Navbar />
      <main className="container mx-auto px-4 pt-16">
        <TodoList />
      </main>
    </div>
  );
};

export default Index;
