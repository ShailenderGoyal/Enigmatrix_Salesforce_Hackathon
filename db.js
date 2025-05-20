// db.js
const { MongoClient } = require('mongodb');

// Database connection variables
let client;
let db;

/**
 * Connect to MongoDB
 * @returns {Promise<object>} MongoDB client instance
 */
async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }

  try {
    // Connect to the MongoDB cluster
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    // Get the database
    db = client.db(process.env.DB_NAME);
    
    console.log(`Connected to database: ${process.env.DB_NAME}`);
    return { client, db };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

/**
 * Get a MongoDB collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Collection>} MongoDB collection
 */
async function getCollection(collectionName) {
  if (!client || !db) {
    await connectToDatabase();
  }
  return db.collection(collectionName);
}

/**
 * Close the database connection
 * @returns {Promise<void>}
 */
async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Database connection closed');
  }
}

// Export functions
module.exports = {
  connectToDatabase,
  getCollection,
  closeDatabaseConnection
};
