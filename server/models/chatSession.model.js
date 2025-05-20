import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  knowledgeBaseId: { type: mongoose.Schema.Types.ObjectId, default: null },
  lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
export default ChatSession;