
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  qualifications: [{
    type: String,
    required: true
  }],
  experience: {
    type: String,
    required: true
  },
  govtLink: {
    type: String,
    required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopkeeper: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['central', 'state', 'local', 'psu'],
    default: 'state'
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract'],
    default: 'full-time'
  },
  applicationCount: {
    type: Number,
    default: 0
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
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search functionality
jobSchema.index({ title: 'text', department: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
