
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DataManager, localStorageUtils, STORAGE_KEYS } from '@/data/dataManager';

export interface Certificate {
  id: string;
  userId: string;
  certificateName: string;
  issueDate: string;
  certificateFile: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedDate?: string;
  description?: string;
  uploadDate: string;
}

interface CertificateContextType {
  certificates: Certificate[];
  addCertificate: (certificate: Omit<Certificate, 'id' | 'uploadDate'>) => void;
  updateCertificateStatus: (id: string, status: Certificate['status'], verifiedBy?: string) => void;
  deleteCertificate: (id: string) => void;
  getUserCertificates: (userId: string) => Certificate[];
  getPendingCertificates: () => Certificate[];
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const useCertificates = () => {
  const context = useContext(CertificateContext);
  if (context === undefined) {
    throw new Error('useCertificates must be used within a CertificateProvider');
  }
  return context;
};

interface CertificateProviderProps {
  children: ReactNode;
}

export const CertificateProvider: React.FC<CertificateProviderProps> = ({ children }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Load certificates from localStorage on component mount
  useEffect(() => {
    const storedCertificates = DataManager.getCertificates();
    setCertificates(storedCertificates);
  }, []);

  const addCertificate = (certificateData: Omit<Certificate, 'id' | 'uploadDate'>) => {
    const newCertificate = DataManager.addCertificate(certificateData);
    setCertificates(prev => [newCertificate, ...prev]);
  };

  const updateCertificateStatus = (id: string, status: Certificate['status'], verifiedBy?: string) => {
    const updatedCert = DataManager.updateCertificate(id, { 
      status, 
      verifiedBy, 
      verifiedDate: status === 'verified' ? new Date().toISOString().split('T')[0] : undefined 
    });
    
    if (updatedCert) {
      setCertificates(prev => prev.map(cert => cert.id === id ? updatedCert : cert));
    }
  };

  const deleteCertificate = (id: string) => {
    const success = DataManager.deleteCertificate(id);
    if (success) {
      setCertificates(prev => prev.filter(cert => cert.id !== id));
    }
  };

  const getUserCertificates = (userId: string) => {
    return DataManager.getCertificatesByUser(userId);
  };

  const getPendingCertificates = () => {
    return DataManager.getPendingCertificates();
  };

  const value: CertificateContextType = {
    certificates,
    addCertificate,
    updateCertificateStatus,
    deleteCertificate,
    getUserCertificates,
    getPendingCertificates
  };

  return (
    <CertificateContext.Provider value={value}>
      {children}
    </CertificateContext.Provider>
  );
};
