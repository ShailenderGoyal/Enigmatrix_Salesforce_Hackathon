  // // Use MongoDB Shell or create a setup script
  // use learning_platform

// 1. Users Collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "username", "passwordHash"],
      properties: {
        email: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        username: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        passwordHash: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        firstName: {
          bsonType: "string"
        },
        lastName: {
          bsonType: "string"
        },
        jobTitle: {
          bsonType: "string"
        },
        department: {
          bsonType: "string"
        },
        company: {
          bsonType: "string"
        },
        joinDate: {
          bsonType: "date"
        },
        profilePicture: {
          bsonType: "string"
        },
        formData: {
          bsonType: "object"
        },
        createdAt: {
          bsonType: "date"
        },
        updatedAt: {
          bsonType: "date"
        }
      }
    }
  }
});

// 2. Chat Sessions Collection
db.createCollection("chatSessions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "title", "createdAt"],
      properties: {
        userId: {
          bsonType: "objectId",
          description: "reference to the user"
        },
        title: {
          bsonType: "string",
          description: "title of the chat session"
        },
        description: {
          bsonType: "string"
        },
        knowledgeBaseId: {
          bsonType: ["objectId", "null"],
          description: "reference to knowledge base if applicable"
        },
        createdAt: {
          bsonType: "date"
        },
        updatedAt: {
          bsonType: "date"
        },
        lastMessageAt: {
          bsonType: "date"
        }
      }
    }
  }
});

// 3. Chat Messages Collection (for storing individual messages)
db.createCollection("chatMessages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sessionId", "role", "content", "timestamp"],
      properties: {
        sessionId: {
          bsonType: "objectId",
          description: "reference to the chat session"
        },
        role: {
          enum: ["user", "assistant"],
          description: "who sent the message"
        },
        content: {
          bsonType: "string",
          description: "the actual message content"
        },
        timestamp: {
          bsonType: "date",
          description: "when the message was sent"
        },
        metadata: {
          bsonType: "object",
          description: "additional data about the message"
        },
        resources: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              type: {
                bsonType: "string"
              },
              url: {
                bsonType: "string"
              },
              title: {
                bsonType: "string"
              }
            }
          }
        }
      }
    }
  }
});

// 4. Notes Collection (saved responses)
db.createCollection("notes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "title", "content", "createdAt"],
      properties: {
        userId: {
          bsonType: "objectId",
          description: "reference to the user who saved the note"
        },
        title: {
          bsonType: "string",
          description: "title of the note"
        },
        content: {
          bsonType: "string",
          description: "the saved response content"
        },
        userComment: {
          bsonType: "string",
          description: "additional text from the user"
        },
        originalMessageId: {
          bsonType: ["objectId", "null"],
          description: "reference to the original chat message if applicable"
        },
        tags: {
          bsonType: "array",
          items: {
            bsonType: "string"
          }
        },
        createdAt: {
          bsonType: "date"
        },
        updatedAt: {
          bsonType: "date"
        }
      }
    }
  }
});

// 5. Pre-assessment Collection
db.createCollection("preAssessments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "completedAt"],
      properties: {
        userId: {
          bsonType: "objectId",
          description: "reference to the user"
        },
        learningStyle: {
          bsonType: "string",
          description: "the identified learning style"
        },
        preferences: {
          bsonType: "object",
          properties: {
            pacePreference: {
              bsonType: "string"
            },
            contentTypePreference: {
              bsonType: "array",
              items: {
                bsonType: "string"
              }
            },
            interactionMode: {
              bsonType: "string"
            }
          }
        },
        technicalLevel: {
          bsonType: "string"
        },
        goalAreas: {
          bsonType: "array",
          items: {
            bsonType: "string"
          }
        },
        responses: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              questionId: {
                bsonType: "string"
              },
              answer: {
                bsonType: ["string", "array"]
              }
            }
          }
        },
        completedAt: {
          bsonType: "date"
        }
      }
    }
  }
});

// 6. Knowledge Bases Collection
db.createCollection("knowledgeBases", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "createdAt"],
      properties: {
        title: {
          bsonType: "string",
          description: "title of the knowledge base"
        },
        description: {
          bsonType: "string",
          description: "description of the knowledge base"
        },
        topics: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              title: {
                bsonType: "string"
              },
              description: {
                bsonType: "string"
              },
              content: {
                bsonType: "string"
              },
              order: {
                bsonType: "int"
              }
            }
          }
        },
        tags: {
          bsonType: "array",
          items: {
            bsonType: "string"
          }
        },
        expertiseLevel: {
          enum: ["beginner", "intermediate", "advanced", "all-levels"]
        },
        estimatedDuration: {
          bsonType: "int",
          description: "estimated duration in minutes"
        },
        createdAt: {
          bsonType: "date"
        },
        updatedAt: {
          bsonType: "date"
        },
        isPublished: {
          bsonType: "bool"
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.chatSessions.createIndex({ "userId": 1 });
db.chatSessions.createIndex({ "lastMessageAt": -1 });
db.chatMessages.createIndex({ "sessionId": 1, "timestamp": 1 });
db.notes.createIndex({ "userId": 1 });
db.notes.createIndex({ "tags": 1 });
db.knowledgeBases.createIndex({ "title": "text", "description": "text", "topics.title": "text", "topics.description": "text" });
db.knowledgeBases.createIndex({ "tags": 1 });

console.log("Collections created successfully with validation rules and indexes.");
