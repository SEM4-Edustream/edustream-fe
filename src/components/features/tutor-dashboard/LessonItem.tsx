"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Video, 
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  X,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import fileService from '@/services/fileService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import axios from 'axios';
import QuizEditor from './QuizEditor';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { courseService, LessonResponse } from '@/services/courseService';
import { DraggableProvided } from '@hello-pangea/dnd';

interface LessonItemProps {
  lesson: LessonResponse;
  moduleId: string;
  index: number;
  onRefresh: () => void;
  provided?: DraggableProvided;
}

export default function LessonItem({ lesson, moduleId, index, onRefresh, provided }: LessonItemProps) {
  const { courseId } = useParams() as { courseId: string };
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Content Management States
  const [activeTab, setActiveTab] = useState<'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT'>(
    lesson.type
  );
  const [textContent, setTextContent] = useState(lesson.content || '');
  const [isSavingText, setIsSavingText] = useState(false);
  
  // Video Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasContent = !!lesson.videoUrl || !!lesson.content;

  // Tự động poll (hỏi lại API) mỗi 5 giây nếu video đang chờ xử lý duration
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (lesson.type === 'VIDEO' && lesson.videoUrl && !lesson.durationSeconds) {
      timeout = setTimeout(() => {
        onRefresh();
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [lesson.type, lesson.videoUrl, lesson.durationSeconds, onRefresh]);

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
      // Gắn lessonId vào đầu tên file để Lambda có thể nhận diện được
      const randomName = `${lesson.id}_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

      // 1. Get pre-signed URL
      const presigned = await fileService.getPresignedUrl(randomName, file.type, "VIDEO");

      // 2. Extract Duration from file
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      const durationPromise = new Promise<number>((resolve) => {
        videoElement.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoElement.src);
          resolve(Math.round(videoElement.duration));
        };
      });
      videoElement.src = URL.createObjectURL(file);
      const duration = await durationPromise;

      // 3. Upload cleanly via raw Axios to track progress
      await axios.put(presigned.uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      });

      // 4. Update Lesson Backend with the final fileUrl and extracted duration
      await courseService.updateLesson(moduleId, lesson.id, {
        title: lesson.title,
        type: 'VIDEO',
        videoUrl: presigned.fileUrl,
        content: lesson.content,
        orderIndex: lesson.orderIndex,
        durationSeconds: duration 
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
    <div 
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      className={cn(
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
            <div {...provided?.dragHandleProps} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 mr-1" onClick={(e) => e.stopPropagation()}>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
            </div>
            {lesson.type === 'VIDEO' ? (
              <div className={cn("w-7 h-7 rounded flex items-center justify-center transition-colors", hasContent ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500")}>
                <Video className="w-3.5 h-3.5" />
              </div>
            ) : lesson.type === 'QUIZ' ? (
              <div className={cn("w-7 h-7 rounded flex items-center justify-center transition-colors", "bg-orange-100 text-orange-700")}>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            ) : lesson.type === 'ASSIGNMENT' ? (
              <div className={cn("w-7 h-7 rounded flex items-center justify-center transition-colors", hasContent ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500")}>
                <FileText className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className={cn("w-7 h-7 rounded flex items-center justify-center transition-colors", hasContent ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500")}>
                <FileText className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="text-sm font-medium text-[#1c1d1f]">
              {lesson.type === 'QUIZ' ? 'Quiz' : lesson.type === 'ASSIGNMENT' ? 'Assignment' : 'Lecture'} {index + 1}: {lesson.title}
            </span>
            
            {isUploading ? (
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded ml-2 flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" /> Uploading {uploadProgress}%
              </span>
            ) : lesson.type === 'VIDEO' && lesson.videoUrl ? (
              lesson.durationSeconds ? (
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded ml-2">
                  {Math.floor(lesson.durationSeconds / 60)}:{(lesson.durationSeconds % 60).toString().padStart(2, '0')}
                </span>
              ) : (
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded ml-2 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Processing...
                </span>
              )
            ) : null}

            {hasContent && !isExpanded && (lesson.type !== 'VIDEO' || (lesson.durationSeconds && lesson.durationSeconds > 0)) ? (
               <CheckCircle2 className="w-4 h-4 text-green-600 ml-2 animate-in zoom-in" />
            ) : null}
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-4">
              {lesson.type === 'QUIZ' ? 'Quiz Settings' : lesson.type === 'ASSIGNMENT' ? 'Assignment Details' : 'Content Type:'}
            </h4>
            
            {(lesson.type === 'VIDEO' || lesson.type === 'TEXT') && (
              <>
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
              </>
            )}
            <div className="flex-1"></div>
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold">
               Delete {lesson.type === 'QUIZ' ? 'Quiz' : lesson.type === 'ASSIGNMENT' ? 'Assignment' : 'Lecture'}
            </Button>
          </div>

          {activeTab === 'QUIZ' && (
            <QuizEditor lesson={lesson} moduleId={moduleId} />
          )}

          {activeTab === 'ASSIGNMENT' && (
            <div className="space-y-4">
              <RichTextEditor 
                 value={textContent}
                 onChange={setTextContent}
                 placeholder="Enter assignment prompt and instructions..."
                 className="min-h-[300px]"
              />
              <div className="flex justify-between items-center pt-2">
                 <Link href={`/tutor/dashboard/communication/assignments/${courseId}/submissions/${lesson.id}`}>
                   <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                      <ExternalLink className="w-4 h-4 mr-2" /> Grade Submissions
                   </Button>
                 </Link>
                 <Button 
                    onClick={async () => {
                      try {
                        setIsSavingText(true);
                        await courseService.updateLesson(moduleId, lesson.id, {
                          title: lesson.title,
                          type: 'ASSIGNMENT',
                          content: textContent,
                          orderIndex: lesson.orderIndex,
                          videoUrl: undefined,
                          durationSeconds: 0
                        });
                        toast.success('Assignment saved successfully');
                      } catch (e) {
                        toast.error('Failed to save assignment');
                      } finally {
                        setIsSavingText(false);
                      }
                    }}
                    disabled={isSavingText}
                    className="bg-slate-900 text-white font-bold"
                 >
                    {isSavingText && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Assignment
                 </Button>
              </div>
            </div>
          )}

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
                        <span className="flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading video...</span>
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
