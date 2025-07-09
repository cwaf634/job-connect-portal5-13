
const express = require('express');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all subscription plans
router.get('/', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ price: 1 });

    res.json({ plans });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({ message: 'Failed to fetch subscription plans', error: error.message });
  }
});

// Create subscription plan (admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const plan = new SubscriptionPlan(req.body);
    await plan.save();

    res.status(201).json({
      message: 'Subscription plan created successfully',
      plan
    });
  } catch (error) {
    console.error('Create subscription plan error:', error);
    res.status(500).json({ message: 'Failed to create subscription plan', error: error.message });
  }
});

// Update subscription plan (admin only)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    res.json({
      message: 'Subscription plan updated successfully',
      plan
    });
  } catch (error) {
    console.error('Update subscription plan error:', error);
    res.status(500).json({ message: 'Failed to update subscription plan', error: error.message });
  }
});

// Delete subscription plan (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    res.json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    console.error('Delete subscription plan error:', error);
    res.status(500).json({ message: 'Failed to delete subscription plan', error: error.message });
  }
});

// Subscribe to plan (student only)
router.post('/subscribe', auth, authorize('student'), async (req, res) => {
  try {
    const { planId, paymentMethod, paymentDetails } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    // Here you would typically integrate with a payment gateway
    // For now, we'll simulate a successful payment

    const user = await User.findById(req.user._id);
    
    // Update user subscription
    user.studentDetails.subscriptionPlan = plan.name.toLowerCase();
    user.studentDetails.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    await user.save();

    res.json({
      message: 'Subscription successful',
      plan: plan.name,
      expiryDate: user.studentDetails.subscriptionExpiry
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ message: 'Subscription failed', error: error.message });
  }
});

// Get user subscription status
router.get('/status', auth, authorize('student'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const subscriptionStatus = {
      currentPlan: user.studentDetails.subscriptionPlan || 'basic',
      expiryDate: user.studentDetails.subscriptionExpiry,
      isActive: user.studentDetails.subscriptionExpiry ? 
                new Date() < user.studentDetails.subscriptionExpiry : false
    };

    res.json({ subscriptionStatus });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ message: 'Failed to get subscription status', error: error.message });
  }
});

module.exports = router;
