import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  userComment: { type: String, default: '' },
  originalMessageId: { type: mongoose.Schema.Types.ObjectId, default: null },
  tags: [{ type: String }],
}, { timestamps: true });

const Note = mongoose.model("NOte", noteSchema);
export default Note;