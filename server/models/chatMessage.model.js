import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  resources: [{ type: mongoose.Schema.Types.Mixed }]
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;