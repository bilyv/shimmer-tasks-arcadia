import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useTodo } from "@/contexts/TodoContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage 
} from "@/components/ui/avatar";
import { 
  UserCircle,
  Mail,
  Edit,
  Users,
  LineChart,
  Trophy,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import { mockConnections } from "@/data/mockData";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Todo } from "@/types/todo";

// Interface for the StatCard component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  description?: string;
  color?: string;
}

// Stat card component for reusability
const StatCard = ({ icon, title, value, description, color = "text-primary" }: StatCardProps) => (
  <Card className="bg-card/60 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className={`p-2 rounded-full ${color.replace('text-', 'bg-')}/10`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const Profile = () => {
  const { user } = useAuth();
  const { todos } = useTodo();
  const [stats, setStats] = useState({
    completed: 0,
    streak: 0,
    tasksCreated: 0,
    completionRate: 0,
    connections: 0
  });

  useEffect(() => {
    // Calculate stats from todos
    const completed = todos.filter(t => t.completed).length;
    const tasksCreated = todos.length;
    const completionRate = tasksCreated > 0 ? Math.round((completed / tasksCreated) * 100) : 0;
    
    // Calculate streak (simplified version)
    let streak = 0;
    const today = new Date();
    let currentDate = today;
    let hasCompletedTasks = true;
    
    while (hasCompletedTasks) {
      const todosForDay = todos.filter(todo => {
        if (!todo.updatedAt) return false;
        return isSameDay(new Date(todo.updatedAt), currentDate) && todo.completed;
      });
      
      if (todosForDay.length > 0) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        hasCompletedTasks = false;
      }
    }
    
    setStats({
      completed,
      streak,
      tasksCreated,
      completionRate,
      connections: mockConnections.length
    });
  }, [todos]);

  if (!user) return null;

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-8 px-4 pb-20 md:pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="text-xl">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{user.username}</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <UserCircle className="h-4 w-4" />
                <span>@{user.username.toLowerCase()}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline" className="px-2 py-1 text-xs flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> 
                  {stats.streak} day streak
                </Badge>
                <Badge variant="outline" className="px-2 py-1 text-xs flex items-center gap-1">
                  <Users className="h-3 w-3" /> 
                  {stats.connections} connections
                </Badge>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <StatCard 
            icon={<Clock className="h-5 w-5 text-amber-500" />}
            title="Current Streak"
            value={stats.streak}
            description={stats.streak > 0 ? "Keep going!" : "Start today!"}
            color="text-amber-500"
          />
          <StatCard 
            icon={<Users className="h-5 w-5 text-violet-500" />}
            title="Connections"
            value={stats.connections}
            color="text-violet-500"
            description="People you're connected with"
          />
        </div>
        
        {/* Main Content */}
        <Tabs defaultValue="progress" className="bg-background/50 p-4 rounded-xl backdrop-blur-md border shadow-sm mb-8">
          <TabsList className="mb-4 bg-background border">
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <Card className="bg-card/60 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="text-lg">Task Progress by Category</CardTitle>
                <CardDescription>View your task completion rates by category.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {useTodo().categories.map(category => {
                    const categoryTodos = todos.filter(t => t.categoryId === category.id);
                    const completed = categoryTodos.filter(t => t.completed).length;
                    const total = categoryTodos.length;
                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                    
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {completed}/{total} ({percentage}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Recent Connections */}
        <Card className="bg-card/60 backdrop-blur-sm border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Connections</CardTitle>
              <CardDescription>People you've connected with recently.</CardDescription>
            </div>
            <Button variant="link" className="text-primary">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockConnections.slice(0, 3).map(connection => (
                <div key={connection.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={connection.avatar} alt={connection.name} />
                    <AvatarFallback>{connection.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{connection.name}</p>
                    <p className="text-sm text-muted-foreground">@{connection.username}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={connection.status === "online" ? "bg-green-500/10 text-green-500" : ""}>
                    {connection.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/20 flex justify-between py-3">
            <p className="text-sm text-muted-foreground">
              Showing 3 of {mockConnections.length} connections
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile; 