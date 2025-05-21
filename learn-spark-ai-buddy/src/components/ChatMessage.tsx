
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLearning, ChatMessage as ChatMessageType, useLearn } from '@/contexts/LearningContext';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Check, Save } from 'lucide-react';
import { addNote, generateTags } from '@/utils/clientNotesUtils';
import { toast } from 'sonner';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { updateNotes } = useLearn();
  const { user } = useAuth();
  const { currentModule, activeSubtopicId } = useLearning(); // Move this to the top level
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(message.notes || '');

  const handleSaveNote = () => {
    // Save to LearningContext for current session
    updateNotes(message.id, noteContent);
    
    // Save to localStorage for persistent storage
    if (message.sender === 'ai' && noteContent.trim()) {
      // Get current date as a formatted string
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      
      // Get the subtopic from the current module and active subtopic ID
      const subtopic = currentModule?.subtopics.find(s => s.id === activeSubtopicId);
      
      // Create tags from the message content
      const tags = generateTags(message.content);
      
      // Create a unique ID for the note
      const noteId = `note-${Date.now()}`;
      
      // Create the note object
      const newNote = {
        id: noteId,
        topic: currentModule?.title || 'General',
        subtopic: subtopic?.title || 'Uncategorized',
        date: currentDate,
        questionContent: message.content.includes('?') 
          ? message.content.split('?')[0] + '?' 
          : message.content.substring(0, 100) + '...',
        responseContent: message.content,
        noteContent: noteContent,
        tags: tags,
        isFavorite: false
      };
      
      // Add the note to localStorage
      addNote(newNote);
      toast.success('Note saved successfully!');
    }
    
    setIsEditing(false);
  };

  // Function to make URLs clickable
  const formatMessageContent = (content: string) => {
    // Simple regex to convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary underline break-all"
          >
            {part}
          </a>
        );
      }
      // Convert markdown-style bold to HTML
      const boldText = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      if (boldText !== part) {
        return <span key={index} dangerouslySetInnerHTML={{ __html: boldText }} />;
      }
      
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
        <div className="flex items-start mb-1">
          {message.sender === 'ai' && (
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/placeholder.svg" alt="AI Assistant" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          )}
          <div className={`rounded-lg p-3 ${
            message.sender === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary/20'
          }`}>
            <div className="whitespace-pre-wrap break-words">
              {formatMessageContent(message.content)}
            </div>
            <div className="text-xs opacity-70 mt-1 text-right">
              {format(new Date(message.timestamp), 'p')}
            </div>
          </div>
          {message.sender === 'user' && (
            <Avatar className="h-8 w-8 ml-2">
              <AvatarImage src={user?.photoURL} alt={user?.name || "User"} />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          )}
        </div>
        
        {message.sender === 'ai' && (
          <div className="ml-10 mt-1">
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  placeholder="Add your notes here..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveNote}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {message.notes ? (
                  <div
                    className="bg-muted p-2 rounded border text-sm mt-1 cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  >
                    <div className="font-semibold text-xs mb-1 text-muted-foreground">Your notes:</div>
                    {message.notes}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground"
                    onClick={() => setIsEditing(true)}
                  >
                    + Add notes
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
