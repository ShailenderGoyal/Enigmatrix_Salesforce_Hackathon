// repositories/preAssessmentRepository.js
const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

class PreAssessmentRepository {
  async savePreAssessment(userId, assessmentData) {
    const preAssessments = await getCollection('preAssessments');
    
    // Check if an assessment already exists for this user
    const existingAssessment = await preAssessments.findOne({ 
      userId: new ObjectId(userId) 
    });
    
    if (existingAssessment) {
      // Update existing assessment
      const updates = {
        ...assessmentData,
        updatedAt: new Date()
      };
      
      await preAssessments.updateOne(
        { _id: existingAssessment._id },
        { $set: updates }
      );
      
      return { ...existingAssessment, ...updates };
    } else {
      // Create new assessment
      const assessment = {
        userId: new ObjectId(userId),
        ...assessmentData,
        completedAt: new Date()
      };
      
      const result = await preAssessments.insertOne(assessment);
      return { ...assessment, _id: result.insertedId };
    }
  }
  
  async getUserPreAssessment(userId) {
    const preAssessments = await getCollection('preAssessments');
    return preAssessments.findOne({ userId: new ObjectId(userId) });
  }
// Additional methods for preAssessmentRepository.js

/**
 * Get assessment statistics
 * @returns {Promise<Object>} Assessment statistics
 */
async getAssessmentStats() {
  const preAssessments = await getCollection('preAssessments');
  
  const stats = await preAssessments.aggregate([
    {
      $group: {
        _id: null,
        totalAssessments: { $sum: 1 },
        byLearningStyle: {
          $push: {
            k: '$learningStyle',
            v: 1
          }
        },
        byTechnicalLevel: {
          $push: {
            k: '$technicalLevel',
            v: 1
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalAssessments: 1,
        learningStyles: { $arrayToObject: '$byLearningStyle' },
        technicalLevels: { $arrayToObject: '$byTechnicalLevel' }
      }
    }
  ]).toArray();
  
  return stats[0] || {
    totalAssessments: 0,
    learningStyles: {},
    technicalLevels: {}
  };
}

/**
 * Get distribution of learning styles
 * @returns {Promise<Array>} Learning style distribution
 */
async getLearningStyleDistribution() {
  const preAssessments = await getCollection('preAssessments');
  
  return preAssessments.aggregate([
    {
      $group: {
        _id: '$learningStyle',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        learningStyle: '$_id',
        count: 1
      }
    },
    {
      $sort: { count: -1 }
    }
  ]).toArray();
}

}



module.exports = new PreAssessmentRepository();