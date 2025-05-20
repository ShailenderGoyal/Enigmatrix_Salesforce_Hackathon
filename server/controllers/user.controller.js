import bcrypt from 'bcryptjs';
import User from "../models/users.model.js";
import mongoose from 'mongoose';

const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.passwordHash;
  return obj;
};

// ================= USER CONTROLLERS =================

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const updateFields = { ...req.body, updatedAt: new Date() };
    ['email', 'username', 'passwordHash', 'createdAt'].forEach(f => delete updateFields[f]);

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updateFields }, { new: true });
    res.json(sanitizeUser(updatedUser));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateFormData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.formData = { ...user.formData, ...req.body };
    user.updatedAt = new Date();
    await user.save();

    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.updatedAt = new Date();
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= ADMIN CONTROLLERS =================

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { email: { $regex: req.query.search, $options: 'i' } },
        { username: { $regex: req.query.search, $options: 'i' } },
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } }
      ];
    } else if (req.query.department) {
      filter.department = req.query.department;
    } else if (req.query.company) {
      filter.company = req.query.company;
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(users.map(sanitizeUser));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updateFields = { ...req.body, updatedAt: new Date() };
    ['email', 'username', 'passwordHash', 'createdAt'].forEach(f => delete updateFields[f]);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(sanitizeUser(updatedUser));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStatsOverview = async (req, res) => {
  try {
    const [stats] = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          departments: { $push: '$department' },
          companies: { $push: '$company' },
          avgJoinDate: { $avg: { $toLong: '$joinDate' } }
        }
      }
    ]);

    const departmentCounts = {};
    stats.departments.forEach(dep => dep && (departmentCounts[dep] = (departmentCounts[dep] || 0) + 1));
    const companyCounts = {};
    stats.companies.forEach(comp => comp && (companyCounts[comp] = (companyCounts[comp] || 0) + 1));

    res.json({
      totalUsers: stats.totalUsers,
      departmentCounts,
      companyCounts,
      avgJoinDate: new Date(stats.avgJoinDate)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecentUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const users = await User.find({})
      .sort({ joinDate: -1 })
      .limit(limit)
      .select('firstName lastName email username company department joinDate profilePicture');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
