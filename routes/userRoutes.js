// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userRepository = require('../repositories/userRepository');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await userRepository.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove sensitive information
    const { passwordHash, ...userProfile } = user;
    
    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update current user profile
router.patch('/me', auth, async (req, res) => {
  try {
    const updatedUser = await userRepository.update(req.user.id, req.body);
    
    // Remove sensitive information
    const { passwordHash, ...userProfile } = updatedUser;
    
    res.json(userProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update user's form data
router.patch('/me/form-data', auth, async (req, res) => {
  try {
    const updatedUser = await userRepository.updateFormData(req.user.id, req.body);
    
    // Remove sensitive information
    const { passwordHash, ...userProfile } = updatedUser;
    
    res.json(userProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Change password
router.post('/me/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Verify current password
    const user = await userRepository.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    await userRepository.updatePassword(req.user.id, newPassword);
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADMIN ROUTES

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    let users;
    
    // Check if search term is provided
    if (req.query.search) {
      users = await userRepository.search(req.query.search, { limit, skip });
    } 
    // Check if filtering by department
    else if (req.query.department) {
      users = await userRepository.findByDepartment(req.query.department, { limit, skip });
    }
    // Check if filtering by company
    else if (req.query.company) {
      users = await userRepository.findByCompany(req.query.company, { limit, skip });
    }
    // Otherwise, get all users
    else {
      const collection = await userRepository.getCollection();
      users = await collection
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
    }
    
    // Remove sensitive information
    const sanitizedUsers = users.map(user => {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(sanitizedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await userRepository.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove sensitive information
    const { passwordHash, ...userProfile } = user;
    
    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const updatedUser = await userRepository.update(req.params.id, req.body);
    
    // Remove sensitive information
    const { passwordHash, ...userProfile } = updatedUser;
    
    res.json(userProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const success = await userRepository.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user statistics (admin only)
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const stats = await userRepository.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get recent users (admin only)
router.get('/stats/recent', adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const recentUsers = await userRepository.getRecentUsers(limit);
    res.json(recentUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;