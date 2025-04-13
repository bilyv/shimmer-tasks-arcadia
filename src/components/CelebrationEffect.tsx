import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles, Star, PartyPopper, Award, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CelebrationEffectProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function CelebrationEffect({ isVisible, onComplete }: CelebrationEffectProps) {
  const [confettiCount] = useState(25);
  const [confetti, setConfetti] = useState<Array<{
    id: number;
    x: number;
    size: number;
    color: string;
    delay: number;
    duration: number;
    type: 'circle' | 'rect' | 'icon';
    icon?: React.ReactNode;
  }>>([]);

  useEffect(() => {
    if (isVisible) {
      const colors = [
        'bg-arc-purple', 
        'bg-arc-blue', 
        'bg-arc-green', 
        'bg-arc-yellow', 
        'bg-arc-cyan',
        'bg-primary',
        'bg-arc-light-purple'
      ];
      
      const icons = [
        <Trophy className="text-yellow-400" key="trophy" />,
        <Sparkles className="text-purple-400" key="sparkles" />,
        <Star className="text-yellow-300" key="star" />,
        <PartyPopper className="text-blue-400" key="party" />,
        <Award className="text-purple-500" key="award" />,
        <Check className="text-green-400" key="check" />
      ];
      
      const newConfetti = Array.from({ length: confettiCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Random horizontal position (0-100%)
        size: Math.random() * 0.5 + 0.5, // Random size between 0.5-1 (will be multiplied)
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3, // Random delay up to 0.3s
        duration: Math.random() * 1.5 + 1.5, // Random duration between 1.5-3s
        type: Math.random() > 0.8 
          ? 'icon' 
          : (Math.random() > 0.5 ? 'circle' : 'rect') as 'circle' | 'rect' | 'icon',
        icon: icons[Math.floor(Math.random() * icons.length)]
      }));
      
      setConfetti(newConfetti);
      
      // Hide the celebration effect after all animations complete
      const maxDuration = Math.max(...newConfetti.map(c => c.duration + c.delay)) * 1000;
      const timer = setTimeout(() => {
        onComplete();
      }, maxDuration + 500); // Add a small buffer
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, confettiCount, onComplete]);

  const renderConfettiItem = (item: typeof confetti[0]) => {
    const style = {
      left: `${item.x}%`,
      animationDelay: `${item.delay}s`,
      animationDuration: `${item.duration}s`,
    };

    if (item.type === 'circle') {
      return (
        <div 
          key={item.id}
          className={cn("absolute w-3 h-3 rounded-full animate-confetti-drop", item.color)}
          style={style}
        />
      );
    } else if (item.type === 'rect') {
      return (
        <div 
          key={item.id}
          className={cn("absolute w-2 h-4 animate-confetti-drop", item.color)}
          style={style}
        />
      );
    } else {
      return (
        <div 
          key={item.id}
          className={cn("absolute w-5 h-5 animate-confetti-drop flex items-center justify-center")}
          style={style}
        >
          <div className="animate-celebration-rotate">
            {item.icon}
          </div>
        </div>
      );
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map(renderConfettiItem)}
      
      {/* Center celebration icon */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-scale-in-out">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-arc-purple to-arc-blue flex items-center justify-center shadow-lg">
            <Check className="w-10 h-10 text-white" />
          </div>
          <div className="mt-3 font-bold text-xl text-gradient-animated animate-bounce-slow">
            Task Complete!
          </div>
        </div>
      </div>
    </div>
  );
} 