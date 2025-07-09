// Dummy data for the JobConnect application
import { User } from '@/contexts/AuthContext';
import { SubscriptionPlan } from '@/contexts/SubscriptionPlansContext';

export const dummyUsers: User[] = [
  {
    id: '1',
    email: 'student@jobconnect.com',
    name: 'Rahul Kumar',
    userType: 'student',
    subscriptionTier: 'Premium',
    profilePhoto: '',
    profile: {
      phone: '+91 9876543210',
      location: 'Mumbai, Maharashtra',
      bio: 'Engineering student seeking government job opportunities',
      skills: ['Computer Skills', 'Communication'],
      experience: '1 year',
      company: '',
      department: ''
    }
  },
  {
    id: '2',
    email: 'shopowner@jobconnect.com',
    name: 'Main Shop Owner',
    userType: 'employer',
    subscriptionTier: 'Basic',
    profilePhoto: '',
    profile: {
      phone: '+91 9876543211',
      location: 'Delhi, India',
      bio: 'Government job portal shop owner',
      skills: [],
      experience: '5 years',
      company: 'Government Job Portal Shop',
      department: 'Job Services'
    }
  },
  {
    id: '3',
    email: 'admin@jobconnect.com',
    name: 'Demo Administrator',
    userType: 'administrator',
    subscriptionTier: 'Pro',
    profilePhoto: '',
    profile: {
      phone: '+91 9876543212',
      location: 'New Delhi, India',
      bio: 'System administrator',
      skills: ['Administration', 'Management'],
      experience: '10 years',
      company: 'JobConnect Admin',
      department: 'Administration'
    }
  }
];

export const dummySubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹0',
    period: '',
    iconColor: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    features: [
      '5 Mock Tests',
      'Basic job search',
      'Certificate upload',
      'Email notifications'
    ],
    isPopular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹299',
    period: '/month',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      '50 Mock Tests',
      'Priority job applications',
      'Direct shopkeeper contact',
      '24/7 chat support',
      'Resume optimization',
      'Advanced mock tests'
    ],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '₹999',
    period: '/month',
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: [
      'All Premium features',
      'Unlimited applications',
      'Personal career advisor',
      'Interview preparation',
      'Unlimited mock tests',
      'Priority support'
    ],
    isPopular: false
  }
];

export const dummyJobs = [
  {
    id: 1,
    title: 'Junior Clerk',
    department: 'Public Works Department',
    location: 'Mumbai, Maharashtra',
    salary: '₹15,000 - ₹25,000',
    type: 'Full-time',
    experience: 'Fresher',
    qualification: 'Graduate',
    description: 'Responsible for maintaining records and assisting with administrative tasks.',
    applicationDeadline: '2024-02-15',
    vacancies: 10,
    ageLimit: '18-30 years',
    category: 'General',
    examDate: '2024-03-01',
    syllabus: ['General Knowledge', 'English', 'Mathematics', 'Reasoning'],
    applicationFee: '₹500',
    selectionProcess: 'Written Test + Interview'
  },
  {
    id: 2,
    title: 'Assistant Manager',
    department: 'Rural Development',
    location: 'Delhi, NCR',
    salary: '₹25,000 - ₹40,000',
    type: 'Full-time',
    experience: '2+ years',
    qualification: 'Post Graduate',
    description: 'Oversee rural development projects and coordinate with local authorities.',
    applicationDeadline: '2024-02-20',
    vacancies: 5,
    ageLimit: '21-35 years',
    category: 'Management',
    examDate: '2024-03-10',
    syllabus: ['General Studies', 'Rural Development', 'Management', 'Current Affairs'],
    applicationFee: '₹750',
    selectionProcess: 'Written Test + Group Discussion + Interview'
  }
];

export const dummyCertificates = [
  {
    id: 1,
    certificateName: 'Computer Skills Certificate',
    issueDate: '2023-12-15',
    certificateFile: 'computer_certificate.pdf',
    status: 'verified' as const,
    verifiedBy: 'Admin',
    verifiedDate: '2024-01-10',
    description: 'Basic computer skills including MS Office'
  },
  {
    id: 2,
    certificateName: 'English Proficiency',
    issueDate: '2023-11-20',
    certificateFile: 'english_certificate.pdf',
    status: 'pending' as const,
    description: 'English language proficiency certificate'
  }
];

export const dummyMockTests = [
  {
    id: 1,
    title: 'General Knowledge Mock Test 1',
    subject: 'General Knowledge',
    duration: 60,
    totalQuestions: 50,
    difficulty: 'Medium',
    description: 'Test your general knowledge with current affairs and static GK',
    questions: [
      {
        id: 1,
        question: 'Who is the current President of India?',
        options: ['Ram Nath Kovind', 'Droupadi Murmu', 'APJ Abdul Kalam', 'Pranab Mukherjee'],
        correctAnswer: 1,
        explanation: 'Droupadi Murmu is the current President of India since July 2022.'
      },
      {
        id: 2,
        question: 'What is the capital of Assam?',
        options: ['Guwahati', 'Dispur', 'Silchar', 'Tezpur'],
        correctAnswer: 1,
        explanation: 'Dispur is the capital of Assam, while Guwahati is the largest city.'
      }
    ]
  }
];

// Local storage keys
export const STORAGE_KEYS = {
  USERS: 'jobconnect_registered_users',
  SUBSCRIPTION_PLANS: 'jobconnect_subscription_plans',
  CERTIFICATES: 'jobconnect_certificates',
  USER_SUBSCRIPTIONS: 'jobconnect_user_subscriptions',
  APPLIED_JOBS: 'jobconnect_applied_jobs',
  MOCK_TEST_RESULTS: 'jobconnect_mock_test_results'
} as const;

// Local storage utility functions
export const localStorageUtils = {
  // Generic get function
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  // Generic set function
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  },

  // Remove function
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  // Clear all JobConnect data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorageUtils.remove(key);
    });
  }
};