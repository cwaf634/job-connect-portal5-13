import { User } from '@/contexts/AuthContext';
import { SubscriptionPlan } from '@/contexts/SubscriptionPlansContext';

// Data interfaces
export interface Certificate {
  id: string;
  userId: string;
  certificateName: string;
  description?: string;
  issueDate: string;
  certificateFile: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedDate?: string;
  verifiedBy?: string;
  uploadDate: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  qualification: string;
  description: string;
  applicationDeadline: string;
  vacancies: number;
  ageLimit: string;
  category: string;
  examDate: string;
  syllabus: string[];
  applicationFee: string;
  selectionProcess: string;
}

export interface MockTest {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalQuestions: number;
  difficulty: string;
  description: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface UserSubscription {
  userId: string;
  planId: string;
  planName: string;
  subscribedAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface AdminPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  maxUsers: number;
  storage: string;
  support: string;
  status: string;
  isPopular: boolean;
  color: string;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

// Storage keys
export const STORAGE_KEYS = {
  USERS: 'jobconnect_users',
  CERTIFICATES: 'jobconnect_certificates',
  JOBS: 'jobconnect_jobs',
  MOCK_TESTS: 'jobconnect_mock_tests',
  USER_SUBSCRIPTIONS: 'jobconnect_user_subscriptions',
  SUBSCRIPTION_PLANS: 'jobconnect_subscription_plans',
  ADMIN_PLANS: 'jobconnect_admin_plans',
  APPLIED_JOBS: 'jobconnect_applied_jobs',
  MOCK_TEST_RESULTS: 'jobconnect_mock_test_results'
} as const;

// Local storage utility functions
export const localStorageUtils = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorageUtils.remove(key);
    });
  }
};

// Data manager class
export class DataManager {
  // Certificate management
  static getCertificates(): Certificate[] {
    return localStorageUtils.get(STORAGE_KEYS.CERTIFICATES, []);
  }

  static addCertificate(certificate: Omit<Certificate, 'id' | 'uploadDate'>): Certificate {
    const certificates = this.getCertificates();
    const newCertificate: Certificate = {
      ...certificate,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    // Add to the beginning of the array (top)
    certificates.unshift(newCertificate);
    localStorageUtils.set(STORAGE_KEYS.CERTIFICATES, certificates);
    return newCertificate;
  }

  static updateCertificate(id: string, updates: Partial<Certificate>): Certificate | null {
    const certificates = this.getCertificates();
    const index = certificates.findIndex(cert => cert.id === id);
    
    if (index !== -1) {
      certificates[index] = { ...certificates[index], ...updates };
      localStorageUtils.set(STORAGE_KEYS.CERTIFICATES, certificates);
      return certificates[index];
    }
    return null;
  }

  static deleteCertificate(id: string): boolean {
    const certificates = this.getCertificates();
    const filtered = certificates.filter(cert => cert.id !== id);
    
    if (filtered.length !== certificates.length) {
      localStorageUtils.set(STORAGE_KEYS.CERTIFICATES, filtered);
      return true;
    }
    return false;
  }

  static getCertificatesByUser(userId: string): Certificate[] {
    return this.getCertificates().filter(cert => cert.userId === userId);
  }

  static getPendingCertificates(): Certificate[] {
    return this.getCertificates().filter(cert => cert.status === 'pending');
  }

  // User management
  static getUsers(): User[] {
    return localStorageUtils.get(STORAGE_KEYS.USERS, []);
  }

  static addUser(user: Omit<User, 'id'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: Date.now().toString()
    };
    
    // Add to the beginning of the array (top)
    users.unshift(newUser);
    localStorageUtils.set(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  static updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorageUtils.set(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    return null;
  }

  // Subscription plans management
  static getSubscriptionPlans(): SubscriptionPlan[] {
    return localStorageUtils.get(STORAGE_KEYS.SUBSCRIPTION_PLANS, []);
  }

  static addSubscriptionPlan = this.addAdminPlan;
  static updateSubscriptionPlan = this.updateAdminPlan;
  static deleteSubscriptionPlan = this.deleteAdminPlan;

  static getAdminPlans(): AdminPlan[] {
    return localStorageUtils.get(STORAGE_KEYS.ADMIN_PLANS, []);
  }

  static addAdminPlan(plan: Omit<AdminPlan, 'id'>): AdminPlan {
    const plans = this.getAdminPlans();
    const newPlan: AdminPlan = {
      ...plan,
      id: Date.now().toString()
    };
    
    // Add to the beginning of the array (top)
    plans.unshift(newPlan);
    localStorageUtils.set(STORAGE_KEYS.ADMIN_PLANS, plans);
    
    // Also sync to subscription plans for student panel
    this.syncAdminPlansToSubscriptionPlans();
    return newPlan;
  }

  static updateAdminPlan(id: string, updates: Partial<AdminPlan>): AdminPlan | null {
    const plans = this.getAdminPlans();
    const index = plans.findIndex(plan => plan.id === id);
    
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updates };
      localStorageUtils.set(STORAGE_KEYS.ADMIN_PLANS, plans);
      
      // Sync changes to subscription plans
      this.syncAdminPlansToSubscriptionPlans();
      return plans[index];
    }
    return null;
  }

  static deleteAdminPlan(id: string): boolean {
    const plans = this.getAdminPlans();
    const filtered = plans.filter(plan => plan.id !== id);
    
    if (filtered.length !== plans.length) {
      localStorageUtils.set(STORAGE_KEYS.ADMIN_PLANS, filtered);
      
      // Sync changes to subscription plans
      this.syncAdminPlansToSubscriptionPlans();
      return true;
    }
    return false;
  }

  // Sync admin plans to subscription plans for student panel
  static syncAdminPlansToSubscriptionPlans(): void {
    const adminPlans = this.getAdminPlans();
    const subscriptionPlans: SubscriptionPlan[] = adminPlans
      .filter(plan => plan.status === 'active')
      .map(plan => ({
        id: plan.id,
        name: plan.name,
        price: plan.price === 0 ? '₹0' : `₹${plan.price}`,
        period: plan.duration === 'monthly' ? '/month' : '/year',
        features: plan.features,
        isPopular: plan.isPopular,
        iconColor: this.getIconColorFromColor(plan.color),
        bgColor: this.getBgColorFromColor(plan.color),
        borderColor: this.getBorderColorFromColor(plan.color)
      }));
    
    localStorageUtils.set(STORAGE_KEYS.SUBSCRIPTION_PLANS, subscriptionPlans);
  }

  private static getIconColorFromColor(color: string): string {
    const colorMap = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-500';
  }

  private static getBgColorFromColor(color: string): string {
    const colorMap = {
      blue: 'bg-blue-50',
      green: 'bg-green-50',
      purple: 'bg-purple-50',
      orange: 'bg-orange-50'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-50';
  }

  private static getBorderColorFromColor(color: string): string {
    const colorMap = {
      blue: 'border-blue-200',
      green: 'border-green-200',
      purple: 'border-purple-200',
      orange: 'border-orange-200'
    };
    return colorMap[color as keyof typeof colorMap] || 'border-gray-200';
  }

  // User subscriptions
  static getUserSubscriptions(): UserSubscription[] {
    return localStorageUtils.get(STORAGE_KEYS.USER_SUBSCRIPTIONS, []);
  }

  static addUserSubscription(subscription: UserSubscription): void {
    const subscriptions = this.getUserSubscriptions();
    const existingIndex = subscriptions.findIndex(sub => sub.userId === subscription.userId);
    
    if (existingIndex !== -1) {
      subscriptions[existingIndex] = subscription;
    } else {
      subscriptions.push(subscription);
    }
    
    localStorageUtils.set(STORAGE_KEYS.USER_SUBSCRIPTIONS, subscriptions);
  }

  static getUserSubscription(userId: string): UserSubscription | null {
    const subscriptions = this.getUserSubscriptions();
    return subscriptions.find(sub => sub.userId === userId) || null;
  }

  // Initialize default data
  static initializeDefaultData(): void {
    // Initialize default admin plans if none exist
    const adminPlans = this.getAdminPlans();
    if (adminPlans.length === 0) {
      const defaultPlans: Omit<AdminPlan, 'id'>[] = [
        {
          name: 'Basic',
          price: 0,
          duration: 'monthly',
          description: 'Perfect for getting started',
          features: ['5 Mock Tests', 'Basic job search', 'Certificate upload', 'Email notifications'],
          maxUsers: 1,
          storage: '1GB',
          support: 'Email',
          status: 'active',
          isPopular: false,
          color: 'blue',
          iconColor: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        },
        {
          name: 'Premium',
          price: 299,
          duration: 'monthly',
          description: 'Most popular choice for job seekers',
          features: ['50 Mock Tests', 'Priority job applications', 'Direct shopkeeper contact', '24/7 chat support', 'Resume optimization', 'Advanced mock tests'],
          maxUsers: 1,
          storage: '10GB',
          support: 'Email & Chat',
          status: 'active',
          isPopular: true,
          color: 'green',
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        },
        {
          name: 'Enterprise',
          price: 999,
          duration: 'monthly',
          description: 'Complete solution for serious job seekers',
          features: ['All Premium features', 'Unlimited applications', 'Personal career advisor', 'Interview preparation', 'Unlimited mock tests', 'Priority support'],
          maxUsers: 1,
          storage: '50GB',
          support: '24/7 Phone & Chat',
          status: 'active',
          isPopular: false,
          color: 'purple',
          iconColor: 'text-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        }
      ];

      defaultPlans.forEach(plan => this.addAdminPlan(plan));
    }

    // Initialize default users if none exist
    const users = this.getUsers();
    if (users.length === 0) {
      const defaultUsers: Omit<User, 'id'>[] = [
        {
          _id: 'student_demo_001',
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
          _id: 'employer_demo_001',
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
          _id: 'admin_demo_001',
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

      defaultUsers.forEach(user => this.addUser(user));
    }
  }
}

// Initialize data when module loads
DataManager.initializeDefaultData();
