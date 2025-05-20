
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useLearning, UserPreferences } from '@/contexts/LearningContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Define prebuilt path type
interface PrebuiltPath {
  id: string;
  title: string;
  description: string;
  category: string;
}

// Define interest and goal options
interface Option {
  id: string;
  label: string;
}

// Array of predefined Salesforce interests
const INTEREST_OPTIONS: Option[] = [
  { id: 'admin', label: 'Salesforce Administration' },
  { id: 'dev', label: 'Salesforce Development' },
  { id: 'agentforce', label: 'AgentForce' },
  { id: 'apex', label: 'Apex Programming' },
  { id: 'lwc', label: 'Lightning Web Components' },
  { id: 'flows', label: 'Flow Builder' },
  { id: 'integration', label: 'Salesforce Integration' },
  { id: 'einstein', label: 'Einstein AI' },
  { id: 'cpq', label: 'Salesforce CPQ' },
  { id: 'marketing', label: 'Marketing Cloud' },
  { id: 'commerce', label: 'Commerce Cloud' },
  { id: 'experience', label: 'Experience Cloud' },
  { id: 'data', label: 'Data Management' },
];

// Array of predefined Salesforce learning goals
const GOAL_OPTIONS: Option[] = [
  { id: 'certification', label: 'Salesforce Certification' },
  { id: 'career', label: 'Salesforce Career' },
  { id: 'skill', label: 'Expand Salesforce Skills' },
  { id: 'badges', label: 'Earn Trailhead Badges' },
  { id: 'ranger', label: 'Become a Trailhead Ranger' },
  { id: 'implementation', label: 'Implement Salesforce' },
  { id: 'consulting', label: 'Salesforce Consulting' },
  { id: 'project', label: 'Complete a Salesforce Project' },
  { id: 'agentforce', label: 'Build with AgentForce' },
  { id: 'app', label: 'Create AppExchange App' },
];

// Array of prebuilt Salesforce Trailhead paths that users can choose from during onboarding
const PREBUILT_PATHS: PrebuiltPath[] = [
  {
    id: 'path-1',
    title: 'Salesforce Administrator',
    description: 'Master Salesforce setup, security, and automation to become a certified Admin',
    category: 'Administration'
  },
  {
    id: 'path-2',
    title: 'Salesforce Developer',
    description: 'Build custom applications using Apex, Lightning Web Components, and APIs',
    category: 'Development'
  },
  {
    id: 'path-3',
    title: 'AgentForce Fundamentals',
    description: 'Learn to build AI agents that extend Salesforce capabilities',
    category: 'AI'
  },
  {
    id: 'path-4',
    title: 'Salesforce Einstein AI',
    description: 'Implement AI-powered predictions, recommendations, and automation',
    category: 'AI'
  },
  {
    id: 'path-5',
    title: 'Trailhead Ranger Journey',
    description: 'Complete essential badges and projects to reach Ranger status',
    category: 'Career'
  },
  {
    id: 'path-6',
    title: 'Service Cloud Specialist',
    description: 'Master customer service tools, case management, and service automation',
    category: 'Service'
  },
  {
    id: 'path-7',
    title: 'Sales Cloud Consultant',
    description: 'Configure and optimize Sales Cloud for lead-to-cash management',
    category: 'Sales'
  }
];

const OnboardingQuiz: React.FC = () => {
  const { updateUser } = useAuth();
  const { setPreferences, generateRoadmap } = useLearning();
  const [step, setStep] = useState(1);
  const [learningStyle, setLearningStyle] = useState('visual');
  const [experience, setExperience] = useState('beginner');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [topic, setTopic] = useState('');
  const [pathMode, setPathMode] = useState<'custom' | 'prebuilt'>('prebuilt');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalSteps = 3;

  const handleSelectPath = (pathId: string) => {
    setSelectedPath(pathId === selectedPath ? null : pathId);
    if (pathId !== selectedPath) {
      const path = PREBUILT_PATHS.find(p => p.id === pathId);
      if (path) {
        setTopic(path.title);
      }
    }
  };

  const handleInterestChange = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleGoalChange = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Map selected IDs to their labels
      const interestLabels = selectedInterests.map(id => 
        INTEREST_OPTIONS.find(option => option.id === id)?.label || id
      );
      
      const goalLabels = selectedGoals.map(id => 
        GOAL_OPTIONS.find(option => option.id === id)?.label || id
      );
      
      // Create user preferences object
      const preferences: UserPreferences = {
        learningStyle,
        experience,
        interests: interestLabels,
        goals: goalLabels,
      };
      
      // Save preferences
      setPreferences(preferences);
      
      // Mark user as onboarded
      updateUser({ onboarded: true });
      
      // Get the topic to use
      let finalTopic = topic;
      if (pathMode === 'prebuilt' && selectedPath) {
        const path = PREBUILT_PATHS.find(p => p.id === selectedPath);
        if (path) {
          finalTopic = path.title;
        }
      }
      
      if (!finalTopic.trim()) {
        finalTopic = 'Salesforce Administration'; // Default fallback
      }
      
      // Generate initial roadmap
      await generateRoadmap(finalTopic);
      
      toast.success('Preferences saved! Your personalized learning path is ready.');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('There was an error saving your preferences.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-md md:max-w-lg border-none shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Let's Personalize Your Salesforce Journey</CardTitle>
          <CardDescription className="text-lg mt-2">
            Step {step} of {totalSteps}: {
              step === 1 ? 'Learning Style' : 
              step === 2 ? 'Your Interests' : 
              'Choose Learning Path'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-medium text-center mb-6">How do you prefer to learn?</h3>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <Button 
                    type="button" 
                    onClick={() => setLearningStyle('visual')}
                    variant={learningStyle === 'visual' ? 'default' : 'outline'}
                    className={cn(
                      "h-auto py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-2",
                      learningStyle === 'visual' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    )}
                  >
                    <span className="text-lg">Visual</span>
                    <span className="text-xs text-center opacity-80">(images, diagrams)</span>
                  </Button>
                  
                  <Button 
                    type="button" 
                    onClick={() => setLearningStyle('verbal')}
                    variant={learningStyle === 'verbal' ? 'default' : 'outline'}
                    className={cn(
                      "h-auto py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-2",
                      learningStyle === 'verbal' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    )}
                  >
                    <span className="text-lg">Verbal</span>
                    <span className="text-xs text-center opacity-80">(reading, writing)</span>
                  </Button>
                  
                  <Button 
                    type="button" 
                    onClick={() => setLearningStyle('interactive')}
                    variant={learningStyle === 'interactive' ? 'default' : 'outline'}
                    className={cn(
                      "h-auto py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-2",
                      learningStyle === 'interactive' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    )}
                  >
                    <span className="text-lg">Interactive</span>
                    <span className="text-xs text-center opacity-80">(practice, examples)</span>
                  </Button>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-medium text-center mb-6">What's your experience level?</h3>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <Button 
                    type="button" 
                    onClick={() => setExperience('beginner')}
                    variant={experience === 'beginner' ? 'default' : 'outline'}
                    className={cn(
                      "h-auto py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-2",
                      experience === 'beginner' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    )}
                  >
                    <span className="text-lg">Beginner</span>
                    <span className="text-xs text-center opacity-80">(new to the subject)</span>
                  </Button>
                  
                  <Button 
                    type="button" 
                    onClick={() => setExperience('intermediate')}
                    variant={experience === 'intermediate' ? 'default' : 'outline'}
                    className={cn(
                      "h-auto py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-2",
                      experience === 'intermediate' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    )}
                  >
                    <span className="text-lg">Intermediate</span>
                    <span className="text-xs text-center opacity-80">(some knowledge)</span>
                  </Button>
                  
                  <Button 
                    type="button" 
                    onClick={() => setExperience('advanced')}
                    variant={experience === 'advanced' ? 'default' : 'outline'}
                    className={cn(
                      "h-auto py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-2",
                      experience === 'advanced' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    )}
                  >
                    <span className="text-lg">Advanced</span>
                    <span className="text-xs text-center opacity-80">(experienced)</span>
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {step === 2 && (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-medium text-center mb-6">What topics interest you?</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {INTEREST_OPTIONS.map((interest) => (
                    <Button 
                      key={interest.id}
                      type="button" 
                      onClick={() => handleInterestChange(interest.id)}
                      variant={selectedInterests.includes(interest.id) ? 'default' : 'outline'}
                      className={cn(
                        "rounded-full px-4 py-2",
                        selectedInterests.includes(interest.id) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary'
                      )}
                    >
                      {interest.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-medium text-center mb-6">What are your learning goals?</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {GOAL_OPTIONS.map((goal) => (
                    <Button 
                      key={goal.id}
                      type="button" 
                      onClick={() => handleGoalChange(goal.id)}
                      variant={selectedGoals.includes(goal.id) ? 'default' : 'outline'}
                      className={cn(
                        "rounded-full px-4 py-2",
                        selectedGoals.includes(goal.id) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary'
                      )}
                    >
                      {goal.label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {step === 3 && (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-medium text-center mb-6">How would you like to start?</h3>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button 
                    type="button" 
                    onClick={() => setPathMode('prebuilt')}
                    variant={pathMode === 'prebuilt' ? 'default' : 'outline'}
                    className={cn(
                      "h-auto py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-2",
                      pathMode === 'prebuilt' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    )}
                  >
                    <span className="text-lg">Pre-built</span>
                    <span className="text-xs text-center opacity-80">(Select from learning paths)</span>
                  </Button>
                  
                  <Button 
                    type="button" 
                    onClick={() => setPathMode('custom')}
                    variant={pathMode === 'custom' ? 'default' : 'outline'}
                    className={cn(
                      "h-auto py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-2",
                      pathMode === 'custom' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    )}
                  >
                    <span className="text-lg">Custom</span>
                    <span className="text-xs text-center opacity-80">(Create your own path)</span>
                  </Button>
                </div>
              </div>
              
              {pathMode === 'prebuilt' ? (
                <div className="mt-6">
                  <h3 className="text-xl font-medium text-center mb-6">Choose a learning path:</h3>
                  <div className="grid gap-4">
                    {PREBUILT_PATHS.map((path) => (
                      <Button
                        key={path.id}
                        type="button"
                        onClick={() => handleSelectPath(path.id)}
                        variant={selectedPath === path.id ? 'default' : 'outline'}
                        className={cn(
                          "h-auto py-3 px-4 rounded-xl w-full flex flex-col items-start justify-start gap-1 text-left",
                          selectedPath === path.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                        )}
                      >
                        <span className="text-base font-medium">{path.title}</span>
                        <span className="text-xs opacity-80">{path.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 mt-6">
                  <h3 className="text-xl font-medium text-center mb-6">What would you like to learn about?</h3>
                  <Input
                    id="topic"
                    placeholder="e.g., Artificial Intelligence"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-2 rounded-xl p-6 text-center text-lg"
                  />
                </div>
              )}
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Based on your preferences, we'll generate a personalized learning
                  path for you. You can always modify or create new paths later.
                </p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4 pt-6">
          <Button 
            onClick={step < 3 ? () => setStep(step + 1) : handleSubmit}
            disabled={isSubmitting || (step === 3 && pathMode === 'prebuilt' && !selectedPath) || (step === 3 && pathMode === 'custom' && !topic.trim())}
            className="w-full rounded-full h-12 text-lg font-medium"
          >
            {isSubmitting ? 'Creating your path...' : step < 3 ? 'Continue' : 'Create Learning Path'}
          </Button>
          
          {step > 1 && (
            <Button 
              variant="link" 
              onClick={() => setStep(step - 1)}
              className="text-muted-foreground"
            >
              Go back
            </Button>
          )}
          
          {/* Progress indicator */}
          <div className="flex justify-center items-center gap-2 w-full mt-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index} 
                className={cn(
                  "h-1 rounded-full transition-all",
                  index + 1 <= step ? "bg-primary w-12" : "bg-secondary w-8"
                )}
              />
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingQuiz;
