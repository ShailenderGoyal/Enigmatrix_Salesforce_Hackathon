// repositories/knowledgeBaseRepository.js
const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

class KnowledgeBaseRepository {
  async createKnowledgeBase(knowledgeBaseData) {
    const knowledgeBases = await getCollection('knowledgeBases');
    
    const knowledgeBase = {
      ...knowledgeBaseData,
      topics: knowledgeBaseData.topics || [],
      tags: knowledgeBaseData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: knowledgeBaseData.isPublished || false
    };
    
    const result = await knowledgeBases.insertOne(knowledgeBase);
    return { ...knowledgeBase, _id: result.insertedId };
  }
  
  async getKnowledgeBases(options = {}) {
    const knowledgeBases = await getCollection('knowledgeBases');
    
    let query = {};
    
    // Filter by published status if specified
    if (options.publishedOnly) {
      query.isPublished = true;
    }
    
    // Filter by expertise level if specified
    if (options.expertiseLevel) {
      query.expertiseLevel = options.expertiseLevel;
    }
    
    // Filter by tags if specified
    if (options.tag) {
      query.tags = options.tag;
    }
    
    // Add text search if specified
    if (options.search) {
      query.$text = { $search: options.search };
    }
    
    const limit = options.limit || 20;
    const skip = options.skip || 0;
    
    return knowledgeBases
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }
  
  async getKnowledgeBaseById(id) {
    const knowledgeBases = await getCollection('knowledgeBases');
    return knowledgeBases.findOne({ _id: new ObjectId(id) });
  }
  
  async updateKnowledgeBase(id, updateData) {
    const knowledgeBases = await getCollection('knowledgeBases');
    
    const allowedUpdates = [
      'title', 
      'description', 
      'topics', 
      'tags', 
      'expertiseLevel', 
      'estimatedDuration',
      'isPublished'
    ];
    
    const updates = {};
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedUpdates.includes(key)) {
        updates[key] = value;
      }
    }
    
    updates.updatedAt = new Date();
    
    await knowledgeBases.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    
    return this.getKnowledgeBaseById(id);
  }
  
  async addTopicToKnowledgeBase(id, topic) {
    const knowledgeBases = await getCollection('knowledgeBases');
    
    // Find the highest order to place this at the end
    const kb = await this.getKnowledgeBaseById(id);
    const maxOrder = kb.topics.reduce((max, t) => Math.max(max, t.order || 0), 0);
    
    topic.order = maxOrder + 1;
    
    await knowledgeBases.updateOne(
      { _id: new ObjectId(id) },
      { 
        $push: { topics: topic },
        $set: { updatedAt: new Date() }
      }
    );
    
    return this.getKnowledgeBaseById(id);
  }
  
  async updateTopic(knowledgeBaseId, topicIndex, updateData) {
    const knowledgeBases = await getCollection('knowledgeBases');
    
    const allowedUpdates = ['title', 'description', 'content', 'order'];
    const updates = {};
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedUpdates.includes(key)) {
        updates[`topics.${topicIndex}.${key}`] = value;
      }
    }
    
    updates.updatedAt = new Date();
    
    await knowledgeBases.updateOne(
      { _id: new ObjectId(knowledgeBaseId) },
      { $set: updates }
    );
    
    return this.getKnowledgeBaseById(knowledgeBaseId);
  }
  
  async deleteKnowledgeBase(id) {
    const knowledgeBases = await getCollection('knowledgeBases');
    return knowledgeBases.deleteOne({ _id: new ObjectId(id) });
  }
  // Additional methods for knowledgeBaseRepository.js

/**
 * Get all unique tags used in knowledge bases
 * @returns {Promise<Array>} List of unique tags
 */
async getAllTags() {
  const knowledgeBases = await getCollection('knowledgeBases');
  
  return knowledgeBases.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags' } },
    { $project: { _id: 0, tag: '$_id' } },
    { $sort: { tag: 1 } }
  ]).toArray();
}

/**
 * Remove a topic from a knowledge base
 * @param {string} id - Knowledge base ID
 * @param {number} topicIndex - Index of the topic to remove
 * @returns {Promise<Object>} Updated knowledge base
 */
async removeTopic(id, topicIndex) {
  const knowledgeBases = await getCollection('knowledgeBases');
  
  // Get the knowledge base
  const kb = await this.getKnowledgeBaseById(id);
  
  // Remove the topic at the specified index
  kb.topics.splice(topicIndex, 1);
  
  // Update the knowledge base
  await knowledgeBases.updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: { 
        topics: kb.topics,
        updatedAt: new Date()
      } 
    }
  );
  
  return this.getKnowledgeBaseById(id);
}

/**
 * Get usage statistics for knowledge bases
 * @returns {Promise<Object>} Usage statistics
 */
async getUsageStatistics() {
  const knowledgeBases = await getCollection('knowledgeBases');
  const chatSessions = await getCollection('chatSessions');
  
  // Get total counts
  const totalKBs = await knowledgeBases.countDocuments();
  const publishedKBs = await knowledgeBases.countDocuments({ isPublished: true });
  
  // Get knowledge base usage in chat sessions
  const kbUsage = await chatSessions.aggregate([
    {
      $match: {
        knowledgeBaseId: { $ne: null }
      }
    },
    {
      $group: {
        _id: '$knowledgeBaseId',
        sessionCount: { $sum: 1 },
        lastAccessed: { $max: '$lastMessageAt' }
      }
    },
    {
      $lookup: {
        from: 'knowledgeBases',
        localField: '_id',
        foreignField: '_id',
        as: 'kbDetails'
      }
    },
    {
      $unwind: '$kbDetails'
    },
    {
      $project: {
        _id: 0,
        knowledgeBaseId: '$_id',
        title: '$kbDetails.title',
        sessionCount: 1,
        lastAccessed: 1
      }
    },
    {
      $sort: { sessionCount: -1 }
    }
  ]).toArray();
  
  // Get expertise level distribution
  const expertiseLevelDistribution = await knowledgeBases.aggregate([
    {
      $group: {
        _id: '$expertiseLevel',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        level: '$_id',
        count: 1
      }
    }
  ]).toArray();
  
  // Get tag usage
  const tagUsage = await knowledgeBases.aggregate([
    { $unwind: '$tags' },
    {
      $group: {
        _id: '$tags',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        tag: '$_id',
        count: 1
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]).toArray();
  
  return {
    totalKnowledgeBases: totalKBs,
    publishedKnowledgeBases: publishedKBs,
    knowledgeBaseUsage: kbUsage,
    expertiseLevelDistribution,
    topTags: tagUsage
  };
}

}

module.exports = new KnowledgeBaseRepository();