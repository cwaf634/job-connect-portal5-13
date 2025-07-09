
const express = require('express');
const multer = require('multer');
const path = require('path');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Multer configuration for certificate uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/certificates/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cert-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  }
});

// Upload certificate (student only)
router.post('/', auth, authorize('student'), upload.single('certificate'), async (req, res) => {
  try {
    const { name, type, issuer, issueDate, expiryDate, credentialId, verificationUrl } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Certificate file is required' });
    }

    const certificate = new Certificate({
      studentId: req.user._id,
      name,
      type,
      issuer,
      issueDate: new Date(issueDate),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      credentialId,
      verificationUrl,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

    await certificate.save();

    // Update user's certificate array
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        'studentDetails.certificates': {
          name: certificate.name,
          url: `/uploads/certificates/${req.file.filename}`,
          uploadDate: new Date(),
          status: 'pending'
        }
      }
    });

    res.status(201).json({
      message: 'Certificate uploaded successfully',
      certificate
    });
  } catch (error) {
    console.error('Upload certificate error:', error);
    res.status(500).json({ message: 'Failed to upload certificate', error: error.message });
  }
});

// Get certificates for student
router.get('/student', auth, authorize('student'), async (req, res) => {
  try {
    const certificates = await Certificate.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ certificates });
  } catch (error) {
    console.error('Get student certificates error:', error);
    res.status(500).json({ message: 'Failed to fetch certificates', error: error.message });
  }
});

// Get all certificates for verification (admin only)
router.get('/admin', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { issuer: { $regex: search, $options: 'i' } }
      ];
    }

    const certificates = await Certificate.find(query)
      .populate('studentId', 'name email')
      .populate('verifiedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Certificate.countDocuments(query);

    res.json({
      certificates,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get admin certificates error:', error);
    res.status(500).json({ message: 'Failed to fetch certificates', error: error.message });
  }
});

// Verify/reject certificate (admin only)
router.put('/:id/verify', auth, authorize('admin'), async (req, res) => {
  try {
    const { status, verificationNotes, rejectionReason } = req.body;

    const certificate = await Certificate.findById(req.params.id)
      .populate('studentId', 'name email');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    certificate.status = status;
    certificate.verifiedBy = req.user._id;
    certificate.verifiedDate = new Date();
    
    if (verificationNotes) certificate.verificationNotes = verificationNotes;
    if (rejectionReason) certificate.rejectionReason = rejectionReason;

    await certificate.save();

    // Update user's certificate status
    await User.findOneAndUpdate(
      { 
        _id: certificate.studentId._id,
        'studentDetails.certificates.name': certificate.name
      },
      {
        $set: {
          'studentDetails.certificates.$.status': status
        }
      }
    );

    // Create notification for student
    const notification = new Notification({
      userId: certificate.studentId._id,
      type: 'certificate_status',
      title: 'Certificate Status Update',
      message: `Your certificate "${certificate.name}" has been ${status}`,
      panel: 'student',
      relatedId: certificate._id,
      relatedModel: 'Certificate'
    });

    await notification.save();

    res.json({
      message: `Certificate ${status} successfully`,
      certificate
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ message: 'Failed to verify certificate', error: error.message });
  }
});

// Delete certificate
router.delete('/:id', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Check authorization
    const isOwner = req.user.userType === 'student' && 
                   certificate.studentId.toString() === req.user._id.toString();
    const isAdmin = req.user.userType === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Certificate.findByIdAndDelete(req.params.id);

    // Remove from user's certificate array
    if (req.user.userType === 'student') {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: {
          'studentDetails.certificates': { name: certificate.name }
        }
      });
    }

    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ message: 'Failed to delete certificate', error: error.message });
  }
});

module.exports = router;
