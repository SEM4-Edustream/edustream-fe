"use client";

import React, { useEffect, useState } from 'react';
import adminService from '@/services/adminService';
import { format } from 'date-fns';
import { ShieldAlert, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageMeta } from '@/types/course';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageMeta, setPageMeta] = useState<PageMeta<any> | null>(null);

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const fetchLogs = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await adminService.getAuditLogs(pageNumber, 15);
      if (response && response.content) {
        setLogs(response.content);
        setPageMeta(response);
      }
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-2xl ring-1 ring-red-100">
           <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-slate-600 font-medium leading-none mt-1">System activity and security records</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity Type</th>
                <th className="px-6 py-4">Entity ID</th>
                <th className="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <Activity className="animate-spin text-orange-500 w-8 h-8 mx-auto" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                      {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {log.adminUsername}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.action === 'REVIEW' || log.action === 'APPROVE' ? 'bg-green-100 text-green-800' :
                        log.action === 'REJECT' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{log.entityType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500">{log.entityId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{log.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {pageMeta && pageMeta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <span className="text-sm text-slate-500">
              Page <span className="font-medium text-slate-900">{(pageMeta?.pageNumber ?? pageMeta?.number ?? 0) + 1}</span> of <span className="font-medium text-slate-900">{pageMeta.totalPages}</span>
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
