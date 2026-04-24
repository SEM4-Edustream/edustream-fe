'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import StudentDashboard from './StudentDashboard';

export default function AuthRouterWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <StudentDashboard />;
  }

  return <>{children}</>;
}