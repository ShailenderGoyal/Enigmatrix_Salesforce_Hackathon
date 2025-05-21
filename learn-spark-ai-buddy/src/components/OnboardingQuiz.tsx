
// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Separator } from '@/components/ui/separator';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Checkbox } from '@/components/ui/checkbox';
// import { useAuth } from '@/contexts/AuthContext';
// import { useLearning, UserPreferences } from '@/contexts/LearningContext';
// import { toast } from 'sonner';

// // Define prebuilt path type
// interface PrebuiltPath {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
// }

// // Define interest and goal options
// interface Option {
//   id: string;
//   label: string;
// }

// // Array of predefined interests
// const INTEREST_OPTIONS: Option[] = [
//   { id: 'ai', label: 'Artificial Intelligence' },
//   { id: 'ml', label: 'Machine Learning' },
//   { id: 'data-science', label: 'Data Science' },
//   { id: 'web-dev', label: 'Web Development' },
//   { id: 'mobile-dev', label: 'Mobile Development' },
//   { id: 'cloud', label: 'Cloud Computing' },
//   { id: 'cybersecurity', label: 'Cybersecurity' },
//   { id: 'blockchain', label: 'Blockchain' },
//   { id: 'game-dev', label: 'Game Development' },
//   { id: 'iot', label: 'Internet of Things' },
//   { id: 'robotics', label: 'Robotics' },
//   { id: 'design', label: 'UI/UX Design' },
// ];

// // Array of predefined learning goals
// const GOAL_OPTIONS: Option[] = [
//   { id: 'career', label: 'Career Change' },
//   { id: 'skill', label: 'Skill Enhancement' },
//   { id: 'personal', label: 'Personal Interest' },
//   { id: 'academic', label: 'Academic Achievement' },
//   { id: 'certification', label: 'Professional Certification' },
//   { id: 'startup', label: 'Building a Startup' },
//   { id: 'project', label: 'Specific Project Completion' },
//   { id: 'knowledge', label: 'General Knowledge' },
// ];

// // Array of prebuilt paths that users can choose from during onboarding
// const PREBUILT_PATHS: PrebuiltPath[] = [
//   {
//     id: 'path-1',
//     title: 'Introduction to Programming',
//     description: 'Learn the basics of programming concepts and logic',
//     category: 'Programming'
//   },
//   {
//     id: 'path-2',
//     title: 'Web Development Fundamentals',
//     description: 'HTML, CSS, JavaScript, and responsive design basics',
//     category: 'Programming'
//   },
//   {
//     id: 'path-3',
//     title: 'Machine Learning Basics',
//     description: 'Core concepts in ML, including algorithms and model training',
//     category: 'Data Science'
//   },
//   {
//     id: 'path-4',
//     title: 'Data Analysis with Python',
//     description: 'Learn to analyze and visualize data using Python libraries',
//     category: 'Data Science'
//   },
//   {
//     id: 'path-5',
//     title: 'Artificial Intelligence',
//     description: 'Explore AI concepts, applications, and future trends',
//     category: 'Technology'
//   }
// ];

// const OnboardingQuiz: React.FC = () => {
//   const { updateUser } = useAuth();
//   const { setPreferences, generateRoadmap } = useLearning();
//   const [step, setStep] = useState(1);
//   const [learningStyle, setLearningStyle] = useState('visual');
//   const [experience, setExperience] = useState('beginner');
//   const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
//   const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
//   const [topic, setTopic] = useState('');
//   const [pathMode, setPathMode] = useState<'custom' | 'prebuilt'>('prebuilt');
//   const [selectedPath, setSelectedPath] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSelectPath = (pathId: string) => {
//     setSelectedPath(pathId === selectedPath ? null : pathId);
//     if (pathId !== selectedPath) {
//       const path = PREBUILT_PATHS.find(p => p.id === pathId);
//       if (path) {
//         setTopic(path.title);
//       }
//     }
//   };

//   const handleInterestChange = (id: string) => {
//     setSelectedInterests(prev => 
//       prev.includes(id)
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const handleGoalChange = (id: string) => {
//     setSelectedGoals(prev => 
//       prev.includes(id)
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
    
//     try {
//       // Map selected IDs to their labels
//       const interestLabels = selectedInterests.map(id => 
//         INTEREST_OPTIONS.find(option => option.id === id)?.label || id
//       );
      
//       const goalLabels = selectedGoals.map(id => 
//         GOAL_OPTIONS.find(option => option.id === id)?.label || id
//       );
      
//       // Create user preferences object
//       const preferences: UserPreferences = {
//         learningStyle,
//         experience,
//         interests: interestLabels,
//         goals: goalLabels,
//       };
      
//       // Save preferences
//       setPreferences(preferences);
      
//       // Mark user as onboarded
//       updateUser({ onboarded: true });
      
//       // Get the topic to use
//       let finalTopic = topic;
//       if (pathMode === 'prebuilt' && selectedPath) {
//         const path = PREBUILT_PATHS.find(p => p.id === selectedPath);
//         if (path) {
//           finalTopic = path.title;
//         }
//       }
      
//       if (!finalTopic.trim()) {
//         finalTopic = 'Artificial Intelligence'; // Default fallback
//       }
      
//       // Generate initial roadmap
//       await generateRoadmap(finalTopic);
      
//       toast.success('Preferences saved! Your personalized learning path is ready.');
//     } catch (error) {
//       console.error('Onboarding error:', error);
//       toast.error('There was an error saving your preferences.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>Let's Personalize Your Learning</CardTitle>
//           <CardDescription>
//             Step {step} of 3: {
//               step === 1 ? 'Learning Style' : 
//               step === 2 ? 'Your Interests' : 
//               'Choose Learning Path'
//             }
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {step === 1 && (
//             <>
//               <div className="mb-6">
//                 <Label htmlFor="learning-style">How do you prefer to learn?</Label>
//                 <RadioGroup 
//                   id="learning-style" 
//                   value={learningStyle} 
//                   onValueChange={setLearningStyle} 
//                   className="mt-3 space-y-3"
//                 >
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="visual" id="visual" />
//                     <Label htmlFor="visual" className="cursor-pointer">Visual (images, diagrams)</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="verbal" id="verbal" />
//                     <Label htmlFor="verbal" className="cursor-pointer">Verbal (reading, writing)</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="interactive" id="interactive" />
//                     <Label htmlFor="interactive" className="cursor-pointer">Interactive (practice, examples)</Label>
//                   </div>
//                 </RadioGroup>
//               </div>
              
//               <Separator className="my-4" />
              
//               <div className="mt-6">
//                 <Label htmlFor="experience">What's your experience level?</Label>
//                 <RadioGroup 
//                   id="experience" 
//                   value={experience} 
//                   onValueChange={setExperience} 
//                   className="mt-3 space-y-3"
//                 >
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="beginner" id="beginner" />
//                     <Label htmlFor="beginner" className="cursor-pointer">Beginner (new to the subject)</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="intermediate" id="intermediate" />
//                     <Label htmlFor="intermediate" className="cursor-pointer">Intermediate (some knowledge)</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="advanced" id="advanced" />
//                     <Label htmlFor="advanced" className="cursor-pointer">Advanced (experienced)</Label>
//                   </div>
//                 </RadioGroup>
//               </div>
//             </>
//           )}
          
//           {step === 2 && (
//             <>
//               <div className="mb-6">
//                 <Label className="block mb-2">What topics interest you?</Label>
//                 <ScrollArea className="h-[200px] pr-4 -mr-4">
//                   <div className="space-y-2">
//                     {INTEREST_OPTIONS.map((interest) => (
//                       <div key={interest.id} className="flex items-center space-x-2">
//                         <Checkbox 
//                           id={`interest-${interest.id}`} 
//                           checked={selectedInterests.includes(interest.id)}
//                           onCheckedChange={() => handleInterestChange(interest.id)}
//                         />
//                         <Label 
//                           htmlFor={`interest-${interest.id}`}
//                           className="cursor-pointer"
//                         >
//                           {interest.label}
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </div>
              
//               <Separator className="my-4" />
              
//               <div className="mt-6">
//                 <Label className="block mb-2">What are your learning goals?</Label>
//                 <ScrollArea className="h-[200px] pr-4 -mr-4">
//                   <div className="space-y-2">
//                     {GOAL_OPTIONS.map((goal) => (
//                       <div key={goal.id} className="flex items-center space-x-2">
//                         <Checkbox 
//                           id={`goal-${goal.id}`} 
//                           checked={selectedGoals.includes(goal.id)}
//                           onCheckedChange={() => handleGoalChange(goal.id)}
//                         />
//                         <Label 
//                           htmlFor={`goal-${goal.id}`}
//                           className="cursor-pointer"
//                         >
//                           {goal.label}
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </div>
//             </>
//           )}
          
//           {step === 3 && (
//             <>
//               <div className="mb-6">
//                 <Label>How would you like to start?</Label>
//                 <RadioGroup 
//                   value={pathMode} 
//                   onValueChange={(value: 'custom' | 'prebuilt') => setPathMode(value)}
//                   className="mt-3 space-y-3"
//                 >
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="prebuilt" id="prebuilt" />
//                     <Label htmlFor="prebuilt" className="cursor-pointer">Select from pre-built learning paths</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="custom" id="custom" />
//                     <Label htmlFor="custom" className="cursor-pointer">Create a custom learning path</Label>
//                   </div>
//                 </RadioGroup>
//               </div>
              
//               <Separator className="my-4" />
              
//               {pathMode === 'prebuilt' ? (
//                 <div className="mt-4">
//                   <Label className="mb-2 block">Choose a learning path:</Label>
//                   <ScrollArea className="h-[200px] pr-4 -mr-4">
//                     <div className="space-y-2">
//                       {PREBUILT_PATHS.map((path) => (
//                         <div
//                           key={path.id}
//                           className="flex items-start space-x-2 p-2 hover:bg-secondary/50 rounded-md transition-colors"
//                         >
//                           <Checkbox
//                             id={`onboarding-${path.id}`}
//                             checked={selectedPath === path.id}
//                             onCheckedChange={() => handleSelectPath(path.id)}
//                           />
//                           <div className="grid gap-1.5">
//                             <Label
//                               htmlFor={`onboarding-${path.id}`}
//                               className="text-sm font-medium leading-none cursor-pointer"
//                             >
//                               {path.title}
//                             </Label>
//                             <p className="text-xs text-muted-foreground">
//                               {path.description}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </ScrollArea>
//                 </div>
//               ) : (
//                 <div className="mb-6">
//                   <Label htmlFor="topic">What would you like to learn about?</Label>
//                   <Input
//                     id="topic"
//                     placeholder="e.g., Artificial Intelligence"
//                     value={topic}
//                     onChange={(e) => setTopic(e.target.value)}
//                     className="mt-2"
//                   />
//                 </div>
//               )}
              
//               <div className="mt-4 text-sm text-muted-foreground">
//                 <p>
//                   Based on your preferences, we'll generate a personalized learning
//                   path for you. You can always modify or create new paths later.
//                 </p>
//               </div>
//             </>
//           )}
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           {step > 1 && (
//             <Button 
//               variant="outline" 
//               onClick={() => setStep(step - 1)}
//             >
//               Back
//             </Button>
//           )}
//           {step < 3 ? (
//             <Button 
//               onClick={() => setStep(step + 1)}
//               className="ml-auto"
//             >
//               Next
//             </Button>
//           ) : (
//             <Button 
//               onClick={handleSubmit}
//               disabled={isSubmitting || (pathMode === 'prebuilt' && !selectedPath) || (pathMode === 'custom' && !topic.trim())}
//               className="ml-auto"
//             >
//               {isSubmitting ? 'Creating your path...' : 'Create Learning Path'}
//             </Button>
//           )}
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default OnboardingQuiz;




import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';


// Define prebuilt path type
interface PrebuiltPath {
  id: string;
  title: string;
  description: string;
  category: string;
  interestTags?: string[];
  goalTags?: string[];
  keywordTriggers?: string[];
  initialChatMessage?: string;
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
    category: 'Administration',
    interestTags: ['admin', 'flows', 'data'],
    goalTags: ['certification', 'career', 'badges'],
    keywordTriggers: ['admin', 'administrator', 'administration', 'manage', 'setup', 'security', 'user', 'new to salesforce', 'beginner'],
    initialChatMessage: "Welcome to the Salesforce Administrator learning path! 🌟 I've created a personalized roadmap to help you master Salesforce administration skills. Let's start with the fundamentals: What's your current familiarity with Salesforce?"

  },
  {
    id: 'path-2',
    title: 'Salesforce Developer',
    description: 'Build custom applications using Apex, Lightning Web Components, and APIs',
    category: 'Development',
    interestTags: ['dev', 'apex', 'lwc', 'integration'],
    goalTags: ['certification', 'skill', 'project'],
    keywordTriggers: ['developer', 'development', 'code', 'coding', 'programming', 'apex', 'lwc', 'lightning', 'components'],
    initialChatMessage: "Welcome to the Salesforce Developer learning path! 💻 I've created a personalized roadmap to help you master Salesforce development. Let's get started: Have you done any programming before, and if so, which languages are you familiar with?"

  },
  {
    id: 'path-3',
    title: 'AgentForce Fundamentals',
    description: 'Learn to build AI agents that extend Salesforce capabilities',
    category: 'AI',
    interestTags: ['agentforce', 'einstein', 'integration'],
    goalTags: ['agentforce', 'skill', 'implementation'],
    keywordTriggers: ['agentforce', 'agent force', 'ai agent', 'agent', 'intern', 'artificial intelligence', 'generative ai', 'gpt'],
    initialChatMessage: "Welcome to the AgentForce Fundamentals learning path! 🤖 I've created a personalized roadmap to help you master building AI agents for Salesforce. Let's begin with the basics: What aspect of AgentForce are you most excited to learn about?"

  },
  {
    id: 'path-4',
    title: 'Salesforce Einstein AI',
    description: 'Implement AI-powered predictions, recommendations, and automation',
    category: 'AI',
    interestTags: ['einstein', 'admin', 'dev'],
    goalTags: ['skill', 'implementation', 'project'],
    keywordTriggers: ['einstein', 'ai', 'artificial intelligence', 'machine learning', 'predictions', 'analytics', 'data science'],
    initialChatMessage: "Welcome to the Salesforce Einstein AI learning path! 🧠 I've created a personalized roadmap to help you master Einstein AI capabilities. Let's start: What's your experience with data science or AI concepts so far?"

  },
  {
    id: 'path-5',
    title: 'Trailhead Ranger Journey',
    description: 'Complete essential badges and projects to reach Ranger status',
    category: 'Career',
    interestTags: ['admin', 'dev', 'data'],
    goalTags: ['ranger', 'badges', 'skill'],
    keywordTriggers: ['trailhead', 'badges', 'ranger', 'career', 'certification', 'learning'],
    initialChatMessage: "Welcome to the Trailhead Ranger Journey! 🏆 I've created a personalized roadmap to help you earn badges and reach Ranger status. Let's get started: Have you completed any Trailhead badges before?"

  },
  {
    id: 'path-6',
    title: 'Service Cloud Specialist',
    description: 'Master customer service tools, case management, and service automation',

    category: 'Service',
    interestTags: ['admin', 'flows', 'data'],
    goalTags: ['certification', 'implementation', 'consulting'],
    keywordTriggers: ['service', 'service cloud', 'customer service', 'support', 'case management', 'help desk'],
    initialChatMessage: "Welcome to the Service Cloud Specialist learning path! 🛎️ I've created a personalized roadmap to help you master Salesforce Service Cloud. Let's begin: What type of customer service processes are you looking to implement or improve?"

  },
  {
    id: 'path-7',
    title: 'Sales Cloud Consultant',
    description: 'Configure and optimize Sales Cloud for lead-to-cash management',
    category: 'Sales',
    interestTags: ['admin', 'cpq', 'flows'],
    goalTags: ['certification', 'consulting', 'implementation'],
    keywordTriggers: ['sales', 'sales cloud', 'opportunity', 'lead', 'accounts', 'cpq', 'quotes', 'pipeline'],
    initialChatMessage: "Welcome to the Sales Cloud Consultant learning path! 📊 I've created a personalized roadmap to help you master Salesforce Sales Cloud. Let's start: What sales processes are you most interested in optimizing?"
  },
  {
    id: 'path-8',
    title: 'LWC for Advanced UI Development',
    description: 'Master Lightning Web Components for modern UI development on Salesforce',
    category: 'Development',
    interestTags: ['lwc', 'dev', 'experience'],
    goalTags: ['skill', 'project', 'app'],
    keywordTriggers: ['lightning', 'lwc', 'components', 'ui', 'user interface', 'experience', 'frontend', 'javascript'],
    initialChatMessage: "Welcome to the Lightning Web Components learning path! ⚡ I've created a personalized roadmap to help you master modern UI development on Salesforce. Let's start: What's your experience with JavaScript and web development?"
  },
  {
    id: 'path-9',
    title: 'Apex Programming Masterclass',
    description: 'Deep dive into Apex programming language for complex business logic',
    category: 'Development',
    interestTags: ['apex', 'dev', 'integration'],
    goalTags: ['skill', 'certification', 'project'],
    keywordTriggers: ['apex', 'programming', 'code', 'triggers', 'classes', 'backend', 'business logic'],
    initialChatMessage: "Welcome to the Apex Programming Masterclass! 🚀 I've created a personalized roadmap to help you master Apex development. Let's get started: What's your current experience with object-oriented programming?"
  },
  {
    id: 'path-10',
    title: 'Flow Builder Expert',
    description: 'Become an expert in creating complex automation with Flow Builder',
    category: 'Administration',
    interestTags: ['flows', 'admin', 'automation'],
    goalTags: ['skill', 'implementation', 'consulting'],
    keywordTriggers: ['flow', 'flow builder', 'automation', 'no code', 'low code', 'process', 'automate'],
    initialChatMessage: "Welcome to the Flow Builder Expert learning path! ⚙️ I've created a personalized roadmap to help you master Salesforce automation. Let's begin: What kinds of processes are you looking to automate in your organization?"

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
  const [customQueryText, setCustomQueryText] = useState('');
  const [pathMode, setPathMode] = useState<'custom' | 'prebuilt'>('prebuilt');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendedPaths, setRecommendedPaths] = useState<PrebuiltPath[]>([]);
  const [analyzingCustomPath, setAnalyzingCustomPath] = useState(false);
  const [customPathResult, setCustomPathResult] = useState<PrebuiltPath | null>(null);

  
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
    const updatedInterests = selectedInterests.includes(id)
      ? selectedInterests.filter(item => item !== id)
      : [...selectedInterests, id];
    
    setSelectedInterests(updatedInterests);
    updateRecommendedPaths(updatedInterests, selectedGoals);
  };

  const handleGoalChange = (id: string) => {
    const updatedGoals = selectedGoals.includes(id)
      ? selectedGoals.filter(item => item !== id)
      : [...selectedGoals, id];
    
    setSelectedGoals(updatedGoals);
    updateRecommendedPaths(selectedInterests, updatedGoals);
  };
  
  // Function to update recommended paths based on selected interests and goals
  const updateRecommendedPaths = (interests: string[], goals: string[]) => {
    // Only provide recommendations if user has selected at least one interest and one goal
    if (interests.length === 0 || goals.length === 0) {
      setRecommendedPaths([]);
      return;
    }
    
    // Calculate a score for each path based on matching tags
    const scoredPaths = PREBUILT_PATHS.map(path => {
      const interestMatches = path.interestTags?.filter(tag => interests.includes(tag)).length || 0;
      const goalMatches = path.goalTags?.filter(tag => goals.includes(tag)).length || 0;
      
      // Total score is weighted sum of matches
      const score = (interestMatches * 2) + (goalMatches * 3);
      
      return { path, score };
    });
    
    // Filter paths with at least one matching interest and one matching goal
    const filteredPaths = scoredPaths.filter(({ path, score }) => {
      const hasInterestMatch = path.interestTags?.some(tag => interests.includes(tag)) || false;
      const hasGoalMatch = path.goalTags?.some(tag => goals.includes(tag)) || false;
      return hasInterestMatch && hasGoalMatch;
    });
    
    // Sort by score (descending) and take top 3
    const topPaths = filteredPaths
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.path);
    
    setRecommendedPaths(topPaths);
  };

  // Function to analyze custom query and match to a pre-built path
  const analyzeCustomQuery = (query: string) => {
    if (!query.trim()) return null;
    
    setAnalyzingCustomPath(true);
    
    // Convert query to lowercase for case-insensitive matching
    const lowerQuery = query.toLowerCase();
    
    // Calculate a score for each path based on keyword matches
    const scoredPaths = PREBUILT_PATHS.map(path => {
      // Count how many keywords match in the query
      const keywordMatches = path.keywordTriggers?.filter(keyword => 
        lowerQuery.includes(keyword.toLowerCase())
      ).length || 0;
      
      return { path, score: keywordMatches };
    });
    
    // Sort by score and get the highest match
    const bestMatch = scoredPaths.sort((a, b) => b.score - a.score)[0];
    
    // Set default path for demo if no matches (AgentForce for the example)
    // In a real app, you might want more sophisticated NLP
    let resultPath: PrebuiltPath;
    
    if (bestMatch.score === 0 || lowerQuery.includes('intern') && lowerQuery.includes('agentforce')) {
      // Hardcoded mapping for the example query about being an intern and AgentForce
      resultPath = PREBUILT_PATHS.find(p => p.id === 'path-3') || PREBUILT_PATHS[0];
    } else {
      resultPath = bestMatch.path;
    }
    
    // Simulate a brief analysis delay
    setTimeout(() => {
      setCustomPathResult(resultPath);
      setAnalyzingCustomPath(false);
    }, 1500);
    
    return resultPath;
  };
  
  // Effect to analyze query when user switches to custom path mode
  useEffect(() => {
    if (pathMode === 'custom' && customQueryText.trim() && !customPathResult) {
      analyzeCustomQuery(customQueryText);
    }
  }, [pathMode, customQueryText]);

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
      let finalTopic = '';
      let initialMessage = '';
      
      if (pathMode === 'prebuilt' && selectedPath) {
        const path = PREBUILT_PATHS.find(p => p.id === selectedPath);
        if (path) {
          finalTopic = path.title;
          initialMessage = path.initialChatMessage || '';
        }
      } else if (pathMode === 'custom' && customPathResult) {
        // For custom paths, use the matched pre-built path
        finalTopic = customPathResult.title;
        initialMessage = customPathResult.initialChatMessage || '';
      }
      
      if (!finalTopic.trim()) {
        finalTopic = 'Salesforce Administration'; // Default fallback
        initialMessage = PREBUILT_PATHS[0].initialChatMessage || '';

      }
      
      // Generate initial roadmap with custom welcome message if available
      await generateRoadmap(finalTopic, initialMessage);
      
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
              
              {/* Recommended Paths Section - Show if both interests and goals are selected */}
              {recommendedPaths.length > 0 && (
                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="text-xl font-medium text-center mb-4">Recommended Learning Paths</h3>
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    Based on your interests and goals, we recommend these paths:
                  </p>
                  <div className="grid gap-3">
                    {recommendedPaths.map((path) => (
                      <Button
                        key={path.id}
                        type="button"
                        onClick={() => {
                          setPathMode('prebuilt');
                          setSelectedPath(path.id);
                          setStep(3);
                        }}
                        variant="outline"
                        className="h-auto py-3 px-4 rounded-xl w-full flex flex-col items-start justify-start gap-1 text-left hover:bg-primary hover:text-primary-foreground"
                      >
                        <span className="text-base font-medium">{path.title}</span>
                        <span className="text-xs opacity-80">{path.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

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
                  
                  {/* Show recommended paths first with a heading if there are any */}
                  {recommendedPaths.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-primary mb-3">Recommended based on your preferences:</h4>
                      <div className="grid gap-3">
                        {recommendedPaths.map((path) => (
                          <Button
                            key={path.id}
                            type="button"
                            onClick={() => handleSelectPath(path.id)}
                            variant={selectedPath === path.id ? 'default' : 'outline'}
                            className={cn(
                              "h-auto py-3 px-4 rounded-xl w-full flex flex-col items-start justify-start gap-1 text-left border-primary/30",
                              selectedPath === path.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-base font-medium">{path.title}</span>
                              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Recommended</span>
                            </div>
                            <span className="text-xs opacity-80">{path.description}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Show all paths */}

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
                  <h3 className="text-xl font-medium text-center mb-6">Tell us about your learning goals</h3>
                  <Textarea
                    id="customQuery"
                    placeholder="e.g., I am new to ML. I want to learn it for MLOps."
                    value={customQueryText}
                    onChange={(e) => setCustomQueryText(e.target.value)}
                    className="mt-2 rounded-xl p-4 text-center text-base min-h-[120px]"

                  />
                  
                  {analyzingCustomPath && (
                    <div className="mt-4 text-center text-sm text-muted-foreground animate-pulse">
                      Analyzing your learning needs...
                    </div>
                  )}
                  
                  {customPathResult && !analyzingCustomPath && (
                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <h4 className="font-medium text-primary mb-2">Recommended Learning Path:</h4>
                      <p className="text-base">{customPathResult.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{customPathResult.description}</p>
                    </div>
                  )}
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
            disabled={isSubmitting || (step === 3 && pathMode === 'prebuilt' && !selectedPath) || (step === 3 && pathMode === 'custom' && !customQueryText.trim() && !customPathResult)}

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
