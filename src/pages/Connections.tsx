import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Users, Plus, User2, X, Check, ArrowUpRight, UserCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data for connections
const mockConnections = [
  { id: "1", name: "Alex Johnson", username: "alexj", avatar: "", status: "online", role: "Designer" },
  { id: "2", name: "Samantha Williams", username: "samw", avatar: "", status: "offline", role: "Developer" },
  { id: "3", name: "David Chen", username: "dchen", avatar: "", status: "online", role: "Product Manager" },
  { id: "4", name: "Maria Garcia", username: "mgarcia", avatar: "", status: "busy", role: "UI/UX Designer" },
  { id: "5", name: "James Wilson", username: "jwilson", avatar: "", status: "offline", role: "Frontend Developer" }
];

// Mock data for teams
const mockTeams = [
  { id: "1", name: "Design Team", members: 5, avatar: "🎨" },
  { id: "2", name: "Development", members: 8, avatar: "💻" },
  { id: "3", name: "Marketing", members: 3, avatar: "📊" }
];

type ConnectionStatus = "online" | "offline" | "busy";
type Connection = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: ConnectionStatus;
  role: string;
};

type Team = {
  id: string;
  name: string;
  members: number;
  avatar: string;
};

const Connections = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [newTeamName, setNewTeamName] = useState("");
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);

  // Filter connections based on search query
  const filteredConnections = connections.filter(connection => 
    connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter teams based on search query
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a name for your team",
        variant: "destructive",
      });
      return;
    }

    const newTeam: Team = {
      id: Math.random().toString(36).substring(2, 9),
      name: newTeamName,
      members: 1,
      avatar: "🚀",
    };

    setTeams([...teams, newTeam]);
    setNewTeamName("");
    setShowCreateTeamDialog(false);

    toast({
      title: "Team created!",
      description: `Your team "${newTeamName}" has been created successfully`,
    });
  };

  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "busy": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        {/* Header with search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Connections</h1>
            <p className="text-muted-foreground">Manage your connections and teams</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search connections or teams..."
              className="pl-9 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Tabs for People and Teams */}
        <Tabs defaultValue="people" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
            <TabsTrigger value="people" className="flex items-center gap-2">
              <User2 className="h-4 w-4" />
              People
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
          </TabsList>
          
          {/* People/Connections Tab */}
          <TabsContent value="people" className="space-y-4">
            {/* Actions */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredConnections.length} {filteredConnections.length === 1 ? 'connection' : 'connections'}
              </p>
              <Button variant="outline" size="sm" className="gap-1">
                <UserPlus className="h-4 w-4" />
                <span>Add Connection</span>
              </Button>
            </div>
            
            {/* Connection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnections.length > 0 ? (
                filteredConnections.map((connection) => (
                  <Card key={connection.id} className="overflow-hidden hover:border-primary/40 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-background">
                          <AvatarImage src={connection.avatar} alt={connection.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {connection.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{connection.name}</CardTitle>
                          <CardDescription className="text-xs">@{connection.username}</CardDescription>
                        </div>
                      </div>
                      <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(connection.status)}`}></span>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">{connection.role}</div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span>Profile</span>
                      </Button>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <UserCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No connections found</h3>
                  <p className="text-muted-foreground max-w-sm mt-2 mb-4">
                    {searchQuery
                      ? `No connections match your search "${searchQuery}"`
                      : "You don't have any connections yet. Add some to collaborate."}
                  </p>
                  <Button variant="outline" size="sm" className="gap-1">
                    <UserPlus className="h-4 w-4" />
                    <span>Add Connection</span>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-4">
            {/* Actions */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredTeams.length} {filteredTeams.length === 1 ? 'team' : 'teams'}
              </p>
              <Dialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Create Team</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription>
                      Create a team to collaborate with others on tasks.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="team-name">Team Name</Label>
                      <Input
                        id="team-name"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="Enter team name"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleCreateTeam}>
                      Create Team
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Team Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <Card key={team.id} className="overflow-hidden hover:border-primary/40 transition-colors">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                        {team.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-base">{team.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {team.members} {team.members === 1 ? 'member' : 'members'}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(team.members, 5))].map((_, index) => (
                          <Avatar key={index} className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="text-xs">
                              {String.fromCharCode(65 + index)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {team.members > 5 && (
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                            +{team.members - 5}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span>Open</span>
                      </Button>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Team</Badge>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No teams found</h3>
                  <p className="text-muted-foreground max-w-sm mt-2 mb-4">
                    {searchQuery
                      ? `No teams match your search "${searchQuery}"`
                      : "You don't have any teams yet. Create a team to collaborate."}
                  </p>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowCreateTeamDialog(true)}>
                    <Plus className="h-4 w-4" />
                    <span>Create Team</span>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Connections; 