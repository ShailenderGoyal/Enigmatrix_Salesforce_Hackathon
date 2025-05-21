import ChatSession from '../models/chatSession.model.js';
import ChatMessage from '../models/chatMessage.model.js';
import mongoose from 'mongoose';
import axios from 'axios';

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
    const {userId}=req.body;
    const session = new ChatSession({
      userId: userId,
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
    const {userId}=req.body;
    if (!session) return res.status(404).json({ message: 'Chat session not found' });
    if (session.userId.toString() !== userId) {
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
    const {userId}=req.body;
    const session = await ChatSession.findOne({
      _id: req.params.id,
      userId: userId
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
    
    const title=session.title;
    session.lastMessageAt = new Date();
    await session.save();
    
    console.log("user chat saved successfully");
    try
    {
      console.log(title);    
      const aireposnse=await axios.post(`http://localhost:8000/ai/res`, {
        prompt:`${content} with regard  to title ${title}`
      });
      const agentContent=aireposnse.data.ans;
      // console.log(agentContent);
      // console.log("here");
      const agentMessage = new ChatMessage({
        sessionId: session._id,
        role: 'assistant',
        content:agentContent,
        metadata
      });
  
      await agentMessage.save();
      return res.status(201).json({ans:aireposnse.data.ans});
      
    }
    catch(err)
    {
      return res.status(err.status || 500).json({msg:"error here",err});
    }
    

    // // --- Optional: handle assistant reply asynchronously ---
    // try {
    //   const aiReply = await generateAIResponse(content, session);

    //   const assistantMessage = new ChatMessage({
    //     sessionId: session._id,
    //     role: 'assistant',
    //     content: aiReply.content,
    //     metadata: aiReply.metadata
    //   });

    //   await assistantMessage.save();

    //   session.lastMessageAt = new Date();
    //   await session.save();
    // } catch (err) {
    //   console.error('AI response error:', err);

    //   await new ChatMessage({
    //     sessionId: session._id,
    //     role: 'assistant',
    //     content: 'Sorry, I encountered an error processing your request.',
    //     metadata: { error: true }
    //   }).save();
    // }

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCombinedMessageContent = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = await ChatMessage.find({ sessionId }).sort({ timestamp: 1 });

    if (!messages.length) {
      return res.status(404).json({ message: 'No messages found for this session.' });
    }

    const combinedContent = messages.map(msg => msg.content).join(' ');

    res.status(200).json({ sessionId, combinedContent });
  } catch (error) {
    console.error('Error fetching combined messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};