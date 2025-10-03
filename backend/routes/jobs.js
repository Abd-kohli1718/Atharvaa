const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
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
    
    let query = db('jobs')
      .select('jobs.*', 'users.name as created_by_name')
      .leftJoin('users', 'jobs.created_by', 'users.id')
      .orderBy('jobs.created_at', 'desc');

    // Apply filters
    if (category) {
      query = query.where('jobs.category', 'like', `%${category}%`);
    }
    if (location) {
      query = query.where('jobs.location', 'like', `%${location}%`);
    }
    if (language) {
      query = query.where('jobs.language', language);
    }

    // Pagination
    const offset = (page - 1) * limit;
    const jobs = await query.limit(limit).offset(offset);
    
    // Get total count for pagination
    let countQuery = db('jobs');
    if (category) countQuery = countQuery.where('category', 'like', `%${category}%`);
    if (location) countQuery = countQuery.where('location', 'like', `%${location}%`);
    if (language) countQuery = countQuery.where('language', language);
    
    const totalCount = await countQuery.count('* as count').first();

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount.count / limit),
          totalItems: totalCount.count,
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
    
    const job = await db('jobs')
      .select('jobs.*', 'users.name as created_by_name')
      .leftJoin('users', 'jobs.created_by', 'users.id')
      .where('jobs.id', id)
      .first();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: { job }
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

    const jobData = {
      ...value,
      created_by: req.user.id
    };

    const [jobId] = await db('jobs').insert(jobData);
    
    const newJob = await db('jobs')
      .select('jobs.*', 'users.name as created_by_name')
      .leftJoin('users', 'jobs.created_by', 'users.id')
      .where('jobs.id', jobId)
      .first();

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job: newJob }
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
    const existingJob = await db('jobs').where('id', id).first();
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (existingJob.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own jobs'
      });
    }

    await db('jobs').where('id', id).update(value);
    
    const updatedJob = await db('jobs')
      .select('jobs.*', 'users.name as created_by_name')
      .leftJoin('users', 'jobs.created_by', 'users.id')
      .where('jobs.id', id)
      .first();

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job: updatedJob }
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
    const existingJob = await db('jobs').where('id', id).first();
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (existingJob.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own jobs'
      });
    }

    await db('jobs').where('id', id).del();

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
