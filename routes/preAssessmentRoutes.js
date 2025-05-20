// routes/preAssessmentRoutes.js
const express = require('express');
const router = express.Router();
const PreAssessmentRepository = require('../repositories/preAssessmentRepository');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

/**
 * @route   GET /api/assessment/me
 * @desc    Get current user's pre-assessment
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const assessment = await PreAssessmentRepository.getUserPreAssessment(req.user.id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Pre-assessment not found' });
    }
    
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   POST /api/assessment/me
 * @desc    Save or update current user's pre-assessment
 * @access  Private
 */
router.post('/me', auth, async (req, res) => {
  try {
    const assessmentData = req.body;
    
    // Validate required fields
    if (!assessmentData.learningStyle) {
      return res.status(400).json({ message: 'Learning style is required' });
    }
    
    const assessment = await PreAssessmentRepository.savePreAssessment(
      req.user.id,
      assessmentData
    );
    
    res.json(assessment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   GET /api/assessment/questions
 * @desc    Get pre-assessment questions
 * @access  Public
 */
router.get('/questions', async (req, res) => {
  try {
    // In a real implementation, these would probably come from a database
    // For this example, we'll return a static set of questions
    const questions = [
      {
        id: 'learning-style-1',
        text: 'How do you prefer to learn new information?',
        type: 'single-choice',
        options: [
          { id: 'visual', text: 'By seeing diagrams, charts, or videos' },
          { id: 'auditory', text: 'By listening to explanations or discussions' },
          { id: 'reading', text: 'By reading text or articles' },
          { id: 'kinesthetic', text: 'By doing hands-on exercises or practical activities' }
        ]
      },
      {
        id: 'pace-preference',
        text: 'What pace do you prefer when learning new material?',
        type: 'single-choice',
        options: [
          { id: 'slow', text: 'Slow and thorough - I like to fully understand each concept before moving on' },
          { id: 'moderate', text: 'Moderate pace - balanced between thoroughness and progress' },
          { id: 'fast', text: 'Fast-paced - I prefer to cover a lot of ground quickly' },
          { id: 'variable', text: 'Variable - I like to speed through familiar concepts and slow down for new ones' }
        ]
      },
      {
        id: 'content-preference',
        text: 'Which types of content do you find most helpful? (Select all that apply)',
        type: 'multiple-choice',
        options: [
          { id: 'videos', text: 'Video tutorials or lectures' },
          { id: 'articles', text: 'Written articles or documentation' },
          { id: 'interactive-examples', text: 'Interactive examples or demos' },
          { id: 'case-studies', text: 'Case studies or real-world applications' },
          { id: 'code-samples', text: 'Code samples or examples' },
          { id: 'quizzes', text: 'Quizzes and assessments' },
          { id: 'discussion', text: 'Discussion or Q&A formats' }
        ]
      },
      {
        id: 'technical-level',
        text: 'How would you describe your current technical expertise in your field?',
        type: 'single-choice',
        options: [
          { id: 'beginner', text: 'Beginner - I am just starting out' },
          { id: 'intermediate', text: 'Intermediate - I have some experience but still learning' },
          { id: 'advanced', text: 'Advanced - I have substantial experience and knowledge' },
          { id: 'expert', text: 'Expert - I have deep expertise in my field' }
        ]
      },
      {
        id: 'goal-areas',
        text: 'What are your primary learning goals? (Select all that apply)',
        type: 'multiple-choice',
        options: [
          { id: 'tech-skills', text: 'Technical skills development' },
          { id: 'career-advancement', text: 'Career advancement or job change' },
          { id: 'problem-solving', text: 'Solving specific problems or challenges' },
          { id: 'certification', text: 'Preparing for certification or formal qualification' },
          { id: 'staying-current', text: 'Staying current with industry trends' },
          { id: 'personal-interest', text: 'Personal interest or curiosity' }
        ]
      }
    ];
    
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN ROUTES

/**
 * @route   GET /api/assessment/stats
 * @desc    Get pre-assessment statistics
 * @access  Admin
 */
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await PreAssessmentRepository.getAssessmentStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/assessment/user/:userId
 * @desc    Get a specific user's pre-assessment (admin only)
 * @access  Admin
 */
router.get('/user/:userId', adminAuth, async (req, res) => {
  try {
    const assessment = await PreAssessmentRepository.getUserPreAssessment(req.params.userId);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Pre-assessment not found' });
    }
    
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/assessment/learning-styles
 * @desc    Get distribution of learning styles
 * @access  Admin
 */
router.get('/learning-styles', adminAuth, async (req, res) => {
  try {
    const distribution = await PreAssessmentRepository.getLearningStyleDistribution();
    res.json(distribution);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;