
// import React from 'react';
// import Header from '@/components/Header';
// import ProgressTracker from '@/components/ProgressTracker';
// import ChatInterface from '@/components/ChatInterface';
// import RoadmapGenerator from '@/components/RoadmapGenerator';
// import ConceptsList from '@/components/ConceptsList';
// import PrebuiltLearningPaths from '@/components/PrebuiltLearningPaths';
// import { useAuth } from '@/contexts/AuthContext';
// import OnboardingQuiz from '@/components/OnboardingQuiz';

// const Dashboard: React.FC = () => {
//   const { user } = useAuth();
  
//   // If user hasn't completed onboarding, show the quiz
//   if (user && !user.onboarded) {
//     return <OnboardingQuiz />;
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
      
//       <div className="container mx-auto pt-20 pb-6 px-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="md:col-span-1 space-y-6">
//             <ProgressTracker />
//             <PrebuiltLearningPaths />
//             <RoadmapGenerator />
//             <ConceptsList />
//           </div>
          
//           <div className="md:col-span-2 h-[calc(100vh-140px)]">
//             <ChatInterface />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import RoadmapGenerator from '@/components/RoadmapGenerator';
import ConceptsList from '@/components/ConceptsList';
import PrebuiltLearningPaths from '@/components/PrebuiltLearningPaths';
import GameProgress from '@/components/GameProgress';
import { VisualLearningPath, CustomPathCreator } from '@/components/VisualLearningPath';
import { useAuth } from '@/contexts/AuthContext';
import { useLearning } from '@/contexts/LearningContext';
import OnboardingQuiz from '@/components/OnboardingQuiz';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { modules } = useLearning();
  const [showNudge, setShowNudge] = useState(false);
  const [pathCollapsed, setPathCollapsed] = useState(true);
  
  // Calculate overall progress based on all modules
  const calculateOverallProgress = () => {
    if (!modules || modules.length === 0) return 0;
    
    const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0);
    return Math.round(totalProgress / modules.length);
  };
  
  const overallProgress = calculateOverallProgress();
  
  // Show a motivational nudge after 15 seconds of inactivity
  useEffect(() => {
    if (!user) return;
    
    // Skip for now if onboarding is needed
    if (!user.onboarded) return;
    
    const timer = setTimeout(() => {
      setShowNudge(true);
    }, 15000);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  // If not logged in or not onboarded, show nothing
  if (!user) {
    return null;
  }
  
  // Show onboarding quiz if the user is not onboarded
  if (!user.onboarded) {
    return <OnboardingQuiz />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto pt-20 pb-6 px-4">
        {/* Motivational nudge banner */}
        {showNudge && (
          <div className="mb-4 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-4 rounded-lg border border-primary/20 flex items-center justify-between animate-in fade-in slide-in-from-top-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Keep up the momentum!</h3>
                <p className="text-sm text-muted-foreground">You're 1 day away from a 5-day streak. Complete today's lesson to earn the "Consistent" badge.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowNudge(false)}
              >
                Dismiss
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => {
                  setShowNudge(false);
                  toast.success('Great choice! Let\'s continue learning.');
                }}
              >
                Continue Learning
              </Button>
            </div>
          </div>  
        )}
        
        {/* Collapsible Learning Path at Top */}
        <div className="mb-4 border rounded-lg bg-card overflow-hidden">
          <div 
            className="p-3 flex items-center justify-between cursor-pointer"
            onClick={() => setPathCollapsed(!pathCollapsed)}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {pathCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                <span className="font-medium">Learning Path</span>
              </div>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-secondary/20 rounded-full overflow-hidden mr-2">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${overallProgress}%` }} 
                  />
                </div>
                <span className="text-xs text-muted-foreground">{overallProgress}%</span>
              </div>
            </div>
            <CustomPathCreator />
          </div>

          <div className={cn(
            "transition-all duration-300 overflow-hidden",
            pathCollapsed ? "max-h-0" : "max-h-[400px] border-t p-4"
          )}>
            <VisualLearningPath />
          </div>
        </div>
        
        {/* Main Content Area with Resources and Chat with emphasis on chat */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Learning Resources - Left (1/3 width) */}
          <div className="lg:col-span-1 space-y-4 h-[calc(100vh-220px)] overflow-y-auto pr-2 pb-4">
            <div className="border rounded-lg p-4 bg-card">
              <h2 className="text-lg font-semibold mb-3">Your Progress</h2>
              <GameProgress />
            </div>
            


            <div className="border rounded-lg p-4 bg-card">
              <h2 className="text-lg font-semibold mb-3">Learning Resources</h2>
              <div className="space-y-4">
                {/* Custom Path Creation with highlight */}
                <div className="border-2 rounded-lg p-3 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 mb-4">
                  <h3 className="text-md font-medium mb-2 flex items-center">
                    <span className="mr-2">Create Your Own Path</span>
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">New</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">Build a personalized learning journey</p>
                  <RoadmapGenerator />
                </div>
                
                <PrebuiltLearningPaths />
                <ConceptsList />
              </div>
            </div>
          </div>
          
          {/* Chat Interface - Right (3/4 width) */}
          <div className="lg:col-span-3">
            <div className="h-[calc(100vh-220px)] rounded-lg border bg-card shadow-sm overflow-hidden">
              <ChatInterface />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
