import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Circle, Info } from 'lucide-react';
import { useLearning } from '@/contexts/LearningContext';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// Import directly from the file path to fix TypeScript error
import LearningPathNode from '@/components/VisualLearningPath/LearningPathNode';

const VisualLearningPath: React.FC = () => {
  const { 
    modules, 
    currentModule, 
    activeSubtopicId, 
    setCurrentModule, 
    setActiveSubtopicId 
  } = useLearning();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Calculate overall progress
  const overallProgress = modules.length 
    ? Math.round(modules.reduce((sum, module) => sum + module.progress, 0) / modules.length) 
    : 0;
  
  // Toggle collapsed state
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  
  // Handle node click
  const handleNodeClick = (moduleId: string, subtopicId: string) => {
    setCurrentModule(moduleId);
    setActiveSubtopicId(subtopicId);
  };
  
  return (
    <div className="bg-card rounded-lg shadow-sm border mb-3 transition-all duration-300 overflow-hidden">
      {/* Header with progress and collapse button */}
      <div className="flex items-center justify-between py-2 px-3 border-b bg-muted/30">
        <div className="flex items-center gap-2 flex-1">
          <h3 className="font-medium text-sm">Learning Path</h3>
          <div className="flex-1 max-w-[100px] mx-2">
            <Progress value={overallProgress} className="h-1.5" />
          </div>
          <span className="text-xs text-muted-foreground">{overallProgress}%</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-1 h-6 w-6 p-0" 
          onClick={toggleCollapse}
        >
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </Button>
      </div>
      
      {/* Main content (collapsible) */}
      <div className={cn(
        "transition-all duration-300 overflow-hidden",
        isCollapsed ? "max-h-0" : "max-h-[300px]" // Reduced max height for slimmer appearance
      )}>
        <div className="py-2 px-3 overflow-x-auto">
          {modules.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="w-full">
                  <div className="flex items-center mb-1.5 text-xs">
                    <div 
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center mr-2",
                        module.progress === 100 ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
                      )}
                    >
                      {module.progress === 100 ? <Check size={10} /> : <Info size={10} />}
                    </div>
                    <h4 className="font-medium text-xs">{module.title}</h4>
                    <div className="ml-auto flex items-center gap-2">
                      <Progress value={module.progress} className="h-1 w-12" />
                      <span className="text-xs text-muted-foreground">{module.progress}%</span>
                    </div>
                  </div>
                  
                  {/* Path visualization - slimmer and more focused */}
                  <div className="relative flex items-center ml-2 pl-2 py-1.5 border-l border-primary/30">
                    <div className="flex items-center space-x-3 w-full overflow-x-auto pb-1 no-scrollbar">
                      {module.subtopics.map((subtopic, subtopicIndex) => (
                        <React.Fragment key={subtopic.id}>
                          <LearningPathNode 
                            title={subtopic.title}
                            completed={subtopic.completed}
                            concepts={subtopic.concepts}
                            isActive={activeSubtopicId === subtopic.id}
                            onClick={() => handleNodeClick(module.id, subtopic.id)}
                          />
                          
                          {/* Connector (not for the last item) - thinner */}
                          {subtopicIndex < module.subtopics.length - 1 && (
                            <div className="w-8 h-[1px] bg-primary/30 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-xs">No learning paths available. Generate one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualLearningPath;
