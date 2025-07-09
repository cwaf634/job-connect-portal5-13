
const express = require('express');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get notifications for user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    
    const query = { userId: req.user._id };
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const notifications = await Notification.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      isRead: false 
    });

    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read', error: error.message });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
});

// Clear all notifications
router.delete('/clear-all', auth, async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });

    res.json({ message: 'All notifications cleared successfully' });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({ message: 'Failed to clear all notifications', error: error.message });
  }
});

// Create notification (internal use - for other services)
router.post('/', auth, async (req, res) => {
  try {
    const notification = new Notification({
      ...req.body,
      userId: req.body.userId || req.user._id
    });

    await notification.save();

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Failed to create notification', error: error.message });
  }
});

module.exports = router;
