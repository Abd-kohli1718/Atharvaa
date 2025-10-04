const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Scheme title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  eligibility: {
    type: String,
    required: [true, 'Eligibility criteria is required'],
    minlength: [10, 'Eligibility criteria must be at least 10 characters']
  },
  link: {
    type: String,
    required: [true, 'Official link is required'],
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    minlength: [2, 'Category must be at least 2 characters'],
    maxlength: [100, 'Category cannot exceed 100 characters']
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
schemeSchema.index({ category: 1 });
schemeSchema.index({ language: 1 });
schemeSchema.index({ createdBy: 1 });
schemeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Scheme', schemeSchema);