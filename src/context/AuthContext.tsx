"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import tutorService from '@/services/tutorService';
import axiosInstance from '@/lib/axios';

interface User {
  id: string;
  username: string;
  role: string;
  avatarUrl?: string;
  email?: string;
  fullName?: string;
}

export type TutorStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED' | 'NOT_STARTED';

interface AuthContextType {
  user: User | null;
  token: string | null;
  tutorStatus: TutorStatus;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshTutorStatus: () => Promise<void>;
  updateUser: (data: Partial<User>) => void; // Hàm đồng bộ dữ liệu nhanh
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tutorStatus, setTutorStatus] = useState<TutorStatus>('NOT_STARTED');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchTutorStatus = async (role: string) => {
    // Normalize role string (remove ROLE_ prefix)
    const normalizedRole = role?.startsWith('ROLE_') ? role.substring(5) : role;
    
    if (normalizedRole === 'STUDENT') {
      try {
        const response = await tutorService.getMyProfileStatus();
        const status = response?.result?.status || response?.status;
        if (status) {
          setTutorStatus(status as TutorStatus);
        }
      } catch (error) {
        // 404 is expected if profile doesn't exist
        setTutorStatus('NOT_STARTED');
      }
    } else if (normalizedRole === 'TUTOR' || normalizedRole === 'ADMIN') {
      setTutorStatus('APPROVED');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        
        // Immediate local user load to prevent unnecessary waiting for UI
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Standardize role field
          if (parsedUser.roleName && !parsedUser.role) {
            parsedUser.role = parsedUser.roleName.startsWith('ROLE_') ? parsedUser.roleName.substring(5) : parsedUser.roleName;
          }
          setUser(parsedUser);
          await fetchTutorStatus(parsedUser.role);
        }

        try {
          // Fetch fresh user info to get the latest avatarUrl/details
          const response: any = await axiosInstance.get('/users/my-info');
          const freshUser = response.result || response;
          // Standardize API response to our local User interface
          if (freshUser.roleName) {
            freshUser.role = freshUser.roleName.startsWith('ROLE_') ? freshUser.roleName.substring(5) : freshUser.roleName;
          }
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
          await fetchTutorStatus(freshUser.role);
        } catch (e) {
          console.error("Failed to fetch fresh user info", e);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    try {
      // Immediately fetch complete user details (avatar, correct role field)
      const response: any = await axiosInstance.get('/users/my-info');
      const freshUser = response.result || response;
      if (freshUser.roleName) {
        freshUser.role = freshUser.roleName.startsWith('ROLE_') ? freshUser.roleName.substring(5) : freshUser.roleName;
      }
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
      await fetchTutorStatus(freshUser.role);
    } catch (e) {
      // Fallback to minimal data if sync fails
      console.error("Failed to sync full user info after login", e);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      await fetchTutorStatus(userData.role);
    }
    
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setTutorStatus('NOT_STARTED');
    if (pathname.includes('/profile') || pathname.includes('/admin') || pathname.includes('/tutor')) {
      router.push('/');
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const refreshTutorStatus = async () => {
    if (user) {
      await fetchTutorStatus(user.role);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      tutorStatus,
      isAuthenticated: !!token, 
      login, 
      logout, 
      isLoading,
      refreshTutorStatus,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
