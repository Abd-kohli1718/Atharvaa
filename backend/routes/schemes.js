const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const schemeSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  eligibility: Joi.string().min(5).required(),
  link: Joi.string().uri().optional(),
  language: Joi.string().min(2).max(50).required(),
  category: Joi.string().max(100).optional(),
  is_active: Joi.boolean().default(true)
});

// Get all schemes with optional filters
router.get('/', async (req, res) => {
  try {
    const { language, category, is_active = true, page = 1, limit = 10 } = req.query;
    
    let query = db('schemes')
      .select('*')
      .where('is_active', is_active === 'true')
      .orderBy('created_at', 'desc');

    // Apply filters
    if (language) {
      query = query.where('language', language);
    }
    if (category) {
      query = query.where('category', 'like', `%${category}%`);
    }

    // Pagination
    const offset = (page - 1) * limit;
    const schemes = await query.limit(limit).offset(offset);
    
    // Get total count for pagination
    let countQuery = db('schemes').where('is_active', is_active === 'true');
    if (language) countQuery = countQuery.where('language', language);
    if (category) countQuery = countQuery.where('category', 'like', `%${category}%`);
    
    const totalCount = await countQuery.count('* as count').first();

    res.json({
      success: true,
      data: {
        schemes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount.count / limit),
          totalItems: totalCount.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get scheme by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const scheme = await db('schemes')
      .where('id', id)
      .first();

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    res.json({
      success: true,
      data: { scheme }
    });
  } catch (error) {
    console.error('Get scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new scheme (admin only)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { error, value } = schemeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const [schemeId] = await db('schemes').insert(value);
    
    const newScheme = await db('schemes')
      .where('id', schemeId)
      .first();

    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: { scheme: newScheme }
    });
  } catch (error) {
    console.error('Create scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update scheme (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = schemeSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if scheme exists
    const existingScheme = await db('schemes').where('id', id).first();
    if (!existingScheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    await db('schemes').where('id', id).update(value);
    
    const updatedScheme = await db('schemes')
      .where('id', id)
      .first();

    res.json({
      success: true,
      message: 'Scheme updated successfully',
      data: { scheme: updatedScheme }
    });
  } catch (error) {
    console.error('Update scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete scheme (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if scheme exists
    const existingScheme = await db('schemes').where('id', id).first();
    if (!existingScheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    await db('schemes').where('id', id).del();

    res.json({
      success: true,
      message: 'Scheme deleted successfully'
    });
  } catch (error) {
    console.error('Delete scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get schemes by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { language, page = 1, limit = 10 } = req.query;
    
    let query = db('schemes')
      .where('category', 'like', `%${category}%`)
      .where('is_active', true)
      .orderBy('created_at', 'desc');

    if (language) {
      query = query.where('language', language);
    }

    const offset = (page - 1) * limit;
    const schemes = await query.limit(limit).offset(offset);

    res.json({
      success: true,
      data: { schemes }
    });
  } catch (error) {
    console.error('Get schemes by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Search schemes
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { language, page = 1, limit = 10 } = req.query;
    
    let searchQuery = db('schemes')
      .where(function() {
        this.where('title', 'like', `%${query}%`)
            .orWhere('description', 'like', `%${query}%`)
            .orWhere('category', 'like', `%${query}%`);
      })
      .where('is_active', true)
      .orderBy('created_at', 'desc');

    if (language) {
      searchQuery = searchQuery.where('language', language);
    }

    const offset = (page - 1) * limit;
    const results = await searchQuery.limit(limit).offset(offset);

    res.json({
      success: true,
      data: { results }
    });
  } catch (error) {
    console.error('Search schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
