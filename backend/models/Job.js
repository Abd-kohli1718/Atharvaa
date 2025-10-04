const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    minlength: [2, 'Category must be at least 2 characters'],
    maxlength: [100, 'Category cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    minlength: [2, 'Location must be at least 2 characters'],
    maxlength: [255, 'Location cannot exceed 255 characters']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    minlength: [2, 'Language must be at least 2 characters'],
    maxlength: [50, 'Language cannot exceed 50 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
jobSchema.index({ category: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ language: 1 });
jobSchema.index({ createdBy: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);