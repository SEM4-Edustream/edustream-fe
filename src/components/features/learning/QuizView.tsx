import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

interface QuizViewProps {
  lessonId: string;
  onComplete: () => void;
}

export default function QuizView({ lessonId, onComplete }: QuizViewProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchQuestions();
  }, [lessonId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setResult(null);
      setAnswers({});
      const res = await axiosInstance.get(`/api/quizzes/${lessonId}/questions`);
      setQuestions(res.result || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId: string, choiceId: string, type: string) => {
    if (result) return; // Prevent changing after submission

    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (type === 'SINGLE_CHOICE') {
        return { ...prev, [questionId]: [choiceId] };
      } else {
        if (currentAnswers.includes(choiceId)) {
          return { ...prev, [questionId]: currentAnswers.filter(id => id !== choiceId) };
        } else {
          return { ...prev, [questionId]: [...currentAnswers, choiceId] };
        }
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await axiosInstance.post(`/api/quizzes/${lessonId}/submit`, { answers });
      setResult(res.result);
      
      if (res.result.passed) {
        toast.success(`You passed with a score of ${res.result.score}%!`);
        onComplete();
      } else {
        toast.error(`You failed with a score of ${res.result.score}%. Please try again.`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  if (questions.length === 0) {
    return <div className="p-10 text-center text-slate-500">This quiz has no questions yet.</div>;
  }

  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {result && (
          <div className={`p-6 rounded-lg border-2 ${result.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'} text-center space-y-3`}>
            <div className="flex justify-center">
              {result.passed ? <CheckCircle2 className="w-12 h-12 text-emerald-500" /> : <XCircle className="w-12 h-12 text-red-500" />}
            </div>
            <h3 className={`text-2xl font-bold ${result.passed ? 'text-emerald-700' : 'text-red-700'}`}>
              {result.passed ? 'Congratulations! You Passed' : 'You did not pass'}
            </h3>
            <p className="text-slate-600 font-medium">Your score: <span className="font-bold text-lg">{result.score}%</span></p>
            {!result.passed && (
              <Button onClick={fetchQuestions} variant="outline" className="mt-4">
                <RotateCcw className="w-4 h-4 mr-2" /> Try Again
              </Button>
            )}
          </div>
        )}

        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={q.id} className={`p-6 bg-white border border-slate-200 rounded-lg shadow-sm ${result ? 'opacity-80' : ''}`}>
              <h3 className="font-bold text-lg text-slate-900 mb-4">
                {qIndex + 1}. {q.content}
                {q.type === 'MULTIPLE_CHOICE' && <span className="text-xs font-normal text-slate-500 ml-2">(Select all that apply)</span>}
              </h3>
              
              <div className="space-y-3">
                {q.choices.map((c: any) => {
                  const isSelected = (answers[q.id] || []).includes(c.id);
                  return (
                    <div 
                      key={c.id}
                      onClick={() => handleSelect(q.id, c.id, q.type)}
                      className={`
                        p-4 border rounded-md cursor-pointer transition-all flex items-center gap-3
                        ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-medium' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'}
                        ${result ? 'cursor-not-allowed' : ''}
                      `}
                    >
                      <div className={`
                        w-5 h-5 flex items-center justify-center border shrink-0
                        ${q.type === 'SINGLE_CHOICE' ? 'rounded-full' : 'rounded'}
                        ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 bg-white'}
                      `}>
                        {isSelected && <div className={`bg-white ${q.type === 'SINGLE_CHOICE' ? 'w-2 h-2 rounded-full' : 'w-2.5 h-2.5 rounded-sm'}`} />}
                      </div>
                      <span>{c.content}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!result && (
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSubmit} 
              disabled={submitting || questions.some(q => !(answers[q.id]?.length > 0))}
              className="bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold px-8 h-12"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
