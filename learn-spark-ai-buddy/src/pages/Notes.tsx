import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Edit2, Calendar, Tag, BookOpen, MessageSquare, Star, StarOff } from 'lucide-react';

// Mock data for saved notes
const MOCK_NOTES = [
  {
    id: 'note-1',
    topic: 'Salesforce Administrator',
    subtopic: 'User Management',
    date: '2025-05-15',
    questionContent: 'How do I set up a new user profile with specific permissions in Salesforce?',
    responseContent: 'To set up a new user profile with specific permissions in Salesforce, follow these steps:\n\n1. Navigate to Setup > Administration > Users > Profiles\n2. Click "New Profile"\n3. Select a profile to clone from\n4. Give your profile a name\n5. Adjust the permissions for the new profile\n6. Save the profile\n7. Assign the profile to users as needed\n\nRemember that profiles control what users can see and do in Salesforce, including object permissions, field permissions, and more.',
    noteContent: 'Important to remember: Always use the principle of least privilege when setting up profiles. Start with minimal access and add permissions as needed rather than removing them from a profile with too many permissions.',
    tags: ['administration', 'security', 'best-practices'],
    isFavorite: true
  },
  {
    id: 'note-2',
    topic: 'AgentForce Fundamentals',
    subtopic: 'Agent Setup',
    date: '2025-05-18',
    questionContent: 'What are the key requirements for setting up a new AgentForce instance?',
    responseContent: 'Setting up a new AgentForce instance requires the following key requirements:\n\n1. Einstein API License: Ensure your org has the appropriate Einstein API license activated\n2. Permissions: Set up the "AgentForce Admin" permission set or custom permissions\n3. Data Sources: Configure the data sources your agent will access\n4. Model Selection: Choose between available AI models based on your use case\n5. Knowledge Base: Prepare document repositories for your agent to reference\n6. Testing Environment: Set up a sandbox for testing before production deployment\n\nOnce these requirements are met, you can proceed with the actual configuration in Setup > Einstein > AgentForce > New Agent.',
    noteContent: 'Make sure to document the decisions made for model selection and data source configuration. For our use case, the "sales-specialized" model works better than the general purpose model.',
    tags: ['agentforce', 'ai', 'setup'],
    isFavorite: false
  },
  {
    id: 'note-3',
    topic: 'Apex Programming Masterclass',
    subtopic: 'Triggers',
    date: '2025-05-20',
    questionContent: 'What are the best practices for writing efficient Apex triggers?',
    responseContent: 'Best practices for writing efficient Apex triggers include:\n\n1. Bulkify your code: Always write triggers to handle multiple records\n2. One trigger per object: Consolidate logic into a single trigger per object\n3. Delegate business logic: Move complex logic to handler classes\n4. Avoid SOQL queries inside loops: Query outside loops to avoid hitting governor limits\n5. Use context variables: Leverage Trigger.new, Trigger.old, etc. instead of additional queries\n6. Avoid recursive triggers: Implement static flags to prevent recursion\n7. Error handling: Use addError() method for field-specific errors\n8. Test coverage: Ensure at least 75% test coverage with bulk test data\n\nFollowing these practices helps maintain performance and avoid hitting Salesforce governor limits.',
    noteContent: 'For our project, we should use the trigger framework developed by the architecture team. Also remember to always check for recursion when updating the same object that triggered the execution.',
    tags: ['apex', 'development', 'performance'],
    isFavorite: true
  },
  {
    id: 'note-4',
    topic: 'Lightning Web Components',
    subtopic: 'Data Binding',
    date: '2025-05-12',
    questionContent: 'How does data binding work in Lightning Web Components?',
    responseContent: 'Data binding in Lightning Web Components works through a few key mechanisms:\n\n1. One-way data binding: Changes to JavaScript properties are reflected in the template automatically\n2. Reactive properties: Properties decorated with @track or using the newer reactive model\n3. Public properties: Properties decorated with @api can be set by parent components\n4. Event handling: Use event handlers to update values based on user interactions\n\nLWC uses a virtual DOM and efficient rendering to update only what changes. When a reactive property changes, the component rerenders. Unlike Aura components, LWC doesn\'t have two-way binding by default - you need to handle the events explicitly.',
    noteContent: 'When working with complex objects, remember that only the object reference is reactive by default. Use @track or immutable patterns (creating new object references) when dealing with nested properties that need to trigger rerenders.',
    tags: ['lwc', 'javascript', 'ui'],
    isFavorite: false
  },
  {
    id: 'note-5',
    topic: 'Flow Builder Expert',
    subtopic: 'Flow Performance',
    date: '2025-05-08',
    questionContent: 'How can I optimize the performance of complex flows?',
    responseContent: 'To optimize the performance of complex flows, follow these recommendations:\n\n1. Minimize the number of elements: Consolidate where possible\n2. Use Fast Field Updates: Before-save flows are faster than after-save\n3. Bulk process records: Configure collections properly to handle multiple records\n4. Avoid SOQL inside loops: Use Get Records elements before loops\n5. Cache results: Store query results in variables rather than repeated queries\n6. Use conditional logic: Skip unnecessary paths with decision elements\n7. Limit recursive flows: Avoid flows that might trigger themselves repeatedly\n8. Monitor debug logs: Identify bottlenecks in the execution\n\nImplementing these practices can significantly improve flow performance, especially for processes handling large data volumes.',
    noteContent: 'The biggest performance gain for our order processing flow came from switching to before-save flow for field updates and using a single "Get Records" element at the beginning rather than multiple queries throughout the flow.',
    tags: ['flow', 'automation', 'performance'],
    isFavorite: true
  }
];

const Notes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter notes based on search term and active tab
  const filteredNotes = MOCK_NOTES.filter(note => {
    const matchesSearch = 
      note.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subtopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.questionContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.responseContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.noteContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'favorites') return matchesSearch && note.isFavorite;
    
    // Filter by topic tab
    return matchesSearch && note.topic.toLowerCase().includes(activeTab.toLowerCase());
  });
  
  // Get unique topics for tabs
  const topics = Array.from(new Set(MOCK_NOTES.map(note => note.topic)));
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto pt-20 pb-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Learning Notes</h1>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              Export Notes
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Notes</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            {topics.map(topic => (
              <TabsTrigger key={topic} value={topic}>
                {topic}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-6">
            {filteredNotes.length === 0 ? (
              <div className="text-center p-12 border rounded-md bg-muted/20">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No notes found</h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? `No notes match your search for "${searchTerm}"`
                    : "You don't have any notes in this category yet"
                  }
                </p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <Card key={note.id} className="shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{note.topic}: {note.subtopic}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{note.date}</span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit Note</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 rounded-full text-amber-500"
                        >
                          {note.isFavorite ? <Star className="h-4 w-4 fill-amber-500" /> : <StarOff className="h-4 w-4" />}
                          <span className="sr-only">{note.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-accent/20 p-3 rounded-md">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-primary mt-1" />
                          <p className="font-medium">{note.questionContent}</p>
                        </div>
                        <div className="ml-6 text-sm text-muted-foreground">
                          {note.responseContent.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-2">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Edit2 className="h-4 w-4 text-primary" />
                          My Notes
                        </h4>
                        <div className="ml-6 border-l-2 border-primary/30 pl-3 text-sm">
                          {note.noteContent}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex items-center gap-2 pt-2 pb-4">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map(tag => (
                        <Badge 
                          key={tag}
                          variant="outline" 
                          className="text-xs bg-accent/30 hover:bg-accent cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notes;
