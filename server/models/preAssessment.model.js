import mongoose from 'mongoose';

const preAssessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  learningStyle: { type: String },
  technicalLevel: { type: String },
  pacePreference: { type: String },
  contentPreference: [{ type: String }],
  goalAreas: [{ type: String }],
  completedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const PreAssessment = mongoose.model("PreAssessment", preAssessmentSchema);
export default PreAssessment;