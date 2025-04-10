import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Handle viewport height for mobile browsers
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateViewportHeight);
    updateViewportHeight();

    return () => window.removeEventListener('resize', updateViewportHeight);
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Handle Google sign in mock
  const handleGoogleSignIn = () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username before continuing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate auth process
    setTimeout(() => {
      // Login via context
      login(username);
      
      toast({
        title: activeTab === "login" ? "Welcome back!" : "Account created",
        description: `You have successfully ${activeTab === "login" ? "logged in" : "registered"} as ${username}`,
      });
      
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div 
      className="flex flex-col items-center justify-between w-full bg-gradient-to-br from-background to-muted/30 py-8 px-4"
      style={{ minHeight: `${viewportHeight}px` }}
    >
      {/* Background pattern */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f01a_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f01a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 dark:bg-purple-700 opacity-20 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col justify-center py-6">
        {/* Logo/Branding */}
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-arc-purple to-arc-blue bg-clip-text text-transparent">
            Arce Todo
          </h1>
          <p className="text-muted-foreground">Organize your tasks beautifully</p>
        </div>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <Card className="border-border/40 bg-card/60 backdrop-blur-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {activeTab === "login" ? "Welcome back" : "Create an account"}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "login" 
                  ? "Enter your username to sign in" 
                  : "Enter your details below to create your account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="rounded-md"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Continue with
                  </span>
                </div>
              </div>

              <Button 
                className="w-full flex items-center justify-center gap-2 group" 
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                ) : (
                  <FcGoogle className="h-5 w-5" />
                )}
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  {activeTab === "login" ? "Sign in with Google" : "Sign up with Google"}
                </span>
              </Button>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                {activeTab === "login" ? (
                  <p>
                    Don't have an account?{" "}
                    <button 
                      className="underline text-primary underline-offset-4 hover:text-primary/90"
                      onClick={() => setActiveTab("register")}
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button 
                      className="underline text-primary underline-offset-4 hover:text-primary/90"
                      onClick={() => setActiveTab("login")}
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        </Tabs>
      </div>
      
      {/* Footer space to ensure content is not cut off */}
      <div className="w-full text-center text-xs text-muted-foreground mt-8 pb-4">
        &copy; {new Date().getFullYear()} Arce Todo
      </div>
    </div>
  );
};

export default Auth; 