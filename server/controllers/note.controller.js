import Note from '../models/note.model.js';
import mongoose from 'mongoose';

export const handleGetNotes = async (req, res) => {
  try {
    const { tag, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { userId: req.user.id };

    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search };

    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleCreateNote = async (req, res) => {
  try {
    const { title, content, userComment, originalMessageId, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = new Note({
      userId: req.user.id,
      title,
      content,
      userComment,
      originalMessageId: originalMessageId ? new mongoose.Types.ObjectId(originalMessageId) : null,
      tags: tags || []
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const handleGetNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this note' });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleUpdateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    const allowedFields = ['title', 'userComment', 'tags'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        note[field] = req.body[field];
      }
    });

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const handleDeleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
