
const express = require('express');
const MockTest = require('../models/MockTest');
const MockTestResult = require('../models/MockTestResult');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all mock tests
router.get('/', auth, async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const tests = await MockTest.find(query)
      .select('-questions.correctAnswer -questions.explanation') // Hide answers for students
      .populate('createdBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await MockTest.countDocuments(query);

    res.json({
      tests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get mock tests error:', error);
    res.status(500).json({ message: 'Failed to fetch mock tests', error: error.message });
  }
});

// Get mock test by ID (for taking test)
router.get('/:id', auth, authorize('student'), async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id)
      .select('-questions.correctAnswer -questions.explanation');

    if (!test || !test.isActive) {
      return res.status(404).json({ message: 'Mock test not found' });
    }

    // Check if user has subscription limits
    const user = await User.findById(req.user._id);
    const subscriptionPlan = user.studentDetails?.subscriptionPlan || 'basic';
    const mockTestsCompleted = user.studentDetails?.mockTestsCompleted || 0;

    // Check limits based on subscription
    let hasAccess = true;
    if (subscriptionPlan === 'basic' && mockTestsCompleted >= 5) {
      hasAccess = false;
    }

    if (!hasAccess) {
      return res.status(403).json({ 
        message: 'Mock test limit reached. Please upgrade your subscription.' 
      });
    }

    res.json({ test });
  } catch (error) {
    console.error('Get mock test error:', error);
    res.status(500).json({ message: 'Failed to fetch mock test', error: error.message });
  }
});

// Submit mock test result
router.post('/:id/submit', auth, authorize('student'), async (req, res) => {
  try {
    const { answers, timeTaken, startedAt } = req.body;

    const test = await MockTest.findById(req.params.id);
    if (!test || !test.isActive) {
      return res.status(404).json({ message: 'Mock test not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let skippedAnswers = 0;

    const processedAnswers = answers.map((answer, index) => {
      const question = test.questions[index];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      
      if (answer.selectedAnswer === null || answer.selectedAnswer === undefined) {
        skippedAnswers++;
      } else if (isCorrect) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }

      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      };
    });

    const score = correctAnswers * (test.questions[0]?.marks || 1);
    const percentage = (correctAnswers / test.totalQuestions) * 100;
    const isPassed = percentage >= test.passingScore;

    // Create test result
    const result = new MockTestResult({
      studentId: req.user._id,
      testId: req.params.id,
      answers: processedAnswers,
      score,
      totalQuestions: test.totalQuestions,
      correctAnswers,
      wrongAnswers,
      skippedAnswers,
      timeTaken,
      percentage,
      isPassed,
      startedAt: new Date(startedAt)
    });

    await result.save();

    // Update user's mock test completion count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'studentDetails.mockTestsCompleted': 1 }
    });

    // Return result with correct answers for review
    const testWithAnswers = await MockTest.findById(req.params.id);
    
    res.json({
      message: 'Mock test completed successfully',
      result: {
        ...result.toObject(),
        test: {
          title: test.title,
          passingScore: test.passingScore,
          questions: testWithAnswers.questions.map((q, index) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            userAnswer: processedAnswers[index].selectedAnswer,
            isCorrect: processedAnswers[index].isCorrect
          }))
        }
      }
    });
  } catch (error) {
    console.error('Submit mock test error:', error);
    res.status(500).json({ message: 'Failed to submit mock test', error: error.message });
  }
});

// Get user's mock test results
router.get('/results/my-results', auth, authorize('student'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const results = await MockTestResult.find({ studentId: req.user._id })
      .populate('testId', 'title category difficulty')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ completedAt: -1 });

    const total = await MockTestResult.countDocuments({ studentId: req.user._id });

    res.json({
      results,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user mock test results error:', error);
    res.status(500).json({ message: 'Failed to fetch mock test results', error: error.message });
  }
});

// Create mock test (admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const test = new MockTest({
      ...req.body,
      createdBy: req.user._id
    });

    await test.save();

    res.status(201).json({
      message: 'Mock test created successfully',
      test
    });
  } catch (error) {
    console.error('Create mock test error:', error);
    res.status(500).json({ message: 'Failed to create mock test', error: error.message });
  }
});

// Update mock test (admin only)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const test = await MockTest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!test) {
      return res.status(404).json({ message: 'Mock test not found' });
    }

    res.json({
      message: 'Mock test updated successfully',
      test
    });
  } catch (error) {
    console.error('Update mock test error:', error);
    res.status(500).json({ message: 'Failed to update mock test', error: error.message });
  }
});

// Delete mock test (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const test = await MockTest.findByIdAndDelete(req.params.id);

    if (!test) {
      return res.status(404).json({ message: 'Mock test not found' });
    }

    // Also delete related results
    await MockTestResult.deleteMany({ testId: req.params.id });

    res.json({ message: 'Mock test deleted successfully' });
  } catch (error) {
    console.error('Delete mock test error:', error);
    res.status(500).json({ message: 'Failed to delete mock test', error: error.message });
  }
});

module.exports = router;
