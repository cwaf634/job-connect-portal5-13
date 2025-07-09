
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dummySubscriptionPlans, localStorageUtils, STORAGE_KEYS } from '@/data/dummyData';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular: boolean;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

interface SubscriptionPlansContextType {
  plans: SubscriptionPlan[];
  addPlan: (plan: SubscriptionPlan) => void;
  updatePlan: (id: string, plan: Partial<SubscriptionPlan>) => void;
  deletePlan: (id: string) => void;
}

const SubscriptionPlansContext = createContext<SubscriptionPlansContextType | undefined>(undefined);

export const useSubscriptionPlans = () => {
  const context = useContext(SubscriptionPlansContext);
  if (context === undefined) {
    throw new Error('useSubscriptionPlans must be used within a SubscriptionPlansProvider');
  }
  return context;
};

interface SubscriptionPlansProviderProps {
  children: ReactNode;
}

export const SubscriptionPlansProvider: React.FC<SubscriptionPlansProviderProps> = ({ children }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  // Load plans from localStorage on component mount
  useEffect(() => {
    const storedPlans = localStorageUtils.get(STORAGE_KEYS.SUBSCRIPTION_PLANS, []);
    if (storedPlans.length > 0) {
      setPlans(storedPlans);
    } else {
      setPlans(dummySubscriptionPlans);
    }
  }, []);

  // Save to localStorage whenever plans change
  useEffect(() => {
    if (plans.length > 0) {
      localStorageUtils.set(STORAGE_KEYS.SUBSCRIPTION_PLANS, plans);
    }
  }, [plans]);


  const addPlan = (plan: SubscriptionPlan) => {
    setPlans(prev => [...prev, plan]);
  };

  const updatePlan = (id: string, updatedPlan: Partial<SubscriptionPlan>) => {
    setPlans(prev => prev.map(plan => 
      plan.id === id ? { ...plan, ...updatedPlan } : plan
    ));
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const value: SubscriptionPlansContextType = {
    plans,
    addPlan,
    updatePlan,
    deletePlan
  };

  return (
    <SubscriptionPlansContext.Provider value={value}>
      {children}
    </SubscriptionPlansContext.Provider>
  );
};
