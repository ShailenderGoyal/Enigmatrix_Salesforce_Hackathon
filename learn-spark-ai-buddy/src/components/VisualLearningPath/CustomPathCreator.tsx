import React, { useState } from 'react';
import { Plus, X, Save, FileText, Lightbulb } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLearning } from '@/contexts/LearningContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface SubtopicInput {
  title: string;
  concepts: string[];
}

interface ModuleInput {
  title: string;
  description: string;
  subtopics: SubtopicInput[];
}

const CustomPathCreator: React.FC = () => {
  const { generateRoadmap } = useLearning();
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  
  // For advanced mode (manual creation)
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');
  const [modules, setModules] = useState<ModuleInput[]>([
    {
      title: '',
      description: '',
      subtopics: [{ title: '', concepts: [''] }]
    }
  ]);
  
  const handleAddModule = () => {
    setModules([
      ...modules,
      {
        title: '',
        description: '',
        subtopics: [{ title: '', concepts: [''] }]
      }
    ]);
  };
  
  const handleRemoveModule = (moduleIndex: number) => {
    setModules(modules.filter((_, index) => index !== moduleIndex));
  };
  
  const handleAddSubtopic = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].subtopics.push({ title: '', concepts: [''] });
    setModules(newModules);
  };
  
  const handleRemoveSubtopic = (moduleIndex: number, subtopicIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].subtopics = newModules[moduleIndex].subtopics.filter(
      (_, index) => index !== subtopicIndex
    );
    setModules(newModules);
  };
  
  const handleAddConcept = (moduleIndex: number, subtopicIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].subtopics[subtopicIndex].concepts.push('');
    setModules(newModules);
  };
  
  const handleRemoveConcept = (moduleIndex: number, subtopicIndex: number, conceptIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].subtopics[subtopicIndex].concepts = newModules[moduleIndex].subtopics[subtopicIndex].concepts.filter(
      (_, index) => index !== conceptIndex
    );
    setModules(newModules);
  };
  
  const handleModuleChange = (moduleIndex: number, field: keyof ModuleInput, value: string) => {
    const newModules = [...modules];
    if (field === 'title' || field === 'description') {
      newModules[moduleIndex][field] = value;
    }
    setModules(newModules);
  };
  
  const handleSubtopicChange = (moduleIndex: number, subtopicIndex: number, value: string) => {
    const newModules = [...modules];
    newModules[moduleIndex].subtopics[subtopicIndex].title = value;
    setModules(newModules);
  };
  
  const handleConceptChange = (moduleIndex: number, subtopicIndex: number, conceptIndex: number, value: string) => {
    const newModules = [...modules];
    newModules[moduleIndex].subtopics[subtopicIndex].concepts[conceptIndex] = value;
    setModules(newModules);
  };
  
  const handleCreateSimplePath = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      await generateRoadmap(topic);
      setOpen(false);
      setTopic('');
    } catch (error) {
      console.error('Error creating path:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // For advanced mode (not fully implemented in this version)
  const handleCreateAdvancedPath = () => {
    // In a real implementation, this would create a custom path
    // based on the modules state
    console.log('Creating advanced path:', modules);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 text-xs"
        >
          <Plus size={12} />
          <span>Create Custom Path</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Learning Path</DialogTitle>
        </DialogHeader>
        
        <div className="flex border rounded-lg overflow-hidden mb-4">
          <button
            className={`flex-1 p-2 text-sm font-medium ${activeTab === 'simple' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted hover:bg-muted/80'}`}
            onClick={() => setActiveTab('simple')}
          >
            Simple
          </button>
          <button
            className={`flex-1 p-2 text-sm font-medium ${activeTab === 'advanced' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted hover:bg-muted/80'}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
        </div>
        
        {activeTab === 'simple' ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter a topic and we'll generate a personalized learning path for you.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., AI Ethics, Machine Learning, JavaScript"
              />
            </div>
            
            <div className="bg-muted/40 rounded-lg p-3 flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {['Salesforce Development', 'Data Management', 'Einstein Analytics'].map((suggestion) => (
                    <Button
                      key={suggestion} 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTopic(suggestion)}
                      className="text-xs h-7"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Create a custom learning path by defining your own modules and subtopics.
            </p>
            
            {modules.map((module, moduleIndex) => (
              <Card key={moduleIndex} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={() => handleRemoveModule(moduleIndex)}
                  disabled={modules.length <= 1}
                >
                  <X size={14} />
                </Button>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-base mb-0">
                    <Input
                      value={module.title}
                      onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                      placeholder="Module title"
                      className="border-0 p-0 text-base font-semibold h-7"
                    />
                  </CardTitle>
                  <CardDescription>
                    <Textarea
                      value={module.description}
                      onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                      placeholder="Module description"
                      className="min-h-[60px] resize-none text-sm"
                    />
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3 pb-0">
                  <p className="text-sm font-medium">Subtopics</p>
                  
                  {module.subtopics.map((subtopic, subtopicIndex) => (
                    <div key={subtopicIndex} className="border rounded-md p-3 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        onClick={() => handleRemoveSubtopic(moduleIndex, subtopicIndex)}
                        disabled={module.subtopics.length <= 1}
                      >
                        <X size={14} />
                      </Button>
                      
                      <div className="space-y-2">
                        <Input
                          value={subtopic.title}
                          onChange={(e) => handleSubtopicChange(moduleIndex, subtopicIndex, e.target.value)}
                          placeholder="Subtopic title"
                          className="border-0 p-0 text-sm font-medium h-6"
                        />
                        
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Key concepts</p>
                          
                          {subtopic.concepts.map((concept, conceptIndex) => (
                            <div key={conceptIndex} className="flex gap-2">
                              <Input
                                value={concept}
                                onChange={(e) => handleConceptChange(moduleIndex, subtopicIndex, conceptIndex, e.target.value)}
                                placeholder="Concept"
                                className="text-xs"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={() => handleRemoveConcept(moduleIndex, subtopicIndex, conceptIndex)}
                                disabled={subtopic.concepts.length <= 1}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          ))}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => handleAddConcept(moduleIndex, subtopicIndex)}
                          >
                            <Plus size={14} className="mr-1" />
                            Add Concept
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddSubtopic(moduleIndex)}
                  >
                    <Plus size={14} className="mr-1" />
                    Add Subtopic
                  </Button>
                </CardContent>
                
                <CardFooter className="pt-4 pb-3">
                  
                </CardFooter>
              </Card>
            ))}
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddModule}
            >
              <Plus size={14} className="mr-1" />
              Add Module
            </Button>
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={activeTab === 'simple' ? handleCreateSimplePath : handleCreateAdvancedPath}
            disabled={loading || (activeTab === 'simple' && !topic.trim())}
            className="flex items-center gap-2"
          >
            {loading ? 'Creating...' : 'Create Learning Path'}
            {!loading && (
              activeTab === 'simple' 
                ? <FileText size={16} /> 
                : <Save size={16} />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomPathCreator;
