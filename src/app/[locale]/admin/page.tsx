"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  CreditCard,
  Activity,
  Layers
} from 'lucide-react';
import adminService from '@/services/adminService';
import { format } from 'date-fns';

const COLORS = ['#ff944d', '#c084fc', '#4ade80'];

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [overviewRes, chartRes] = await Promise.all([
          adminService.getAnalyticsOverview(),
          adminService.getRevenueChart(30)
        ]);
        
        setOverview(overviewRes);
        
        // Format chart data
        if (chartRes && chartRes.length > 0) {
          const formattedData = chartRes.map((item: any) => ({
            date: format(new Date(item.date), 'dd/MM'),
            revenue: item.revenue
          }));
          setRevenueData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><Activity className="animate-spin text-orange-500 w-8 h-8" /></div>;

  const userBreakdownData = [
    { name: 'Students', value: overview?.totalStudents || 0 },
    { name: 'Tutors', value: overview?.totalTutors || 0 }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl ring-1 ring-orange-100">
           <Activity className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-600 font-medium leading-none mt-1">Overview of platform statistics and performance</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SmallStatCard 
          title="Total Revenue" 
          value={`${overview?.totalRevenue?.toLocaleString() || 0} VND`} 
          description="All time revenue"
          icon={TrendingUp} 
        />
        <SmallStatCard 
          title="Total Students" 
          value={overview?.totalStudents || 0} 
          description="Registered students"
          icon={Users} 
        />
        <SmallStatCard 
          title="Total Tutors" 
          value={overview?.totalTutors || 0} 
          description="Registered tutors"
          icon={Users} 
        />
        <SmallStatCard 
          title="Pending Courses" 
          value={overview?.pendingCourses || 0} 
          description="Awaiting approval"
          icon={BookOpen} 
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-slate-800">Revenue (Last 30 Days)</h3>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => [typeof value === 'number' ? `${value.toLocaleString()} VND` : '-', 'Revenue']} />
                  <Bar dataKey="revenue" fill="#ff944d" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* User Breakdown Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-800">User Distribution</h3>
           </div>
           <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userBreakdownData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [typeof value === 'number' ? value.toLocaleString() : String(value), 'Users']} />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="flex flex-wrap justify-center gap-4 mt-6">
              {userBreakdownData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm font-bold text-slate-600">{entry.name} ({entry.value})</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function SmallStatCard({ title, value, description, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
           <p className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-1">{title}</p>
           <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
           <p className="text-[10px] text-slate-500 font-medium mt-1">{description}</p>
        </div>
        <Icon className="w-5 h-5 text-slate-300" />
      </div>
    </div>
  );
}
