import fs from 'fs';
import path from 'path';

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

const notesFilePath = path.join(process.cwd(), 'src/data/userNotes.json');

// Read notes from JSON file
export const readNotes = (): Note[] => {
  try {
    // For client-side use, we need to handle this differently
    // This will be used in our API endpoint
    const data = fs.readFileSync(notesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading notes file:', error);
    return [];
  }
};

// Write notes to JSON file
export const writeNotes = (notes: Note[]): void => {
  try {
    // For client-side use, we need to handle this differently
    // This will be used in our API endpoint
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
  } catch (error) {
    console.error('Error writing to notes file:', error);
  }
};

// Add a new note
export const addNote = (note: Note): Note[] => {
  const notes = readNotes();
  notes.push(note);
  writeNotes(notes);
  return notes;
};
