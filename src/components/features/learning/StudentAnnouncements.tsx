"use client";

import React, { useEffect, useState } from 'react';
import { Megaphone, Calendar, User, Loader2 } from 'lucide-react';
import { announcementService, AnnouncementResponse } from '@/services/announcementService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface StudentAnnouncementsProps {
  courseId: string;
}

export default function StudentAnnouncements({ courseId }: StudentAnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<AnnouncementResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, [courseId]);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementService.getCourseAnnouncements(courseId);
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Đang tải thông báo...</p>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <Megaphone className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Chưa có thông báo nào</h3>
        <p className="text-slate-500 text-sm mt-1">Giảng viên sẽ đăng thông báo quan trọng tại đây.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-indigo-500" />
          Thông báo từ giảng viên
        </h2>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {announcements.length} thông báo
        </span>
      </div>

      <div className="grid gap-6">
        {announcements.map((ann) => (
          <div 
            key={ann.id} 
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {ann.title}
              </h3>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(ann.createdAt), 'dd MMMM, yyyy', { locale: vi })}
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-slate-600 text-[15px] leading-relaxed whitespace-pre-wrap mb-6">
              {ann.content}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs overflow-hidden border border-indigo-100">
                {ann.authorAvatar ? (
                  <img src={ann.authorAvatar} alt={ann.authorName} className="w-full h-full object-cover" />
                ) : (
                  ann.authorName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-none">{ann.authorName}</span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">Giảng viên khóa học</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
