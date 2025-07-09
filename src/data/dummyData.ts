// Re-export from the new data manager for compatibility
export { 
  DataManager,
  localStorageUtils, 
  STORAGE_KEYS,
  type Certificate,
  type Job,
  type MockTest,
  type UserSubscription,
  type AdminPlan
} from './dataManager';

import { User } from '@/contexts/AuthContext';
import { SubscriptionPlan } from '@/contexts/SubscriptionPlansContext';
import { DataManager } from './dataManager';

// Legacy compatibility - these will be loaded from localStorage via DataManager
export const dummyUsers: User[] = DataManager.getUsers();
export const dummySubscriptionPlans: SubscriptionPlan[] = DataManager.getSubscriptionPlans();

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