"use client";

import React from "react";
import { 
  Bell, 
  ChevronDown, 
  Globe,
  Search,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white sticky top-0 z-30 px-8 flex items-center justify-between border-b border-slate-100 shadow-sm/5">
      {/* Spacer for left side (since search is centered) */}
      <div className="w-10 md:w-64" />

      {/* Centered Search Bar */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search option.." 
            className="w-full bg-[#f8f9fa] border-none pl-12 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all font-medium placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right Side Tools */}
      <div className="flex-1 flex justify-end items-center gap-2 md:gap-4 lg:ml-64">
        {/* Language Switcher */}
         <button className="flex items-center gap-1.5 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group">
            <Globe className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-semibold text-slate-600">EN</span>
            <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-600 transition-colors" />
         </button>

        {/* Notification Bell */}
        <button className="relative w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-colors group">
           <Bell className="w-5 h-5 text-slate-500 group-hover:text-slate-800 transition-all" />
           <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white shadow-sm" />
        </button>

        {/* Account Profile Icon */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-colors">
           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
              <User className="w-4 h-4 text-slate-500" />
           </div>
        </button>
      </div>
    </header>
  );
}
