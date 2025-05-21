import React from 'react';
import { Check, Circle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface LearningPathNodeProps {
  title: string;
  completed: boolean;
  concepts: string[];
  isActive: boolean;
  onClick: () => void;
}

const LearningPathNode: React.FC<LearningPathNodeProps> = ({
  title,
  completed,
  concepts,
  isActive,
  onClick,
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "flex flex-col items-center relative",
              "group transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus",
              "min-w-[140px] max-w-[140px]"
            )}
          >
            {/* Node circle */}
            <div 
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center",
                "transition-all duration-200 mb-1",
                completed 
                  ? "bg-green-100 border border-green-500 text-green-600" 
                  : isActive
                    ? "bg-primary text-white" 
                    : "bg-background border border-primary/20 text-muted-foreground",
                isActive && !completed && "ring-2 ring-primary/20"
              )}
            >
              {completed 
                ? <Check className="h-3.5 w-3.5" /> 
                : <Circle className="h-3.5 w-3.5" />
              }
            </div>
            
            {/* Title (one line, truncated) */}
            <span 
              className={cn(
                "text-[10px] leading-tight font-medium text-center w-full truncate px-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {title}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className="max-w-[220px] p-0 rounded-md">
          <div className="p-2">
            <h4 className="font-medium text-xs mb-1">{title}</h4>
            
            {concepts.length > 0 && (
              <div className="text-xs">
                <span className="text-muted-foreground font-medium text-[10px]">Key concepts:</span>
                <ul className="mt-0.5 space-y-0.5">
                  {concepts.map((concept, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-primary/70 mt-1.5" />
                      <span className="leading-tight">{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-1.5 text-[10px] text-muted-foreground border-t border-border/50 pt-1">
              {completed 
                ? "✓ Completed - Click to review"
                : isActive
                  ? "▶ In progress"
                  : "○ Not started - Click to begin"
              }
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LearningPathNode;
