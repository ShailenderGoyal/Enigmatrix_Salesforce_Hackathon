import KnowledgeBase from '../models/knowledgeBase.model.js';

export const handleGetKnowledgeBases = async (req, res) => {
  try {
    const { published, tag, level, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (published === 'true') query.isPublished = true;
    if (tag) query.tags = tag;
    if (level) query.expertiseLevel = level;
    if (search) query.$text = { $search: search };

    const items = await KnowledgeBase.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleCreateKnowledgeBase = async (req, res) => {
  try {
    const { title, description, topics, tags, expertiseLevel, estimatedDuration, isPublished } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const kb = new KnowledgeBase({
      title,
      description,
      topics: topics || [],
      tags: tags || [],
      expertiseLevel,
      estimatedDuration,
      isPublished: !!isPublished
    });

    await kb.save();
    res.status(201).json(kb);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const handleGetKnowledgeBaseById = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findById(req.params.id);
    if (!kb) return res.status(404).json({ message: 'Knowledge Base not found' });
    res.json(kb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleUpdateKnowledgeBase = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findById(req.params.id);
    if (!kb) return res.status(404).json({ message: 'Knowledge Base not found' });

    const allowedFields = ['title', 'description', 'topics', 'tags', 'expertiseLevel', 'estimatedDuration', 'isPublished'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        kb[field] = req.body[field];
      }
    });

    await kb.save();
    res.json(kb);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const handleDeleteKnowledgeBase = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findById(req.params.id);
    if (!kb) return res.status(404).json({ message: 'Knowledge Base not found' });

    await kb.deleteOne();
    res.json({ message: 'Knowledge Base deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
