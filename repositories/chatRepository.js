// chatRepository.js
const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

class ChatRepository {
  async createSession(userId, title, knowledgeBaseId = null) {
    const sessions = await getCollection('chatSessions');
    
    const session = {
      userId: new ObjectId(userId),
      title: title,
      knowledgeBaseId: knowledgeBaseId ? new ObjectId(knowledgeBaseId) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessageAt: new Date()
    };
    
    const result = await sessions.insertOne(session);
    return { ...session, _id: result.insertedId };
  }
  
  async addMessage(sessionId, role, content, metadata = {}) {
    // 1. Add the message to chatMessages collection
    const messages = await getCollection('chatMessages');
    
    const message = {
      sessionId: new ObjectId(sessionId),
      role: role, // 'user' or 'assistant'
      content: content,
      timestamp: new Date(),
      metadata: metadata,
      resources: []
    };
    
    const result = await messages.insertOne(message);
    
    // 2. Update the session's lastMessageAt timestamp
    const sessions = await getCollection('chatSessions');
    await sessions.updateOne(
      { _id: new ObjectId(sessionId) },
      { 
        $set: { 
          lastMessageAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    return { ...message, _id: result.insertedId };
  }
  
  async getSessionWithMessages(sessionId, limit = 50, before = null) {
    // 1. Get the session details
    const sessions = await getCollection('chatSessions');
    const session = await sessions.findOne({ _id: new ObjectId(sessionId) });
    
    if (!session) {
      return null;
    }
    
    // 2. Get the messages for this session with pagination
    const messages = await getCollection('chatMessages');
    
    let query = { sessionId: new ObjectId(sessionId) };
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }
    
    const chatMessages = await messages
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    // 3. Return combined object
    return {
      ...session,
      messages: chatMessages.reverse() // Return in chronological order
    };
  }
  
  async getUserSessions(userId, limit = 20, skip = 0) {
    const sessions = await getCollection('chatSessions');
    
    return sessions
      .find({ userId: new ObjectId(userId) })
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }
}

module.exports = new ChatRepository();