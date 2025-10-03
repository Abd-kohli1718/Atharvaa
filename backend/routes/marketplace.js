const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const marketplaceSchema = Joi.object({
  business_name: Joi.string().min(2).max(255).required(),
  owner_name: Joi.string().min(2).max(255).required(),
  product_service: Joi.string().min(5).required(),
  contact: Joi.string().min(5).max(255).required(),
  language: Joi.string().min(2).max(50).required(),
  location: Joi.string().max(255).optional(),
  description: Joi.string().max(1000).optional()
});

// Get all marketplace entries with optional filters
router.get('/', async (req, res) => {
  try {
    const { language, location, page = 1, limit = 10 } = req.query;
    
    let query = db('marketplace')
      .select('marketplace.*', 'users.name as created_by_name')
      .leftJoin('users', 'marketplace.created_by', 'users.id')
      .orderBy('marketplace.created_at', 'desc');

    // Apply filters
    if (language) {
      query = query.where('marketplace.language', language);
    }
    if (location) {
      query = query.where('marketplace.location', 'like', `%${location}%`);
    }

    // Pagination
    const offset = (page - 1) * limit;
    const marketplace = await query.limit(limit).offset(offset);
    
    // Get total count for pagination
    let countQuery = db('marketplace');
    if (language) countQuery = countQuery.where('language', language);
    if (location) countQuery = countQuery.where('location', 'like', `%${location}%`);
    
    const totalCount = await countQuery.count('* as count').first();

    res.json({
      success: true,
      data: {
        marketplace,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount.count / limit),
          totalItems: totalCount.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get marketplace error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get marketplace entry by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const entry = await db('marketplace')
      .select('marketplace.*', 'users.name as created_by_name')
      .leftJoin('users', 'marketplace.created_by', 'users.id')
      .where('marketplace.id', id)
      .first();

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Marketplace entry not found'
      });
    }

    res.json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    console.error('Get marketplace entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new marketplace entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = marketplaceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const entryData = {
      ...value,
      created_by: req.user.id
    };

    const [entryId] = await db('marketplace').insert(entryData);
    
    const newEntry = await db('marketplace')
      .select('marketplace.*', 'users.name as created_by_name')
      .leftJoin('users', 'marketplace.created_by', 'users.id')
      .where('marketplace.id', entryId)
      .first();

    res.status(201).json({
      success: true,
      message: 'Marketplace entry created successfully',
      data: { entry: newEntry }
    });
  } catch (error) {
    console.error('Create marketplace entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update marketplace entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = marketplaceSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if entry exists and user owns it
    const existingEntry = await db('marketplace').where('id', id).first();
    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Marketplace entry not found'
      });
    }

    if (existingEntry.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own marketplace entries'
      });
    }

    await db('marketplace').where('id', id).update(value);
    
    const updatedEntry = await db('marketplace')
      .select('marketplace.*', 'users.name as created_by_name')
      .leftJoin('users', 'marketplace.created_by', 'users.id')
      .where('marketplace.id', id)
      .first();

    res.json({
      success: true,
      message: 'Marketplace entry updated successfully',
      data: { entry: updatedEntry }
    });
  } catch (error) {
    console.error('Update marketplace entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete marketplace entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if entry exists and user owns it
    const existingEntry = await db('marketplace').where('id', id).first();
    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Marketplace entry not found'
      });
    }

    if (existingEntry.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own marketplace entries'
      });
    }

    await db('marketplace').where('id', id).del();

    res.json({
      success: true,
      message: 'Marketplace entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete marketplace entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Search marketplace entries
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { language, page = 1, limit = 10 } = req.query;
    
    let searchQuery = db('marketplace')
      .select('marketplace.*', 'users.name as created_by_name')
      .leftJoin('users', 'marketplace.created_by', 'users.id')
      .where(function() {
        this.where('business_name', 'like', `%${query}%`)
            .orWhere('product_service', 'like', `%${query}%`)
            .orWhere('description', 'like', `%${query}%`);
      })
      .orderBy('marketplace.created_at', 'desc');

    if (language) {
      searchQuery = searchQuery.where('marketplace.language', language);
    }

    const offset = (page - 1) * limit;
    const results = await searchQuery.limit(limit).offset(offset);

    res.json({
      success: true,
      data: { results }
    });
  } catch (error) {
    console.error('Search marketplace error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
