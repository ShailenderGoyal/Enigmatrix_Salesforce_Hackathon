// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const ChatRepository = require('../repositories/chatRepository');
const auth = require('../middleware/auth');

// Get all chat sessions for a user
router.get('/sessions', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const sessions = await ChatRepository.getUserSessions(req.user.id, limit, skip);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new chat session
router.post('/sessions', auth, async (req, res) => {
  try {
    const { title, knowledgeBaseId } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const session = await ChatRepository.createSession(
      req.user.id, 
      title,
      knowledgeBaseId
    );
    
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific chat session with messages
router.get('/sessions/:id', auth, async (req, res) => {
  try {
    const before = req.query.before;
    const limit = parseInt(req.query.limit) || 50;
    
    const session = await ChatRepository.getSessionWithMessages(
      req.params.id, 
      limit,
      before
    );
    
    if (!session) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    // Check if the session belongs to the authenticated user
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this session' });
    }
    
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a message to a chat session
router.post('/sessions/:id/messages', auth, async (req, res) => {
  try {
    const { content, metadata } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    // First check if the session exists and belongs to the user
    const sessions = await getCollection('chatSessions');
    const session = await sessions.findOne({ 
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user.id)
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Chat session not found or not authorized' });
    }
    
    const message = await ChatRepository.addMessage(
      req.params.id,
      'user', // This route is for user messages
      content,
      metadata || {}
    );
    
    res.status(201).json(message);
    
    // Then asynchronously process the message with AI and add the response
    // This would typically be handled by a message queue in production
    try {
      // This is where you'd call your AI service
      const aiResponse = await generateAIResponse(content, session);
      
      await ChatRepository.addMessage(
        req.params.id,
        'assistant',
        aiResponse.content,
        aiResponse.metadata || {}
      );
      
      // You might use WebSockets here to notify the client of the new message
    } catch (aiError) {
      console.error('Error generating AI response:', aiError);
      // Handle AI service failure
      await ChatRepository.addMessage(
        req.params.id,
        'assistant',
        'Sorry, I encountered an error processing your request.',
        { error: true }
      );
    }
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;