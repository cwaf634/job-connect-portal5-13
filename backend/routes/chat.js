
const express = require('express');
const Chat = require('../models/Chat');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's chats
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.userId': req.user._id,
      isActive: true
    })
    .populate('participants.userId', 'name email profilePicture')
    .populate('applicationId', 'jobTitle status')
    .sort({ updatedAt: -1 });

    res.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Failed to fetch chats', error: error.message });
  }
});

// Get chat by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants.userId', 'name email profilePicture')
      .populate('applicationId', 'jobTitle status');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p.userId._id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ chat });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ message: 'Failed to fetch chat', error: error.message });
  }
});

// Create or get existing chat
router.post('/', auth, async (req, res) => {
  try {
    const { participantId, applicationId } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      $and: [
        { 'participants.userId': req.user._id },
        { 'participants.userId': participantId },
        { applicationId: applicationId }
      ]
    }).populate('participants.userId', 'name email profilePicture');

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [
          {
            userId: req.user._id,
            userType: req.user.userType,
            name: req.user.name
          },
          {
            userId: participantId,
            userType: req.user.userType === 'student' ? 'employer' : 'student'
          }
        ],
        applicationId: applicationId || null
      });

      await chat.save();
      
      chat = await Chat.findById(chat._id)
        .populate('participants.userId', 'name email profilePicture')
        .populate('applicationId', 'jobTitle status');
    }

    res.json({ chat });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Failed to create chat', error: error.message });
  }
});

// Send message
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { message, messageType = 'text' } = req.body;

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add message to chat
    const newMessage = {
      senderId: req.user._id,
      message,
      messageType,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = {
      message,
      timestamp: new Date(),
      senderId: req.user._id
    };

    await chat.save();

    // Populate the chat with user details for response
    const updatedChat = await Chat.findById(chat._id)
      .populate('participants.userId', 'name email profilePicture')
      .populate('messages.senderId', 'name profilePicture');

    res.json({
      message: 'Message sent successfully',
      chat: updatedChat
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

// Mark messages as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark messages as read for current user
    chat.messages.forEach(msg => {
      if (msg.senderId.toString() !== req.user._id.toString() && !msg.isRead) {
        msg.isRead = true;
        msg.readAt = new Date();
      }
    });

    await chat.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Failed to mark messages as read', error: error.message });
  }
});

module.exports = router;
