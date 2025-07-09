
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  resume: {
    filename: String,
    originalName: String,
    path: String,
    size: Number
  },
  documents: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedDate: Date,
  reviewNotes: String,
  shopkeeper: {
    type: String,
    required: true
  },
  jobTitle: String,
  department: String,
  location: String,
  salary: String,
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
applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound indexes for efficient queries
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ status: 1, appliedDate: -1 });
applicationSchema.index({ shopkeeper: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
