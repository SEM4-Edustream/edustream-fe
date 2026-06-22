"use client";

import React, { useEffect, useState } from 'react';
import adminService from '@/services/adminService';
import { Activity, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { PageMeta } from '@/types/course';
import { AdminCourseMetricResponse } from '@/types/admin';

export default function CourseMetricsPage() {
  const [metrics, setMetrics] = useState<AdminCourseMetricResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageMeta, setPageMeta] = useState<PageMeta<AdminCourseMetricResponse> | null>(null);

  useEffect(() => {
    fetchMetrics(page);
  }, [page]);

  const fetchMetrics = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await adminService.getCourseMetrics(pageNumber, 15);
      if (response && response.content) {
        setMetrics(response.content);
        setPageMeta(response);
      }
    } catch (error) {
      console.error("Failed to fetch course metrics", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl ring-1 ring-indigo-100">
           <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Course Metrics</h1>
          <p className="text-slate-600 font-medium leading-none mt-1">Aggregated statistics by course</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4">Tutor</th>
                <th className="px-6 py-4 text-right">Total Students</th>
                <th className="px-6 py-4 text-right">Avg Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <Activity className="animate-spin text-orange-500 w-8 h-8 mx-auto" />
                  </td>
                </tr>
              ) : metrics.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No course metrics found.
                  </td>
                </tr>
              ) : (
                metrics.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.courseTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {item.tutorName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-900">
                      {item.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs font-medium text-slate-600">{Number(item.averageProgress || 0).toFixed(1)}%</span>
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 rounded-full" 
                            style={{ width: `${Number(item.averageProgress || 0)}%` }}
                          />
                        </div>
                      </div>
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
