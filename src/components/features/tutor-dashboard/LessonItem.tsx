"use client";

import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Video, 
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { courseService, LessonResponse } from '@/services/courseService';
import fileService from '@/services/fileService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface LessonItemProps {
  lesson: LessonResponse;
  moduleId: string;
  index: number;
  onRefresh: () => void;
}

export default function LessonItem({ lesson, moduleId, index, onRefresh }: LessonItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Content Management States
  const [activeTab, setActiveTab] = useState<'VIDEO' | 'TEXT'>(
    lesson.type === 'QUIZ' ? 'TEXT' : lesson.type
  );
  const [textContent, setTextContent] = useState(lesson.content || '');
  const [isSavingText, setIsSavingText] = useState(false);
  
  // Video Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasContent = !!lesson.videoUrl || !!lesson.content;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;
    
    try {
      setIsDeleting(true);
      await courseService.deleteLesson(moduleId, lesson.id);
      window.dispatchEvent(new Event('course-updated'));
      toast.success('Lecture deleted successfully');
      onRefresh();
    } catch (error: any) {
      console.error(error);
      const isLocked = error.response?.status === 400 && error.response?.data?.message?.includes('Action not allowed');
      toast.error(isLocked ? "Khóa học đã khóa, vui lòng liên hệ Admin." : "Failed to delete lecture");
      setIsDeleting(false);
    }
  };

  const handleSaveText = async () => {
    if (!textContent.trim()) {
      toast.error('Article content cannot be empty');
      return;
    }
    
    try {
      setIsSavingText(true);
      await courseService.updateLesson(moduleId, lesson.id, {
        title: lesson.title,
        type: 'TEXT',
        content: textContent,
        orderIndex: lesson.orderIndex,
        videoUrl: undefined, // Clear video when switching to article
        durationSeconds: 0
      });
      window.dispatchEvent(new Event('course-updated'));
      toast.success('Article saved successfully');
      onRefresh();
    } catch (error: any) {
      console.error(error);
      const isLocked = error.response?.status === 400 && error.response?.data?.message?.includes('Action not allowed');
      toast.error(isLocked ? "Khóa học đã khóa, vui lòng liên hệ Admin." : "Failed to save article");
    } finally {
      setIsSavingText(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Vui lòng chọn một tệp Video hợp lệ (.mp4, .mov,...)');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const ext = file.name.split('.').pop();
      const randomName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

      // 1. Get pre-signed URL
      const presigned = await fileService.getPresignedUrl(randomName, file.type, "VIDEO");

      // 2. Upload cleanly via raw Axios to track progress
      await axios.put(presigned.uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      });

      // 3. Update Lesson Backend with the final fileUrl
      await courseService.updateLesson(moduleId, lesson.id, {
        title: lesson.title,
        type: 'VIDEO',
        videoUrl: presigned.fileUrl,
        content: lesson.content,
        orderIndex: lesson.orderIndex,
        durationSeconds: lesson.durationSeconds // optional, could parse from video if needed
      });

      window.dispatchEvent(new Event('course-updated'));
      toast.success('Video uploaded successfully!');
      onRefresh();
    } catch (error: any) {
      console.error(error);
      const isLocked = error?.response?.status === 400 && error?.response?.data?.message?.includes('Action not allowed');
      toast.error(isLocked ? "Khóa học đã khóa, vui lòng liên hệ Admin." : "Upload failed! Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn(
      "bg-white border transition-all rounded-sm shadow-sm ml-8 overflow-hidden",
      isExpanded ? "border-slate-800" : "border-slate-200 hover:border-slate-300",
      isDeleting && "opacity-50 pointer-events-none"
    )}>
      {/* HEADER */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center justify-between p-3 transition-colors cursor-pointer select-none",
          isExpanded ? "bg-slate-50 border-b border-slate-200" : "bg-transparent group/lesson"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {lesson.type === 'VIDEO' ? (
              <div className={cn("w-7 h-7 rounded flex items-center justify-center transition-colors", hasContent ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500")}>
                <Video className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className={cn("w-7 h-7 rounded flex items-center justify-center transition-colors", hasContent ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500")}>
                <FileText className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="text-sm font-medium text-[#1c1d1f]">Lecture {index + 1}: {lesson.title}</span>
            
            {hasContent && !isExpanded && (
               <CheckCircle2 className="w-4 h-4 text-green-600 ml-2 animate-in zoom-in" />
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isExpanded && (
             <div className="flex items-center gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity mr-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
             </div>
          )}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400">
             {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* EXPANDED CONTENT BODY */}
      {isExpanded && (
        <div className="p-5 bg-white animate-in slide-in-from-top-2 duration-200">
          
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-4">Content Type:</h4>
            <Button 
               variant="ghost" 
               size="sm" 
               className={cn("h-8 px-4 rounded-full text-xs font-bold gap-2", activeTab === 'VIDEO' ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}
               onClick={() => setActiveTab('VIDEO')}
            >
               <Video className="w-3.5 h-3.5" /> Video
            </Button>
            <Button 
               variant="ghost" 
               size="sm" 
               className={cn("h-8 px-4 rounded-full text-xs font-bold gap-2", activeTab === 'TEXT' ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}
               onClick={() => setActiveTab('TEXT')}
            >
               <FileText className="w-3.5 h-3.5" /> Article
            </Button>
            <div className="flex-1"></div>
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold">
               Delete Lecture
            </Button>
          </div>

          {/* VIDEO UPLOAD UI */}
          {activeTab === 'VIDEO' && (
            <div className="space-y-4">
               {lesson.videoUrl ? (
                 <div className="border border-slate-200 rounded-md p-4 bg-slate-50 flex items-start gap-4">
                    <div className="w-24 h-16 bg-slate-200 rounded flex items-center justify-center shrink-0 border border-slate-300/50">
                       <Video className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                       <h5 className="text-sm font-bold text-[#1c1d1f]">Video Uploaded</h5>
                       <p className="text-xs text-slate-500 break-all">{lesson.videoUrl}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                       Replace Video
                    </Button>
                 </div>
               ) : (
                 <div className="border-2 border-dashed border-slate-200 rounded-md p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-slate-300 transition-colors bg-slate-50/50">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                       <Video className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                       <h5 className="font-bold text-[#1c1d1f] text-sm mb-1">Select Video</h5>
                       <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                          Get your students engaged with high quality video. Support common formats (mp4, mov). Size limit applies.
                       </p>
                    </div>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-slate-900 text-white font-bold px-8 mt-2"
                    >
                      {isUploading ? "Uploading..." : "Select File"}
                    </Button>
                 </div>
               )}
               
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="video/*" 
                 onChange={handleVideoUpload} 
               />

               {isUploading && (
                  <div className="space-y-2 mt-4 animate-in fade-in">
                     <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span className="flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading directly to AWS S3...</span>
                        <span>{uploadProgress}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-indigo-600 transition-all duration-300 ease-out" 
                           style={{ width: `${uploadProgress}%` }}
                        />
                     </div>
                  </div>
               )}
            </div>
          )}

          {/* ARTICLE TEXT UI */}
          {activeTab === 'TEXT' && (
            <div className="space-y-4">
              <RichTextEditor 
                 value={textContent}
                 onChange={setTextContent}
                 placeholder="Enter article text here..."
                 className="min-h-[300px]"
              />
              <div className="flex justify-end pt-2">
                 <Button 
                    onClick={handleSaveText}
                    disabled={isSavingText}
                    className="bg-slate-900 text-white font-bold px-8"
                 >
                    {isSavingText ? "Saving..." : "Save Article"}
                 </Button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
