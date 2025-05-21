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
