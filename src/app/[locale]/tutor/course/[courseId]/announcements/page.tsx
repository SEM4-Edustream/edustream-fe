"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Megaphone, Send, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { announcementService, AnnouncementResponse } from '@/services/announcementService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

export default function TutorAnnouncementsPage() {
  const { courseId } = useParams() as { courseId: string };
  const [announcements, setAnnouncements] = useState<AnnouncementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, [courseId]);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementService.getCourseAnnouncements(courseId);
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      await announcementService.createAnnouncement(courseId, { title, content });
      toast.success("Thông báo đã được gửi tới toàn bộ học viên!");
      setTitle('');
      setContent('');
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) {
      toast.error("Không thể gửi thông báo. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-indigo-600" />
            Thông báo khóa học
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Gửi thông điệp quan trọng tới toàn bộ học viên đã đăng ký khóa học này.
          </p>
        </div>
        
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold h-12 px-6 rounded-none flex gap-2"
          >
            <Plus className="w-5 h-5" /> Soạn thông báo mới
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 lg:p-8 shadow-xl shadow-indigo-50 animate-in zoom-in-95 slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
             <Send className="w-5 h-5 text-indigo-500" />
             Soạn thảo thông báo
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tiêu đề thông báo</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Lịch học bù tuần tới, Tài liệu mới đã được cập nhật..."
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nội dung chi tiết</label>
              <textarea 
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung bạn muốn gửi tới học viên..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none"
                required
              />
            </div>

            <div className="bg-amber-50 rounded-xl p-4 flex gap-3 border border-amber-100">
               <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
               <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  Lưu ý: Thông báo này sẽ được gửi ngay lập tức tới tất cả học viên qua hệ thống **In-app Notification** và **WebSocket**. Học viên sẽ thấy thông báo nổi trên màn hình.
               </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => setShowForm(false)}
                className="font-bold text-slate-500 h-12 px-6 rounded-xl"
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-10 rounded-xl shadow-lg shadow-indigo-100"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gửi thông báo ngay"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-400 font-medium">Đang tải danh sách thông báo...</p>
        </div>
      ) : announcements.length === 0 ? (
        !showForm && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Megaphone className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Chưa có thông báo nào được gửi</h3>
            <p className="text-slate-500 mt-2">Hãy bắt đầu kết nối với học viên của bạn ngay hôm nay.</p>
          </div>
        )
      ) : (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            Lịch sử thông báo đã gửi
          </h2>
          <div className="grid gap-6">
            {announcements.map((ann) => (
              <div 
                key={ann.id} 
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 text-lg">{ann.title}</h4>
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
                    {format(new Date(ann.createdAt), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                  {ann.content}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                    <Send className="w-3 h-3" /> Đã gửi thành công
                  </div>
                  {/* Có thể thêm nút xóa hoặc sửa nếu cần */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
