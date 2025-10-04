const express = require('express');
const Joi = require('joi');
const Scheme = require('../models/Scheme');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const schemeSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  eligibility: Joi.string().min(5).required(),
  link: Joi.string().uri().required(),
  language: Joi.string().min(2).max(50).required(),
  category: Joi.string().max(100).required()
});

// Get all schemes with optional filters
router.get('/', async (req, res) => {
  try {
    const { language, category, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (language) {
      filter.language = language;
    }
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get schemes with populated user data
    const schemes = await Scheme.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalCount = await Scheme.countDocuments(filter);

    res.json({
      success: true,
      data: {
        schemes: schemes.map(scheme => ({
          ...scheme.toObject(),
          created_by_name: scheme.createdBy?.name
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
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
    
    const scheme = await Scheme.findById(id)
      .populate('createdBy', 'name');

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    res.json({
      success: true,
      data: { 
        scheme: {
          ...scheme.toObject(),
          created_by_name: scheme.createdBy?.name
        }
      }
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

    const scheme = new Scheme({
      ...value,
      createdBy: req.user._id
    });

    await scheme.save();
    
    const newScheme = await Scheme.findById(scheme._id)
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: { 
        scheme: {
          ...newScheme.toObject(),
          created_by_name: newScheme.createdBy?.name
        }
      }
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
    const existingScheme = await Scheme.findById(id);
    if (!existingScheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    const updatedScheme = await Scheme.findByIdAndUpdate(id, value, { new: true })
      .populate('createdBy', 'name');

    res.json({
      success: true,
      message: 'Scheme updated successfully',
      data: { 
        scheme: {
          ...updatedScheme.toObject(),
          created_by_name: updatedScheme.createdBy?.name
        }
      }
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
    const existingScheme = await Scheme.findById(id);
    if (!existingScheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    await Scheme.findByIdAndDelete(id);

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
    
    // Build filter object
    const filter = {
      category: { $regex: category, $options: 'i' }
    };

    if (language) {
      filter.language = language;
    }

    const skip = (page - 1) * limit;
    const schemes = await Scheme.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { 
        schemes: schemes.map(scheme => ({
          ...scheme.toObject(),
          created_by_name: scheme.createdBy?.name
        }))
      }
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
    
    // Build search filter
    const searchFilter = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    };

    if (language) {
      searchFilter.language = language;
    }

    const skip = (page - 1) * limit;
    const results = await Scheme.find(searchFilter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { 
        results: results.map(scheme => ({
          ...scheme.toObject(),
          created_by_name: scheme.createdBy?.name
        }))
      }
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
