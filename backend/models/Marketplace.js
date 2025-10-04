const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    minlength: [2, 'Business name must be at least 2 characters'],
    maxlength: [255, 'Business name cannot exceed 255 characters']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    minlength: [2, 'Owner name must be at least 2 characters'],
    maxlength: [255, 'Owner name cannot exceed 255 characters']
  },
  productService: {
    type: String,
    required: [true, 'Product/Service description is required'],
    minlength: [10, 'Product/Service description must be at least 10 characters']
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      minlength: [10, 'Address must be at least 10 characters']
    }
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
marketplaceSchema.index({ location: 1 });
marketplaceSchema.index({ language: 1 });
marketplaceSchema.index({ createdBy: 1 });
marketplaceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Marketplace', marketplaceSchema);