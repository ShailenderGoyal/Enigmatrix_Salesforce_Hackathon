
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

// Array of predefined interests
const INTEREST_OPTIONS: Option[] = [
  { id: 'ai', label: 'Artificial Intelligence' },
  { id: 'ml', label: 'Machine Learning' },
  { id: 'data-science', label: 'Data Science' },
  { id: 'web-dev', label: 'Web Development' },
  { id: 'mobile-dev', label: 'Mobile Development' },
  { id: 'cloud', label: 'Cloud Computing' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'blockchain', label: 'Blockchain' },
  { id: 'game-dev', label: 'Game Development' },
  { id: 'iot', label: 'Internet of Things' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'design', label: 'UI/UX Design' },
];

// Array of predefined learning goals
const GOAL_OPTIONS: Option[] = [
  { id: 'career', label: 'Career Change' },
  { id: 'skill', label: 'Skill Enhancement' },
  { id: 'personal', label: 'Personal Interest' },
  { id: 'academic', label: 'Academic Achievement' },
  { id: 'certification', label: 'Professional Certification' },
  { id: 'startup', label: 'Building a Startup' },
  { id: 'project', label: 'Specific Project Completion' },
  { id: 'knowledge', label: 'General Knowledge' },
];

// Array of prebuilt paths that users can choose from during onboarding
const PREBUILT_PATHS: PrebuiltPath[] = [
  {
    id: 'path-1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming concepts and logic',
    category: 'Programming'
  },
  {
    id: 'path-2',
    title: 'Web Development Fundamentals',
    description: 'HTML, CSS, JavaScript, and responsive design basics',
    category: 'Programming'
  },
  {
    id: 'path-3',
    title: 'Machine Learning Basics',
    description: 'Core concepts in ML, including algorithms and model training',
    category: 'Data Science'
  },
  {
    id: 'path-4',
    title: 'Data Analysis with Python',
    description: 'Learn to analyze and visualize data using Python libraries',
    category: 'Data Science'
  },
  {
    id: 'path-5',
    title: 'Artificial Intelligence',
    description: 'Explore AI concepts, applications, and future trends',
    category: 'Technology'
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
        finalTopic = 'Artificial Intelligence'; // Default fallback
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Let's Personalize Your Learning</CardTitle>
          <CardDescription>
            Step {step} of 3: {
              step === 1 ? 'Learning Style' : 
              step === 2 ? 'Your Interests' : 
              'Choose Learning Path'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <>
              <div className="mb-6">
                <Label htmlFor="learning-style">How do you prefer to learn?</Label>
                <RadioGroup 
                  id="learning-style" 
                  value={learningStyle} 
                  onValueChange={setLearningStyle} 
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="visual" id="visual" />
                    <Label htmlFor="visual" className="cursor-pointer">Visual (images, diagrams)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="verbal" id="verbal" />
                    <Label htmlFor="verbal" className="cursor-pointer">Verbal (reading, writing)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interactive" id="interactive" />
                    <Label htmlFor="interactive" className="cursor-pointer">Interactive (practice, examples)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator className="my-4" />
              
              <div className="mt-6">
                <Label htmlFor="experience">What's your experience level?</Label>
                <RadioGroup 
                  id="experience" 
                  value={experience} 
                  onValueChange={setExperience} 
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner" className="cursor-pointer">Beginner (new to the subject)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate" className="cursor-pointer">Intermediate (some knowledge)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced" className="cursor-pointer">Advanced (experienced)</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
          
          {step === 2 && (
            <>
              <div className="mb-6">
                <Label className="block mb-2">What topics interest you?</Label>
                <ScrollArea className="h-[200px] pr-4 -mr-4">
                  <div className="space-y-2">
                    {INTEREST_OPTIONS.map((interest) => (
                      <div key={interest.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`interest-${interest.id}`} 
                          checked={selectedInterests.includes(interest.id)}
                          onCheckedChange={() => handleInterestChange(interest.id)}
                        />
                        <Label 
                          htmlFor={`interest-${interest.id}`}
                          className="cursor-pointer"
                        >
                          {interest.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <Separator className="my-4" />
              
              <div className="mt-6">
                <Label className="block mb-2">What are your learning goals?</Label>
                <ScrollArea className="h-[200px] pr-4 -mr-4">
                  <div className="space-y-2">
                    {GOAL_OPTIONS.map((goal) => (
                      <div key={goal.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`goal-${goal.id}`} 
                          checked={selectedGoals.includes(goal.id)}
                          onCheckedChange={() => handleGoalChange(goal.id)}
                        />
                        <Label 
                          htmlFor={`goal-${goal.id}`}
                          className="cursor-pointer"
                        >
                          {goal.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
          
          {step === 3 && (
            <>
              <div className="mb-6">
                <Label>How would you like to start?</Label>
                <RadioGroup 
                  value={pathMode} 
                  onValueChange={(value: 'custom' | 'prebuilt') => setPathMode(value)}
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prebuilt" id="prebuilt" />
                    <Label htmlFor="prebuilt" className="cursor-pointer">Select from pre-built learning paths</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="cursor-pointer">Create a custom learning path</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator className="my-4" />
              
              {pathMode === 'prebuilt' ? (
                <div className="mt-4">
                  <Label className="mb-2 block">Choose a learning path:</Label>
                  <ScrollArea className="h-[200px] pr-4 -mr-4">
                    <div className="space-y-2">
                      {PREBUILT_PATHS.map((path) => (
                        <div
                          key={path.id}
                          className="flex items-start space-x-2 p-2 hover:bg-secondary/50 rounded-md transition-colors"
                        >
                          <Checkbox
                            id={`onboarding-${path.id}`}
                            checked={selectedPath === path.id}
                            onCheckedChange={() => handleSelectPath(path.id)}
                          />
                          <div className="grid gap-1.5">
                            <Label
                              htmlFor={`onboarding-${path.id}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {path.title}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {path.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="mb-6">
                  <Label htmlFor="topic">What would you like to learn about?</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Artificial Intelligence"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-2"
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
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              className="ml-auto"
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || (pathMode === 'prebuilt' && !selectedPath) || (pathMode === 'custom' && !topic.trim())}
              className="ml-auto"
            >
              {isSubmitting ? 'Creating your path...' : 'Create Learning Path'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingQuiz;
