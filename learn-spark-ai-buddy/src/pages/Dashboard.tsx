
import React from 'react';
import Header from '@/components/Header';
import ProgressTracker from '@/components/ProgressTracker';
import ChatInterface from '@/components/ChatInterface';
import RoadmapGenerator from '@/components/RoadmapGenerator';
import ConceptsList from '@/components/ConceptsList';
import PrebuiltLearningPaths from '@/components/PrebuiltLearningPaths';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingQuiz from '@/components/OnboardingQuiz';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // If user hasn't completed onboarding, show the quiz
  if (user && !user.onboarded) {
    return <OnboardingQuiz />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto pt-20 pb-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
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
