// routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const NoteRepository = require('../repositories/noteRepository');
const auth = require('../middleware/auth');

// Get all notes for a user
router.get('/', auth, async (req, res) => {
  try {
    const options = {
      tag: req.query.tag,
      search: req.query.search,
      limit: parseInt(req.query.limit) || 20,
      skip: (parseInt(req.query.page) - 1) * (parseInt(req.query.limit) || 20) || 0
    };
    
    const notes = await NoteRepository.getUserNotes(req.user.id, options);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, userComment, originalMessageId, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const note = await NoteRepository.createNote(
      req.user.id, 
      title, 
      content, 
      { userComment, originalMessageId, tags }
    );
    
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await NoteRepository.getNoteById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if the note belongs to the authenticated user
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this note' });
    }
    
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a note
router.patch('/:id', auth, async (req, res) => {
  try {
    // First check if the note exists and belongs to the user
    let note = await NoteRepository.getNoteById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }
    
    note = await NoteRepository.updateNote(req.params.id, req.body);
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    // First check if the note exists and belongs to the user
    const note = await NoteRepository.getNoteById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }
    
    await NoteRepository.deleteNote(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;