const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Job = require('../models/Job');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const MockTest = require('../models/MockTest');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await SubscriptionPlan.deleteMany({});
    await MockTest.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@jobconnect.com',
      password: 'admin123',
      userType: 'admin',
      phone: '+91-9876543210',
      adminDetails: {
        permissions: ['all'],
        lastLogin: new Date()
      }
    });

    await adminUser.save();
    console.log('👤 Created admin user');

    // Create employer/shopkeeper user
    const employerUser = new User({
      name: 'Shop Owner',
      email: 'shopowner@jobconnect.com',
      password: 'shop123',
      userType: 'employer',
      phone: '+91-9876543211',
      employerDetails: {
        companyName: 'Government Job Portal Services',
        shopName: 'Main Job Portal Shop',
        location: 'Delhi, India',
        verificationStatus: 'verified'
      }
    });

    await employerUser.save();
    console.log('🏪 Created shop owner user');

    // Create student user
    const studentUser = new User({
      name: 'Student User',
      email: 'student@jobconnect.com',
      password: 'student123',
      userType: 'student',
      phone: '+91-9876543212',
      studentDetails: {
        education: 'B.Tech Computer Science',
        experience: 'Fresher',
        skills: ['JavaScript', 'React', 'Node.js'],
        subscriptionPlan: 'basic',
        mockTestsCompleted: 0
      }
    });

    await studentUser.save();
    console.log('🎓 Created student user');

    // Create subscription plans
    const subscriptionPlans = [
      {
        name: 'Basic',
        price: '₹0',
        period: '',
        features: [
          '5 Mock Tests',
          'Basic job search',
          'Certificate upload',
          'Email notifications'
        ],
        mockTestLimit: 5,
        applicationLimit: 10,
        prioritySupport: false,
        directContact: false,
        isPopular: false,
        iconColor: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      },
      {
        name: 'Premium',
        price: '₹299',
        period: '/month',
        features: [
          '50 Mock Tests',
          'Priority job applications',
          'Direct shopkeeper contact',
          '24/7 chat support',
          'Resume optimization',
          'Advanced mock tests'
        ],
        mockTestLimit: 50,
        applicationLimit: -1,
        prioritySupport: true,
        directContact: true,
        isPopular: true,
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      {
        name: 'Enterprise',
        price: '₹999',
        period: '/month',
        features: [
          'All Premium features',
          'Unlimited applications',
          'Personal career advisor',
          'Interview preparation',
          'Unlimited mock tests',
          'Priority support'
        ],
        mockTestLimit: -1,
        applicationLimit: -1,
        prioritySupport: true,
        directContact: true,
        isPopular: false,
        iconColor: 'text-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      }
    ];

    await SubscriptionPlan.insertMany(subscriptionPlans);
    console.log('💳 Created subscription plans');

    // Create sample jobs
    const sampleJobs = [
      {
        title: 'Staff Selection Commission - Junior Engineer',
        department: 'Public Works Department',
        location: 'New Delhi',
        salary: '₹35,000 - ₹1,12,000',
        description: 'Applications are invited for the post of Junior Engineer in various government departments.',
        qualifications: ['B.Tech/B.E. in Civil/Mechanical/Electrical Engineering', 'Age limit: 18-27 years'],
        experience: 'Fresher',
        govtLink: 'https://ssc.nic.in',
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        postedBy: employerUser._id,
        shopkeeper: 'Main Job Portal Shop',
        category: 'central'
      },
      {
        title: 'Banking Personnel Selection Institute - Probationary Officer',
        department: 'Banking Services',
        location: 'Mumbai, Maharashtra',
        salary: '₹23,700 - ₹42,020',
        description: 'Recruitment for Probationary Officers in various nationalized banks.',
        qualifications: ['Graduate in any discipline', 'Age limit: 20-30 years'],
        experience: 'Fresher to 2 years',
        govtLink: 'https://ibps.in',
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        postedBy: employerUser._id,
        shopkeeper: 'Main Job Portal Shop',
        category: 'central'
      },
      {
        title: 'Railway Recruitment Board - Assistant Loco Pilot',
        department: 'Indian Railways',
        location: 'Multiple Locations',
        salary: '₹19,900 - ₹35,400',
        description: 'Recruitment for Assistant Loco Pilot positions in Indian Railways.',
        qualifications: ['ITI/Diploma in relevant field', 'Age limit: 18-28 years'],
        experience: 'Fresher',
        govtLink: 'https://rrbcdg.gov.in',
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        postedBy: employerUser._id,
        shopkeeper: 'Main Job Portal Shop',
        category: 'central'
      }
    ];

    await Job.insertMany(sampleJobs);
    console.log('💼 Created sample jobs');

    // Create sample mock test
    const mockTest = new MockTest({
      title: 'General Knowledge Mock Test',
      description: 'Test your general knowledge with this comprehensive mock test.',
      category: 'general',
      difficulty: 'medium',
      duration: 60,
      totalQuestions: 10,
      passingScore: 60,
      questions: [
        {
          question: 'Who is the current Prime Minister of India?',
          options: ['Narendra Modi', 'Rahul Gandhi', 'Arvind Kejriwal', 'Mamata Banerjee'],
          correctAnswer: 0,
          explanation: 'Narendra Modi is the current Prime Minister of India.',
          marks: 1
        },
        {
          question: 'What is the capital of Rajasthan?',
          options: ['Jodhpur', 'Udaipur', 'Jaipur', 'Kota'],
          correctAnswer: 2,
          explanation: 'Jaipur is the capital city of Rajasthan.',
          marks: 1
        },
        {
          question: 'Which is the longest river in India?',
          options: ['Yamuna', 'Ganga', 'Godavari', 'Krishna'],
          correctAnswer: 1,
          explanation: 'The Ganga is the longest river in India.',
          marks: 1
        },
        {
          question: 'In which year did India gain independence?',
          options: ['1945', '1946', '1947', '1948'],
          correctAnswer: 2,
          explanation: 'India gained independence on August 15, 1947.',
          marks: 1
        },
        {
          question: 'Who wrote the Indian National Anthem?',
          options: ['Rabindranath Tagore', 'Bankim Chandra Chattopadhyay', 'Sarojini Naidu', 'Mahatma Gandhi'],
          correctAnswer: 0,
          explanation: 'The Indian National Anthem was written by Rabindranath Tagore.',
          marks: 1
        },
        {
          question: 'What is the currency of India?',
          options: ['Dollar', 'Pound', 'Rupee', 'Euro'],
          correctAnswer: 2,
          explanation: 'The Indian Rupee is the official currency of India.',
          marks: 1
        },
        {
          question: 'Which planet is known as the Red Planet?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          correctAnswer: 1,
          explanation: 'Mars is known as the Red Planet due to its reddish appearance.',
          marks: 1
        },
        {
          question: 'Who is known as the Father of the Nation in India?',
          options: ['Jawaharlal Nehru', 'Subhash Chandra Bose', 'Mahatma Gandhi', 'Sardar Patel'],
          correctAnswer: 2,
          explanation: 'Mahatma Gandhi is known as the Father of the Nation in India.',
          marks: 1
        },
        {
          question: 'What is the largest state in India by area?',
          options: ['Maharashtra', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh'],
          correctAnswer: 2,
          explanation: 'Rajasthan is the largest state in India by area.',
          marks: 1
        },
        {
          question: 'Which is the national bird of India?',
          options: ['Eagle', 'Peacock', 'Sparrow', 'Parrot'],
          correctAnswer: 1,
          explanation: 'The Peacock is the national bird of India.',
          marks: 1
        }
      ],
      createdBy: adminUser._id
    });

    await mockTest.save();
    console.log('📝 Created sample mock test');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Admin: admin@jobconnect.com / admin123');
    console.log('Shop Owner: shopowner@jobconnect.com / shop123');
    console.log('Student: student@jobconnect.com / student123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedData();
