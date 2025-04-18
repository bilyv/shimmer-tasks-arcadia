import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function LearnPurpose() {
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Learn Purpose</h1>
          <p className="text-muted-foreground">
            Bite-sized, actionable content to help you grow and improve everyday
          </p>
        </div>
        <div className="max-w-md mx-auto flex gap-2">
          <Input
            type="search"
            placeholder="Search..."
            className="w-full"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Saved</DropdownMenuItem>
              <DropdownMenuItem>Watch Later</DropdownMenuItem>
              <DropdownMenuItem>Favourite</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Layout>
  );
}