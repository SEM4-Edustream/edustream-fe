"use client";

import React from 'react';
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
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  CreditCard,
  CheckCircle2,
  Clock,
  DollarSign,
  Activity,
  Calendar,
  Layers,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

// Mock Data for Charts
const revenueData = [
  { month: '1/2026', value: 4200000 },
  { month: '2/2026', value: 5000000 },
];

const courseBreakdownData = [
  { name: 'Ongoing', value: 10, fill: '#ff944d' },
  { name: 'Planned', value: 3, fill: '#c084fc' },
  { name: 'Inactive', value: 2, fill: '#4ade80' },
  { name: 'Combo', value: 5, fill: '#3b82f6' },
  { name: 'Single', value: 10, fill: '#ef4444' },
];

const userBreakdownData = [
  { name: 'Students', value: 65 },
  { name: 'Teachers', value: 25 },
  { name: 'Admins', value: 5 },
];

const COLORS = ['#ff944d', '#c084fc', '#4ade80'];

export default function AdminDashboardPage() {
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

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-slate-800">Monthly Revenue</h3>
           </div>
           <div className="mb-4">
              <span className="text-sm font-bold text-slate-700 block uppercase tracking-widest leading-none mb-1">This Month</span>
              <span className="text-3xl font-bold text-slate-900">5,000,000 VND</span>
           </div>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="value" fill="#ff944d" radius={[6, 6, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
           </div>
           <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-widest text-center">Revenue over time Monthly revenue trends</p>
        </div>

        {/* Course Breakdown Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-lg">Course Breakdown</h3>
           </div>
           <span className="text-xs font-bold text-slate-600 mb-6 block">Course types distribution</span>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseBreakdownData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
           <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-orange-500" />
                 <span className="text-[10px] font-bold text-slate-500">Courses</span>
              </div>
           </div>
           <p className="text-[10px] text-center text-slate-400 font-bold mt-2 uppercase tracking-widest">Course Statistics ↗ Breakdown of course types</p>
        </div>

        {/* User Breakdown Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
           <div className="text-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg">User Breakdown</h3>
              <span className="text-xs font-bold text-slate-600">User types distribution</span>
           </div>
           <div className="h-[250px] w-full">
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="flex flex-wrap justify-center gap-3 mt-4">
              {userBreakdownData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-[10px] font-bold text-slate-500">{entry.name}</span>
                </div>
              ))}
           </div>
           <p className="text-[10px] text-center text-slate-600 font-bold mt-4 uppercase tracking-widest">User Distribution ↗ Types of users on the platform</p>
        </div>
      </div>

      {/* Stats Cards Grid - 8 items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SmallStatCard 
          title="Total Revenue" 
          value="25,000,000 VND" 
          description="Earn from courses & plans"
          icon={TrendingUp} 
        />
        <SmallStatCard 
          title="Total Users" 
          value="250" 
          description="registered users"
          icon={Users} 
        />
        <SmallStatCard 
          title="Revenue This Month" 
          value="5,000,000 VND" 
          description="Monthly Revenue"
          icon={CreditCard} 
        />
        <SmallStatCard 
          title="Total Courses" 
          value="15" 
          description="available courses"
          icon={BookOpen} 
        />
        <SmallStatCard 
          title="Total Orders" 
          value="120" 
          description="All time orders"
          icon={Activity} 
        />
        <SmallStatCard 
          title="Successful Orders" 
          value="0" 
          description="Completed orders"
          icon={CheckCircle2} 
        />
        <SmallStatCard 
          title="Pending Orders" 
          value="0" 
          description="Awaiting processing"
          icon={Clock} 
        />
        <SmallStatCard 
          title="Average Order Value" 
          value="0 VND" 
          description="Per order average"
          icon={TrendingUp} 
        />
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
