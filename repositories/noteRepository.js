// repositories/noteRepository.js
const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

class NoteRepository {
  async createNote(userId, title, content, options = {}) {
    const notes = await getCollection('notes');
    
    const note = {
      userId: new ObjectId(userId),
      title: title,
      content: content,
      userComment: options.userComment || '',
      originalMessageId: options.originalMessageId ? new ObjectId(options.originalMessageId) : null,
      tags: options.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await notes.insertOne(note);
    return { ...note, _id: result.insertedId };
  }
  
  async getUserNotes(userId, options = {}) {
    const notes = await getCollection('notes');
    
    let query = { userId: new ObjectId(userId) };
    
    // Add tag filtering if provided
    if (options.tag) {
      query.tags = options.tag;
    }
    
    // Add text search if provided
    if (options.search) {
      query.$text = { $search: options.search };
    }
    
    const limit = options.limit || 20;
    const skip = options.skip || 0;
    
    return notes
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }
  
  async getNoteById(id) {
    const notes = await getCollection('notes');
    return notes.findOne({ _id: new ObjectId(id) });
  }
  
  async updateNote(id, updateData) {
    const notes = await getCollection('notes');
    
    const allowedUpdates = [
      'title', 
      'userComment', 
      'tags'
    ];
    
    const updates = {};
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedUpdates.includes(key)) {
        updates[key] = value;
      }
    }
    
    updates.updatedAt = new Date();
    
    await notes.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    
    return this.getNoteById(id);
  }
  
  async deleteNote(id) {
    const notes = await getCollection('notes');
    return notes.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = new NoteRepository();