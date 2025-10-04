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
    
    const content = await TrainingContent.findById(id)
      .populate('createdBy', 'name');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Training content not found'
      });
    }

    res.json({
      success: true,
      data: { 
        content: {
          ...content.toObject(),
          created_by_name: content.createdBy?.name
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

    const content = new TrainingContent({
      ...value,
      createdBy: req.user._id
    });

    await content.save();
    
    const newContent = await TrainingContent.findById(content._id)
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Training content created successfully',
      data: { 
        content: {
          ...newContent.toObject(),
          created_by_name: newContent.createdBy?.name
        }
      }
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
    const existingContent = await TrainingContent.findById(id);
    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: 'Training content not found'
      });
    }

    if (existingContent.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own training content'
      });
    }

    const updatedContent = await TrainingContent.findByIdAndUpdate(id, value, { new: true })
      .populate('createdBy', 'name');

    res.json({
      success: true,
      message: 'Training content updated successfully',
      data: { 
        content: {
          ...updatedContent.toObject(),
          created_by_name: updatedContent.createdBy?.name
        }
      }
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
    const existingContent = await TrainingContent.findById(id);
    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: 'Training content not found'
      });
    }

    if (existingContent.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own training content'
      });
    }

    await TrainingContent.findByIdAndDelete(id);

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
    
    // Build filter object
    const filter = { type };
    if (language) {
      filter.language = language;
    }

    const skip = (page - 1) * limit;
    const content = await TrainingContent.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { 
        content: content.map(item => ({
          ...item.toObject(),
          created_by_name: item.createdBy?.name
        }))
      }
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
