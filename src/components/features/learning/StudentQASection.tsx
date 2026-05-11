"use client";

import React, { useEffect, useState } from 'react';
import {
  MessageSquare, Send, Loader2, ChevronDown, ChevronUp,
  CheckCircle, Star, Shield, Plus, X
} from 'lucide-react';
import { qaService, QuestionResponse } from '@/services/qaService';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface StudentQASectionProps {
  courseId: string;
  activeLessonId?: string;
  activeLessonTitle?: string;
}

export default function StudentQASection({
  courseId,
  activeLessonId,
  activeLessonTitle,
}: StudentQASectionProps) {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [attachLesson, setAttachLesson] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [courseId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Dùng public API — không cần đăng nhập để xem câu hỏi
      const res = await import('@/lib/api').then(m => m.default.get<any>(
        `/api/qa/courses/${courseId}`,
        { params: { size: 50, sort: 'createdAt,desc' } }
      )) as any;
      setQuestions(res?.content ?? res ?? []);
    } catch {
      // Silently fail — Q&A is optional UI
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Vui lòng điền đầy đủ tiêu đề và nội dung');
      return;
    }
    setSubmitting(true);
    try {
      const newQ = await qaService.createQuestion(courseId, {
        title,
        body,
        lessonId: attachLesson && activeLessonId ? activeLessonId : undefined,
      });
      setQuestions(prev => [newQ, ...prev]);
      setTitle('');
      setBody('');
      setShowForm(false);
      setExpandedId(newQ.id);
      toast.success('Câu hỏi đã được đăng!');
    } catch (err: any) {
      if (err?.response?.status === 403) {
        toast.error('Bạn cần đăng ký khóa học để đặt câu hỏi');
      } else {
        toast.error('Không thể đăng câu hỏi');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpand = async (q: QuestionResponse) => {
    if (expandedId === q.id) {
      setExpandedId(null);
      return;
    }
    // Load detail if answers not loaded yet
    if (!q.answers) {
      try {
        const detail = await qaService.getQuestionDetail(q.id);
        setQuestions(prev => prev.map(item => item.id === q.id ? detail : item));
      } catch { /* ignore */ }
    }
    setExpandedId(q.id);
  };

  const formatTime = (d: string) => {
    try { return formatDistanceToNow(new Date(d), { addSuffix: true, locale: vi }); }
    catch { return ''; }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Hỏi &amp; Đáp</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {questions.length} câu hỏi trong khóa học này
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c1d1f] text-white text-sm font-bold rounded hover:bg-slate-800 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Hủy' : 'Đặt câu hỏi'}
        </button>
      </div>

      {/* Ask Form */}
      {showForm && (
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="font-bold text-slate-800">Câu hỏi mới</h4>

          {activeLessonTitle && (
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={attachLesson}
                onChange={e => setAttachLesson(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600">
                Gắn với bài học: <span className="font-semibold text-slate-800">{activeLessonTitle}</span>
              </span>
            </label>
          )}

          <input
            type="text"
            placeholder="Tiêu đề câu hỏi (ngắn gọn, rõ ràng)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={500}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-white transition-colors"
          />

          <textarea
            placeholder="Mô tả chi tiết câu hỏi của bạn..."
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-white resize-none transition-colors"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmitQuestion}
              disabled={submitting || !title.trim() || !body.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Đăng câu hỏi
            </button>
          </div>
        </div>
      )}

      {/* Question list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl">
          <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="font-semibold text-slate-500">Chưa có câu hỏi nào</p>
          <p className="text-sm text-slate-400 mt-1">Hãy là người đầu tiên đặt câu hỏi!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map(q => (
            <div
              key={q.id}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white"
            >
              {/* Question header */}
              <button
                onClick={() => toggleExpand(q)}
                className="w-full text-left p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={q.studentAvatar}
                    alt={q.studentName}
                    className="w-8 h-8 rounded-full bg-slate-100 shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-medium text-slate-500">{q.studentName}</span>
                          {q.lessonTitle && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                              {q.lessonTitle}
                            </span>
                          )}
                          {q.isResolved && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              <CheckCircle className="w-3 h-3" /> Đã giải quyết
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-2">{q.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-slate-400">{formatTime(q.createdAt)}</span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MessageSquare className="w-3 h-3" /> {q.answerCount} trả lời
                          </span>
                        </div>
                      </div>
                      {expandedId === q.id
                        ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                        : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                      }
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded: body + answers + reply */}
              {expandedId === q.id && (
                <div className="border-t border-slate-100 bg-slate-50/50 pb-4">
                  {/* Question body */}
                  <div className="p-4 pl-15">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap ml-11">
                      {q.body}
                    </p>
                  </div>

                  {/* Answers */}
                  {(q.answers ?? []).length > 0 ? (
                    <div className="border-t border-slate-100 divide-y divide-slate-100">
                      {(q.answers ?? []).map(a => (
                        <div
                          key={a.id}
                          className={`p-4 flex gap-3 ${a.isTopAnswer ? 'bg-amber-50' : ''}`}
                        >
                          <div className="relative shrink-0">
                            <img
                              src={a.authorAvatar}
                              alt={a.authorName}
                              className="w-7 h-7 rounded-full bg-slate-200"
                            />
                            {a.isInstructorAnswer && (
                              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-indigo-600 rounded-full flex items-center justify-center">
                                <Shield className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-semibold text-slate-800">{a.authorName}</span>
                              {a.isInstructorAnswer && (
                                <span className="text-[10px] font-bold uppercase bg-indigo-600 text-white px-1.5 py-0.5 rounded">
                                  Giảng viên
                                </span>
                              )}
                              {a.isTopAnswer && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Top Answer
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">{formatTime(a.createdAt)}</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{a.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 italic">
                      Đang chờ phản hồi từ giảng viên...
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
