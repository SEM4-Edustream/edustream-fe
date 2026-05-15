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
  ChevronRight,
  CreditCard,
  Target
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
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function TutorRevenuePerformancePage() {
  const t = useTranslations('TutorDashboard.Revenue');
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
  
  // Withdrawal Logic (Example: Min $100 to withdraw)
  const MIN_WITHDRAW = 100;
  const balance = stats?.totalLifetimeRevenue || 0;
  const progressPercent = Math.min((balance / MIN_WITHDRAW) * 100, 100);
  const remaining = Math.max(MIN_WITHDRAW - balance, 0);

  // Format chart data for 30 days
  const dailyChartData = stats?.dailyChartData.map(d => ({
    name: new Date(d.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }),
    revenue: d.revenue
  })) || [];

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
          <button className="flex items-center gap-1 text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">
            {t('all_time')}
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-slate-500 font-medium">{t('subtitle')}</p>
      </div>

      {/* Main Stats Bar */}
      <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row border-b border-slate-200 bg-white">
          <button 
            onClick={() => setActiveTab('thisMonth')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 md:border-b-4 transition-all relative group",
              activeTab === 'thisMonth' ? "border-[#1c1d1f]" : "border-transparent hover:bg-slate-50"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">{t('this_month')}</p>
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
                {t('vs_last_month', { amount: `$${stats?.revenueLastMonth.toFixed(2) || '0.00'}` })}
              </p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('lifetime')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 md:border-b-4 transition-all relative group",
              activeTab === 'lifetime' ? "border-[#1c1d1f]" : "border-transparent hover:bg-slate-50"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                 <p className="text-xs text-slate-500 font-medium">{t('lifetime')}</p>
                 <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className="text-3xl font-medium text-slate-900">
                ${stats?.totalLifetimeRevenue.toFixed(2) || '0.00'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {t('all_time')}
              </p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('sales')}
            className={cn(
              "flex-1 p-6 text-left border-b-4 md:border-b-4 transition-all relative group",
              activeTab === 'sales' ? "border-[#1c1d1f]" : "border-transparent hover:bg-slate-50"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                 <p className="text-xs text-slate-500 font-medium">{t('total_orders')}</p>
                 <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className="text-3xl font-medium text-slate-900">
                {totalSales}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {t('orders_desc')}
              </p>
            </div>
          </button>
        </div>

        {/* 30-Day Trend Chart */}
        <div className="p-8 bg-white border-b border-slate-100">
           <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-bold text-slate-900">{t('chart_title')}</h4>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                 <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                 Revenue
              </div>
           </div>
           <div className="h-[250px] w-full">
              {dailyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyChartData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      minTickGap={30}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1c1d1f', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '11px',
                        padding: '8px 12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#revenueGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 italic">
                   <TrendingUp className="w-10 h-10 mb-2 opacity-20" />
                   {t('no_data')}
                </div>
              )}
           </div>
        </div>

        {/* Wallet Section - Improved UI */}
        <div className="p-8 bg-slate-900 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Wallet className="w-48 h-48" />
           </div>
           
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="space-y-6 flex-1 w-full lg:w-auto">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-indigo-600 transition-colors">
                       <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{t('wallet_status')}</p>
                       <h2 className="text-3xl font-black">{t('available_balance')}: <span className="text-emerald-400">${balance.toFixed(2)}</span></h2>
                    </div>
                 </div>

                 {/* Progress Bar for Withdrawal */}
                 <div className="space-y-2 max-w-md">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                       <div className="flex items-center gap-2">
                          <Target className="w-3 h-3" />
                          {balance >= MIN_WITHDRAW ? 'Sẵn sàng rút tiền' : t('min_withdraw_desc', { amount: `$${remaining.toFixed(2)}` })}
                       </div>
                       <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                       <div 
                         className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-1000 ease-out"
                         style={{ width: `${progressPercent}%` }}
                       />
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-col items-center lg:items-end gap-3 shrink-0">
                 <Button 
                   disabled={balance < MIN_WITHDRAW}
                   className={cn(
                     "font-black text-xs uppercase tracking-widest px-10 py-7 transition-all",
                     balance >= MIN_WITHDRAW 
                        ? "bg-white text-slate-900 hover:bg-indigo-500 hover:text-white" 
                        : "bg-white/10 text-white/30 border border-white/10 cursor-not-allowed"
                   )}
                 >
                    {t('withdraw_btn')} {balance < MIN_WITHDRAW && `(${t('coming_soon')})`}
                 </Button>
                 <p className="text-[10px] text-slate-500 font-bold italic">{t('integration_notice')}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Revenue Breakdown Table */}
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">{t('course_breakdown')}</h2>
            <div className="flex items-center gap-3">
               <button className="flex items-center gap-2 px-3 py-2 border border-slate-900 text-xs font-bold rounded-sm hover:bg-slate-50 transition-colors">
                  {t('this_month')}
                  <ChevronDown className="w-4 h-4" />
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-[#1c1d1f] text-white text-xs font-bold rounded-sm hover:bg-slate-800 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
               </button>
            </div>
         </div>
         
         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Horizontal scroll wrapper for responsive table */}
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                     <tr>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">{t('title')}</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">{t('units_sold')}</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">{t('total_revenue')}</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">{t('details')}</th>
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
                                <p className="font-bold text-slate-900 truncate max-w-[250px]">{item.title}</p>
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
                          <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic">{t('no_data')}</td>
                       </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

    </div>
  );
}
