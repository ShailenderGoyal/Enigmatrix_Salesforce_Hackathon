import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Edit2, Calendar, Tag, BookOpen, MessageSquare, Star, StarOff, RefreshCw } from 'lucide-react';
import { readNotes, toggleFavorite, updateNote, Note as UserNote } from '@/utils/clientNotesUtils';
import mockNotes from '@/data/userNotes.json';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Notes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  
  // State for edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<UserNote | null>(null);
  const [editedNoteContent, setEditedNoteContent] = useState('');
  
  // Load notes from localStorage and combine with mock data
  useEffect(() => {
    // Get notes from localStorage
    const savedNotes = readNotes();
    
    // Combine with mock notes from JSON file
    const allUserNotes = [...savedNotes, ...mockNotes];
    
    // Remove any duplicates (by id)
    const uniqueNotes = allUserNotes.filter((note, index, self) => 
      index === self.findIndex(n => n.id === note.id)
    );
    
    setUserNotes(uniqueNotes);
    
    // For debugging
    console.log('Notes loaded:', uniqueNotes.length);
    
    // Function to reload notes when the window gets focus
    const handleFocus = () => {
      const refreshedNotes = readNotes();
      setUserNotes(refreshedNotes);
    };
    
    // Add event listener for focus events
    window.addEventListener('focus', handleFocus);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Get notes sorted by date (newest first)
  const allNotes = [...userNotes].sort((a, b) => {
    // Parse dates and compare them in reverse order
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  // Filter notes based on search, favorites and active tab
  const filteredNotes = allNotes.filter(note => {
    // First check if it matches the search term
    const matchesSearch = 
      searchTerm === '' || 
      note.questionContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.responseContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.noteContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Then check if it should be filtered by favorites
    const matchesFavorite = !showFavoritesOnly || note.isFavorite;
    
    // Finally check if it matches the active tab
    const matchesTab = 
      activeTab === 'all' || 
      note.topic.toLowerCase().includes(activeTab.toLowerCase());
      
    return matchesSearch && matchesFavorite && matchesTab;
  });

  // Get unique topics for tabs from both mock and user notes
  const topics = Array.from(new Set(allNotes.map(note => note.topic)));
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto pt-20 pb-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            My Notes
          </h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notes..."
                className="pl-8 w-[200px] sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className={`${showFavoritesOnly ? 'bg-amber-100 text-amber-700 border-amber-300' : ''}`}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              {showFavoritesOnly ? (
                <>
                  <Star className="mr-1 h-4 w-4 fill-amber-500" />
                  Favorites
                </>
              ) : (
                <>
                  <Star className="mr-1 h-4 w-4" />
                  Show Favorites
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const refreshedNotes = readNotes();
                setUserNotes(refreshedNotes);
                toast.success('Notes refreshed');
              }}
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all">All Notes</TabsTrigger>
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
                          onClick={() => {
                            // Open edit dialog with this note
                            setEditingNote(note);
                            setEditedNoteContent(note.noteContent);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit Note</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 rounded-full text-amber-500"
                          onClick={() => {
                            // Toggle favorite for any note
                            try {
                              // Use the toggleFavorite utility function
                              const updatedNotes = toggleFavorite(note.id);
                              
                              // Update the state
                              setUserNotes(prevNotes => {
                                return prevNotes.map(n => 
                                  n.id === note.id ? { ...n, isFavorite: !n.isFavorite } : n
                                );
                              });
                              
                              toast.success(`Note ${note.isFavorite ? 'removed from' : 'added to'} favorites`);
                            } catch (error) {
                              console.error('Error toggling favorite:', error);
                              toast.error('Error updating favorite status');
                            }
                          }}
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
      
      {/* Edit Note Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          
          {editingNote && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <h3 className="text-sm font-medium">Context:</h3>
                  <div className="bg-accent/20 p-3 rounded-md">
                    <p className="font-medium text-sm">{editingNote.questionContent}</p>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <h3 className="text-sm font-medium">Your Notes:</h3>
                  <Textarea 
                    value={editedNoteContent}
                    onChange={e => setEditedNoteContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    try {
                      // Update the note
                      const updatedNotes = updateNote(editingNote.id, {
                        noteContent: editedNoteContent
                      });
                      
                      // Update the state
                      setUserNotes(prevNotes => {
                        return prevNotes.map(note => 
                          note.id === editingNote.id ? 
                            { ...note, noteContent: editedNoteContent } : note
                        );
                      });
                      
                      // Close dialog
                      setIsEditDialogOpen(false);
                      toast.success('Note updated successfully');
                    } catch (error) {
                      console.error('Error updating note:', error);
                      toast.error('Error updating note');
                    }
                  }}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notes;
