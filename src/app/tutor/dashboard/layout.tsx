"use client";

import React from "react";
import DashboardSidebar from "@/components/features/tutor-dashboard/DashboardSidebar";
import DashboardHeader from "@/components/features/tutor-dashboard/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/tutor/dashboard");
    }
    // Optional: Check if user has TUTOR role
    if (!isLoading && isAuthenticated && user?.role !== 'TUTOR' && user?.role !== 'ADMIN') {
       router.push("/teaching"); // Redirect back to teaching landing if not a tutor yet
    }
  }, [isLoading, isAuthenticated, router, user]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
           <p className="text-slate-500 font-bold animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex">
      {/* Navigation Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pl-[72px]">
        <DashboardHeader />
        
        <main className="overflow-y-auto no-scrollbar py-6 min-h-[1543px]">
           <div className="max-w-[1600px] mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
