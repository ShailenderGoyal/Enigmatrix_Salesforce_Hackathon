import React from 'react';
import { Check, Info } from 'lucide-react';
import { useLearning } from '@/contexts/LearningContext';
import { Progress } from '@/components/ui/progress';
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
  
  // Handle node click
  const handleNodeClick = (moduleId: string, subtopicId: string) => {
    setCurrentModule(moduleId);
    setActiveSubtopicId(subtopicId);
  };
  
  return (
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
  );
};

export default VisualLearningPath;
