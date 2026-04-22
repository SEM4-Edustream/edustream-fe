"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { 
  BookOpen, 
  Search,
  ExternalLink,
  Loader2,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import adminService from '@/services/adminService';
import { toast } from 'sonner';
import { CourseSummary } from '@/services/courseService';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminAllCoursesPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering state
  const [status, setStatus] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const pageSize = 5;

  const fetchAllCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: pageSize,
        sort: sortBy,
        ...(status ? { status } : {})
      };
      const data = await adminService.getAllCourses(params);
      setCourses(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [page, status, sortBy]);

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  const handleStatusChange = (newStatus: string | null) => {
    setStatus(newStatus);
    setPage(0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Published</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider"><Clock className="w-3 h-3" /> Pending</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-100 uppercase tracking-wider"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-100 uppercase tracking-wider">{status}</span>;
    }
  };

  const filterTabs = [
    { label: 'All', value: null },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All Courses</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and monitor all educational content on the platform</p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden p-1 shadow-sm">
          <div className="flex items-center px-4 gap-2 text-slate-400">
             <Search className="w-4 h-4" />
             <input type="text" placeholder="Search courses..." className="border-none outline-none text-sm w-64 text-slate-800 placeholder-slate-400 py-2" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {filterTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleStatusChange(tab.value)}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                status === tab.value 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer"
          >
            <option value="createdAt,desc">Newest First</option>
            <option value="createdAt,asc">Oldest First</option>
            <option value="title,asc">Title (A-Z)</option>
            <option value="price,desc">Price (High-Low)</option>
            <option value="price,asc">Price (Low-High)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <BookOpen className="w-5 h-5 text-indigo-500" />
               Course Library
               <span className="bg-slate-100 text-slate-600 py-0.5 px-3 rounded-full text-xs font-bold ml-2">
                 {totalElements}
               </span>
            </h3>
         </div>

         {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
               <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
               <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Loading courses...</p>
            </div>
         ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                  <AlertCircle className="w-10 h-10" />
               </div>
               <h4 className="text-xl font-bold text-slate-900 mb-2">No Courses Found</h4>
               <p className="text-slate-500 text-sm max-w-sm font-medium">There are no courses matching your current filters.</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100">
                     <tr>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">Course Detail</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">Instructor</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">Price</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">Status</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px] text-right">View</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {courses.map((course) => (
                        <tr key={course.id} className="hover:bg-slate-50/50 transition-all group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-5">
                                 <div className="relative w-20 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                                    {course.thumbnailUrl ? (
                                       <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center">
                                          <BookOpen className="w-5 h-5 text-slate-300" />
                                       </div>
                                    )}
                                 </div>
                                 <div className="flex flex-col gap-0.5">
                                    <span className="font-bold text-slate-900 leading-none truncate max-w-[200px]">{course.title}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{course.category?.name || 'Academic'} • {course.modules?.length || 0} SECTIONS</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="font-bold text-slate-700 text-xs">{course.tutorName}</span>
                           </td>
                           <td className="px-8 py-6">
                              <span className="font-bold text-slate-900">${course.price || 0}</span>
                           </td>
                           <td className="px-8 py-6">
                              {getStatusBadge(course.status || 'DRAFT')}
                           </td>
                           <td className="px-8 py-6 text-right">
                              <Link href={`/courses/${course.id}`} target="_blank">
                                 <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-slate-100 rounded-xl">
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                 </Button>
                              </Link>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {/* Pagination Footer */}
         <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/20 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
               Page {page + 1} of {totalPages || 1}
            </p>
            <div className="flex items-center gap-2">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                  className="h-9 w-9 p-0 rounded-xl border-slate-200"
               >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
               </Button>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1 || loading}
                  className="h-9 w-9 p-0 rounded-xl border-slate-200"
               >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
