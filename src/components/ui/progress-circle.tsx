import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  className?: string;
  strokeWidth?: number;
  color?: string;
  animated?: boolean;
  glowEffect?: boolean;
}

export function ProgressCircle({
  value,
  size = "md",
  showPercentage = true,
  className,
  strokeWidth = 3,
  color,
  animated = true,
  glowEffect = true,
}: ProgressCircleProps) {
  // Ensure value is between 0 and 100
  const percentage = Math.min(100, Math.max(0, value));
  
  // Calculate the circle properties
  const radius = 50 - strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Determine size class
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  // Generate gradient ID
  const gradientId = React.useId();
  const filterId = React.useId();
  
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full",
        "shadow-sm hover:shadow-md transition-shadow",
        sizeClasses[size],
        className
      )}
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Define filter for glow effect */}
        {glowEffect && (
          <defs>
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="glow"
              />
              <feBlend in="SourceGraphic" in2="glow" mode="normal" />
            </filter>
          </defs>
        )}
        
        {/* Define gradient */}
        {!color && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary-start, #4f46e5)" />
              <stop offset="100%" stopColor="var(--primary-end, #8b5cf6)" />
            </linearGradient>
          </defs>
        )}
        
        {/* Background circle with subtle pattern */}
        <circle
          className="text-gray-200 dark:text-gray-800"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray="4 2"
          opacity="0.3"
        />
        
        {/* Background solid circle */}
        <circle
          className="text-gray-200 dark:text-gray-700"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          className={color ? "" : ""}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth + 0.5}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            stroke: color || `url(#${gradientId})`,
            filter: glowEffect ? `url(#${filterId})` : undefined,
            transition: animated ? 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' : 'none',
          }}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center font-medium transition-all">
          <span className={cn(
            "transition-all duration-300",
            percentage > 70 ? "text-primary dark:text-primary" : "",
            percentage === 100 ? "scale-110" : ""
          )}>
            {Math.round(percentage)}
          </span>
        </div>
      )}
    </div>
  );
} 