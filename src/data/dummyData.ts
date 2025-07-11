
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

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedDate: string;
  documents: string[];
}

export interface MockTestResult {
  id: string;
  userId: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
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

export interface UserSubscription {
  userId: string;
  planId: string;
  planName: string;
  subscribedAt: string;
  expiresAt: string;
  isActive: boolean;
}

// Storage keys
export const STORAGE_KEYS = {
  USERS: 'jobconnect_users',
  CERTIFICATES: 'jobconnect_certificates',
  JOBS: 'jobconnect_jobs',
  APPLICATIONS: 'jobconnect_applications',
  MOCK_TEST_RESULTS: 'jobconnect_mock_test_results',
  SUBSCRIPTION_PLANS: 'jobconnect_subscription_plans',
  ADMIN_PLANS: 'jobconnect_admin_plans',
  USER_SUBSCRIPTIONS: 'jobconnect_user_subscriptions',
  NOTIFICATIONS: 'jobconnect_notifications'
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
  }
};

// Data manager class
export class DataManager {
  // User management
  static getUsers(): User[] {
    return localStorageUtils.get(STORAGE_KEYS.USERS, []);
  }

  static addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorageUtils.set(STORAGE_KEYS.USERS, users);
  }

  // Job management
  static getJobs(): Job[] {
    return localStorageUtils.get(STORAGE_KEYS.JOBS, []);
  }

  static addJob(job: Job): void {
    const jobs = this.getJobs();
    jobs.push(job);
    localStorageUtils.set(STORAGE_KEYS.JOBS, jobs);
  }

  // Application management
  static getApplications(): Application[] {
    return localStorageUtils.get(STORAGE_KEYS.APPLICATIONS, []);
  }

  static addApplication(application: Application): void {
    const applications = this.getApplications();
    applications.push(application);
    localStorageUtils.set(STORAGE_KEYS.APPLICATIONS, applications);
  }

  // Certificate management
  static getCertificates(): Certificate[] {
    return localStorageUtils.get(STORAGE_KEYS.CERTIFICATES, []);
  }

  static addCertificate(certificate: Certificate): void {
    const certificates = this.getCertificates();
    certificates.push(certificate);
    localStorageUtils.set(STORAGE_KEYS.CERTIFICATES, certificates);
  }

  // Mock test results
  static getMockTestResults(): MockTestResult[] {
    return localStorageUtils.get(STORAGE_KEYS.MOCK_TEST_RESULTS, []);
  }

  static addMockTestResult(result: MockTestResult): void {
    const results = this.getMockTestResults();
    results.push(result);
    localStorageUtils.set(STORAGE_KEYS.MOCK_TEST_RESULTS, results);
  }

  // Subscription plans
  static getSubscriptionPlans(): SubscriptionPlan[] {
    return localStorageUtils.get(STORAGE_KEYS.SUBSCRIPTION_PLANS, []);
  }

  static addSubscriptionPlan(plan: SubscriptionPlan): void {
    const plans = this.getSubscriptionPlans();
    plans.push(plan);
    localStorageUtils.set(STORAGE_KEYS.SUBSCRIPTION_PLANS, plans);
  }

  // Admin plans
  static getAdminPlans(): AdminPlan[] {
    return localStorageUtils.get(STORAGE_KEYS.ADMIN_PLANS, []);
  }

  static addAdminPlan(plan: Omit<AdminPlan, 'id'>): AdminPlan {
    const plans = this.getAdminPlans();
    const newPlan: AdminPlan = {
      ...plan,
      id: Date.now().toString()
    };
    plans.unshift(newPlan);
    localStorageUtils.set(STORAGE_KEYS.ADMIN_PLANS, plans);
    
    // Sync to subscription plans
    this.syncAdminPlansToSubscriptionPlans();
    return newPlan;
  }

  static updateAdminPlan(id: string, updates: Partial<AdminPlan>): AdminPlan | null {
    const plans = this.getAdminPlans();
    const index = plans.findIndex(plan => plan.id === id);
    
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updates };
      localStorageUtils.set(STORAGE_KEYS.ADMIN_PLANS, plans);
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
      this.syncAdminPlansToSubscriptionPlans();
      return true;
    }
    return false;
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

  // Notifications
  static getNotifications(): Notification[] {
    return localStorageUtils.get(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  static addNotification(notification: Notification): void {
    const notifications = this.getNotifications();
    notifications.push(notification);
    localStorageUtils.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  // Sync admin plans to subscription plans
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

  // Initialize default data
  static initializeDefaultData(): void {
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
  }
}

// Initialize data when module loads
DataManager.initializeDefaultData();
