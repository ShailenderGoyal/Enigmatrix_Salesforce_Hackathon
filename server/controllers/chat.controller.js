import ChatSession from '../models/chatSession.model.js';
import ChatMessage from '../models/chatMessage.model.js';
import mongoose from 'mongoose';

// Replace this with your actual AI function
const generateAIResponse = async (userMessage, session) => {
  return {
    content: `Echo: ${userMessage}`, // placeholder
    metadata: {}
  };
};

export const handleGetSessions = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const sessions = await ChatSession.find({ userId: req.user.id })
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleCreateSession = async (req, res) => {
  try {
    const { title, knowledgeBaseId } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const session = new ChatSession({
      userId: req.user.id,
      title,
      knowledgeBaseId: knowledgeBaseId ? new mongoose.Types.ObjectId(knowledgeBaseId) : null
    });

    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const handleGetSessionWithMessages = async (req, res) => {
  try {
    const session = await ChatSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Chat session not found' });
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this session' });
    }

    const { before, limit = 50 } = req.query;
    const query = { sessionId: session._id };
    if (before) query.timestamp = { $lt: new Date(before) };

    const messages = await ChatMessage.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      ...session.toObject(),
      messages: messages.reverse()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleAddMessage = async (req, res) => {
  try {
    const { content, metadata } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const session = await ChatSession.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!session) {
      return res.status(404).json({ message: 'Chat session not found or not authorized' });
    }

    const userMessage = new ChatMessage({
      sessionId: session._id,
      role: 'user',
      content,
      metadata
    });

    await userMessage.save();

    session.lastMessageAt = new Date();
    await session.save();

    res.status(201).json(userMessage);

    // --- Optional: handle assistant reply asynchronously ---
    try {
      const aiReply = await generateAIResponse(content, session);

      const assistantMessage = new ChatMessage({
        sessionId: session._id,
        role: 'assistant',
        content: aiReply.content,
        metadata: aiReply.metadata
      });

      await assistantMessage.save();

      session.lastMessageAt = new Date();
      await session.save();
    } catch (err) {
      console.error('AI response error:', err);

      await new ChatMessage({
        sessionId: session._id,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        metadata: { error: true }
      }).save();
    }

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
