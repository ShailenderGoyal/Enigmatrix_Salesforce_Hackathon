import express from 'express';

import {
  getUserPreAssessment,
  saveOrUpdatePreAssessment,
  getAssessmentStats,
  getLearningStyleDistribution,
  getUserAssessmentById
} from '../controllers/preassment.controller.js';

const router = express.Router();

// User Routes
router.get('/me',  getUserPreAssessment);
router.post('/me', saveOrUpdatePreAssessment);

// Static Questions (unchanged)
router.get('/questions', async (req, res) => {
  try {
    const questions = [/* same questions array as before */];

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Routes
router.get('/stats', getAssessmentStats);
router.get('/user/:userId',  getUserAssessmentById);
router.get('/learning-styles',  getLearningStyleDistribution);

export default router;
