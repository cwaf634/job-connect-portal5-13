import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Application {
  id: number;
  studentName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  govtLink: string;
  qualifications: string[];
  experience: string;
  hasDocument: boolean;
  shopkeeper: string;
  coverLetter: string;
  documentName?: string;
}

interface Shopkeeper {
  id: number;
  name: string;
  email: string;
  phone?: string;
  shop?: string;
  shopName?: string;
  location: string;
  totalApplications: number;
  status: 'active' | 'inactive';
  joinedDate?: string;
}

interface ApplicationContextType {
  applications: Application[];
  shopkeepers: Shopkeeper[];
  addApplication: (application: Application) => void;
  updateApplicationStatus: (applicationId: number, status: 'accepted' | 'rejected') => void;
  getShopkeeperApplications: (shopkeeperName: string) => Application[];
  getActiveShopkeepers: () => Shopkeeper[];
  addShopkeeper: (shopkeeper: Shopkeeper) => void;
  updateShopkeeper: (id: number, shopkeeper: Partial<Shopkeeper>) => void;
  deleteShopkeeper: (id: number) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};

interface ApplicationProviderProps {
  children: ReactNode;
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({ children }) => {
  // Start with empty applications - only real applications will be added
  const [applications, setApplications] = useState<Application[]>([]);

  // Keep registered shopkeepers from admin panel
  const [shopkeepers, setShopkeepers] = useState<Shopkeeper[]>([
    {
      id: 1,
      name: 'Main Shop Owner',
      email: 'shopowner@jobconnect.com',
      shopName: 'Government Job Portal Shop',
      location: 'Delhi, India',
      totalApplications: 0,
      status: 'active',
      joinedDate: '2024-01-10'
    }
  ]);

  const addApplication = (application: Application) => {
    const newApplication = {
      ...application,
      id: Date.now()
    };
    setApplications(prev => [...prev, newApplication]);
    
    // Update shopkeeper's total applications count
    setShopkeepers(prev => prev.map(shopkeeper => 
      shopkeeper.shopName === application.shopkeeper || shopkeeper.name === application.shopkeeper
        ? { ...shopkeeper, totalApplications: shopkeeper.totalApplications + 1 }
        : shopkeeper
    ));
  };

  const updateApplicationStatus = (applicationId: number, status: 'accepted' | 'rejected') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status }
          : app
      )
    );
  };

  const getShopkeeperApplications = (shopkeeperName: string) => {
    return applications.filter(app => 
      app.shopkeeper === shopkeeperName || 
      shopkeepers.find(s => s.name === shopkeeperName)?.shopName === app.shopkeeper
    );
  };

  const getActiveShopkeepers = () => {
    return shopkeepers.filter(shopkeeper => shopkeeper.status === 'active');
  };

  const addShopkeeper = (shopkeeper: Shopkeeper) => {
    setShopkeepers(prev => [...prev, shopkeeper]);
  };

  const updateShopkeeper = (id: number, updatedShopkeeper: Partial<Shopkeeper>) => {
    setShopkeepers(prev => prev.map(shopkeeper => 
      shopkeeper.id === id 
        ? { ...shopkeeper, ...updatedShopkeeper }
        : shopkeeper
    ));
  };

  const deleteShopkeeper = (id: number) => {
    setShopkeepers(prev => prev.filter(shopkeeper => shopkeeper.id !== id));
  };

  const value: ApplicationContextType = {
    applications,
    shopkeepers,
    addApplication,
    updateApplicationStatus,
    getShopkeeperApplications,
    getActiveShopkeepers,
    addShopkeeper,
    updateShopkeeper,
    deleteShopkeeper
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};
