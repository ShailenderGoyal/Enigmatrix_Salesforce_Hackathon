import express from 'express';
import { ensureAuthenticated } from "../middlewares/authEnsure.js";

import {
  handleGetSessions,
  handleCreateSession,
  handleGetSessionWithMessages,
  handleAddMessage
} from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/sessions', ensureAuthenticated, handleGetSessions);
router.post('/sessions', ensureAuthenticated, handleCreateSession);
router.get('/sessions/:id', ensureAuthenticated, handleGetSessionWithMessages);
router.post('/sessions/:id/messages', ensureAuthenticated, handleAddMessage);

export default router;
