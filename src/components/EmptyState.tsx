
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="rounded-full bg-muted p-6 mb-4">
        <ClipboardList className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} className="arc-gradient hover:opacity-90">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
