
const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    required: true
  }],
  mockTestLimit: {
    type: Number,
    default: 5
  },
  applicationLimit: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  prioritySupport: {
    type: Boolean,
    default: false
  },
  directContact: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  iconColor: {
    type: String,
    default: 'text-gray-500'
  },
  bgColor: {
    type: String,
    default: 'bg-gray-50'
  },
  borderColor: {
    type: String,
    default: 'border-gray-200'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
subscriptionPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
