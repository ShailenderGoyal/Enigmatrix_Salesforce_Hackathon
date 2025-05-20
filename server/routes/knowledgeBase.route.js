import express from 'express';
import {
  handleGetKnowledgeBases,
  handleCreateKnowledgeBase,
  handleGetKnowledgeBaseById,
  handleUpdateKnowledgeBase,
  handleDeleteKnowledgeBase
} from '../controllers/knowledgeBase.controller.js';

const router = express.Router();

// Public
router.get('/', handleGetKnowledgeBases);
router.get('/:id', handleGetKnowledgeBaseById);

// Admin
router.post('/',handleCreateKnowledgeBase);
router.patch('/:id',handleUpdateKnowledgeBase);
router.delete('/:id',handleDeleteKnowledgeBase);

export default router;
