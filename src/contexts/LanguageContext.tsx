
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'english' | 'odia' | 'hindi';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  english: {
    // Header
    jobConnect: 'JobConnect',
    governmentJobPortal: 'Government Job Portal',
    login: 'Login',
    register: 'Register',
    
    // Navigation
    dashboard: 'Dashboard',
    jobs: 'Jobs',
    applications: 'My Applications',
    studentApplications: 'Student Applications',
    certificates: 'Certificates',
    mockTests: 'Mock Tests',
    subscription: 'Subscription',
    chat: 'Chat',
    notifications: 'Notifications',
    profile: 'Profile',
    logout: 'Logout',
    
    // Hero Section
    revolutionizing: 'Revolutionizing Job Search & Certificate Verification',
    gatewayTo: 'Your Gateway to',
    verifiedSuccess: 'Verified Success',
    heroDescription: 'Connect students, employers, and institutions through our comprehensive platform for certificate verification and job placement.',
    
    // User Panels
    students: 'Students',
    studentsDesc: 'Upload certificates, apply for jobs',
    employers: 'Employers',
    employersDesc: 'Post jobs, hire verified candidates',
    administrators: 'Administrators',
    administratorsDesc: 'Verify certificates, manage platform',
    
    // Application Status
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
    applied: 'Applied',
    
    // Common Actions
    viewDetails: 'View Details',
    applyNow: 'Apply Now',
    accept: 'Accept',
    reject: 'Reject',
    chatWith: 'Chat with',
  },
  odia: {
    // Header
    jobConnect: 'ଜବ୍‌କନେକ୍ଟ',
    governmentJobPortal: 'ସରକାରୀ ଚାକିରି ପୋର୍ଟାଲ',
    login: 'ଲଗଇନ୍',
    register: 'ରେଜିଷ୍ଟର',
    
    // Navigation
    dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    jobs: 'ଚାକିରି',
    applications: 'ମୋର ଆବେଦନ',
    studentApplications: 'ଛାତ୍ର ଆବେଦନ',
    certificates: 'ସାର୍ଟିଫିକେଟ୍',
    mockTests: 'ମକ୍ ଟେଷ୍ଟ',
    subscription: 'ସବସ୍କ୍ରିପ୍ସନ୍',
    chat: 'ଚାଟ୍',
    notifications: 'ବିଜ୍ଞପ୍ତି',
    profile: 'ପ୍ରୋଫାଇଲ୍',
    logout: 'ଲଗଆଉଟ୍',
    
    // Hero Section
    revolutionizing: 'ଚାକିରି ସନ୍ଧାନ ଏବଂ ସାର୍ଟିଫିକେଟ୍ ଯାଞ୍ଚରେ ବିପ୍ଳବ',
    gatewayTo: 'ଆପଣଙ୍କର ଗେଟୱେ',
    verifiedSuccess: 'ଯାଞ୍ଚିତ ସଫଳତା',
    heroDescription: 'ସାର୍ଟିଫିକେଟ୍ ଯାଞ୍ଚ ଏବଂ ଚାକିରି ନିଯୁକ୍ତି ପାଇଁ ଆମର ବ୍ୟାପକ ପ୍ଲାଟଫର୍ମ ମାଧ୍ୟମରେ ଛାତ୍ର, ନିଯୁକ୍ତିଦାତା ଏବଂ ପ୍ରତିଷ୍ଠାନମାନଙ୍କୁ ସଂଯୋଗ କରନ୍ତୁ।',
    
    // User Panels
    students: 'ଛାତ୍ରମାନେ',
    studentsDesc: 'ସାର୍ଟିଫିକେଟ୍ ଅପଲୋଡ୍ କରନ୍ତୁ, ଚାକିରି ପାଇଁ ଆବେଦନ କରନ୍ତୁ',
    employers: 'ନିଯୁକ୍ତିଦାତା',
    employersDesc: 'ଚାକିରି ପୋଷ୍ଟ କରନ୍ତୁ, ଯାଞ୍ଚିତ ପ୍ରାର୍ଥୀ ନିଯୁକ୍ତି କରନ୍ତୁ',
    administrators: 'ପ୍ରଶାସକ',
    administratorsDesc: 'ସାର୍ଟିଫିକେଟ୍ ଯାଞ୍ଚ କରନ୍ତୁ, ପ୍ଲାଟଫର୍ମ ପରିଚାଳନା କରନ୍ତୁ',
    
    // Application Status
    pending: 'ବିଚାରାଧୀନ',
    accepted: 'ଗ୍ରହଣ କରାଯାଇଛି',
    rejected: 'ପ୍ରତ୍ୟାଖ୍ୟାନ',
    applied: 'ଆବେଦନ କରିଛନ୍ତି',
    
    // Common Actions
    viewDetails: 'ବିସ୍ତୃତ ବିବରଣୀ ଦେଖନ୍ତୁ',
    applyNow: 'ବର୍ତ୍ତମାନ ଆବେଦନ କରନ୍ତୁ',
    accept: 'ଗ୍ରହଣ କରନ୍ତୁ',
    reject: 'ପ୍ରତ୍ୟାଖ୍ୟାନ କରନ୍ତୁ',
    chatWith: 'ସହିତ ଚାଟ୍ କରନ୍ତୁ',
  },
  hindi: {
    // Header
    jobConnect: 'जॉबकनेक्ट',
    governmentJobPortal: 'सरकारी नौकरी पोर्टल',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    
    // Navigation
    dashboard: 'डैशबोर्ड',
    jobs: 'नौकरियाँ',
    applications: 'मेरे आवेदन',
    studentApplications: 'छात्र आवेदन',
    certificates: 'प्रमाणपत्र',
    mockTests: 'मॉक टेस्ट',
    subscription: 'सब्सक्रिप्शन',
    chat: 'चैट',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    
    // Hero Section
    revolutionizing: 'नौकरी खोज और प्रमाणपत्र सत्यापन में क्रांति',
    gatewayTo: 'आपका गेटवे',
    verifiedSuccess: 'सत्यापित सफलता',
    heroDescription: 'प्रमाणपत्र सत्यापन और नौकरी की नियुक्ति के लिए हमारे व्यापक प्लेटफॉर्म के माध्यम से छात्रों, नियोक्ताओं और संस्थानों को जोड़ें।',
    
    // User Panels
    students: 'छात्र',
    studentsDesc: 'प्रमाणपत्र अपलोड करें, नौकरी के लिए आवेदन करें',
    employers: 'नियोक्ता',
    employersDesc: 'नौकरी पोस्ट करें, सत्यापित उम्मीदवारों को नियुक्त करें',
    administrators: 'प्रशासक',
    administratorsDesc: 'प्रमाणपत्र सत्यापित करें, प्लेटफॉर्म प्रबंधित करें',
    
    // Application Status
    pending: 'लंबित',
    accepted: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    applied: 'आवेदन किया',
    
    // Common Actions
    viewDetails: 'विवरण देखें',
    applyNow: 'अभी आवेदन करें',
    accept: 'स्वीकार करें',
    reject: 'अस्वीकार करें',
    chatWith: 'के साथ चैट करें',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key as keyof typeof translations.english] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
