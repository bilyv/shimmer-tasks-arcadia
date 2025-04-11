import { useState } from "react";
import { Layout } from "@/components/Layout";
import { 
  Search, User, Users, UserPlus, Plus, X, Mail, Calendar, Settings, 
  MoreHorizontal, Shield, Check, MessageSquare, Star, UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Demo data
const connections = [
  { 
    id: 1, 
    name: "Alex Johnson", 
    email: "alex@example.com", 
    avatar: "https://i.pravatar.cc/150?img=1", 
    status: "online",
    role: "Designer",
    tasks: 5,
    starred: true
  },
  { 
    id: 2, 
    name: "Sarah Williams", 
    email: "sarah@example.com", 
    avatar: "https://i.pravatar.cc/150?img=5", 
    status: "offline",
    role: "Developer",
    tasks: 2,
    starred: false
  },
  { 
    id: 3, 
    name: "Michael Brown", 
    email: "michael@example.com", 
    avatar: "https://i.pravatar.cc/150?img=8", 
    status: "online",
    role: "Project Manager",
    tasks: 8,
    starred: true
  },
  { 
    id: 4, 
    name: "Emma Davis", 
    email: "emma@example.com", 
    avatar: "https://i.pravatar.cc/150?img=9", 
    status: "offline",
    role: "UI Designer",
    tasks: 3,
    starred: false
  },
  { 
    id: 5, 
    name: "David Wilson", 
    email: "david@example.com", 
    avatar: "https://i.pravatar.cc/150?img=12", 
    status: "online",
    role: "Full Stack Developer",
    tasks: 6,
    starred: false
  },
];

const teams = [
  {
    id: 1,
    name: "Design Team",
    description: "UI/UX and design related tasks",
    members: 4,
    avatar: "D",
    color: "bg-indigo-500"
  },
  {
    id: 2,
    name: "Development",
    description: "Frontend and backend development",
    members: 6,
    avatar: "C",
    color: "bg-pink-500"
  },
  {
    id: 3,
    name: "Marketing",
    description: "Social media and marketing campaigns",
    members: 3,
    avatar: "M",
    color: "bg-amber-500"
  }
];

const Connections = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("people");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  
  // Filter connections based on search query
  const filteredConnections = connections.filter(connection => 
    connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter teams based on search query
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Add new team (simulated)
  const handleAddTeam = () => {
    // In a real app, you would make an API call to create a team
    console.log("Creating team:", { name: newTeamName, description: newTeamDescription });
    
    // Reset form and close dialog
    setNewTeamName("");
    setNewTeamDescription("");
    setTeamDialogOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 w-full pb-20">
        <div className="flex items-center justify-between mb-6 mt-4">
          <div>
            <h1 className="text-2xl font-bold">Connections</h1>
            <p className="text-muted-foreground">Manage your network and teams</p>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add new connection</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                        <Users className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create New Team</DialogTitle>
                        <DialogDescription>
                          Create a new team to collaborate with your connections
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label htmlFor="team-name" className="text-sm font-medium">
                            Team Name
                          </label>
                          <Input
                            id="team-name"
                            placeholder="Enter team name"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="team-description" className="text-sm font-medium">
                            Description
                          </label>
                          <Input
                            id="team-description"
                            placeholder="Team purpose or description"
                            value={newTeamDescription}
                            onChange={(e) => setNewTeamDescription(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setTeamDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" onClick={handleAddTeam}>
                          Create Team
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create new team</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Search connections or teams..."
            className="pl-10 bg-background/60 backdrop-blur-sm w-full pr-4 rounded-full border-border/40 focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="people" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-background/60 backdrop-blur-sm mb-4">
            <TabsTrigger value="people" className="flex-1">
              <User className="h-4 w-4 mr-2" />
              People
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Teams
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="people" className="mt-2">
            {filteredConnections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredConnections.map((connection) => (
                  <Card key={connection.id} className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/40 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-background">
                            <AvatarImage src={connection.avatar} alt={connection.name} />
                            <AvatarFallback>{connection.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${connection.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center">
                            {connection.name}
                            {connection.starred && (
                              <span className="ml-2 text-amber-500">
                                <Star className="h-3.5 w-3.5 fill-current" />
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="text-xs mt-0.5">{connection.role}</CardDescription>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-xs cursor-pointer">
                            <MessageSquare className="mr-2 h-3.5 w-3.5" />
                            <span>Message</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs cursor-pointer">
                            <Calendar className="mr-2 h-3.5 w-3.5" />
                            <span>Schedule meeting</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs cursor-pointer">
                            <Star className="mr-2 h-3.5 w-3.5" />
                            <span>{connection.starred ? 'Unstar' : 'Star'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive text-xs cursor-pointer">
                            <X className="mr-2 h-3.5 w-3.5" />
                            <span>Remove</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    
                    <CardContent className="pb-3">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Mail className="mr-1 h-3.5 w-3.5" />
                        <span>{connection.email}</span>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0 flex justify-between gap-2 text-xs">
                      <Badge variant="outline" className="text-[10px] h-5 border-border/40 bg-background/40">
                        {connection.tasks} Active Tasks
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-5 px-2 text-[10px]">
                        <Check className="mr-1 h-3 w-3" />
                        View Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <UserCircle className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No connections found</h3>
                <p className="mt-1 text-muted-foreground text-sm">Try a different search term or add new connections</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="teams" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Add Team Card */}
              <Card className="border-dashed border-border/40 bg-transparent hover:bg-background/50 transition-colors">
                <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="h-full w-full flex flex-col items-center justify-center p-8 rounded-lg">
                      <div className="h-12 w-12 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium">Create New Team</p>
                      <p className="text-xs text-muted-foreground mt-1">Collaborate with others</p>
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </Card>
              
              {filteredTeams.map((team) => (
                <Card key={team.id} className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/40 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className={`h-10 w-10 ${team.color}`}>
                          <AvatarFallback>{team.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{team.name}</CardTitle>
                          <CardDescription className="text-xs mt-0.5">
                            {team.members} members
                          </CardDescription>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-xs cursor-pointer">
                            <UserPlus className="mr-2 h-3.5 w-3.5" />
                            <span>Add member</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs cursor-pointer">
                            <Settings className="mr-2 h-3.5 w-3.5" />
                            <span>Team settings</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive text-xs cursor-pointer">
                            <X className="mr-2 h-3.5 w-3.5" />
                            <span>Delete team</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <p className="text-xs text-muted-foreground">{team.description}</p>
                  </CardContent>
                  
                  <CardFooter className="pt-3 border-t border-border/20 flex justify-between">
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                      <Shield className="mr-2 h-3.5 w-3.5" />
                      Manage
                    </Button>
                    <Button size="sm" className="h-8 text-xs">
                      <Check className="mr-2 h-3.5 w-3.5" />
                      View Team
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {filteredTeams.length === 0 && searchQuery && (
              <div className="flex flex-col items-center justify-center py-10">
                <Users className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No teams found</h3>
                <p className="mt-1 text-muted-foreground text-sm">Try a different search term or create a new team</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ConnectionsNew; 
