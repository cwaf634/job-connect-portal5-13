
const mongoose = require('mongoose');

const mockTestResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MockTest',
    required: true
  },
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean,
    timeSpent: Number // in seconds
  }],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  wrongAnswers: {
    type: Number,
    required: true
  },
  skippedAnswers: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number,
    required: true // in seconds
  },
  percentage: {
    type: Number,
    required: true
  },
  isPassed: {
    type: Boolean,
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
mockTestResultSchema.index({ studentId: 1, completedAt: -1 });
mockTestResultSchema.index({ testId: 1, isPassed: 1 });

module.exports = mongoose.model('MockTestResult', mockTestResultSchema);
