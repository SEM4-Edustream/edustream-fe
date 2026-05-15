"use client";

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Trophy
} from 'lucide-react';
import { analyticsService, TutorAnalytics } from '@/services/analyticsService';
import { cn } from '@/lib/utils';

export default function DashboardStats() {
  const [stats, setStats] = useState<TutorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: "blue",
      description: "Enrollments across all courses"
    },
    {
      label: "This Month Revenue",
      value: `$${stats.revenueThisMonth.toLocaleString()}`,
      icon: DollarSign,
      color: "emerald",
      trend: stats.revenueGrowth,
      description: `Vs $${stats.revenueLastMonth.toLocaleString()} last month`
    },
    {
      label: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: "amber",
      description: "Based on student reviews"
    },
    {
      label: "Average Progress",
      value: `${Math.round(stats.averageProgress)}%`,
      icon: BarChart3,
      color: "indigo",
      description: "Student completion rate"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div 
            key={idx} 
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-2.5 rounded-xl transition-colors",
                stat.color === 'blue' && "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
                stat.color === 'amber' && "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
                stat.color === 'indigo' && "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.trend !== undefined && (
                <div className={cn(
                  "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                  stat.trend >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
                )}>
                  {stat.trend >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {Math.abs(stat.trend).toFixed(1)}%
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-50">
              <p className="text-[10px] font-medium text-slate-400">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Course Highlight */}
      {stats.topCourseName !== "N/A" && (
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-100/20">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Trophy className="w-40 h-40" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-500/30">
                <TrendingUp className="w-3.5 h-3.5" />
                Best Selling Course
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight max-w-xl leading-tight">
                  {stats.topCourseName}
                </h2>
                <p className="text-slate-400 font-medium">
                  Leading with <span className="text-white font-bold">{stats.topCourseEnrollments} students</span> enrolled. Great job!
                </p>
              </div>
            </div>
            
            <div className="shrink-0 flex items-center gap-4">
               <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm min-w-[120px]">
                  <p className="text-2xl font-black">{stats.topCourseEnrollments}</p>
                  <p className="text-[10px] font-bold text-indigo-300 uppercase">Students</p>
               </div>
               <div className="text-center p-4 bg-indigo-600 rounded-2xl min-w-[120px]">
                  <p className="text-2xl font-black">#1</p>
                  <p className="text-[10px] font-bold text-indigo-100 uppercase">Rank</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
