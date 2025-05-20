import mongoose from 'mongoose';

const knowledgeBaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  topics: [{ type: String }],
  tags: [{ type: String }],
  expertiseLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  estimatedDuration: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

const KnowledgeBase = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
export default KnowledgeBase;
