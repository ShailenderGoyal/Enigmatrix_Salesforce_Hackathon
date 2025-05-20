// repositories/userRepository.js
const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const bcrypt = require('bcryptjs');

class UserRepository {
  constructor() {
    this.collectionName = 'users';
  }
  
  async getCollection() {
    return await getCollection(this.collectionName);
  }
  
  /**
   * Find a user by their ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async findById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }
  
  /**
   * Find a user by their email address
   * @param {string} email - User's email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async findByEmail(email) {
    const collection = await this.getCollection();
    return collection.findOne({ email: email.toLowerCase() });
  }
  
  /**
   * Find a user by their username
   * @param {string} username - User's username
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async findByUsername(username) {
    const collection = await this.getCollection();
    return collection.findOne({ username });
  }
  
  /**
   * Create a new user
   * @param {Object} userData - User data including email, username, password
   * @returns {Promise<Object>} Created user object
   */
  async create(userData) {
    const collection = await this.getCollection();
    
    // Validate required fields
    if (!userData.email || !userData.username || !userData.password) {
      throw new Error('Email, username, and password are required');
    }
    
    // Check if email already exists
    const existingEmail = await this.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error('Email already in use');
    }
    
    // Check if username already exists
    const existingUsername = await this.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already in use');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);
    
    // Prepare user object
    const user = {
      email: userData.email.toLowerCase(),
      username: userData.username,
      passwordHash,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      jobTitle: userData.jobTitle || '',
      department: userData.department || '',
      company: userData.company || '',
      joinDate: userData.joinDate || new Date(),
      profilePicture: userData.profilePicture || '',
      formData: userData.formData || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert into database
    const result = await collection.insertOne(user);
    
    // Return created user (without password hash)
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: result.insertedId };
  }
  
  /**
   * Update an existing user
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user object
   */
  async update(id, updateData) {
    const collection = await this.getCollection();
    
    // Don't allow direct updates to these fields
    const restrictedFields = ['email', 'username', 'passwordHash', 'createdAt'];
    
    // Create update object with allowed fields
    const updates = {};
    Object.keys(updateData).forEach(key => {
      if (!restrictedFields.includes(key)) {
        updates[key] = updateData[key];
      }
    });
    
    // Always update the updatedAt timestamp
    updates.updatedAt = new Date();
    
    // Update in database
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    
    // Return updated user
    return this.findById(id);
  }
  
  /**
   * Update user's password
   * @param {string} id - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success indicator
   */
  async updatePassword(id, newPassword) {
    const collection = await this.getCollection();
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    // Update in database
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          passwordHash,
          updatedAt: new Date()
        } 
      }
    );
    
    return result.modifiedCount > 0;
  }
  
  /**
   * Update user's form data
   * @param {string} id - User ID
   * @param {Object} formData - Form data to update or add
   * @returns {Promise<Object>} Updated user object
   */
  async updateFormData(id, formData) {
    const collection = await this.getCollection();
    
    // Get current user
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Merge existing form data with new data
    const updatedFormData = {
      ...user.formData,
      ...formData
    };
    
    // Update in database
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          formData: updatedFormData,
          updatedAt: new Date()
        } 
      }
    );
    
    // Return updated user
    return this.findById(id);
  }
  
  /**
   * Verify user credentials
   * @param {string} email - User's email
   * @param {string} password - Password to verify
   * @returns {Promise<Object|null>} User object if verified, null otherwise
   */
  async verifyCredentials(email, password) {
    // Find user by email
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return null;
    }
    
    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} Success indicator
   */
  async delete(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
  
  /**
   * Find users by department
   * @param {string} department - Department name
   * @param {Object} options - Pagination options
   * @returns {Promise<Array>} Array of users
   */
  async findByDepartment(department, options = {}) {
    const collection = await this.getCollection();
    
    const limit = options.limit || 20;
    const skip = options.skip || 0;
    
    return collection
      .find({ department })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();
  }
  
  /**
   * Find users by company
   * @param {string} company - Company name
   * @param {Object} options - Pagination options
   * @returns {Promise<Array>} Array of users
   */
  async findByCompany(company, options = {}) {
    const collection = await this.getCollection();
    
    const limit = options.limit || 20;
    const skip = options.skip || 0;
    
    return collection
      .find({ company })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();
  }
  
  /**
   * Search users by name, username, or email
   * @param {string} searchTerm - Search term
   * @param {Object} options - Pagination options
   * @returns {Promise<Array>} Array of matching users
   */
  async search(searchTerm, options = {}) {
    const collection = await this.getCollection();
    
    const limit = options.limit || 20;
    const skip = options.skip || 0;
    
    // Create text index if it doesn't exist
    const indexes = await collection.indexes();
    const hasTextIndex = indexes.some(
      index => index.key && index.key._fts === 'text'
    );
    
    if (!hasTextIndex) {
      await collection.createIndex({
        firstName: 'text',
        lastName: 'text',
        username: 'text',
        email: 'text'
      });
    }
    
    return collection
      .find({
        $text: { $search: searchTerm }
      })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .skip(skip)
      .toArray();
  }
  
  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  async getStats() {
    const collection = await this.getCollection();
    
    const stats = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          byDepartment: {
            $push: {
              k: '$department',
              v: 1
            }
          },
          byCompany: {
            $push: {
              k: '$company',
              v: 1
            }
          },
          avgJoinDate: { $avg: '$joinDate' }
        }
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          departmentCounts: { $arrayToObject: '$byDepartment' },
          companyCounts: { $arrayToObject: '$byCompany' },
          avgJoinDate: 1
        }
      }
    ]).toArray();
    
    return stats[0] || {
      totalUsers: 0,
      departmentCounts: {},
      companyCounts: {},
      avgJoinDate: null
    };
  }
  
  /**
   * Get recently joined users
   * @param {number} limit - Number of users to return
   * @returns {Promise<Array>} Array of recent users
   */
  async getRecentUsers(limit = 5) {
    const collection = await this.getCollection();
    
    const users = await collection
      .find({})
      .sort({ joinDate: -1 })
      .limit(limit)
      .project({
        firstName: 1,
        lastName: 1,
        email: 1,
        username: 1,
        company: 1,
        department: 1,
        joinDate: 1,
        profilePicture: 1
      })
      .toArray();
    
    return users;
  }
}

module.exports = new UserRepository();