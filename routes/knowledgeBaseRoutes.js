// routes/knowledgeBaseRoutes.js
const express = require('express');
const router = express.Router();
const KnowledgeBaseRepository = require('../repositories/knowledgeBaseRepository');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

/**
 * @route   GET /api/kb
 * @desc    Get all knowledge bases (with optional filtering)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const options = {
      publishedOnly: req.query.published === 'true',
      expertiseLevel: req.query.level,
      tag: req.query.tag,
      search: req.query.search,
      limit: parseInt(req.query.limit) || 20,
      skip: (parseInt(req.query.page) - 1) * (parseInt(req.query.limit) || 20) || 0
    };
    
    const knowledgeBases = await KnowledgeBaseRepository.getKnowledgeBases(options);
    res.json(knowledgeBases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/kb/:id
 * @desc    Get a specific knowledge base
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const knowledgeBase = await KnowledgeBaseRepository.getKnowledgeBaseById(req.params.id);
    
    if (!knowledgeBase) {
      return res.status(404).json({ message: 'Knowledge base not found' });
    }
    
    // If knowledge base is not published, only show to admins
    if (!knowledgeBase.isPublished) {
      // Check if user is authenticated and an admin
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(404).json({ message: 'Knowledge base not found' });
      }
      
      // Verify token and check admin status
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userRepository.findById(decoded.id);
        
        if (!user || !user.isAdmin) {
          return res.status(404).json({ message: 'Knowledge base not found' });
        }
      } catch (err) {
        return res.status(404).json({ message: 'Knowledge base not found' });
      }
    }
    
    res.json(knowledgeBase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/kb/tags/all
 * @desc    Get all unique tags from knowledge bases
 * @access  Public
 */
router.get('/tags/all', async (req, res) => {
  try {
    const tags = await KnowledgeBaseRepository.getAllTags();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/kb/topics/:id
 * @desc    Get a specific topic from a knowledge base
 * @access  Public
 */
router.get('/topics/:id/:topicIndex', async (req, res) => {
  try {
    const knowledgeBase = await KnowledgeBaseRepository.getKnowledgeBaseById(req.params.id);
    
    if (!knowledgeBase) {
      return res.status(404).json({ message: 'Knowledge base not found' });
    }
    
    // If knowledge base is not published, only show to admins
    if (!knowledgeBase.isPublished) {
      // Check if user is authenticated and an admin (same as above)
      // ...
    }
    
    const topicIndex = parseInt(req.params.topicIndex);
    
    if (isNaN(topicIndex) || topicIndex < 0 || topicIndex >= knowledgeBase.topics.length) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    const topic = knowledgeBase.topics[topicIndex];
    
    res.json({
      ...topic,
      knowledgeBaseId: knowledgeBase._id,
      knowledgeBaseTitle: knowledgeBase.title
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN ROUTES

/**
 * @route   POST /api/kb
 * @desc    Create a new knowledge base
 * @access  Admin
 */
router.post('/', adminAuth, async (req, res) => {
  try {
    const knowledgeBaseData = {
      title: req.body.title,
      description: req.body.description,
      topics: req.body.topics || [],
      tags: req.body.tags || [],
      expertiseLevel: req.body.expertiseLevel,
      estimatedDuration: parseInt(req.body.estimatedDuration) || 0,
      isPublished: req.body.isPublished || false
    };
    
    if (!knowledgeBaseData.title || !knowledgeBaseData.description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const knowledgeBase = await KnowledgeBaseRepository.createKnowledgeBase(knowledgeBaseData);
    res.status(201).json(knowledgeBase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   PATCH /api/kb/:id
 * @desc    Update a knowledge base
 * @access  Admin
 */
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    // Check if knowledge base exists
    const knowledgeBase = await KnowledgeBaseRepository.getKnowledgeBaseById(req.params.id);
    
    if (!knowledgeBase) {
      return res.status(404).json({ message: 'Knowledge base not found' });
    }
    
    const updatedKnowledgeBase = await KnowledgeBaseRepository.updateKnowledgeBase(
      req.params.id, 
      req.body
    );
    
    res.json(updatedKnowledgeBase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   POST /api/kb/:id/topics
 * @desc    Add a topic to a knowledge base
 * @access  Admin
 */
router.post('/:id/topics', adminAuth, async (req, res) => {
  try {
    // Check if knowledge base exists
    const knowledgeBase = await KnowledgeBaseRepository.getKnowledgeBaseById(req.params.id);
    
    if (!knowledgeBase) {
      return res.status(404).json({ message: 'Knowledge base not found' });
    }
    
    const topicData = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      order: req.body.order
    };
    
    if (!topicData.title || !topicData.content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const updatedKnowledgeBase = await KnowledgeBaseRepository.addTopicToKnowledgeBase(
      req.params.id,
      topicData
    );
    
    res.json(updatedKnowledgeBase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   PATCH /api/kb/:id/topics/:topicIndex
 * @desc    Update a topic in a knowledge base
 * @access  Admin
 */
router.patch('/:id/topics/:topicIndex', adminAuth, async (req, res) => {
  try {
    // Check if knowledge base exists
    const knowledgeBase = await KnowledgeBaseRepository.getKnowledgeBaseById(req.params.id);
    
    if (!knowledgeBase) {
      return res.status(404).json({ message: 'Knowledge base not found' });
    }
    
    const topicIndex = parseInt(req.params.topicIndex);
    
    if (isNaN(topicIndex) || topicIndex < 0 || topicIndex >= knowledgeBase.topics.length) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    const updatedKnowledgeBase = await KnowledgeBaseRepository.updateTopic(
      req.params.id,
      topicIndex,
      req.body
    );
    
    res.json(updatedKnowledgeBase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   DELETE /api/kb/:id/topics/:topicIndex
 * @desc    Remove a topic from a knowledge base
 * @access  Admin
 */
router.delete('/:id/topics/:topicIndex', adminAuth, async (req, res) => {
  try {
    // Check if knowledge base exists
    const knowledgeBase = await KnowledgeBaseRepository.getKnowledgeBaseById(req.params.id);
    
    if (!knowledgeBase) {
      return res.status(404).json({ message: 'Knowledge base not found' });
    }
    
    const topicIndex = parseInt(req.params.topicIndex);
    
    if (isNaN(topicIndex) || topicIndex < 0 || topicIndex >= knowledgeBase.topics.length) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    const updatedKnowledgeBase = await KnowledgeBaseRepository.removeTopic(
      req.params.id,
      topicIndex
    );
    
    res.json(updatedKnowledgeBase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   DELETE /api/kb/:id
 * @desc    Delete a knowledge base
 * @access  Admin
 */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    // Check if knowledge base exists
    const knowledgeBase = await KnowledgeBaseRepository.getKnowledgeBaseById(req.params.id);
    
    if (!knowledgeBase) {
      return res.status(404).json({ message: 'Knowledge base not found' });
    }
    
    await KnowledgeBaseRepository.deleteKnowledgeBase(req.params.id);
    
    res.json({ message: 'Knowledge base deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/kb/stats/usage
 * @desc    Get knowledge base usage statistics
 * @access  Admin
 */
router.get('/stats/usage', adminAuth, async (req, res) => {
  try {
    const stats = await KnowledgeBaseRepository.getUsageStatistics();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   POST /api/kb/:id/publish
 * @desc    Publish a knowledge base
 * @access  Admin
 */
router.post('/:id/publish', adminAuth, async (req, res) => {
  try {
    // Check if knowledge base exists
    const knowledgeBase = await KnowledgeBaseRepository.getKnowledgeBaseById(req.params.id);
    
    if (!knowledgeBase) {
      return res.status(404).json({ message: 'Knowledge base not found' });
    }
    
    const updatedKnowledgeBase = await KnowledgeBaseRepository.updateKnowledgeBase(
      req.params.id,
      { isPublished: true }
    );
    
    res.json(updatedKnowledgeBase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   POST /api/kb/:id/unpublish
 * @desc    Unpublish a knowledge base
 * @access  Admin
 */
router.post('/:id/unpublish', adminAuth, async (req, res) => {
  try {
    // Check if knowledge base exists
    const knowledgeBase = await KnowledgeBaseRepository.getKnowledgeBaseById(req.params.id);
    
    if (!knowledgeBase) {
      return res.status(404).json({ message: 'Knowledge base not found' });
    }
    
    const updatedKnowledgeBase = await KnowledgeBaseRepository.updateKnowledgeBase(
      req.params.id,
      { isPublished: false }
    );
    
    res.json(updatedKnowledgeBase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;