import React from "react";
import { UserCircle, Settings, Shield, Bell } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function ProfileSidebar() {
  return (
    <div className="lg:col-span-3">
      <nav className="flex flex-col gap-2">
        <a href="#profile" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium transition-colors">
          <UserCircle className="w-5 h-5" />
          Public Profile
        </a>
        <a href="#account" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
          <Settings className="w-5 h-5" />
          Account Settings
        </a>
        <a href="#security" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
          <Shield className="w-5 h-5" />
          Security
        </a>
        <a href="#notifications" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
          <Bell className="w-5 h-5" />
          Notifications
        </a>
      </nav>
    </div>
  );
}

export function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-4 sm:px-6 font-[sans-serif]">
      <div className="container mx-auto max-w-[1140px]">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-2">Manage your profile information and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ProfileSidebar />
          
          <div className="lg:col-span-9 flex flex-col gap-6">
             {children}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
  );
}
