const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const trainingSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  type: Joi.string().valid('video', 'pdf', 'text', 'infographic').required(),
  url: Joi.string().uri().required(),
  language: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(1000).optional()
});

// Get all training content with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, language, page = 1, limit = 10 } = req.query;
    
    let query = db('training_content')
      .select('training_content.*', 'users.name as created_by_name')
      .leftJoin('users', 'training_content.created_by', 'users.id')
      .orderBy('training_content.created_at', 'desc');

    // Apply filters
    if (type) {
      query = query.where('training_content.type', type);
    }
    if (language) {
      query = query.where('training_content.language', language);
    }

    // Pagination
    const offset = (page - 1) * limit;
    const trainingContent = await query.limit(limit).offset(offset);
    
    // Get total count for pagination
    let countQuery = db('training_content');
    if (type) countQuery = countQuery.where('type', type);
    if (language) countQuery = countQuery.where('language', language);
    
    const totalCount = await countQuery.count('* as count').first();

    res.json({
      success: true,
      data: {
        trainingContent,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount.count / limit),
          totalItems: totalCount.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get training content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get training content by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await db('training_content')
      .select('training_content.*', 'users.name as created_by_name')
      .leftJoin('users', 'training_content.created_by', 'users.id')
      .where('training_content.id', id)
      .first();

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Training content not found'
      });
    }

    res.json({
      success: true,
      data: { content }
    });
  } catch (error) {
    console.error('Get training content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new training content
router.post('/', authenticateToken, requireRole(['entrepreneur', 'admin']), async (req, res) => {
  try {
    const { error, value } = trainingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const contentData = {
      ...value,
      created_by: req.user.id
    };

    const [contentId] = await db('training_content').insert(contentData);
    
    const newContent = await db('training_content')
      .select('training_content.*', 'users.name as created_by_name')
      .leftJoin('users', 'training_content.created_by', 'users.id')
      .where('training_content.id', contentId)
      .first();

    res.status(201).json({
      success: true,
      message: 'Training content created successfully',
      data: { content: newContent }
    });
  } catch (error) {
    console.error('Create training content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update training content
router.put('/:id', authenticateToken, requireRole(['entrepreneur', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = trainingSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if content exists and user owns it (or is admin)
    const existingContent = await db('training_content').where('id', id).first();
    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: 'Training content not found'
      });
    }

    if (existingContent.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own training content'
      });
    }

    await db('training_content').where('id', id).update(value);
    
    const updatedContent = await db('training_content')
      .select('training_content.*', 'users.name as created_by_name')
      .leftJoin('users', 'training_content.created_by', 'users.id')
      .where('training_content.id', id)
      .first();

    res.json({
      success: true,
      message: 'Training content updated successfully',
      data: { content: updatedContent }
    });
  } catch (error) {
    console.error('Update training content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete training content
router.delete('/:id', authenticateToken, requireRole(['entrepreneur', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if content exists and user owns it (or is admin)
    const existingContent = await db('training_content').where('id', id).first();
    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: 'Training content not found'
      });
    }

    if (existingContent.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own training content'
      });
    }

    await db('training_content').where('id', id).del();

    res.json({
      success: true,
      message: 'Training content deleted successfully'
    });
  } catch (error) {
    console.error('Delete training content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get training content by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { language, page = 1, limit = 10 } = req.query;
    
    let query = db('training_content')
      .select('training_content.*', 'users.name as created_by_name')
      .leftJoin('users', 'training_content.created_by', 'users.id')
      .where('training_content.type', type)
      .orderBy('training_content.created_at', 'desc');

    if (language) {
      query = query.where('training_content.language', language);
    }

    const offset = (page - 1) * limit;
    const content = await query.limit(limit).offset(offset);

    res.json({
      success: true,
      data: { content }
    });
  } catch (error) {
    console.error('Get training content by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
