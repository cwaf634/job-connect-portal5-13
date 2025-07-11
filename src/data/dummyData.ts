import { Job, User, SubscriptionPlan, Application, Certificate, MockTestResult, Notification } from '@/types';

// Storage keys
export const STORAGE_KEYS = {
  USERS: 'jobconnect_users',
  CURRENT_USER: 'jobconnect_current_user',
  JOBS: 'jobconnect_jobs',
  APPLICATIONS: 'jobconnect_applications',
  CERTIFICATES: 'jobconnect_certificates',
  MOCK_TEST_RESULTS: 'jobconnect_mock_test_results',
  SUBSCRIPTION_PLANS: 'jobconnect_subscription_plans',
  USER_SUBSCRIPTIONS: 'jobconnect_user_subscriptions',
  NOTIFICATIONS: 'jobconnect_notifications'
};

// LocalStorage utility functions
export const localStorageUtils = {
  get: (key: string, defaultValue: any) => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return defaultValue;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
};

// Dummy user data
export const dummyUsers: User[] = [
  {
    id: '1',
    email: 'student@jobconnect.com',
    name: 'Demo Student',
    userType: 'student',
    subscriptionTier: 'Basic',
    profilePhoto: '',
    profile: {
      phone: '123-456-7890',
      location: 'New York',
      bio: 'Aspiring software engineer',
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: '2 years',
      company: '',
      department: ''
    }
  },
  {
    id: '2',
    email: 'shopowner@jobconnect.com',
    name: 'Demo Shop Owner',
    userType: 'employer',
    profilePhoto: '',
    profile: {
      phone: '987-654-3210',
      location: 'Los Angeles',
      bio: 'Local business owner',
      skills: [],
      experience: '',
      company: 'Acme Corp',
      department: ''
    }
  },
  {
    id: '3',
    email: 'admin@jobconnect.com',
    name: 'Demo Administrator',
    userType: 'admin',
    profilePhoto: '',
    profile: {
      phone: '555-123-4567',
      location: 'Chicago',
      bio: 'System administrator',
      skills: ['System Administration', 'Networking'],
      experience: '5 years',
      company: '',
      department: ''
    }
  }
];

// Dummy job data
export const dummyJobs: Job[] = [
  {
    id: '101',
    title: 'Software Engineer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    description: 'Develop and maintain web applications.',
    requirements: ['Bachelor\'s degree', '3+ years experience', 'JavaScript, React'],
    salary: '$120,000 - $150,000',
    postedDate: '2024-01-20',
    applicationDeadline: '2024-02-28',
    contactEmail: 'hr@techinnovations.com',
    jobType: 'Full-time',
    category: 'Technology',
    employerId: '2'
  },
  {
    id: '102',
    title: 'Marketing Manager',
    company: 'Global Marketing Solutions',
    location: 'New York, NY',
    description: 'Lead marketing campaigns and strategies.',
    requirements: ['Bachelor\'s degree', '5+ years experience', 'Marketing strategy, Analytics'],
    salary: '$100,000 - $130,000',
    postedDate: '2024-01-15',
    applicationDeadline: '2024-02-20',
    contactEmail: 'careers@globalmarketing.com',
    jobType: 'Full-time',
    category: 'Marketing',
    employerId: '2'
  },
  {
    id: '103',
    title: 'Data Analyst',
    company: 'Data Insights Corp',
    location: 'Chicago, IL',
    description: 'Analyze data to provide insights and recommendations.',
    requirements: ['Bachelor\'s degree', '2+ years experience', 'Data analysis, SQL, Python'],
    salary: '$90,000 - $110,000',
    postedDate: '2024-01-10',
    applicationDeadline: '2024-02-15',
    contactEmail: 'jobs@datainsights.com',
    jobType: 'Full-time',
    category: 'Analytics',
    employerId: '2'
  }
];

// Dummy application data
export const dummyApplications: Application[] = [
  {
    id: '201',
    jobId: '101',
    applicantId: '1',
    applicationDate: '2024-01-25',
    status: 'Pending',
    resumeUrl: 'https://example.com/resume1.pdf',
    coverLetter: 'Enthusiastic software engineer eager to contribute to Tech Innovations Inc.'
  },
  {
    id: '202',
    jobId: '102',
    applicantId: '1',
    applicationDate: '2024-01-22',
    status: 'Reviewed',
    resumeUrl: 'https://example.com/resume2.pdf',
    coverLetter: 'Experienced marketing professional ready to drive growth for Global Marketing Solutions.'
  }
];

// Dummy certificate data
export const dummyCertificates: Certificate[] = [
  {
    id: '301',
    name: 'Certified Scrum Master',
    url: 'https://example.com/csm.pdf',
    uploadDate: '2023-11-15',
    status: 'verified',
    studentId: '1'
  },
  {
    id: '302',
    name: 'AWS Certified Developer',
    url: 'https://example.com/aws.pdf',
    uploadDate: '2023-10-20',
    status: 'pending',
    studentId: '1'
  }
];

// Dummy mock test result data
export const dummyMockTestResults: MockTestResult[] = [
  {
    id: '401',
    testName: 'JavaScript Basics',
    score: 85,
    dateTaken: '2024-01-18',
    studentId: '1'
  },
  {
    id: '402',
    testName: 'React Fundamentals',
    score: 92,
    dateTaken: '2024-01-25',
    studentId: '1'
  }
];

// Dummy subscription plan data
export const dummySubscriptionPlans: SubscriptionPlan[] = [
  {
    id: '501',
    name: 'Basic',
    price: '₹0',
    period: 'monthly',
    features: ['Access to basic mock tests', 'Limited job listings'],
    isPopular: false,
    iconColor: 'text-gray-500',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200'
  },
  {
    id: '502',
    name: 'Premium',
    price: '₹499',
    period: 'monthly',
    features: ['Unlimited mock tests', 'Featured job listings', 'Priority support'],
    isPopular: true,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: '503',
    name: 'Enterprise',
    price: '₹999',
    period: 'monthly',
    features: ['All premium features', 'Direct contact with employers', 'Personalized career coaching'],
    isPopular: false,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
];

// Dummy notification data
export const dummyNotifications: Notification[] = [
  {
    id: '601',
    type: 'application',
    message: 'Your application for Software Engineer at Tech Innovations Inc. has been reviewed.',
    date: '2024-01-28',
    isRead: false,
    userId: '1'
  },
  {
    id: '602',
    type: 'certificate',
    message: 'Your Certified Scrum Master certificate has been verified.',
    date: '2024-01-27',
    isRead: true,
    userId: '1'
  }
];

// DataManager to encapsulate data access and manipulation
export const DataManager = {
  getUsers: (): User[] => {
    return localStorageUtils.get(STORAGE_KEYS.USERS, dummyUsers);
  },
  getJobs: (): Job[] => {
    return localStorageUtils.get(STORAGE_KEYS.JOBS, dummyJobs);
  },
  getApplications: (): Application[] => {
    return localStorageUtils.get(STORAGE_KEYS.APPLICATIONS, dummyApplications);
  },
  getCertificates: (): Certificate[] => {
    return localStorageUtils.get(STORAGE_KEYS.CERTIFICATES, dummyCertificates);
  },
  getMockTestResults: (): MockTestResult[] => {
    return localStorageUtils.get(STORAGE_KEYS.MOCK_TEST_RESULTS, dummyMockTestResults);
  },
  getSubscriptionPlans: (): SubscriptionPlan[] => {
    return localStorageUtils.get(STORAGE_KEYS.SUBSCRIPTION_PLANS, dummySubscriptionPlans);
  },
  getNotifications: (): Notification[] => {
    return localStorageUtils.get(STORAGE_KEYS.NOTIFICATIONS, dummyNotifications);
  },
  addUser: (user: User) => {
    const users = DataManager.getUsers();
    localStorageUtils.set(STORAGE_KEYS.USERS, [...users, user]);
  },
  addJob: (job: Job) => {
    const jobs = DataManager.getJobs();
    localStorageUtils.set(STORAGE_KEYS.JOBS, [...jobs, job]);
  },
  addApplication: (application: Application) => {
    const applications = DataManager.getApplications();
    localStorageUtils.set(STORAGE_KEYS.APPLICATIONS, [...applications, application]);
  },
  addCertificate: (certificate: Certificate) => {
    const certificates = DataManager.getCertificates();
    localStorageUtils.set(STORAGE_KEYS.CERTIFICATES, [...certificates, certificate]);
  },
  addMockTestResult: (mockTestResult: MockTestResult) => {
    const mockTestResults = DataManager.getMockTestResults();
    localStorageUtils.set(STORAGE_KEYS.MOCK_TEST_RESULTS, [...mockTestResults, mockTestResult]);
  },
  addSubscriptionPlan: (subscriptionPlan: SubscriptionPlan) => {
    const subscriptionPlans = DataManager.getSubscriptionPlans();
    localStorageUtils.set(STORAGE_KEYS.SUBSCRIPTION_PLANS, [...subscriptionPlans, subscriptionPlan]);
  },
  addNotification: (notification: Notification) => {
    const notifications = DataManager.getNotifications();
    localStorageUtils.set(STORAGE_KEYS.NOTIFICATIONS, [...notifications, notification]);
  },
  updateUser: (id: string, updatedUser: Partial<User>) => {
    const users = DataManager.getUsers();
    const updatedUsers = users.map(user => user.id === id ? { ...user, ...updatedUser } : user);
    localStorageUtils.set(STORAGE_KEYS.USERS, updatedUsers);
  },
   updateJob: (id: string, updatedJob: Partial<Job>) => {
    const jobs = DataManager.getJobs();
    const updatedJobs = jobs.map(job => job.id === id ? { ...job, ...updatedJob } : job);
    localStorageUtils.set(STORAGE_KEYS.JOBS, updatedJobs);
  },
  updateApplication: (id: string, updatedApplication: Partial<Application>) => {
    const applications = DataManager.getApplications();
    const updatedApplications = applications.map(application => application.id === id ? { ...application, ...updatedApplication } : application);
    localStorageUtils.set(STORAGE_KEYS.APPLICATIONS, updatedApplications);
  },
  updateCertificate: (id: string, updatedCertificate: Partial<Certificate>) => {
    const certificates = DataManager.getCertificates();
    const updatedCertificates = certificates.map(certificate => certificate.id === id ? { ...certificate, ...updatedCertificate } : certificate);
    localStorageUtils.set(STORAGE_KEYS.CERTIFICATES, updatedCertificates);
  },
  updateMockTestResult: (id: string, updatedMockTestResult: Partial<MockTestResult>) => {
    const mockTestResults = DataManager.getMockTestResults();
    const updatedMockTestResults = mockTestResults.map(mockTestResult => mockTestResult.id === id ? { ...mockTestResult, ...updatedMockTestResult } : mockTestResult);
    localStorageUtils.set(STORAGE_KEYS.MOCK_TEST_RESULTS, updatedMockTestResults);
  },
  updateSubscriptionPlan: (id: string, updatedSubscriptionPlan: Partial<SubscriptionPlan>) => {
    const subscriptionPlans = DataManager.getSubscriptionPlans();
    const updatedSubscriptionPlans = subscriptionPlans.map(subscriptionPlan => subscriptionPlan.id === id ? { ...subscriptionPlan, ...updatedSubscriptionPlan } : subscriptionPlan);
    localStorageUtils.set(STORAGE_KEYS.SUBSCRIPTION_PLANS, updatedSubscriptionPlans);
  },
  updateNotification: (id: string, updatedNotification: Partial<Notification>) => {
    const notifications = DataManager.getNotifications();
    const updatedNotifications = notifications.map(notification => notification.id === id ? { ...notification, ...updatedNotification } : notification);
    localStorageUtils.set(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
  },
  deleteUser: (id: string) => {
    const users = DataManager.getUsers();
    const updatedUsers = users.filter(user => user.id !== id);
    localStorageUtils.set(STORAGE_KEYS.USERS, updatedUsers);
  },
  deleteJob: (id: string) => {
    const jobs = DataManager.getJobs();
    const updatedJobs = jobs.filter(job => job.id !== id);
    localStorageUtils.set(STORAGE_KEYS.JOBS, updatedJobs);
  },
  deleteApplication: (id: string) => {
    const applications = DataManager.getApplications();
    const updatedApplications = applications.filter(application => application.id !== id);
    localStorageUtils.set(STORAGE_KEYS.APPLICATIONS, updatedApplications);
  },
  deleteCertificate: (id: string) => {
    const certificates = DataManager.getCertificates();
    const updatedCertificates = certificates.filter(certificate => certificate.id !== id);
    localStorageUtils.set(STORAGE_KEYS.CERTIFICATES, updatedCertificates);
  },
  deleteMockTestResult: (id: string) => {
    const mockTestResults = DataManager.getMockTestResults();
    const updatedMockTestResults = mockTestResults.filter(mockTestResult => mockTestResult.id !== id);
    localStorageUtils.set(STORAGE_KEYS.MOCK_TEST_RESULTS, updatedMockTestResults);
  },
  deleteSubscriptionPlan: (id: string) => {
    const subscriptionPlans = DataManager.getSubscriptionPlans();
    const updatedSubscriptionPlans = subscriptionPlans.filter(subscriptionPlan => subscriptionPlan.id !== id);
    localStorageUtils.set(STORAGE_KEYS.SUBSCRIPTION_PLANS, updatedSubscriptionPlans);
  },
  deleteNotification: (id: string) => {
    const notifications = DataManager.getNotifications();
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    localStorageUtils.set(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
  }
};
