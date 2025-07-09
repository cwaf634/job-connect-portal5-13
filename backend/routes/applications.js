
const express = require('express');
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Multer configuration for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.includes('document');

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and image files are allowed'));
    }
  }
});

// Submit job application (students only)
router.post('/', auth, authorize('student'), upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    // Check if application deadline has passed
    if (new Date() > job.applicationDeadline) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      studentId: req.user._id,
      jobId: jobId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Process uploaded files
    let resume = null;
    const documents = [];

    if (req.files.resume) {
      resume = {
        filename: req.files.resume[0].filename,
        originalName: req.files.resume[0].originalname,
        path: req.files.resume[0].path,
        size: req.files.resume[0].size
      };
    }

    if (req.files.documents) {
      req.files.documents.forEach(file => {
        documents.push({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          type: path.extname(file.originalname).toLowerCase()
        });
      });
    }

    // Create application
    const application = new Application({
      studentId: req.user._id,
      jobId: jobId,
      studentName: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '',
      coverLetter,
      resume,
      documents,
      jobTitle: job.title,
      department: job.department,
      location: job.location,
      salary: job.salary,
      shopkeeper: job.shopkeeper
    });

    await application.save();

    // Update job application count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationCount: 1 }
    });

    // Create notification for employer
    const notification = new Notification({
      userId: job.postedBy,
      type: 'job_application',
      title: 'New Job Application',
      message: `${req.user.name} applied for ${job.title}`,
      panel: 'employer',
      relatedId: application._id,
      relatedModel: 'Application'
    });

    await notification.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
});

// Get applications for a student
router.get('/student', auth, authorize('student'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { studentId: req.user._id };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('jobId', 'title department location salary applicationDeadline')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appliedDate: -1 });

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get student applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
});

// Get applications for an employer
router.get('/employer', auth, authorize('employer'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Get jobs posted by this employer
    const employerJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = employerJobs.map(job => job._id);

    const query = { jobId: { $in: jobIds } };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('studentId', 'name email phone profilePicture studentDetails')
      .populate('jobId', 'title department location salary')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appliedDate: -1 });

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get employer applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
});

// Get all applications (admin only)
router.get('/admin', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Application.find(query)
      .populate('studentId', 'name email phone profilePicture')
      .populate('jobId', 'title department location salary')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appliedDate: -1 });

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get admin applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
});

// Update application status (employer/admin only)
router.put('/:id/status', auth, authorize('employer', 'admin'), async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    
    const application = await Application.findById(req.params.id)
      .populate('jobId', 'postedBy title')
      .populate('studentId', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if employer owns this job application
    if (req.user.userType === 'employer' && 
        application.jobId.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update application
    application.status = status;
    application.reviewedBy = req.user._id;
    application.reviewedDate = new Date();
    if (reviewNotes) application.reviewNotes = reviewNotes;

    await application.save();

    // Create notification for student
    const notification = new Notification({
      userId: application.studentId._id,
      type: 'application_status',
      title: 'Application Status Update',
      message: `Your application for ${application.jobId.title} has been ${status}`,
      panel: 'student',
      relatedId: application._id,
      relatedModel: 'Application'
    });

    await notification.save();

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Failed to update application status', error: error.message });
  }
});

// Get application by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('studentId', 'name email phone profilePicture studentDetails')
      .populate('jobId', 'title department location salary qualifications experience govtLink postedBy')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization
    const isStudent = req.user.userType === 'student' && 
                     application.studentId._id.toString() === req.user._id.toString();
    const isEmployer = req.user.userType === 'employer' && 
                      application.jobId.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.userType === 'admin';

    if (!isStudent && !isEmployer && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Failed to fetch application', error: error.message });
  }
});

// Withdraw application (student only)
router.put('/:id/withdraw', auth, authorize('student'), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot withdraw application that has been reviewed' });
    }

    application.status = 'withdrawn';
    await application.save();

    // Decrease job application count
    await Job.findByIdAndUpdate(application.jobId, {
      $inc: { applicationCount: -1 }
    });

    res.json({
      message: 'Application withdrawn successfully',
      application
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Failed to withdraw application', error: error.message });
  }
});

module.exports = router;
