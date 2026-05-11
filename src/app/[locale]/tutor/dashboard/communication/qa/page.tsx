"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronDown, Search, Loader2, MessageSquare,
  CheckCircle, Star, BookOpen, RefreshCw
} from 'lucide-react';
import { courseService, CourseResponse } from '@/services/courseService';
import { qaService, QAFilter, QuestionResponse } from '@/services/qaService';
import QuestionThread from '@/components/features/communication/QuestionThread';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const FILTER_OPTIONS: { label: string; value: QAFilter }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chưa có câu trả lời', value: 'NO_ANSWER' },
  { label: 'Chưa có giảng viên trả lời', value: 'NO_INSTRUCTOR_ANSWER' },
];

export default function QAPage() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionResponse | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [filter, setFilter] = useState<QAFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
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

  // Fetch courses
  useEffect(() => {
    courseService.getMyTutorCourses({ size: 100 })
      .then(res => setCourses(res.content || []))
      .catch(() => toast.error('Không thể tải danh sách khóa học'));
  }, []);

  // Fetch questions
  const fetchQuestions = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await qaService.getTutorQuestions({
        courseId: selectedCourseId || undefined,
        filter,
        size: 50,
      });
      setQuestions(res.content || []);
      setTotalElements(res.totalElements || 0);
    } catch {
      toast.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCourseId, filter]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
    } catch { return ''; }
  };

  const handleQuestionUpdate = (updated: QuestionResponse) => {
    setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q));
    if (selectedQuestion?.id === updated.id) {
      setSelectedQuestion(updated);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel: List */}
      <div className={`flex flex-col border-r border-slate-100 bg-white transition-all duration-300 ${selectedQuestion ? 'w-[55%]' : 'w-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3" ref={dropdownRef}>
              <h1 className="text-2xl font-bold text-[#1c1d1f]">Q&amp;A</h1>
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
                    <button
                      onClick={() => { setSelectedCourseId(''); setShowCourseDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${!selectedCourseId ? 'font-bold text-indigo-600' : 'text-slate-700'}`}
                    >
                      Tất cả khóa học
                    </button>
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
            <button
              onClick={() => fetchQuestions(true)}
              disabled={refreshing}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              title="Làm mới"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  filter === opt.value
                    ? 'bg-white text-[#1c1d1f] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm câu hỏi hoặc tên học viên..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <p className="text-xs text-slate-400">
            {totalElements > 0 ? `${totalElements} câu hỏi` : ''}
          </p>
        </div>

        {/* Question list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-8 space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-slate-200" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1c1d1f] mb-1">Chưa có câu hỏi nào</h3>
                <p className="text-sm text-slate-400">
                  {filter !== 'ALL' ? 'Không có câu hỏi nào phù hợp với bộ lọc này.' : 'Học viên chưa đặt câu hỏi.'}
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredQuestions.map(q => (
                <li key={q.id}>
                  <button
                    onClick={() => setSelectedQuestion(q)}
                    className={`w-full text-left p-5 hover:bg-slate-50 transition-colors group ${
                      selectedQuestion?.id === q.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={q.studentAvatar}
                        alt={q.studentName}
                        className="w-8 h-8 rounded-full shrink-0 bg-slate-100 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-medium text-slate-600">{q.studentName}</span>
                          {q.courseTitle && !selectedCourseId && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                              {q.courseTitle}
                            </span>
                          )}
                          {q.isResolved && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-sm font-semibold text-[#1c1d1f] line-clamp-2 group-hover:text-indigo-700 transition-colors">
                          {q.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-slate-400">{formatTime(q.createdAt)}</span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MessageSquare className="w-3 h-3" /> {q.answerCount}
                          </span>
                          {q.answerCount === 0 && (
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                              Chưa có trả lời
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right panel: Thread */}
      {selectedQuestion ? (
        <div className="flex-1 overflow-hidden">
          <QuestionThread
            question={selectedQuestion}
            onClose={() => setSelectedQuestion(null)}
            onUpdate={handleQuestionUpdate}
            isTutor={true}
          />
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-50 text-center p-8">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <MessageSquare className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 max-w-[200px] leading-relaxed">
              Chọn một câu hỏi để xem chi tiết và trả lời
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
