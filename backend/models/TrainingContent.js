const mongoose = require('mongoose');

const trainingContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  type: {
    type: String,
    enum: ['video', 'pdf', 'text', 'infographic'],
    required: [true, 'Content type is required']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
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
trainingContentSchema.index({ type: 1 });
trainingContentSchema.index({ language: 1 });
trainingContentSchema.index({ createdBy: 1 });
trainingContentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('TrainingContent', trainingContentSchema);