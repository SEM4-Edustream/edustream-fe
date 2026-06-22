"use client";

import React, { useEffect, useState } from 'react';
import { paymentService, BookingResponse } from '@/services/paymentService';
import { format } from 'date-fns';
import { Receipt, AlertCircle, Loader2, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { ProfileLayout } from "@/components/features/profile/ProfileLayout";

export default function PurchaseHistoryPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await paymentService.getMyBookings(page, 10);
      setBookings(response.content);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load purchase history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'PAID') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          PAID
        </span>
      );
    }
    if (status === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
          <Clock className="w-3.5 h-3.5" />
          PENDING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        {status}
      </span>
    );
  };

  return (
    <ProfileLayout>
      <div className="max-w-4xl mx-auto py-2 px-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl ring-1 ring-indigo-100">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase History</h1>
            <p className="text-slate-500 text-sm mt-1">View your past course purchases and transactions</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
              <p className="text-sm font-medium">Loading history...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Receipt className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-base font-semibold text-slate-900 mb-1">No purchases yet</p>
              <p className="text-sm">When you buy a course, it will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs font-mono text-slate-400 mb-1">Order #{booking.id.substring(0, 8)}</p>
                      <p className="text-sm font-medium text-slate-900">
                        {format(new Date(booking.createdAt), 'MMMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-bold text-slate-900">
                        {booking.amount.toLocaleString()} đ
                      </p>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    {booking.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded overflow-hidden bg-slate-200 shrink-0">
                          {item.courseThumbnail ? (
                            <img src={item.courseThumbnail} alt={item.courseTitle} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-medium">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{item.courseTitle}</p>
                        </div>
                        <div className="text-sm font-medium text-slate-600">
                          {item.price.toLocaleString()} đ
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {!loading && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
              <span className="text-sm font-medium text-slate-500">
                Page <span className="text-slate-900">{page + 1}</span> of <span className="text-slate-900">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProfileLayout>
  );
}
