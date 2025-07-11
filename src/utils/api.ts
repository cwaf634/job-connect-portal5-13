const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('jobconnect_token');
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (userData: any) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  getCurrentUser: () => apiRequest('/auth/me'),
  
  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
};

// Users API calls
export const usersAPI = {
  getAllUsers: () => apiRequest('/users'),
  
  getUserById: (id: string) => apiRequest(`/users/${id}`),
  
  updateUser: (id: string, userData: any) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  deleteUser: (id: string) =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Jobs API calls
export const jobsAPI = {
  getAllJobs: () => apiRequest('/jobs'),
  
  getJobById: (id: string) => apiRequest(`/jobs/${id}`),
  
  createJob: (jobData: any) =>
    apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    }),
  
  updateJob: (id: string, jobData: any) =>
    apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    }),
  
  deleteJob: (id: string) =>
    apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    }),
};

// Applications API calls
export const applicationsAPI = {
  getAllApplications: () => apiRequest('/applications'),
  
  getApplicationById: (id: string) => apiRequest(`/applications/${id}`),
  
  submitApplication: (applicationData: any) =>
    apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),
  
  updateApplicationStatus: (id: string, status: string) =>
    apiRequest(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Certificates API calls
export const certificatesAPI = {
  getAllCertificates: () => apiRequest('/certificates'),
  
  getUserCertificates: (userId: string) => apiRequest(`/certificates/user/${userId}`),
  
  uploadCertificate: (certificateData: any) =>
    apiRequest('/certificates', {
      method: 'POST',
      body: JSON.stringify(certificateData),
    }),
  
  verifyCertificate: (id: string, verificationData: any) =>
    apiRequest(`/certificates/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify(verificationData),
    }),
};

// Subscriptions API calls
export const subscriptionsAPI = {
  getAllPlans: () => apiRequest('/subscriptions/plans'),
  
  getUserSubscription: (userId: string) => apiRequest(`/subscriptions/user/${userId}`),
  
  createSubscription: (subscriptionData: any) =>
    apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    }),
  
  updateSubscription: (id: string, subscriptionData: any) =>
    apiRequest(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subscriptionData),
    }),
};

// Mock Tests API calls
export const mockTestsAPI = {
  getAllTests: () => apiRequest('/mock-tests'),
  
  getTestById: (id: string) => apiRequest(`/mock-tests/${id}`),
  
  submitTestResult: (resultData: any) =>
    apiRequest('/mock-tests/results', {
      method: 'POST',
      body: JSON.stringify(resultData),
    }),
  
  getUserTestResults: (userId: string) => apiRequest(`/mock-tests/results/user/${userId}`),
};

// Notifications API calls
export const notificationsAPI = {
  getUserNotifications: (userId: string) => apiRequest(`/notifications/user/${userId}`),
  
  markAsRead: (id: string) =>
    apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    }),
  
  createNotification: (notificationData: any) =>
    apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    }),
};

// Shopkeepers API calls
export const shopkeepersAPI = {
  getAllShopkeepers: () => apiRequest('/shopkeepers'),
  
  verifyShopkeeper: (id: string, verificationData: any) =>
    apiRequest(`/shopkeepers/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify(verificationData),
    }),
};

// Chat API calls
export const chatAPI = {
  getConversations: (userId: string) => apiRequest(`/chat/conversations/${userId}`),
  
  getMessages: (conversationId: string) => apiRequest(`/chat/messages/${conversationId}`),
  
  sendMessage: (messageData: any) =>
    apiRequest('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),
};

export default {
  authAPI,
  usersAPI,
  jobsAPI,
  applicationsAPI,
  certificatesAPI,
  subscriptionsAPI,
  mockTestsAPI,
  notificationsAPI,
  shopkeepersAPI,
  chatAPI,
};
