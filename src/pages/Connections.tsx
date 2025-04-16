import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Users, Plus, MessageSquare, Star, Settings, Mail, Compass } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Mock data for connections
const mockConnections = [
  { id: 1, name: "Alex Johnson", username: "alexj", avatar: "https://i.pravatar.cc/150?img=1", status: "online", isTeamMember: true, isConnected: true, isFavorite: true },
  { id: 2, name: "Sarah Williams", username: "sarahw", avatar: "https://i.pravatar.cc/150?img=5", status: "offline", isTeamMember: true, isConnected: true, isFavorite: false },
  { id: 3, name: "Michael Chen", username: "michaelc", avatar: "https://i.pravatar.cc/150?img=3", status: "online", isTeamMember: false, isConnected: true, isFavorite: false },
  { id: 4, name: "Emily Davis", username: "emilyd", avatar: "https://i.pravatar.cc/150?img=10", status: "offline", isTeamMember: false, isConnected: false, isFavorite: false },
  { id: 5, name: "James Wilson", username: "jamesw", avatar: "https://i.pravatar.cc/150?img=11", status: "online", isTeamMember: true, isConnected: true, isFavorite: true },
];

// Mock data for suggested connections
const mockSuggestedConnections = [
  { id: 6, name: "Jordan Lee", username: "jordanl", avatar: "https://i.pravatar.cc/150?img=15", role: "Product Designer", mutual: 3 },
  { id: 7, name: "Sophia Garcia", username: "sophiag", avatar: "https://i.pravatar.cc/150?img=20", role: "UI Developer", mutual: 5 },
  { id: 8, name: "Marcus Thompson", username: "marcust", avatar: "https://i.pravatar.cc/150?img=25", role: "Project Manager", mutual: 2 },
  { id: 9, name: "Olivia Kim", username: "oliviak", avatar: "https://i.pravatar.cc/150?img=30", role: "UX Researcher", mutual: 4 },
  { id: 10, name: "Noah Robinson", username: "noahr", avatar: "https://i.pravatar.cc/150?img=35", role: "Frontend Engineer", mutual: 1 },
  { id: 11, name: "Emma Martinez", username: "emmam", avatar: "https://i.pravatar.cc/150?img=40", role: "Backend Developer", mutual: 6 },
  { id: 12, name: "Liam Wright", username: "liamw", avatar: "https://i.pravatar.cc/150?img=45", role: "DevOps Engineer", mutual: 2 },
];

// Mock data for teams
const mockTeams = [
  { id: 1, name: "Design Team", members: 5, avatar: "💎" },
  { id: 2, name: "Development", members: 8, avatar: "🚀" },
  { id: 3, name: "Marketing", members: 4, avatar: "📊" },
];

const Connections = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [discoverSearchQuery, setDiscoverSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("people");
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);
  const [showDiscoverDialog, setShowDiscoverDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamEmoji, setNewTeamEmoji] = useState("🚀");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>(
    mockConnections.filter(c => c.isFavorite).map(c => c.id)
  );

  // Get active contact details 
  const activeContact = mockConnections.find(c => c.id === activeContactId);

  // Filter connections based on search query and show only connected users
  const filteredConnections = mockConnections.filter(connection => 
    connection.isConnected &&
    (connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter suggested connections based on discover search query
  const filteredSuggestedConnections = mockSuggestedConnections.filter(connection => 
    connection.name.toLowerCase().includes(discoverSearchQuery.toLowerCase()) ||
    connection.username.toLowerCase().includes(discoverSearchQuery.toLowerCase()) ||
    connection.role.toLowerCase().includes(discoverSearchQuery.toLowerCase())
  );

  // Filter teams based on search query
  const filteredTeams = mockTeams.filter(team => 
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

    if (selectedMembers.length === 0) {
      toast({
        title: "Team members required",
        description: "Please select at least one team member",
        variant: "destructive",
      });
      return;
    }

    // Mock team creation
    toast({
      title: "Team created",
      description: `${newTeamName} has been created with ${selectedMembers.length} members!`,
    });

    // Reset form and close dialog
    setNewTeamName("");
    setSelectedMembers([]);
    setShowCreateTeamDialog(false);
  };

  const toggleMemberSelection = (connectionId: number) => {
    if (selectedMembers.includes(connectionId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== connectionId));
    } else {
      setSelectedMembers([...selectedMembers, connectionId]);
    }
  };

  const handleConnect = (connectionId: number) => {
    toast({
      title: "Connection request sent",
      description: "Your connection request has been sent!",
    });
  };

  const handleMessage = (connectionId: number) => {
    setActiveContactId(connectionId);
    setShowMessageDialog(true);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent",
      description: `Message sent to ${activeContact?.name}`,
    });

    // Reset form and close dialog
    setMessageText("");
    setShowMessageDialog(false);
  };

  const handleToggleFavorite = (connectionId: number) => {
    if (favorites.includes(connectionId)) {
      setFavorites(favorites.filter(id => id !== connectionId));
      toast({
        title: "Removed from favorites",
        description: "Contact removed from favorites",
      });
    } else {
      setFavorites([...favorites, connectionId]);
      toast({
        title: "Added to favorites",
        description: "Contact added to favorites",
      });
    }
  };

  const emojis = ["🚀", "💎", "🔥", "⚡", "🌟", "🎯", "🎨", "📊", "💡", "🛠️"];

  return (
    <Layout>
      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            {activeContact && (
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
                  <AvatarFallback>{activeContact.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle>{activeContact.name}</DialogTitle>
                  <DialogDescription>@{activeContact.username}</DialogDescription>
                </div>
              </div>
            )}
          </DialogHeader>
          
          <div className="bg-accent/30 rounded-md p-3 my-4 h-[150px] overflow-y-auto">
            <p className="text-sm text-muted-foreground text-center italic">
              Your conversation history will appear here
            </p>
          </div>
          
          <div className="relative mt-2">
            <div className="flex items-center border border-input rounded-md focus-within:ring-1 focus-within:ring-primary">
              <Input 
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                placeholder="Type your message..." 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 mr-1"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Connections</h1>
            <p className="text-muted-foreground">Manage your network and teams</p>
          </div>
        </div>

        <Tabs defaultValue="people" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <div className="mb-3 flex justify-between items-center">
            <div className="relative w-[260px]">
              <div className="flex w-full items-center rounded-md border border-input bg-background px-3 focus-within:ring-1 focus-within:ring-primary">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                  className="flex w-full border-0 bg-transparent p-2 text-sm shadow-none focus-visible:outline-none focus-visible:ring-0" 
                  placeholder="Search connections..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <TabsContent value="people" className="space-y-3 w-full mt-0">
              <div className="flex justify-end m-0">
                <Dialog open={showDiscoverDialog} onOpenChange={setShowDiscoverDialog}>
                  <DialogTrigger asChild>
                    <Button className="arc-gradient hover:opacity-90">
                      <Compass className="h-4 w-4 mr-1" /> Discover
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Discover Connections</DialogTitle>
                      <DialogDescription>
                        Find and connect with people relevant to you.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="relative my-4">
                      <div className="flex w-full items-center rounded-md border border-input bg-background px-3 focus-within:ring-1 focus-within:ring-primary">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input 
                          className="flex w-full border-0 bg-transparent p-2 text-sm shadow-none focus-visible:outline-none focus-visible:ring-0" 
                          placeholder="Search profiles..." 
                          value={discoverSearchQuery}
                          onChange={(e) => setDiscoverSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {filteredSuggestedConnections.length > 0 ? (
                        filteredSuggestedConnections.map(connection => (
                          <Card key={connection.id} className="bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={connection.avatar} alt={connection.name} />
                                    <AvatarFallback>{connection.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-sm font-medium">{connection.name}</h3>
                                    <p className="text-xs text-muted-foreground">@{connection.username}</p>
                                    <p className="text-xs text-muted-foreground">{connection.role}</p>
                                  </div>
                                </div>
                                
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-xs h-8"
                                  onClick={() => {
                                    handleConnect(connection.id);
                                    setShowDiscoverDialog(false);
                                  }}
                                >
                                  <UserPlus className="h-3 w-3 mr-1" />
                                  Connect
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
                          <h3 className="text-base font-medium">No profiles found</h3>
                          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
            
            <TabsContent value="teams" className="space-y-3 w-full mt-0">
              <div className="flex justify-end m-0">
                <Dialog open={showCreateTeamDialog} onOpenChange={(open) => {
                  setShowCreateTeamDialog(open);
                  if (!open) {
                    setSelectedMembers([]);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="arc-gradient hover:opacity-90">
                      <Plus className="h-4 w-4 mr-1" /> Create Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create a new team</DialogTitle>
                      <DialogDescription>
                        Create a team to collaborate with your connections.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="team-name">Team name</Label>
                        <Input 
                          id="team-name" 
                          placeholder="Enter team name" 
                          value={newTeamName}
                          onChange={(e) => setNewTeamName(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Team icon</Label>
                        <div className="flex flex-wrap gap-2">
                          {emojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              className={`w-8 h-8 flex items-center justify-center rounded-md text-lg ${
                                newTeamEmoji === emoji 
                                  ? "bg-primary/20 ring-2 ring-primary" 
                                  : "hover:bg-accent"
                              }`}
                              onClick={() => setNewTeamEmoji(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid gap-2 mt-2">
                        <Label>Select team members</Label>
                        <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                          {mockConnections.filter(c => c.isConnected).length > 0 ? (
                            mockConnections.filter(c => c.isConnected).map(connection => (
                              <div 
                                key={connection.id} 
                                className={`flex items-center justify-between p-2 rounded-md mb-1 cursor-pointer hover:bg-accent ${
                                  selectedMembers.includes(connection.id) ? "bg-primary/10" : ""
                                }`}
                                onClick={() => toggleMemberSelection(connection.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    checked={selectedMembers.includes(connection.id)} 
                                    onChange={() => {}} // Handled by the div onClick
                                    className="h-4 w-4"
                                  />
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={connection.avatar} alt={connection.name} />
                                    <AvatarFallback>{connection.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{connection.name}</p>
                                    <p className="text-xs text-muted-foreground">@{connection.username}</p>
                                  </div>
                                </div>
                                <div className={cn(
                                  "w-2 h-2 rounded-full", 
                                  connection.status === "online" ? "bg-green-500" : "bg-muted"
                                )} />
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              No connections available
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setShowCreateTeamDialog(false);
                        setSelectedMembers([]);
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTeam}>
                        Create Team
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
          </div>

          <TabsContent value="people" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnections.length > 0 ? (
                filteredConnections.map(connection => (
                  <Card key={connection.id} className="hover:shadow-md transition-shadow duration-200 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={connection.avatar} alt={connection.name} />
                            <AvatarFallback>{connection.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{connection.name}</CardTitle>
                            <CardDescription>@{connection.username}</CardDescription>
                          </div>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium", 
                          connection.status === "online" 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          {connection.status}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        {connection.isTeamMember && (
                          <Badge variant="outline" className="text-[10px] h-5 rounded-sm">Team Member</Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px] h-5 rounded-sm">Connected</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-0">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => handleMessage(connection.id)}
                      >
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Message</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={cn("h-8 w-8 p-0 rounded-full", 
                          favorites.includes(connection.id) ? "text-yellow-500 hover:text-yellow-600" : ""
                        )}
                        onClick={() => handleToggleFavorite(connection.id)}
                      >
                        <Star className={cn(
                          "h-4 w-4",
                          favorites.includes(connection.id) ? "fill-yellow-500" : "fill-transparent"
                        )} />
                        <span className="sr-only">Favorite</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">No connections found</h3>
                  <p className="text-muted-foreground mt-1">Try adjusting your search or invite new people</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.length > 0 ? (
                filteredTeams.map(team => (
                  <Card key={team.id} className="hover:shadow-md transition-shadow duration-200 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-xl">
                            {team.avatar}
                          </div>
                          <div>
                            <CardTitle className="text-base">{team.name}</CardTitle>
                            <CardDescription>{team.members} members</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(team.members, 4))].map((_, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={`https://i.pravatar.cc/150?img=${team.id * 4 + i + 1}`} />
                            <AvatarFallback>?</AvatarFallback>
                          </Avatar>
                        ))}
                        {team.members > 4 && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-accent text-accent-foreground text-xs">
                            +{team.members - 4}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-0">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <MessageSquare className="h-4 w-4" />
                        <span className="sr-only">Team chat</span>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Settings</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs h-8 px-3 ml-auto"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">No teams found</h3>
                  <p className="text-muted-foreground mt-1">Create a new team to get started</p>
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