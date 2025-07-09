import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { localStorageUtils, STORAGE_KEYS, dummyCertificates } from '@/data/dummyData';

export interface Certificate {
  id: number;
  certificateName: string;
  issueDate: string;
  certificateFile: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedDate?: string;
  description?: string;
  userId?: string;
}

interface CertificateContextType {
  certificates: Certificate[];
  addCertificate: (certificate: Omit<Certificate, 'id'>) => void;
  updateCertificateStatus: (id: number, status: Certificate['status'], verifiedBy?: string) => void;
  deleteCertificate: (id: number) => void;
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
    const storedCertificates = localStorageUtils.get(STORAGE_KEYS.CERTIFICATES, []);
    if (storedCertificates.length > 0) {
      setCertificates(storedCertificates);
    } else {
      // Initialize with dummy certificates
      setCertificates(dummyCertificates);
    }
  }, []);

  // Save to localStorage whenever certificates change
  useEffect(() => {
    if (certificates.length > 0) {
      localStorageUtils.set(STORAGE_KEYS.CERTIFICATES, certificates);
    }
  }, [certificates]);

  const addCertificate = (certificateData: Omit<Certificate, 'id'>) => {
    const newCertificate: Certificate = {
      ...certificateData,
      id: Date.now(),
      status: 'pending'
    };
    
    setCertificates(prev => [newCertificate, ...prev]); // Add at top
  };

  const updateCertificateStatus = (id: number, status: Certificate['status'], verifiedBy?: string) => {
    setCertificates(prev => prev.map(cert => 
      cert.id === id 
        ? { 
            ...cert, 
            status, 
            verifiedBy, 
            verifiedDate: status === 'verified' ? new Date().toISOString().split('T')[0] : undefined 
          }
        : cert
    ));
  };

  const deleteCertificate = (id: number) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
  };

  const getUserCertificates = (userId: string) => {
    return certificates.filter(cert => cert.userId === userId);
  };

  const getPendingCertificates = () => {
    return certificates.filter(cert => cert.status === 'pending');
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