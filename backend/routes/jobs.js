
const express = require('express');
const Job = require('../models/Job');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, location, category } = req.query;
    
    const query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Failed to fetch job', error: error.message });
  }
});

// Create job (admin/employer only)
router.post('/', auth, authorize('admin', 'employer'), async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user._id
    };

    // For employers, use their shop name
    if (req.user.userType === 'employer' && req.user.employerDetails) {
      jobData.shopkeeper = req.user.employerDetails.shopName || req.user.name;
    }

    const job = new Job(jobData);
    await job.save();

    const populatedJob = await Job.findById(job._id).populate('postedBy', 'name email');

    res.status(201).json({ 
      message: 'Job created successfully', 
      job: populatedJob 
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
});

// Update job
router.put('/:id', auth, authorize('admin', 'employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if employer owns this job
    if (req.user.userType === 'employer' && job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email');

    res.json({ message: 'Job updated successfully', job: updatedJob });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
});

// Delete job
router.delete('/:id', auth, authorize('admin', 'employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if employer owns this job
    if (req.user.userType === 'employer' && job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
});

// Get jobs by employer
router.get('/employer/:employerId', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.params.employerId })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    console.error('Get employer jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch employer jobs', error: error.message });
  }
});

module.exports = router;
