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
  CalendarDays,
  UserCircle,
  Mail,
  Edit,
  Users,
  CheckCircle2,
  LineChart,
  Activity,
  Trophy,
  Clock,
  Github,
  Calendar 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import { mockConnections } from "@/data/mockData";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Component to render the GitHub-style activity graph
const ActivityGrid = ({ todos }) => {
  const today = new Date();
  const oneYearAgo = subDays(today, 365);
  
  const days = eachDayOfInterval({ start: oneYearAgo, end: today });
  
  // Group todos by date for easy lookup
  const todosByDate = {};
  todos.forEach(todo => {
    if (todo.createdAt) {
      const dateStr = format(new Date(todo.createdAt), 'yyyy-MM-dd');
      if (!todosByDate[dateStr]) {
        todosByDate[dateStr] = [];
      }
      todosByDate[dateStr].push(todo);
    }
  });
  
  // Calculate activity level (0-4) for a given date
  const getActivityLevel = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = todosByDate[dateStr]?.length || 0;
    
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
  };
  
  // Group days by week for display
  const weeks = [];
  let currentWeek = [];
  
  days.forEach((day, i) => {
    const dayOfWeek = day.getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentWeek.push(day);
    
    if (i === days.length - 1) {
      weeks.push(currentWeek);
    }
  });
  
  // Fill the first week with empty cells if needed
  if (weeks[0].length < 7) {
    const firstWeek = weeks[0];
    const missing = 7 - firstWeek.length;
    for (let i = 0; i < missing; i++) {
      firstWeek.unshift(null);
    }
  }
  
  return (
    <div className="overflow-x-auto py-4">
      <div className="min-w-[800px]">
        <div className="flex text-xs text-muted-foreground mb-2 justify-start pl-10">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((day, i) => (
            <div key={i} className="w-6 text-center">{day}</div>
          ))}
        </div>
        <div className="flex flex-col gap-[3px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-[3px]">
              {week.map((day, dayIndex) => {
                if (!day) return <div key={`empty-${dayIndex}`} className="w-6 h-6" />;
                
                const level = getActivityLevel(day);
                const dateStr = format(day, 'MMM d, yyyy');
                const count = todosByDate[format(day, 'yyyy-MM-dd')]?.length || 0;
                
                return (
                  <div
                    key={dayIndex}
                    className={`w-6 h-6 rounded-sm cursor-pointer transition-colors
                      ${level === 0 ? 'bg-muted hover:bg-muted/80' : ''}
                      ${level === 1 ? 'bg-emerald-200 dark:bg-emerald-900 hover:bg-emerald-300 dark:hover:bg-emerald-800' : ''}
                      ${level === 2 ? 'bg-emerald-300 dark:bg-emerald-800 hover:bg-emerald-400 dark:hover:bg-emerald-700' : ''}
                      ${level === 3 ? 'bg-emerald-400 dark:bg-emerald-700 hover:bg-emerald-500 dark:hover:bg-emerald-600' : ''}
                      ${level === 4 ? 'bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500' : ''}
                    `}
                    title={`${dateStr}: ${count} ${count === 1 ? 'task' : 'tasks'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-start mt-3 gap-2 text-xs">
          <div className="flex items-center">
            <span className="mr-2 text-muted-foreground">Less</span>
            <div className="flex gap-[3px]">
              <div className="w-6 h-6 rounded-sm bg-muted" />
              <div className="w-6 h-6 rounded-sm bg-emerald-200 dark:bg-emerald-900" />
              <div className="w-6 h-6 rounded-sm bg-emerald-300 dark:bg-emerald-800" />
              <div className="w-6 h-6 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
              <div className="w-6 h-6 rounded-sm bg-emerald-500 dark:bg-emerald-600" />
            </div>
            <span className="ml-2 text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat card component for reusability
const StatCard = ({ icon, title, value, description, color = "text-primary" }) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
            title="Tasks Completed"
            value={stats.completed}
            color="text-emerald-500"
          />
          <StatCard 
            icon={<Activity className="h-5 w-5 text-blue-500" />}
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            color="text-blue-500"
          />
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
          />
        </div>
        
        {/* Main Content */}
        <Tabs defaultValue="activity" className="bg-background/50 p-4 rounded-xl backdrop-blur-md border shadow-sm mb-8">
          <TabsList className="mb-4 bg-background border">
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity">
            <Card className="bg-card/60 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="text-lg">Activity Contributions</CardTitle>
                <CardDescription>Your task creation and completion activity over the past year.</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityGrid todos={todos} />
              </CardContent>
            </Card>
          </TabsContent>
          
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
          
          <TabsContent value="calendar">
            <Card className="bg-card/60 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="text-lg">Task Calendar View</CardTitle>
                <CardDescription>Your upcoming and completed tasks by date.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <CalendarDays className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-center">
                    Calendar view is coming soon!<br />
                    Check back for updates.
                  </p>
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