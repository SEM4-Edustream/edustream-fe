"use client";

import React, { useEffect, useState } from 'react';
import { 
  ChevronDown, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  BookOpen,
  ArrowRight,
  Download,
  Calendar,
  Wallet,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { analyticsService, TutorAnalytics } from '@/services/analyticsService';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function TutorRevenuePerformancePage() {
  const [stats, setStats] = useState<TutorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'thisMonth' | 'lifetime' | 'sales'>('thisMonth');

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
        <div className="h-96 bg-slate-50 rounded-xl" />
      </div>
    );
  }

  const isGrowth = (stats?.revenueGrowth || 0) >= 0;
  const totalSales = stats?.revenueByCourse.reduce((acc, curr) => acc + curr.totalSales, 0) || 0;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Doanh thu</h1>
          <button className="flex items-center gap-1 text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">
            Toàn thời gian
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-slate-500 font-medium">Theo dõi và phân tích thu nhập từ việc giảng dạy</p>
      </div>

      {/* Main Stats Bar - Similar to Overview */}
      <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-200 bg-white">
          {/* This Month Revenue Tab */}
          <button 
            onClick={() => setActiveTab('thisMonth')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 transition-all relative group",
              activeTab === 'thisMonth' ? "border-[#1c1d1f]" : "border-transparent hover:bg-slate-50"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Doanh thu tháng này</p>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full",
                  isGrowth ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                   {isGrowth ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                   {Math.abs(stats?.revenueGrowth || 0).toFixed(1)}%
                </div>
              </div>
              <h3 className="text-3xl font-medium text-slate-900">
                ${stats?.revenueThisMonth.toFixed(2) || '0.00'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                So với ${stats?.revenueLastMonth.toFixed(2) || '0.00'} tháng trước
              </p>
            </div>
          </button>

          {/* Lifetime Revenue Tab */}
          <button 
            onClick={() => setActiveTab('lifetime')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 transition-all relative group",
              activeTab === 'lifetime' ? "border-[#1c1d1f]" : "border-transparent hover:bg-slate-50"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                 <p className="text-xs text-slate-500 font-medium">Tổng doanh thu tích lũy</p>
                 <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className="text-3xl font-medium text-slate-900">
                ${stats?.totalLifetimeRevenue.toFixed(2) || '0.00'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Kể từ khi bắt đầu giảng dạy
              </p>
            </div>
          </button>

          {/* Total Sales Tab */}
          <button 
            onClick={() => setActiveTab('sales')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 transition-all relative group",
              activeTab === 'sales' ? "border-[#1c1d1f]" : "border-transparent hover:bg-slate-50"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                 <p className="text-xs text-slate-500 font-medium">Tổng số đơn hàng</p>
                 <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className="text-3xl font-medium text-slate-900">
                {totalSales}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Số lượng khóa học đã bán thành công
              </p>
            </div>
          </button>
        </div>

        {/* Withdrawal Section - Coming Soon */}
        <div className="p-8 bg-slate-900 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Wallet className="w-32 h-32" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                 <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                    Wallet Status
                 </div>
                 <h2 className="text-2xl font-bold">Số dư khả dụng: <span className="text-emerald-400">${stats?.totalLifetimeRevenue.toFixed(2)}</span></h2>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                 <Button disabled className="bg-white/10 text-white/50 border border-white/10 cursor-not-allowed font-black text-xs uppercase tracking-widest px-8 py-6">
                    Yêu cầu rút tiền (Coming Soon)
                 </Button>
                 <p className="text-[10px] text-slate-500 font-bold italic">* Chức năng thanh toán đang được tích hợp</p>
              </div>
           </div>
        </div>
      </div>

      {/* Revenue Breakdown Table */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Chi tiết theo khóa học</h2>
            <div className="flex items-center gap-3">
               <button className="flex items-center gap-2 px-3 py-2 border border-slate-900 text-xs font-bold rounded-sm hover:bg-slate-50 transition-colors">
                  Tháng này
                  <ChevronDown className="w-4 h-4" />
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-[#1c1d1f] text-white text-xs font-bold rounded-sm hover:bg-slate-800 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
               </button>
            </div>
         </div>
         
         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                     <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Khóa học</th>
                     <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Số lượng bán</th>
                     <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tổng doanh thu</th>
                     <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Chi tiết</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {stats?.revenueByCourse.map((item) => (
                    <tr key={item.courseId} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BookOpen className="w-5 h-5" />
                             </div>
                             <p className="font-bold text-slate-900">{item.title}</p>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <span className="font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs">{item.totalSales}</span>
                       </td>
                       <td className="px-6 py-5">
                          <span className="text-lg font-black text-slate-900">${item.totalRevenue.toLocaleString()}</span>
                       </td>
                       <td className="px-6 py-5 text-right">
                          <button className="p-2 hover:bg-indigo-50 text-slate-300 hover:text-indigo-600 rounded-full transition-all">
                             <ChevronRight className="w-5 h-5" />
                          </button>
                       </td>
                    </tr>
                  ))}
                  {(!stats?.revenueByCourse || stats.revenueByCourse.length === 0) && (
                    <tr>
                       <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic">Chưa có dữ liệu bán hàng</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
