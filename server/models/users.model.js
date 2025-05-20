import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  jobTitle: String,
  department: String,
  company: String,
  profilePhoto: {
      type: String,
    },
  formData: Object,
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // adds createdAt and updatedAt
const User = mongoose.model("User", userSchema);
export default User;});



