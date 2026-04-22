"use client";

import React, { useEffect, useState } from 'react';
import adminService from '@/services/adminService';
import { TutorProfileResponse } from '@/services/tutorService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Eye, 
  MoreHorizontal, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminTutorVerificationPage() {
  const [profiles, setProfiles] = useState<TutorProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStatus, setCurrentStatus] = useState('PENDING');
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getTutorProfiles(currentStatus);
        setProfiles(data || []);
        
        // Fetch all counts for tabs
        const [pending, approved, rejected] = await Promise.all([
          adminService.getTutorProfiles('PENDING'),
          adminService.getTutorProfiles('APPROVED'),
          adminService.getTutorProfiles('REJECTED')
        ]);
        
        setCounts({
          PENDING: pending?.length || 0,
          APPROVED: approved?.length || 0,
          REJECTED: rejected?.length || 0
        });
      } catch (error) {
        console.error("Failed to fetch tutor profiles", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [currentStatus]);

  const filteredProfiles = profiles.filter(p => 
    p.tutorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.headline?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-600 rounded-full" />
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Tutor Verification
          </h1>
          <p className="text-slate-600 font-medium">Review and manage the instructor talent pool.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200 font-bold bg-white shadow-sm hover:bg-slate-50">
              Export CSV
           </Button>
           <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
              Bulk Actions
           </Button>
        </div>
      </div>

      {/* UX Improvement: Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          label="Pending Review"
          value={counts.PENDING.toString()}
          subLabel="Requires attention"
          color="amber"
        />
        <StatCard 
          icon={<Users className="w-6 h-6 text-indigo-600" />}
          label="Total Applications"
          value="128"
          subLabel="+12% this month"
          trend="+5.4%"
          color="indigo"
        />
        <StatCard 
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          label="Avg. Approval Time"
          value="1.2d"
          subLabel="Within SLA"
          color="emerald"
        />
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setCurrentStatus(status)}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 relative flex items-center gap-2 ${
              currentStatus === status 
                ? "text-indigo-600 border-indigo-600 bg-indigo-50/30" 
                : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {status}
            {counts[status] > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                currentStatus === status
                  ? "bg-indigo-600 text-white"
                  : status === 'PENDING' ? "bg-amber-100 text-amber-700" :
                    status === 'APPROVED' ? "bg-emerald-100 text-emerald-700" :
                    "bg-red-100 text-red-700"
              }`}>
                {counts[status]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/30">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or headline..." 
              className="w-full pl-11 pr-4 py-3 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl border-slate-200 font-bold gap-2">
                <Filter className="w-4 h-4" />
                Filter
             </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 transition-all duration-300">
          <Table>
            <TableHeader className="bg-white border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-6 px-8 text-slate-500 font-semibold uppercase text-[11px] tracking-widest">Tutor Application</TableHead>
                <TableHead className="py-6 text-slate-500 font-semibold uppercase text-[11px] tracking-widest">Headline</TableHead>
                <TableHead className="py-6 text-slate-500 font-semibold uppercase text-[11px] tracking-widest">Applied Date</TableHead>
                {currentStatus !== 'PENDING' && (
                  <TableHead className="py-6 text-slate-500 font-semibold uppercase text-[11px] tracking-widest">Verified At</TableHead>
                )}
                <TableHead className="py-6 text-slate-500 font-semibold uppercase text-[11px] tracking-widest">Status</TableHead>
                <TableHead className="py-6 px-8 text-right text-slate-500 font-semibold uppercase text-[11px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                       <p className="text-slate-500 font-bold">Fetching applications...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProfiles.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={4} className="h-64 text-center">
                     <p className="text-slate-400 font-bold text-lg">No pending applications found.</p>
                   </TableCell>
                </TableRow>
              ) : (
                filteredProfiles.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    <TableCell className="py-6 px-8">
                       <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-lg border border-indigo-100 shadow-sm transition-transform group-hover:scale-110 uppercase">
                             {p.tutorName?.substring(0,2) || 'TP'}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.tutorName || "Tutor Applicant"}</span>
                              <span className="text-xs text-slate-500 font-semibold uppercase tracking-tight">ID: {p.id.substring(0,8)}...</span>
                           </div>
                       </div>
                    </TableCell>
                    <TableCell className="py-6 max-w-[200px]">
                       <p className="text-slate-700 line-clamp-1 font-medium">{p.headline || 'No headline'}</p>
                    </TableCell>
                    <TableCell className="py-6">
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">
                            {p.verificationStartDate ? format(new Date(p.verificationStartDate), 'MMM dd, yyyy') : 'Recently'}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {p.verificationStartDate ? format(new Date(p.verificationStartDate), 'HH:mm aaa') : 'Reviewing now'}
                          </span>
                       </div>
                    </TableCell>
                    {currentStatus !== 'PENDING' && (
                      <TableCell className="py-6">
                        <div className="flex flex-col">
                           <span className="font-bold text-indigo-600 text-sm">
                             {p.verifiedAt ? format(new Date(p.verifiedAt), 'MMM dd, yyyy') : '-'}
                           </span>
                           <span className="text-xs text-slate-400 font-medium italic">
                             {p.verifiedAt ? format(new Date(p.verifiedAt), 'HH:mm aaa') : ''}
                           </span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="py-6">
                       <Badge className={`border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                         currentStatus === 'PENDING' ? "bg-amber-100/80 text-amber-700 border-amber-200" :
                         currentStatus === 'APPROVED' ? "bg-emerald-100/80 text-emerald-700 border-emerald-200" :
                         "bg-red-100/80 text-red-700 border-red-200"
                       }`}>
                         {p.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-right">
                       <div className="flex justify-end gap-2 text-indigo-600">
                          <Link href={`/admin/tutor-verification/${p.id}`}>
                             <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white hover:text-indigo-600 text-slate-600 font-bold text-xs gap-2 px-4 h-10 uppercase transition-all border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm">
                                <Eye className="w-4 h-4" />
                                View Detail
                             </Button>
                          </Link>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subLabel, trend, color }: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  subLabel: string,
  trend?: string,
  color: 'amber' | 'indigo' | 'emerald'
}) {
  const colors = {
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200"
  };

  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-110 transition-transform ${colors[color].split(' ')[0]}`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div className={`p-3 rounded-2xl border ${colors[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      
      <div className="mt-5 relative z-10">
        <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{label}</h3>
        <div className="flex items-baseline gap-2">
           <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
           <span className="text-slate-400 text-sm font-medium">{subLabel}</span>
        </div>
      </div>
    </div>
  );
}
