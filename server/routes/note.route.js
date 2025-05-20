import express from 'express';
import { ensureAuthenticated } from "../middlewares/authEnsure.js";
import {
  handleGetNotes,
  handleCreateNote,
  handleGetNoteById,
  handleUpdateNote,
  handleDeleteNote
} from '../controllers/note.controller.js';

const router = express.Router();

router.get('/', ensureAuthenticated, handleGetNotes);
router.post('/', ensureAuthenticated, handleCreateNote);
router.get('/:id', ensureAuthenticated, handleGetNoteById);
router.patch('/:id', ensureAuthenticated, handleUpdateNote);
router.delete('/:id', ensureAuthenticated, handleDeleteNote);

export default router;
