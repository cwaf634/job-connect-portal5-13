
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userType: {
    type: String,
    enum: ['student', 'employer', 'admin'],
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Student specific fields
  studentDetails: {
    dateOfBirth: Date,
    address: String,
    education: String,
    experience: String,
    skills: [String],
    resume: String,
    certificates: [{
      name: String,
      url: String,
      uploadDate: Date,
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      }
    }],
    subscriptionPlan: {
      type: String,
      default: 'basic'
    },
    subscriptionExpiry: Date,
    mockTestsCompleted: {
      type: Number,
      default: 0
    }
  },
  // Employer specific fields
  employerDetails: {
    companyName: String,
    companyAddress: String,
    companyPhone: String,
    shopName: String,
    location: String,
    businessLicense: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  // Admin specific fields
  adminDetails: {
    permissions: [String],
    lastLogin: Date
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
