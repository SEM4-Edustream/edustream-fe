"use client";

import React, { useEffect, useState } from 'react';
import adminService from '@/services/adminService';
import { format } from 'date-fns';
import { Users, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageMeta } from '@/types/course';
import { AdminEnrollmentDetailResponse } from '@/types/admin';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<AdminEnrollmentDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageMeta, setPageMeta] = useState<PageMeta<AdminEnrollmentDetailResponse> | null>(null);

  useEffect(() => {
    fetchEnrollments(page);
  }, [page]);

  const fetchEnrollments = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await adminService.getEnrollments(pageNumber, 15);
      if (response && response.content) {
        setEnrollments(response.content);
        setPageMeta(response);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl ring-1 ring-blue-100">
           <Users className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Enrollments</h1>
          <p className="text-slate-600 font-medium leading-none mt-1">Track student purchases and learning progress</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4">Tutor</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Enrolled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <Activity className="animate-spin text-orange-500 w-8 h-8 mx-auto" />
                  </td>
                </tr>
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No enrollments found.
                  </td>
                </tr>
              ) : (
                enrollments.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{item.studentName}</div>
                      <div className="text-xs text-slate-500">{item.studentEmail}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.courseTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {item.tutorName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 rounded-full" 
                            style={{ width: `${item.progressPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600">{item.progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600">
                      {item.enrolledAt ? format(new Date(item.enrolledAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {pageMeta && pageMeta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <span className="text-sm text-slate-500">
              Page <span className="font-medium text-slate-900">{(pageMeta.pageNumber ?? pageMeta.number ?? 0) + 1}</span> of <span className="font-medium text-slate-900">{pageMeta.totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pageMeta.totalPages - 1, p + 1))}
                disabled={page >= pageMeta.totalPages - 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
