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
  Wallet
} from 'lucide-react';
import { analyticsService, TutorAnalytics } from '@/services/analyticsService';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function TutorRevenuePerformancePage() {
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
      <div className="p-10 space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-slate-100 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-50 rounded-xl" />)}
        </div>
        <div className="h-96 bg-slate-50 rounded-xl" />
      </div>
    );
  }

  const isGrowth = (stats?.revenueGrowth || 0) >= 0;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Doanh thu</h1>
          <p className="text-sm text-slate-500 font-medium">Theo dõi và phân tích thu nhập từ việc giảng dạy</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 font-bold border-slate-200">
             <Calendar className="w-4 h-4" />
             Tháng này
             <ChevronDown className="w-4 h-4" />
          </Button>
          <Button className="bg-[#1c1d1f] hover:bg-slate-800 gap-2 font-bold">
             <Download className="w-4 h-4" />
             Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-4">
           <div className="flex items-center justify-between">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                 <DollarSign className="w-5 h-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full",
                isGrowth ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                 {isGrowth ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                 {Math.abs(stats?.revenueGrowth || 0).toFixed(1)}%
              </div>
           </div>
           <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doanh thu tháng này</p>
              <h3 className="text-3xl font-black text-slate-900">${stats?.revenueThisMonth.toLocaleString()}</h3>
           </div>
           <p className="text-[10px] text-slate-400 font-medium">So với ${stats?.revenueLastMonth.toLocaleString()} tháng trước</p>
        </div>

        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-4">
           <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
              <Wallet className="w-5 h-5" />
           </div>
           <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng doanh thu tích lũy</p>
              <h3 className="text-3xl font-black text-slate-900">${stats?.totalLifetimeRevenue.toLocaleString()}</h3>
           </div>
           <p className="text-[10px] text-slate-400 font-medium">Từ khi bắt đầu giảng dạy</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white space-y-4 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-20 h-20" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái thanh toán</p>
                <h3 className="text-2xl font-black">Sẵn sàng rút tiền</h3>
              </div>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black text-xs uppercase tracking-widest py-5">
                 Yêu cầu rút tiền
                 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
           </div>
        </div>
      </div>

      {/* Revenue Breakdown Table */}
      <div className="space-y-6">
         <h2 className="text-xl font-bold text-slate-900">Chi tiết theo khóa học</h2>
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                     <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Khóa học</th>
                     <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Số lượng bán</th>
                     <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tổng doanh thu</th>
                     <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Hành động</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {stats?.revenueByCourse.map((item) => (
                    <tr key={item.courseId} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5" />
                             </div>
                             <p className="font-bold text-slate-900">{item.title}</p>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <span className="font-bold text-slate-600">{item.totalSales}</span>
                       </td>
                       <td className="px-6 py-5">
                          <span className="text-lg font-black text-slate-900">${item.totalRevenue.toLocaleString()}</span>
                       </td>
                       <td className="px-6 py-5 text-right">
                          <button className="text-xs font-bold text-indigo-600 hover:underline">Chi tiết</button>
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
