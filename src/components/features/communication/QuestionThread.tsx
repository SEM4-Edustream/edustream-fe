"use client";

import React, { useState } from 'react';
import { X, CheckCircle, Star, Send, Loader2, Award, UserCircle, Shield } from 'lucide-react';
import { qaService, QuestionResponse, AnswerResponse } from '@/services/qaService';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface QuestionThreadProps {
  question: QuestionResponse;
  onClose: () => void;
  onUpdate: (updated: QuestionResponse) => void;
  isTutor?: boolean;
}

export default function QuestionThread({
  question,
  onClose,
  onUpdate,
  isTutor = false,
}: QuestionThreadProps) {
  const [answerBody, setAnswerBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<AnswerResponse[]>(question.answers ?? []);

  const handleSubmitAnswer = async () => {
    if (!answerBody.trim()) return;
    setSubmitting(true);
    try {
      const newAnswer = await qaService.createAnswer(question.id, answerBody);
      setAnswers(prev => [...prev, newAnswer]);
      setAnswerBody('');
      onUpdate({ ...question, answerCount: (question.answerCount ?? 0) + 1 });
      toast.success('Câu trả lời đã được đăng!');
    } catch {
      toast.error('Không thể đăng câu trả lời');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkTopAnswer = async (answerId: string) => {
    try {
      const updated = await qaService.markTopAnswer(answerId);
      setAnswers(prev => prev.map(a => a.id === answerId ? updated : { ...a, isTopAnswer: false }));
      toast.success('Đã cập nhật Top Answer');
    } catch {
      toast.error('Không thể cập nhật Top Answer');
    }
  };

  const handleResolve = async () => {
    try {
      const updated = await qaService.resolveQuestion(question.id);
      onUpdate(updated);
      toast.success(updated.isResolved ? 'Đã đánh dấu đã giải quyết' : 'Đã mở lại câu hỏi');
    } catch {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-slate-100 shrink-0">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {question.isResolved && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> Đã giải quyết
              </span>
            )}
            {question.lessonTitle && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full truncate max-w-[160px]">
                {question.lessonTitle}
              </span>
            )}
            <span className="text-xs text-slate-400">{question.answerCount} câu trả lời</span>
          </div>
          <h2 className="text-lg font-bold text-[#1c1d1f] leading-snug line-clamp-3">
            {question.title}
          </h2>
        </div>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Original Question */}
        <div className="flex gap-3">
          <img
            src={question.studentAvatar}
            alt={question.studentName}
            className="w-9 h-9 rounded-full shrink-0 bg-slate-200"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-[#1c1d1f]">{question.studentName}</span>
              <span className="text-xs text-slate-400">{formatTime(question.createdAt)}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{question.body}</p>
          </div>
        </div>

        {/* Divider */}
        {answers.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">{answers.length} câu trả lời</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
        )}

        {/* Answers */}
        {answers.map((answer) => (
          <div key={answer.id} className={`flex gap-3 ${answer.isTopAnswer ? 'bg-amber-50 -mx-6 px-6 py-4 rounded-none' : ''}`}>
            <div className="relative shrink-0">
              <img
                src={answer.authorAvatar}
                alt={answer.authorName}
                className="w-9 h-9 rounded-full bg-slate-200"
              />
              {answer.isInstructorAnswer && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-sm text-[#1c1d1f]">{answer.authorName}</span>
                {answer.isInstructorAnswer && (
                  <span className="text-[10px] font-bold uppercase bg-indigo-600 text-white px-1.5 py-0.5 rounded">
                    Giảng viên
                  </span>
                )}
                {answer.isTopAnswer && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Top Answer
                  </span>
                )}
                <span className="text-xs text-slate-400">{formatTime(answer.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{answer.body}</p>
              {isTutor && (
                <button
                  onClick={() => handleMarkTopAnswer(answer.id)}
                  className={`mt-2 flex items-center gap-1 text-xs font-medium transition-colors ${
                    answer.isTopAnswer
                      ? 'text-amber-600 hover:text-amber-800'
                      : 'text-slate-400 hover:text-amber-600'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${answer.isTopAnswer ? 'fill-amber-500 text-amber-500' : ''}`} />
                  {answer.isTopAnswer ? 'Bỏ Top Answer' : 'Đánh dấu Top Answer'}
                </button>
              )}
            </div>
          </div>
        ))}

        {answers.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <UserCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Chưa có câu trả lời nào. Hãy là người đầu tiên!</p>
          </div>
        )}
      </div>

      {/* Footer: Answer input + Actions */}
      <div className="border-t border-slate-100 p-4 space-y-3 shrink-0">
        {isTutor && (
          <button
            onClick={handleResolve}
            className={`w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded transition-colors ${
              question.isResolved
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {question.isResolved ? 'Mở lại câu hỏi' : 'Đánh dấu đã giải quyết'}
          </button>
        )}
        <div className="flex gap-2">
          <textarea
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmitAnswer();
            }}
            placeholder="Viết câu trả lời... (Ctrl+Enter để gửi)"
            rows={3}
            className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 resize-none transition-colors"
          />
          <button
            onClick={handleSubmitAnswer}
            disabled={submitting || !answerBody.trim()}
            className="self-end px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
