
import React, { useState } from 'react';
import { useLearning } from '@/contexts/LearningContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the types for our prebuilt paths
interface PrebuiltPath {
  id: string;
  title: string;
  description: string;
  category: 'programming' | 'data-science' | 'general-knowledge' | 'business';
}

// Create an array of prebuilt paths that users can choose from
const PREBUILT_PATHS: PrebuiltPath[] = [
  {
    id: 'path-1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming concepts and logic',
    category: 'programming'
  },
  {
    id: 'path-2',
    title: 'Web Development Fundamentals',
    description: 'HTML, CSS, JavaScript, and responsive design basics',
    category: 'programming'
  },
  {
    id: 'path-3',
    title: 'Machine Learning Basics',
    description: 'Core concepts in ML, including algorithms and model training',
    category: 'data-science'
  },
  {
    id: 'path-4',
    title: 'Data Analysis with Python',
    description: 'Learn to analyze and visualize data using Python libraries',
    category: 'data-science'
  },
  {
    id: 'path-5',
    title: 'Public Speaking',
    description: 'Improve your presentation and public speaking skills',
    category: 'general-knowledge'
  },
  {
    id: 'path-6',
    title: 'Critical Thinking',
    description: 'Enhance your problem-solving and analytical thinking',
    category: 'general-knowledge'
  },
  {
    id: 'path-7',
    title: 'Business Strategy',
    description: 'Learn fundamentals of business strategy and planning',
    category: 'business'
  },
  {
    id: 'path-8',
    title: 'Product Management',
    description: 'Skills for managing products from conception to launch',
    category: 'business'
  },
  {
    id: 'path-9',
    title: 'Artificial Intelligence Ethics',
    description: 'Explore ethical considerations in AI development',
    category: 'programming'
  },
  {
    id: 'path-10',
    title: 'Mobile App Development',
    description: 'Learn to build apps for iOS and Android platforms',
    category: 'programming'
  },
];

const PrebuiltLearningPaths: React.FC = () => {
  const { generateRoadmap, isGeneratingRoadmap } = useLearning();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleSelectPath = (pathId: string) => {
    setSelectedPath(pathId === selectedPath ? null : pathId);
  };

  const handleApplyPath = async () => {
    if (!selectedPath) {
      toast.error('Please select a learning path first');
      return;
    }

    const path = PREBUILT_PATHS.find(p => p.id === selectedPath);
    if (!path) return;

    try {
      await generateRoadmap(path.title);
      toast.success(`Learning path "${path.title}" has been loaded`);
    } catch (error) {
      console.error('Error applying learning path:', error);
      toast.error('Failed to apply the learning path');
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Explore Learning Paths</CardTitle>
        <CardDescription>
          Select from our pre-built learning paths
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4 -mr-4">
          <div className="space-y-2">
            {PREBUILT_PATHS.map((path) => (
              <div
                key={path.id}
                className="flex items-start space-x-2 p-2 hover:bg-secondary/50 rounded-md transition-colors"
              >
                <Checkbox
                  id={path.id}
                  checked={selectedPath === path.id}
                  onCheckedChange={() => handleSelectPath(path.id)}
                />
                <div className="grid gap-1.5">
                  <Label
                    htmlFor={path.id}
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
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleApplyPath}
          disabled={isGeneratingRoadmap || !selectedPath}
          className="w-full"
        >
          {isGeneratingRoadmap ? 'Generating...' : 'Apply Selected Path'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrebuiltLearningPaths;
