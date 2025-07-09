
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['academic', 'professional', 'skill', 'other'],
    required: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  expiryDate: Date,
  file: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedDate: Date,
  rejectionReason: String,
  verificationNotes: String,
  credentialId: String,
  verificationUrl: String,
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
certificateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
certificateSchema.index({ studentId: 1, status: 1 });
certificateSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Certificate', certificateSchema);
