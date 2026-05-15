"use client";

import React, { useEffect, useState } from 'react';
import { 
  ChevronDown, 
  Info, 
  HelpCircle,
  FileDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyticsService, TutorAnalytics } from '@/services/analyticsService';
import { cn } from '@/lib/utils';

export default function TutorPerformanceOverview() {
  const [stats, setStats] = useState<TutorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'revenue' | 'enrollments' | 'rating'>('revenue');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await analyticsService.getTutorAnalytics();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-10 space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-slate-100 rounded-lg" />
        <div className="h-32 bg-slate-50 rounded-xl" />
        <div className="h-64 bg-slate-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
          <button className="flex items-center gap-1 text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">
            All courses
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-slate-500 font-medium">Get top insights about your performance</p>
      </div>

      {/* Main Container - Bordered box from image */}
      <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm">
        
        {/* Stats Tabs Header */}
        <div className="flex border-b border-slate-200 bg-white">
          {/* Revenue Tab */}
          <button 
            onClick={() => setActiveTab('revenue')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 transition-all relative group",
              activeTab === 'revenue' ? "border-[#1c1d1f]" : "border-transparent hover:bg-slate-50"
            )}
          >
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-medium">This month so far</p>
              <h3 className="text-3xl font-medium text-slate-900">
                ${stats?.revenueThisMonth.toFixed(2) || '0.00'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                ${stats?.revenueThisMonth.toFixed(2) || '0.00'} total revenue
              </p>
            </div>
          </button>

          {/* Enrollments Tab */}
          <button 
            onClick={() => setActiveTab('enrollments')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 transition-all relative group",
              activeTab === 'enrollments' ? "border-[#1c1d1f]" : "border-transparent hover:bg-slate-50"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                 <p className="text-xs text-slate-500 font-medium">This month so far</p>
                 <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className="text-3xl font-medium text-slate-900">
                {stats?.totalStudents || '0'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {stats?.totalStudents || '0'} total enrollments
              </p>
            </div>
          </button>

          {/* Rating Tab */}
          <button 
            onClick={() => setActiveTab('rating')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 transition-all relative group",
              activeTab === 'rating' ? "border-[#1c1d1f]" : "border-transparent hover:bg-slate-50"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                 <p className="text-xs text-slate-500 font-medium">This month so far</p>
                 <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className="text-3xl font-medium text-slate-900">
                {stats?.averageRating.toFixed(2) || '0.00'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {stats?.averageRating.toFixed(2) || '0.00'} average rating
              </p>
            </div>
          </button>
        </div>

        {/* Content Area with Filters */}
        <div className="p-8 bg-white min-h-[400px] flex flex-col">
           {/* Filters Bar */}
           <div className="flex items-center justify-end gap-3 mb-10">
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-slate-900">Date range:</span>
                 <button className="flex items-center gap-2 px-3 py-2 border border-slate-900 text-xs font-bold rounded-sm hover:bg-slate-50 transition-colors">
                    Last 12 months
                    <ChevronDown className="w-4 h-4" />
                 </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1c1d1f] text-white text-xs font-bold rounded-sm hover:bg-slate-800 transition-colors">
                 Export
                 <ChevronDown className="w-4 h-4" />
              </button>
           </div>

           {/* Empty State / Chart Placeholder */}
           <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-sm font-medium text-slate-500">No data to display</p>
           </div>

           {/* Footer Link */}
           <div className="border-t border-slate-100 pt-6 mt-10">
              <button className="flex items-center gap-1 text-sm font-bold text-[#5624d0] hover:text-[#401b9c] transition-colors">
                 Revenue Report
                 <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

    </div>
  );
}
