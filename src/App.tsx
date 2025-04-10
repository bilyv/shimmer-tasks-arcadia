
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TodoProvider } from "@/contexts/TodoContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { cn } from "@/lib/utils";

// Create placeholder pages for the new routes
const CreatePage = () => (
  <div className="container mx-auto pt-24 px-4 min-h-screen">
    <h1 className={cn("text-2xl font-bold mb-6", "bg-gradient-to-r from-arc-purple to-arc-blue bg-clip-text text-transparent")}>Create New Task</h1>
    <p className="text-muted-foreground">Create page content will go here.</p>
  </div>
);

const ConnectionsPage = () => (
  <div className="container mx-auto pt-24 px-4 min-h-screen">
    <h1 className={cn("text-2xl font-bold mb-6", "bg-gradient-to-r from-arc-purple to-arc-blue bg-clip-text text-transparent")}>Your Connections</h1>
    <p className="text-muted-foreground">Connections page content will go here.</p>
  </div>
);

const ProfilePage = () => (
  <div className="container mx-auto pt-24 px-4 min-h-screen">
    <h1 className={cn("text-2xl font-bold mb-6", "bg-gradient-to-r from-arc-purple to-arc-blue bg-clip-text text-transparent")}>Profile</h1>
    <p className="text-muted-foreground">Profile page content will go here.</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <TodoProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TodoProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
