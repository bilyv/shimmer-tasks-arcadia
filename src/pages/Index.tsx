
import { TodoList } from "@/components/TodoList";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 pt-20">
        <TodoList />
      </main>
    </div>
  );
};

export default Index;
