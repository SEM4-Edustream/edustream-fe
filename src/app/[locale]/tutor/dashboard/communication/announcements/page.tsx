"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Megaphone, Search, ChevronDown, Loader2, 
  BookOpen, Plus, Send, Calendar, AlertCircle,
  MessageSquare, CheckCircle, RefreshCw
} from 'lucide-react';
import { courseService, CourseSummary } from '@/services/courseService';
import { announcementService, AnnouncementResponse } from '@/services/announcementService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function AnnouncementsPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementResponse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [annLoading, setAnnLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [selectedAnn, setSelectedAnn] = useState<AnnouncementResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCourseDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Fetch courses on mount
  useEffect(() => {
    courseService.getMyTutorCourses({ size: 100 })
      .then(res => {
        const courseList = res.content || [];
        setCourses(courseList);
        if (courseList.length > 0) {
          setSelectedCourseId(courseList[0].id);
        }
      })
      .catch(() => toast.error('Không thể tải danh sách khóa học'))
      .finally(() => setLoading(false));
  }, []);

  // Fetch announcements
  const fetchAnnouncements = useCallback(async (isRefresh = false) => {
    if (!selectedCourseId) return;
    
    if (isRefresh) setRefreshing(true);
    else setAnnLoading(true);

    try {
      const data = await announcementService.getCourseAnnouncements(selectedCourseId);
      setAnnouncements(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setAnnLoading(false);
      setRefreshing(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !title.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      await announcementService.createAnnouncement(selectedCourseId, { title, content });
      toast.success("Thông báo đã được gửi thành công!");
      setTitle('');
      setContent('');
      fetchAnnouncements(true);
    } catch (err) {
      toast.error("Không thể gửi thông báo. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAnnouncements = announcements.filter(ann => 
    ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Left panel: List */}
      <div className={`flex flex-col border-r border-slate-100 bg-white transition-all duration-300 ${(!showForm && selectedAnn) ? 'w-[45%]' : 'w-full md:w-[450px]'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3" ref={dropdownRef}>
              <h1 className="text-2xl font-bold text-[#1c1d1f]">Thông báo</h1>
              <div className="relative">
                <button
                  onClick={() => setShowCourseDropdown(v => !v)}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#1c1d1f] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {selectedCourse ? (
                    <span className="max-w-[160px] truncate">{selectedCourse.title}</span>
                  ) : 'Tất cả khóa học'}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showCourseDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                    {courses.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCourseId(c.id); setShowCourseDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors truncate ${selectedCourseId === c.id ? 'font-bold text-indigo-600' : 'text-slate-700'}`}
                      >
                        {c.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchAnnouncements(true)}
                disabled={refreshing}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                title="Làm mới"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={() => { setShowForm(true); setSelectedAnn(null); }}
                className="p-2 bg-[#1c1d1f] text-white rounded-full hover:bg-slate-800 transition-all shadow-sm"
                title="Soạn thông báo mới"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm thông báo..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            Lịch sử thông báo ({announcements.length})
          </p>
        </div>

        {/* List content */}
        <div className="flex-1 overflow-y-auto">
          {annLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-8 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <Megaphone className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-sm text-slate-400">Không có thông báo nào.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredAnnouncements.map(ann => (
                <li key={ann.id}>
                  <button
                    onClick={() => { setSelectedAnn(ann); setShowForm(false); }}
                    className={`w-full text-left p-5 hover:bg-slate-50 transition-colors group ${
                      selectedAnn?.id === ann.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'
                    }`}
                  >
                    <h4 className="text-sm font-bold text-[#1c1d1f] mb-1 line-clamp-1 group-hover:text-indigo-700 transition-colors">
                      {ann.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                      {ann.content}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(ann.createdAt), 'dd MMMM, yyyy HH:mm', { locale: vi })}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right panel: Form or Detail */}
      <div className="flex-1 overflow-y-auto bg-slate-50/20">
        {showForm ? (
          <div className="max-w-3xl mx-auto p-10 animate-in fade-in duration-500">
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#1c1d1f] text-white rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1c1d1f]">Soạn thông báo mới</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Gửi thông báo đến toàn bộ học viên đang theo học</p>
                </div>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1c1d1f]">Tiêu đề</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="VD: Cập nhật tài liệu chương 2..."
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-400 transition-colors font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1c1d1f]">Nội dung</label>
                  <textarea 
                    rows={10}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Nội dung thông báo của bạn..."
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-400 transition-colors resize-none font-medium leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-orange-800 font-medium leading-relaxed uppercase">
                    Thông báo sẽ được gửi tức thì tới tất cả học viên qua WebSocket và Notification Bell.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedCourseId}
                    className="flex items-center gap-2 px-8 py-3 bg-[#1c1d1f] text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <Send className="w-4 h-4" />
                        Gửi thông báo
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : selectedAnn ? (
          <div className="max-w-3xl mx-auto p-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1c1d1f]">{selectedAnn.title}</h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Đã gửi bởi {selectedAnn.authorName} • {format(new Date(selectedAnn.createdAt), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowForm(true); setSelectedAnn(null); }}
                  className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  Soạn bài mới
                </button>
              </div>

              <div className="prose prose-slate max-w-none text-slate-600 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                {selectedAnn.content}
              </div>

              <div className="mt-10 pt-6 border-t border-slate-50 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle className="w-4 h-4" /> Đã gửi thành công tới toàn bộ học viên
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400">
            <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-medium">Chọn một thông báo để xem chi tiết</p>
          </div>
        )}
      </div>
    </div>
  );
}
