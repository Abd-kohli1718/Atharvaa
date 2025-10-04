const express = require('express');
const Joi = require('joi');
const Marketplace = require('../models/Marketplace');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const marketplaceSchema = Joi.object({
  businessName: Joi.string().min(2).max(255).required(),
  ownerName: Joi.string().min(2).max(255).required(),
  productService: Joi.string().min(5).required(),
  contact: Joi.object({
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required(),
    email: Joi.string().email().required(),
    address: Joi.string().min(10).required()
  }).required(),
  language: Joi.string().min(2).max(50).required(),
  location: Joi.string().max(255).required()
});

// Get all marketplace entries with optional filters
router.get('/', async (req, res) => {
  try {
    const { language, location, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (language) {
      filter.language = language;
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get marketplace entries with populated user data
    const marketplace = await Marketplace.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalCount = await Marketplace.countDocuments(filter);

    res.json({
      success: true,
      data: {
        marketplace: marketplace.map(item => ({
          ...item.toObject(),
          created_by_name: item.createdBy?.name
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
    
    const entry = await Marketplace.findById(id)
      .populate('createdBy', 'name');

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Marketplace entry not found'
      });
    }

    res.json({
      success: true,
      data: { 
        entry: {
          ...entry.toObject(),
          created_by_name: entry.createdBy?.name
        }
      }
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

    const entry = new Marketplace({
      ...value,
      createdBy: req.user._id
    });

    await entry.save();
    
    const newEntry = await Marketplace.findById(entry._id)
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Marketplace entry created successfully',
      data: { 
        entry: {
          ...newEntry.toObject(),
          created_by_name: newEntry.createdBy?.name
        }
      }
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
    const existingEntry = await Marketplace.findById(id);
    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Marketplace entry not found'
      });
    }

    if (existingEntry.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own marketplace entries'
      });
    }

    const updatedEntry = await Marketplace.findByIdAndUpdate(id, value, { new: true })
      .populate('createdBy', 'name');

    res.json({
      success: true,
      message: 'Marketplace entry updated successfully',
      data: { 
        entry: {
          ...updatedEntry.toObject(),
          created_by_name: updatedEntry.createdBy?.name
        }
      }
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
    const existingEntry = await Marketplace.findById(id);
    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Marketplace entry not found'
      });
    }

    if (existingEntry.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own marketplace entries'
      });
    }

    await Marketplace.findByIdAndDelete(id);

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
    
    // Build search filter
    const searchFilter = {
      $or: [
        { businessName: { $regex: query, $options: 'i' } },
        { productService: { $regex: query, $options: 'i' } }
      ]
    };

    if (language) {
      searchFilter.language = language;
    }

    const skip = (page - 1) * limit;
    const results = await Marketplace.find(searchFilter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { 
        results: results.map(item => ({
          ...item.toObject(),
          created_by_name: item.createdBy?.name
        }))
      }
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
