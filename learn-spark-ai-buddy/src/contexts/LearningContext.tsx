import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import axios from "axios";

export interface Module {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  subtopics: Subtopic[];
}

export interface Subtopic {
  id: string;
  title: string;
  completed: boolean;
  concepts: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  notes?: string;
  moduleId?: string;
  subtopicId?: string;
}

export interface UserPreferences {
  learningStyle: string;
  interests: string[];
  goals: string[];
  experience: string;
}

interface LearningContextType {
  modules: Module[];
  currentModule: Module | null;
  messages: ChatMessage[];
  preferences: UserPreferences | null;
  isGeneratingRoadmap: boolean;
  activeSubtopicId: string | null;
  setCurrentModule: (moduleId: string | null) => void;
  setActiveSubtopicId: (subtopicId: string | null) => void;
  markSubtopicComplete: (moduleId: string, subtopicId: string, completed: boolean) => void;
  sendMessage: (content: string, moduleId?: string, subtopicId?: string, sender?: 'user' | 'ai') => Promise<void>;
  updateNotes: (messageId: string, notes: string) => void;
  setPreferences: (prefs: UserPreferences) => void;
  generateRoadmap: (topic: string) => Promise<void>;
  summarizeConversation: () => Promise<string>;
  reviseSubtopic: (subtopicId: string) => Promise<void>;
}

// Mock Data 
const MOCK_MODULES: Module[] = [
  {
    id: 'module-1',
    title: 'Introduction to AI',
    description: 'Learn the basics of Artificial Intelligence',
    progress: 25,
    subtopics: [
      {
        id: 'subtopic-1-1',
        title: 'What is AI?',
        completed: true,
        concepts: ['Definition of AI', 'History of AI', 'AI vs Machine Learning'],
      },
      {
        id: 'subtopic-1-2',
        title: 'Types of AI',
        completed: false,
        concepts: ['Narrow AI', 'General AI', 'Super AI', 'AI Applications'],
      },
      {
        id: 'subtopic-1-3',
        title: 'Ethics in AI',
        completed: false,
        concepts: ['Ethical Considerations', 'Bias in AI', 'AI Safety'],
      },
    ],
  },
  {
    id: 'module-2',
    title: 'Machine Learning Fundamentals',
    description: 'Explore the core concepts of machine learning',
    progress: 0,
    subtopics: [
      {
        id: 'subtopic-2-1',
        title: 'Supervised Learning',
        completed: false,
        concepts: ['Classification', 'Regression', 'Training Data'],
      },
      {
        id: 'subtopic-2-2',
        title: 'Unsupervised Learning',
        completed: false,
        concepts: ['Clustering', 'Association', 'Dimensionality Reduction'],
      },
    ],
  },
];

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    content: 'Hello! I\'m your AI learning assistant. What would you like to learn today?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 60000),
  }
];

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModuleState] = useState<Module | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [preferences, setPreferencesState] = useState<UserPreferences | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [activeSubtopicId, setActiveSubtopicId] = useState<string | null>(null);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      // In a real app, fetch from API
      setModules(MOCK_MODULES);
      setMessages(MOCK_MESSAGES);
    } else {
      // Clear data when user logs out
      setModules([]);
      setMessages([]);
      setCurrentModuleState(null);
      setPreferencesState(null);
    }
  }, [user]);

  const setCurrentModule = (moduleId: string | null) => {
    if (!moduleId) {
      setCurrentModuleState(null);
      return;
    }
    
    const module = modules.find(m => m.id === moduleId) || null;
    setCurrentModuleState(module);
    
    // Set first subtopic as active if none is set
    if (module && (!activeSubtopicId || !module.subtopics.find(s => s.id === activeSubtopicId))) {
      setActiveSubtopicId(module.subtopics.length > 0 ? module.subtopics[0].id : null);
    }
  };

  const markSubtopicComplete = (moduleId: string, subtopicId: string, completed: boolean) => {
    setModules(prevModules => {
      return prevModules.map(module => {
        if (module.id !== moduleId) return module;
        
        // Update subtopic
        const updatedSubtopics = module.subtopics.map(subtopic => {
          if (subtopic.id !== subtopicId) return subtopic;
          return { ...subtopic, completed };
        });
        
        // Calculate new progress
        const totalSubtopics = updatedSubtopics.length;
        const completedSubtopics = updatedSubtopics.filter(s => s.completed).length;
        const progress = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
        
        return { ...module, subtopics: updatedSubtopics, progress };
      });
    });
  };

  const sendMessage = async (content: string, moduleId?: string, subtopicId?: string, sender: 'user' | 'ai' = 'user') => {
    // Add message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${sender}`,
      content,
      sender,
      timestamp: new Date(),
      moduleId,
      subtopicId,
    };
    
    setMessages(prev => [...prev, newMessage]);

    // If it's a user message, generate AI response
    if (sender === 'user') {
      // Mock AI response with delay
      setTimeout(async () => {
        // Generate AI response based on the context
        let responseContent = '';
        let res= await axios.post('http://localhost:8000/api/chat/sessions/682c5fd239ceff8e75aed3e5/messages', {
    content:content,
    userId:"682c56f24a0b3f3954f1e737"
        }, {
      headers: {
        'Content-Type': 'application/json',
        // Include auth token if required:
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiX2lkIjoiNjgyYzU2ZjI0YTBiM2YzOTU0ZjFlNzM3IiwiaWF0IjoxNzQ3NzM3OTEzLCJleHAiOjE3NDc3NTU5MTN9.7EvL0l5jCzwi2347WP4mEDKkoeNh_MEIWdhcTIy65sQ`
      }
    });
    responseContent=res.data.ans;    
    console.log(res);

        
        if (content.toLowerCase().includes('summarize') || content.startsWith('[SUMMARY]')) {
          responseContent = 'Here\'s a summary of our discussion: We covered the key concepts of this topic including definitions, applications, and practical examples. The most important points were about how these concepts relate to real-world scenarios.';
        } 
        else if (content.toLowerCase().includes('what is ai')) {
          responseContent = 'Artificial Intelligence (AI) refers to systems that can perform tasks that typically require human intelligence. These include tasks like visual perception, speech recognition, decision-making, and language translation. AI systems learn from data and improve over time.';
        } 
        else if (content.toLowerCase().includes('types of ai')) {
          responseContent = 'There are generally three types of AI:\n\n1. **Narrow AI**: Systems designed for specific tasks (like Siri or self-driving cars).\n\n2. **General AI**: Systems with human-level intelligence across a wide range of tasks (still theoretical).\n\n3. **Super AI**: Systems that surpass human intelligence (purely hypothetical at this point).';
        }
        else if (content.toLowerCase().includes('analyzing image') || content.toLowerCase().includes('analyzing document')) {
          responseContent = 'I\'ve analyzed the file you uploaded. It appears to contain information about ' + (content.includes('image') ? 'visual elements related to technology or learning concepts' : 'educational content covering multiple topics') + '. What specific questions do you have about it?';
        } 
        else if (content.toLowerCase().includes('answer questions about the document')) {
          responseContent = 'I\'m ready to answer questions about the document you\'ve uploaded. What would you like to know? You can ask about specific sections, concepts, or request a summary of the main points.';
        }
        
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          content: responseContent,
          sender: 'ai',
          timestamp: new Date(),
          moduleId,
          subtopicId,
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }, 1500);
    }
  };

  const updateNotes = (messageId: string, notes: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId ? { ...message, notes } : message
      )
    );
  };

  const setPreferences = (prefs: UserPreferences) => {
    setPreferencesState(prefs);
  };

  const generateRoadmap = async (topic: string) => {
    setIsGeneratingRoadmap(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - in a real app, this would come from the Gemini API
      const newModules: Module[] = [
        {
          id: `module-${Date.now()}-1`,
          title: `Introduction to ${topic}`,
          description: `Learn the fundamentals of ${topic}`,
          progress: 0,
          subtopics: [
            {
              id: `subtopic-${Date.now()}-1-1`,
              title: `What is ${topic}?`,
              completed: false,
              concepts: [`Definition of ${topic}`, `History of ${topic}`, `Core principles`],
            },
            {
              id: `subtopic-${Date.now()}-1-2`,
              title: `Key Concepts in ${topic}`,
              completed: false,
              concepts: [`Fundamental theories`, `Basic terminology`, `Common applications`],
            },
          ],
        },
        {
          id: `module-${Date.now()}-2`,
          title: `Advanced ${topic}`,
          description: `Deep dive into ${topic} applications and techniques`,
          progress: 0,
          subtopics: [
            {
              id: `subtopic-${Date.now()}-2-1`,
              title: `${topic} in Practice`,
              completed: false,
              concepts: [`Real-world examples`, `Case studies`, `Implementation strategies`],
            },
            {
              id: `subtopic-${Date.now()}-2-2`,
              title: `${topic} Tools and Technologies`,
              completed: false,
              concepts: [`Popular frameworks`, `Essential tools`, `Technology stack`],
            },
          ],
        },
      ];
      
      setModules(newModules);
      setCurrentModuleState(newModules[0]);
      setActiveSubtopicId(newModules[0].subtopics[0].id);
      
      // Add system message about new roadmap
      const systemMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        content: `I've created a personalized learning roadmap for ${topic}. Let's start with "What is ${topic}?" Would you like me to introduce this topic?`,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, systemMessage]);
      
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const summarizeConversation = async (): Promise<string> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock implementation
    const relevantMessages = activeSubtopicId 
      ? messages.filter(m => m.subtopicId === activeSubtopicId)
      : messages.slice(-10);
    
    if (relevantMessages.length <= 1) {
      return "Not enough conversation to summarize yet.";
    }
    
    // Mock summary - in a real app, this would use Gemini or similar
    return "In this conversation, we discussed the fundamental concepts of AI, including its definition, history, and key differences from machine learning. We also covered types of AI systems and their applications in modern technology.";
  };

  const reviseSubtopic = async (subtopicId: string): Promise<void> => {
    const subtopic = modules
      .flatMap(m => m.subtopics)
      .find(s => s.id === subtopicId);
    
    if (!subtopic) return;
    
    // Create a revision message
    const revisionPrompt = `Let's revise the key points about "${subtopic.title}":`;
    
    await sendMessage(revisionPrompt, currentModule?.id, subtopicId);
    
    // Mock AI sending concept-based revision messages
    setTimeout(() => {
      const conceptPrompts = subtopic.concepts.map(concept => {
        return `**${concept}**: Here's a revision of this concept with key points and examples.`;
      });
      
      // Send concept revisions with delays between them
      conceptPrompts.forEach((prompt, index) => {
        setTimeout(() => {
          sendMessage(prompt, currentModule?.id, subtopicId, 'ai');
        }, (index + 1) * 2000);
      });
    }, 2000);
  };

  return (
    <LearningContext.Provider
      value={{
        modules,
        currentModule,
        messages,
        preferences,
        isGeneratingRoadmap,
        activeSubtopicId,
        setCurrentModule,
        setActiveSubtopicId,
        markSubtopicComplete,
        sendMessage,
        updateNotes,
        setPreferences,
        generateRoadmap,
        summarizeConversation,
        reviseSubtopic,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
