
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userType: {
      type: String,
      enum: ['student', 'employer'],
      required: true
    },
    name: String
  }],
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  messages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      enum: ['text', 'file', 'image'],
      default: 'text'
    },
    file: {
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      mimetype: String
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastMessage: {
    message: String,
    timestamp: Date,
    senderId: mongoose.Schema.Types.ObjectId
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
chatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
chatSchema.index({ 'participants.userId': 1 });
chatSchema.index({ applicationId: 1 });
chatSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Chat', chatSchema);
