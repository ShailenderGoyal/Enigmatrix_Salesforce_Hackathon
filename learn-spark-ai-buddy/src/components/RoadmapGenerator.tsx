
import React, { useState } from 'react';
import { useLearning } from '@/contexts/LearningContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

const RoadmapGenerator: React.FC = () => {
  const { generateRoadmap, isGeneratingRoadmap } = useLearning();
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }
    
    try {
      await generateRoadmap(topic);
      setTopic('');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast.error('Failed to generate roadmap');
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Create New Learning Path</CardTitle>
        <CardDescription>
          Generate a personalized roadmap for any topic
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter a topic (e.g., Machine Learning)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGeneratingRoadmap}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={isGeneratingRoadmap || !topic.trim()}
          className="w-full"
        >
          {isGeneratingRoadmap ? 'Generating...' : 'Generate Learning Path'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoadmapGenerator;
