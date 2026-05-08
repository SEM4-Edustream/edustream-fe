import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import { LessonResponse } from '@/services/courseService';

interface QuizEditorProps {
  lesson: LessonResponse;
  moduleId: string;
}

export default function QuizEditor({ lesson, moduleId }: QuizEditorProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [lesson.id]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/quizzes/${lesson.id}/questions/tutor`);
      setQuestions(res.result || []);
    } catch (error) {
      console.error('Failed to fetch quiz questions', error);
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        content: '',
        type: 'SINGLE_CHOICE',
        orderIndex: questions.length,
        choices: [
          { content: '', isCorrect: true, orderIndex: 0 },
          { content: '', isCorrect: false, orderIndex: 1 }
        ]
      }
    ]);
  };

  const handleUpdateQuestion = (qIndex: number, field: string, value: any) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], [field]: value };
    setQuestions(updated);
  };

  const handleAddChoice = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].choices.push({
      content: '',
      isCorrect: false,
      orderIndex: updated[qIndex].choices.length
    });
    setQuestions(updated);
  };

  const handleUpdateChoice = (qIndex: number, cIndex: number, field: string, value: any) => {
    const updated = [...questions];
    
    // If setting a choice as correct in SINGLE_CHOICE, unset others
    if (field === 'isCorrect' && value === true && updated[qIndex].type === 'SINGLE_CHOICE') {
      updated[qIndex].choices.forEach((c: any, i: number) => {
        c.isCorrect = i === cIndex;
      });
    } else {
      updated[qIndex].choices[cIndex] = { ...updated[qIndex].choices[cIndex], [field]: value };
    }
    
    setQuestions(updated);
  };

  const handleRemoveChoice = (qIndex: number, cIndex: number) => {
    const updated = [...questions];
    updated[qIndex].choices.splice(cIndex, 1);
    setQuestions(updated);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Validate
      for (const q of questions) {
        if (!q.content.trim()) {
          toast.error('Question content cannot be empty');
          return;
        }
        if (q.choices.length < 2) {
          toast.error('Each question must have at least 2 choices');
          return;
        }
        const hasCorrect = q.choices.some((c: any) => c.isCorrect);
        if (!hasCorrect) {
          toast.error('Each question must have at least 1 correct choice');
          return;
        }
      }

      await axiosInstance.post(`/api/quizzes/${lesson.id}/questions`, questions);
      toast.success('Quiz saved successfully');
      fetchQuestions();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border border-slate-200 p-4 rounded-md bg-slate-50 relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 text-slate-400 hover:text-red-500 hover:bg-red-50"
              onClick={() => handleRemoveQuestion(qIndex)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            
            <div className="space-y-4 pr-8">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 block">Question {qIndex + 1}</label>
                <input
                  className="w-full text-sm p-2 border border-slate-300 rounded outline-none focus:border-indigo-500"
                  placeholder="Enter question text"
                  value={q.content}
                  onChange={(e) => handleUpdateQuestion(qIndex, 'content', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 block">Type</label>
                <select
                  className="w-full text-sm p-2 border border-slate-300 rounded outline-none focus:border-indigo-500"
                  value={q.type}
                  onChange={(e) => handleUpdateQuestion(qIndex, 'type', e.target.value)}
                >
                  <option value="SINGLE_CHOICE">Single Choice</option>
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 block">Answers</label>
                {q.choices.map((c: any, cIndex: number) => (
                  <div key={cIndex} className="flex items-center gap-2">
                    <input
                      type={q.type === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'}
                      name={`question-${qIndex}-correct`}
                      checked={c.isCorrect}
                      onChange={(e) => handleUpdateChoice(qIndex, cIndex, 'isCorrect', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <input
                      className="flex-1 text-sm p-2 border border-slate-300 rounded outline-none focus:border-indigo-500"
                      placeholder={`Choice ${cIndex + 1}`}
                      value={c.content}
                      onChange={(e) => handleUpdateChoice(qIndex, cIndex, 'content', e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-red-500 p-2"
                      onClick={() => handleRemoveChoice(qIndex, cIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs font-bold border-dashed text-indigo-600"
                  onClick={() => handleAddChoice(qIndex)}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Choice
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <Button
          variant="outline"
          className="font-bold border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          onClick={handleAddQuestion}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Question
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || questions.length === 0}
          className="bg-slate-900 text-white font-bold"
        >
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Quiz
        </Button>
      </div>
    </div>
  );
}
