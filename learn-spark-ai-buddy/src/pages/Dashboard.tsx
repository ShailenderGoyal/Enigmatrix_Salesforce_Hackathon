
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
import ProgressTracker from '@/components/ProgressTracker';
import ChatInterface from '@/components/ChatInterface';
import RoadmapGenerator from '@/components/RoadmapGenerator';
import ConceptsList from '@/components/ConceptsList';
import PrebuiltLearningPaths from '@/components/PrebuiltLearningPaths';
import GameProgress from '@/components/GameProgress';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingQuiz from '@/components/OnboardingQuiz';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [showNudge, setShowNudge] = useState(false);
  
  // Show a motivational nudge after 15 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNudge(true);
    }, 15000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // If user hasn't completed onboarding, show the quiz
  if (user && !user.onboarded) {
    return <OnboardingQuiz />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto pt-20 pb-6 px-4">
        {/* Motivational nudge banner */}
        {showNudge && (
          <div className="mb-6 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-4 rounded-lg border border-primary/20 flex items-center justify-between animate-in fade-in slide-in-from-top-5">
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <GameProgress />
            <ProgressTracker />
            <PrebuiltLearningPaths />
            <RoadmapGenerator />
            <ConceptsList />
          </div>
          
          <div className="md:col-span-2 h-[calc(100vh-140px)]">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
