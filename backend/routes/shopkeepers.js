const express = require('express');
const User = require('../models/User');
const Application = require('../models/Application');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all shopkeepers (admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const query = { userType: 'employer' };
    if (status) query['employerDetails.verificationStatus'] = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'employerDetails.shopName': { $regex: search, $options: 'i' } }
      ];
    }

    const shopkeepers = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    // Get application counts for each shopkeeper
    const shopkeepersWithStats = await Promise.all(
      shopkeepers.map(async (shopkeeper) => {
        const totalApplications = await Application.countDocuments({
          shopkeeper: shopkeeper.employerDetails?.shopName || shopkeeper.name
        });

        return {
          ...shopkeeper.toObject(),
          totalApplications
        };
      })
    );

    const total = await User.countDocuments(query);

    res.json({
      shopkeepers: shopkeepersWithStats,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get shopkeepers error:', error);
    res.status(500).json({ message: 'Failed to fetch shopkeepers', error: error.message });
  }
});

// Get shopkeeper by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const shopkeeper = await User.findOne({
      _id: req.params.id,
      userType: 'employer'
    }).select('-password');

    if (!shopkeeper) {
      return res.status(404).json({ message: 'Shopkeeper not found' });
    }

    // Check authorization
    if (req.user.userType !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get application statistics
    const totalApplications = await Application.countDocuments({
      shopkeeper: shopkeeper.employerDetails?.shopName || shopkeeper.name
    });

    const pendingApplications = await Application.countDocuments({
      shopkeeper: shopkeeper.employerDetails?.shopName || shopkeeper.name,
      status: 'pending'
    });

    const acceptedApplications = await Application.countDocuments({
      shopkeeper: shopkeeper.employerDetails?.shopName || shopkeeper.name,
      status: 'accepted'
    });

    res.json({
      shopkeeper: {
        ...shopkeeper.toObject(),
        totalApplications,
        pendingApplications,
        acceptedApplications
      }
    });
  } catch (error) {
    console.error('Get shopkeeper error:', error);
    res.status(500).json({ message: 'Failed to fetch shopkeeper', error: error.message });
  }
});

// Update shopkeeper verification status (admin only)
router.put('/:id/verify', auth, authorize('admin'), async (req, res) => {
  try {
    const { verificationStatus, notes } = req.body;

    const shopkeeper = await User.findOneAndUpdate(
      { _id: req.params.id, userType: 'employer' },
      {
        'employerDetails.verificationStatus': verificationStatus,
        'employerDetails.verificationNotes': notes
      },
      { new: true }
    ).select('-password');

    if (!shopkeeper) {
      return res.status(404).json({ message: 'Shopkeeper not found' });
    }

    res.json({
      message: 'Shopkeeper verification status updated successfully',
      shopkeeper
    });
  } catch (error) {
    console.error('Update shopkeeper verification error:', error);
    res.status(500).json({ message: 'Failed to update verification status', error: error.message });
  }
});

// Delete shopkeeper (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const shopkeeper = await User.findOneAndDelete({
      _id: req.params.id,
      userType: 'employer'
    });

    if (!shopkeeper) {
      return res.status(404).json({ message: 'Shopkeeper not found' });
    }

    res.json({ message: 'Shopkeeper deleted successfully' });
  } catch (error) {
    console.error('Delete shopkeeper error:', error);
    res.status(500).json({ message: 'Failed to delete shopkeeper', error: error.message });
  }
});

// Get shopkeeper dashboard stats
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const shopkeeper = await User.findOne({
      _id: req.params.id,
      userType: 'employer'
    });

    if (!shopkeeper) {
      return res.status(404).json({ message: 'Shopkeeper not found' });
    }

    // Check authorization
    if (req.user.userType !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const shopName = shopkeeper.employerDetails?.shopName || shopkeeper.name;

    // Get application statistics
    const totalApplications = await Application.countDocuments({
      shopkeeper: shopName
    });

    const pendingApplications = await Application.countDocuments({
      shopkeeper: shopName,
      status: 'pending'
    });

    const acceptedApplications = await Application.countDocuments({
      shopkeeper: shopName,
      status: 'accepted'
    });

    const rejectedApplications = await Application.countDocuments({
      shopkeeper: shopName,
      status: 'rejected'
    });

    // Get recent applications
    const recentApplications = await Application.find({
      shopkeeper: shopName
    })
    .populate('studentId', 'name email')
    .populate('jobId', 'title')
    .sort({ appliedDate: -1 })
    .limit(5);

    res.json({
      stats: {
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications
      },
      recentApplications
    });
  } catch (error) {
    console.error('Get shopkeeper stats error:', error);
    res.status(500).json({ message: 'Failed to fetch shopkeeper stats', error: error.message });
  }
});

module.exports = router;
