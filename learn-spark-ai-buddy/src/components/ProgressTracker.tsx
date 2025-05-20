
import React from 'react';
import { useLearning } from '@/contexts/LearningContext';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle } from 'lucide-react';

const ProgressTracker: React.FC = () => {
  const { 
    modules, 
    currentModule, 
    setCurrentModule, 
    activeSubtopicId, 
    setActiveSubtopicId,
    markSubtopicComplete 
  } = useLearning();

  if (!modules.length) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Your Learning Progress</h2>
      
      <ScrollArea className="h-[140px] pr-4 -mr-4">
        <div className="space-y-4">
          {modules.map((module) => (
            <div key={module.id} className="space-y-2">
              <Button
                variant={currentModule?.id === module.id ? "secondary" : "ghost"}
                className="w-full justify-start font-medium"
                onClick={() => setCurrentModule(module.id)}
              >
                <span className="truncate">{module.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {module.progress}%
                </span>
              </Button>
              
              <Progress value={module.progress} className="h-2" />
              
              {currentModule?.id === module.id && (
                <div className="pl-4 space-y-1 mt-2">
                  {module.subtopics.map((subtopic) => (
                    <Button
                      key={subtopic.id}
                      variant="ghost"
                      size="sm" 
                      className={cn(
                        "w-full justify-start text-sm py-1 h-auto",
                        activeSubtopicId === subtopic.id && "bg-secondary/50"
                      )}
                      onClick={() => setActiveSubtopicId(subtopic.id)}
                    >
                      <span className="mr-2">
                        {subtopic.completed ? (
                          <CheckCircle size={16} className="text-primary" />
                        ) : (
                          <Circle size={16} className="text-muted-foreground" />
                        )}
                      </span>
                      <span className="truncate">{subtopic.title}</span>
                      
                      {activeSubtopicId === subtopic.id && !subtopic.completed && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            markSubtopicComplete(module.id, subtopic.id, true);
                          }}
                          title="Mark as completed"
                        >
                          <CheckCircle size={14} className="text-muted-foreground hover:text-primary" />
                        </Button>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProgressTracker;
