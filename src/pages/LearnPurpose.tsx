import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LucideBookOpen, LucideBrain, LucideCalendarClock, LucideSparkles, LucideExternalLink } from "lucide-react";

// Define types for YouTube content
type VideoContent = {
  id: string;
  title: string;
  channelName: string;
  thumbnail: string;
  description: string;
  category: "productivity" | "skills" | "habits" | "motivation";
};

// Sample content - this would ideally come from an API
const sampleContent: VideoContent[] = [
  {
    id: "1",
    title: "The Pomodoro Technique - A Proven Way to Enhance Productivity",
    channelName: "Thomas Frank",
    thumbnail: "https://placehold.co/400x225",
    description: "Master the Pomodoro Technique to boost your focus and productivity with this actionable guide.",
    category: "productivity"
  },
  {
    id: "2",
    title: "How to Take Smart Notes that Actually Work",
    channelName: "Ali Abdaal",
    thumbnail: "https://placehold.co/400x225",
    description: "Learn an effective note-taking system that will transform your learning and creative output.",
    category: "productivity"
  },
  {
    id: "3",
    title: "Master Public Speaking in 5 Simple Steps",
    channelName: "Communication Skills",
    thumbnail: "https://placehold.co/400x225",
    description: "Overcome fear and deliver compelling presentations with these proven techniques.",
    category: "skills"
  },
  {
    id: "4",
    title: "Learn Any New Skill in Half the Time",
    channelName: "Tim Ferriss",
    thumbnail: "https://placehold.co/400x225",
    description: "A practical framework for rapid skill acquisition that anyone can apply.",
    category: "skills"
  },
  {
    id: "5",
    title: "Building a Morning Routine that Changes Your Life",
    channelName: "Matt D'Avella",
    thumbnail: "https://placehold.co/400x225",
    description: "How to create and stick to a morning ritual that sets you up for success.",
    category: "habits"
  },
  {
    id: "6",
    title: "The Two-Minute Rule: Build New Habits Easily",
    channelName: "James Clear",
    thumbnail: "https://placehold.co/400x225",
    description: "Learn how to use the two-minute rule to make habit building effortless.",
    category: "habits"
  },
  {
    id: "7",
    title: "How to Find Your Purpose in Life",
    channelName: "Jay Shetty",
    thumbnail: "https://placehold.co/400x225",
    description: "Practical exercises to discover your passion and live a more meaningful life.",
    category: "motivation"
  },
  {
    id: "8",
    title: "Overcoming Self-Doubt and Building Confidence",
    channelName: "Mel Robbins",
    thumbnail: "https://placehold.co/400x225",
    description: "Actionable strategies to overcome imposter syndrome and believe in yourself.",
    category: "motivation"
  }
];

const VideoCard = ({ video }: { video: VideoContent }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 pb-2">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-auto rounded-md object-cover aspect-video"
        />
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <CardTitle className="text-base line-clamp-2 mb-1">{video.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{video.channelName}</CardDescription>
        <p className="mt-2 text-sm line-clamp-2">{video.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full">
          <LucideExternalLink className="h-4 w-4 mr-2" />
          Watch Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function LearnPurpose() {
  const [activeTab, setActiveTab] = useState<string>("productivity");
  const [filteredContent, setFilteredContent] = useState<VideoContent[]>([]);

  useEffect(() => {
    setFilteredContent(sampleContent.filter(item => item.category === activeTab));
  }, [activeTab]);

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Learn Purpose</h1>
          <p className="text-muted-foreground">
            Bite-sized, actionable content to help you grow and improve everyday
          </p>
        </div>

        <Tabs defaultValue="productivity" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-max">
            <TabsTrigger value="productivity" className="flex items-center gap-2">
              <LucideCalendarClock className="h-4 w-4" />
              <span className="hidden sm:inline">Productivity</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <LucideBookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <LucideBrain className="h-4 w-4" />
              <span className="hidden sm:inline">Habits</span>
            </TabsTrigger>
            <TabsTrigger value="motivation" className="flex items-center gap-2">
              <LucideSparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Motivation</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="productivity" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredContent.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredContent.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="habits" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredContent.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="motivation" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredContent.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
} 