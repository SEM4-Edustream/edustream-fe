"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

export default function AssignmentGradingPage() {
  const { courseId, lessonId } = useParams() as { courseId: string, lessonId: string };
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  
  const [grade, setGrade] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const [isGrading, setIsGrading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [lessonId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res: any = await axiosInstance.get(`/api/assignments/${lessonId}/submissions?page=0&size=100`);
      setSubmissions(res.result.content || []);
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async () => {
    if (!selectedSub) return;
    if (grade === '' || grade < 0 || grade > 100) {
      toast.error('Please enter a valid grade (0-100)');
      return;
    }

    try {
      setIsGrading(true);
      const res: any = await axiosInstance.post(`/api/assignments/submissions/${selectedSub.id}/grade`, {
        grade: Number(grade),
        feedback
      });
      toast.success('Graded successfully!');
      
      // Update locally
      setSubmissions(prev => prev.map(s => s.id === selectedSub.id ? res.result : s));
      setSelectedSub(res.result);
    } catch (error) {
      toast.error('Failed to save grade');
    } finally {
      setIsGrading(false);
    }
  };

  if (loading) {
    return <div className="p-20 flex justify-center h-full items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/tutor/dashboard/communication/assignments/${courseId}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assignment Submissions</h1>
          <p className="text-sm text-slate-500">Review and grade your students' work</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700">
            Student Submissions ({submissions.length})
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {submissions.length === 0 ? (
              <p className="text-slate-500 text-sm text-center p-6">No submissions yet.</p>
            ) : (
              submissions.map(sub => (
                <div 
                  key={sub.id}
                  onClick={() => {
                    setSelectedSub(sub);
                    setGrade(sub.grade !== null ? sub.grade : '');
                    setFeedback(sub.feedback || '');
                  }}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${selectedSub?.id === sub.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">{sub.student.fullName || sub.student.username}</span>
                    {sub.status === 'GRADED' ? (
                      <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Graded
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                        <Clock className="w-3 h-3 mr-1" /> Needs Review
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">Submitted: {new Date(sub.createdAt).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Grading Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm p-6 h-[700px] overflow-y-auto">
          {selectedSub ? (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold">{selectedSub.student.fullName || selectedSub.student.username}'s Submission</h2>
                <p className="text-sm text-slate-500">Submitted on {new Date(selectedSub.createdAt).toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-700">Response Text:</h3>
                <div 
                  className="prose prose-sm max-w-none p-4 bg-slate-50 border border-slate-200 rounded"
                  dangerouslySetInnerHTML={{ __html: selectedSub.content || '<p className="text-slate-400 italic">No text provided.</p>' }}
                />

                {selectedSub.fileUrl && (
                  <div>
                    <h3 className="font-bold text-slate-700 mb-2">Attached File:</h3>
                    <a href={selectedSub.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 font-medium text-sm">
                      View Document
                    </a>
                  </div>
                )}
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="font-bold text-lg text-slate-900">Grading & Feedback</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Score (0-100)</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-32 p-2 border border-slate-300 rounded focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Feedback to Student</label>
                  <textarea 
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback..."
                    className="w-full p-3 border border-slate-300 rounded focus:border-indigo-500 outline-none resize-none"
                  />
                </div>

                <Button 
                  onClick={handleGrade}
                  disabled={isGrading || grade === ''}
                  className="bg-[#1c1d1f] text-white hover:bg-slate-800 font-bold px-8"
                >
                  {isGrading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Grade
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <p>Select a student submission to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
