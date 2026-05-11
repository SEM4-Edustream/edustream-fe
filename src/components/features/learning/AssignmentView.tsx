import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Upload, CheckCircle2 } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { LessonResponse } from '@/services/courseService';
import fileService from '@/services/fileService';
import axios from 'axios';

interface AssignmentViewProps {
  lesson: LessonResponse;
  onComplete: () => void;
}

export default function AssignmentView({ lesson, onComplete }: AssignmentViewProps) {
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSubmission();
  }, [lesson.id]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const res: any = await axiosInstance.get(`/api/assignments/${lesson.id}/my-submission`);
      if (res) {
        setSubmission(res);
        setContent(res.content || '');
        setFileUrl(res.fileUrl || '');
        
        // Auto mark as complete if graded
        if (res.status === 'GRADED') {
          onComplete();
        }
      } else {
        setSubmission(null);
        setContent('');
        setFileUrl('');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const ext = file.name.split('.').pop();
      const randomName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      
      const presigned = await fileService.getPresignedUrl(randomName, file.type, "DOCUMENT");
      
      await axios.put(presigned.uploadUrl, file, {
        headers: { 'Content-Type': file.type }
      });
      
      setFileUrl(presigned.fileUrl);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !fileUrl) {
      toast.error('Please provide some text content or upload a file.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res: any = await axiosInstance.post(`/api/assignments/${lesson.id}/submit`, {
        content,
        fileUrl
      });
      setSubmission(res);
      toast.success('Assignment submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  const isGraded = submission?.status === 'GRADED';

  return (
    <div className="w-full h-full bg-white overflow-y-auto no-scrollbar p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Assignment Prompt */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Assignment: {lesson.title}</h2>
          <div className="prose prose-slate max-w-none p-6 bg-slate-50 border border-slate-200 rounded-lg">
             <div dangerouslySetInnerHTML={{ __html: lesson.content || '<p>No instructions provided.</p>' }} />
          </div>
        </div>

        {/* Feedback Section (if graded) */}
        {isGraded && (
          <div className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <div>
                <h3 className="font-bold text-emerald-900 text-lg">Assignment Graded</h3>
                <p className="text-emerald-700">Your score: <span className="font-bold text-xl ml-1">{submission.grade}/100</span></p>
              </div>
            </div>
            {submission.feedback && (
              <div className="mt-4 pt-4 border-t border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-2">Tutor Feedback:</h4>
                <p className="text-emerald-800 whitespace-pre-wrap">{submission.feedback}</p>
              </div>
            )}
          </div>
        )}

        {/* Submission Area */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Your Submission</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Response Text</label>
              {isGraded ? (
                 <div className="p-4 border rounded bg-slate-50 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content || '<p>No text response.</p>' }} />
              ) : (
                 <RichTextEditor 
                   value={content}
                   onChange={setContent}
                   placeholder="Type your answer here..."
                   className="min-h-[200px]"
                 />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Attached File (Optional)</label>
              {fileUrl ? (
                <div className="flex items-center gap-4 p-4 border rounded-md bg-slate-50">
                  <FileText className="w-6 h-6 text-indigo-500" />
                  <a href={fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-medium hover:underline flex-1 truncate">
                    {fileUrl.split('/').pop()}
                  </a>
                  {!isGraded && (
                    <Button variant="ghost" size="sm" onClick={() => setFileUrl('')} className="text-red-500 hover:bg-red-50 hover:text-red-600">Remove</Button>
                  )}
                </div>
              ) : (
                !isGraded && (
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" 
                      id="assignment-file"
                      className="hidden" 
                      onChange={handleFileUpload} 
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('assignment-file')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      Upload File
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>

          {!isGraded && (
            <div className="pt-6 flex justify-end">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || (!content.trim() && !fileUrl)}
                className="bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold h-12 px-8 text-lg"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {submission ? 'Resubmit Assignment' : 'Submit Assignment'}
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
