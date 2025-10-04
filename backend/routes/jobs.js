const express = require('express');
const Joi = require('joi');
const Job = require('../models/Job');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const jobSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string().min(2).max(100).required(),
  location: Joi.string().min(2).max(255).required(),
  language: Joi.string().min(2).max(50).required()
});

// Get all jobs with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, location, language, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (language) {
      filter.language = language;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get jobs with populated user data
    const jobs = await Job.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalCount = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: {
        jobs: jobs.map(job => ({
          ...job.toObject(),
          created_by_name: job.createdBy?.name
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
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findById(id)
      .populate('createdBy', 'name');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: { 
        job: {
          ...job.toObject(),
          created_by_name: job.createdBy?.name
        }
      }
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new job
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = jobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const job = new Job({
      ...value,
      createdBy: req.user._id
    });

    await job.save();
    
    const newJob = await Job.findById(job._id)
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { 
        job: {
          ...newJob.toObject(),
          created_by_name: newJob.createdBy?.name
        }
      }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update job
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = jobSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if job exists and user owns it
    const existingJob = await Job.findById(id);
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (existingJob.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own jobs'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(id, value, { new: true })
      .populate('createdBy', 'name');

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { 
        job: {
          ...updatedJob.toObject(),
          created_by_name: updatedJob.createdBy?.name
        }
      }
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete job
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if job exists and user owns it
    const existingJob = await Job.findById(id);
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (existingJob.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own jobs'
      });
    }

    await Job.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
