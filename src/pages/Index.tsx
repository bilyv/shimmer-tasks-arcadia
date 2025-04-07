
import { TodoList } from "@/components/TodoList";
import { Navbar } from "@/components/Navbar";
import { GreetingHeader } from "@/components/GreetingHeader";
import { AppDock } from "@/components/AppDock";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 pt-16">
        <AppDock />
        <div className="mt-3">
          <GreetingHeader />
        </div>
        <TodoList />
      </main>
    </div>
  );
};

export default Index;
