"use client";

import React, { useEffect, useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Star,
  Users,
  Clock,
  MessageSquare,
  UserPlus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { analyticsService, TutorAnalytics } from '@/services/analyticsService';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="h-64 bg-slate-50 rounded-xl" />
           <div className="h-64 bg-slate-50 rounded-xl" />
        </div>
      </div>
    );
  }

  // Format chart data
  const formattedChartData = stats?.chartData.map(d => ({
    name: `${d.month}/${d.year}`,
    revenue: d.revenue
  })) || [];

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

      {/* Main Stats Bar */}
      <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-200 bg-white">
          <button 
            onClick={() => setActiveTab('revenue')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 transition-all",
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

          <button 
            onClick={() => setActiveTab('enrollments')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 transition-all",
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

          <button 
            onClick={() => setActiveTab('rating')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 transition-all",
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

        {/* Revenue Chart */}
        <div className="p-8 bg-white border-b border-slate-100">
           <div className="h-[300px] w-full">
              {formattedChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a435f0" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#a435f0" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1c1d1f', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: '#a435f0' }}
                      cursor={{ stroke: '#a435f0', strokeWidth: 1 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#a435f0" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
                   <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
                   Chưa có đủ dữ liệu để hiển thị biểu đồ
                </div>
              )}
           </div>
        </div>

        <div className="p-6 bg-slate-50/50">
           <button className="flex items-center gap-1 text-sm font-bold text-[#5624d0] hover:text-[#401b9c] transition-colors">
              Revenue Report
              <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Courses */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Top 3 Khóa học</h2>
              <button className="text-sm font-bold text-indigo-600 hover:underline">Xem tất cả</button>
           </div>
           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="divide-y divide-slate-100">
                {stats?.topCourses.map((course, idx) => (
                  <div key={course.courseId} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                        #{idx + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{course.title}</p>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrollmentCount} học viên</span>
                          <span className="flex items-center gap-1 text-amber-500"><Star className="w-3 h-3 fill-current" /> {course.averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
                {(!stats?.topCourses || stats.topCourses.length === 0) && (
                  <div className="p-8 text-center text-slate-400 text-sm italic">Chưa có dữ liệu khóa học</div>
                )}
              </div>
           </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold text-slate-900">Hoạt động gần đây</h2>
           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="divide-y divide-slate-100">
                {stats?.recentActivities.map((activity, idx) => (
                  <div key={idx} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      activity.type === 'ENROLLMENT' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {activity.type === 'ENROLLMENT' ? <UserPlus className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900">{activity.studentName}</p>
                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {activity.detail} <span className="font-bold text-slate-700">"{activity.courseTitle}"</span>
                      </p>
                    </div>
                  </div>
                ))}
                {(!stats?.recentActivities || stats.recentActivities.length === 0) && (
                  <div className="p-8 text-center text-slate-400 text-sm italic">Chưa có hoạt động nào</div>
                )}
              </div>
           </div>
        </div>

      </div>

    </div>
  );
}
