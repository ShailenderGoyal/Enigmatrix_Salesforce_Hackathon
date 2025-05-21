// Define the note structure
export interface Note {
  id: string;
  topic: string;
  subtopic: string;
  date: string;
  questionContent: string;
  responseContent: string;
  noteContent: string;
  tags: string[];
  isFavorite: boolean;
}

// LocalStorage key for notes
const NOTES_STORAGE_KEY = 'userNotes';

// Mock data for initial notes
export const MOCK_NOTES: Note[] = [
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
    noteContent: 'In my project, I need to remember that @track is no longer needed for objects and arrays since the Lightning Web Components engine automatically tracks changes to the properties of objects.',
    tags: ['lwc', 'javascript', 'ui'],
    isFavorite: false
  },
  {
    id: 'note-5',
    topic: 'Flow Builder Expert',
    subtopic: 'Flow Performance',
    date: '2025-05-08',
    questionContent: 'How can I optimize the performance of complex flows?',
    responseContent: 'To optimize the performance of complex flows in Salesforce:\n\n1. Minimize DML operations: Collect records and perform bulk operations\n2. Avoid loops within loops: Restructure to prevent nested iterations\n3. Use Fast Field Updates when possible: They don\'t trigger process builders or flows\n4. Collection filters: Filter collections in the flow instead of using SOQL WHERE clauses\n5. Careful with recursion: Avoid unintentional recursive flow triggers\n6. Record-triggered flow consolidation: Combine similar record-triggered flows\n7. Consider cache: Use Platform Cache for frequently accessed data\n8. Transaction control: Be mindful of the 150 DML statements per transaction limit\n\nPeriodically review flow usage and execution time in Debug Logs and Performance Analysis to identify bottlenecks.',
    noteContent: 'The biggest performance improvement for our large flows came from removing duplicate SOQL queries and consolidating DML operations. We reduced execution time by 40% by following these principles.',
    tags: ['flow', 'automation', 'performance'],
    isFavorite: true
  }
];

// Read notes from localStorage
export const readNotes = (): Note[] => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return [];
    
    const notesString = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!notesString) return [];
    return JSON.parse(notesString);
  } catch (error) {
    console.error('Error reading notes from localStorage:', error);
    return [];
  }
};

// Write notes to localStorage
export const writeNotes = (notes: Note[]): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error writing notes to localStorage:', error);
  }
};

// Add a new note
export const addNote = (note: Note): Note[] => {
  const notes = readNotes();
  
  // Check if a note with the same content already exists to avoid duplicates
  const noteExists = notes.some(n => n.questionContent === note.questionContent && n.noteContent === note.noteContent);
  
  if (!noteExists) {
    notes.push(note);
    writeNotes(notes);
  }
  
  return notes;
};

// Toggle favorite status for a note
export const toggleFavorite = (noteId: string): Note[] => {
  const notes = readNotes();
  const updatedNotes = notes.map(note => 
    note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note
  );
  
  writeNotes(updatedNotes);
  return updatedNotes;
};

// Update an existing note
export const updateNote = (noteId: string, updatedNote: Partial<Note>): Note[] => {
  const notes = readNotes();
  const updatedNotes = notes.map(note => 
    note.id === noteId ? { ...note, ...updatedNote } : note
  );
  
  writeNotes(updatedNotes);
  return updatedNotes;
};

// Generate tags from the content
export const generateTags = (content: string): string[] => {
  // A simple algorithm to extract potential keywords from the content
  const words = content.toLowerCase().split(/\s+/);
  const significantWords = words.filter(word => 
    word.length > 5 && 
    !['about', 'because', 'should', 'these', 'their', 'there', 'which', 'would'].includes(word)
  );
  
  // Get unique words and limit to 3 tags
  const uniqueWords = [...new Set(significantWords)];
  return uniqueWords.slice(0, 3);
};

// Initialize localStorage with mock data if it doesn't already have notes
export const initializeNotesStorage = (): Note[] => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return [];
    
    const existingNotes = readNotes();
    
    // If there are no existing notes, add the mock notes
    if (existingNotes.length === 0) {
      console.log('No existing notes found, initializing with mock data');
      writeNotes(MOCK_NOTES);
      return MOCK_NOTES;
    }
    
    return existingNotes;
  } catch (error) {
    console.error('Error initializing notes storage:', error);
    return [];
  }
};
