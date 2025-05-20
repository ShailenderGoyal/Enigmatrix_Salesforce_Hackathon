import PreAssessment from '../models/preAssessment.model.js';
import mongoose from 'mongoose';

export const getUserPreAssessment = async (req, res) => {
  try {
    const assessment = await PreAssessment.findOne({ userId: req.user.id });
    if (!assessment) return res.status(404).json({ message: 'Pre-assessment not found' });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveOrUpdatePreAssessment = async (req, res) => {
  try {
    const data = req.body;

    if (!data.learningStyle) {
      return res.status(400).json({ message: 'Learning style is required' });
    }

    const updated = await PreAssessment.findOneAndUpdate(
      { userId: req.user.id },
      { ...data, completedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAssessmentStats = async (req, res) => {
  try {
    const stats = await PreAssessment.aggregate([
      {
        $group: {
          _id: null,
          totalAssessments: { $sum: 1 },
          byLearningStyle: {
            $push: { k: '$learningStyle', v: 1 }
          },
          byTechnicalLevel: {
            $push: { k: '$technicalLevel', v: 1 }
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
    ]);

    res.json(stats[0] || {
      totalAssessments: 0,
      learningStyles: {},
      technicalLevels: {}
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLearningStyleDistribution = async (req, res) => {
  try {
    const distribution = await PreAssessment.aggregate([
      { $group: { _id: '$learningStyle', count: { $sum: 1 } } },
      { $project: { _id: 0, learningStyle: '$_id', count: 1 } },
      { $sort: { count: -1 } }
    ]);

    res.json(distribution);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserAssessmentById = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const assessment = await PreAssessment.findOne({ userId });
    if (!assessment) return res.status(404).json({ message: 'Pre-assessment not found' });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
