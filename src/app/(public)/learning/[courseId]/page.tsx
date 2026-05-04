'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  FileText, 
  ChevronDown,
  ArrowLeft,
  Settings,
  MessageSquare,
  Trophy,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { courseService, CourseSummary, LessonResponse } from '@/services/courseService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LearningPage() {
  const { courseId } = useParams() as { courseId: string };
  const router = useRouter();
  
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<LessonResponse | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isCompleting, setIsCompleting] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseData, progressData] = await Promise.all([
          courseService.getPublishedCourseDetail(courseId),
          courseService.getCompletedLessons(courseId)
        ]);

        if (!courseData) {
          toast.error("Course not found");
          router.push('/my-learning');
          return;
        }
        setCourse(courseData);
        setCompletedLessons(new Set(progressData || []));
        
        // Auto-select first lesson
        if (courseData.modules && courseData.modules.length > 0 && courseData.modules[0].lessons && courseData.modules[0].lessons.length > 0) {
          setActiveLesson(courseData.modules[0].lessons[0]);
          setExpandedModules(new Set([courseData.modules[0].id]));
        }
      } catch (error) {
        console.error("Failed to fetch course", error);
        toast.error("Failed to load course content");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
    document.title = "Learning | EduStream";
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    const newSet = new Set(expandedModules);
    if (newSet.has(moduleId)) newSet.delete(moduleId);
    else newSet.add(moduleId);
    setExpandedModules(newSet);
  };

  const handleComplete = async () => {
    if (!activeLesson || isCompleting) return;
    
    try {
      setIsCompleting(true);
      await courseService.completeLesson(activeLesson.id);
      
      const newCompleted = new Set(completedLessons);
      newCompleted.add(activeLesson.id);
      setCompletedLessons(newCompleted);
      
      toast.success("Lesson completed!");
      
      // Logic to move to next lesson automatically
      moveToNextLesson();
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('ALREADY_COMPLETED')) {
          setCompletedLessons(prev => new Set(prev).add(activeLesson.id));
          moveToNextLesson();
      } else {
        toast.error("Failed to update progress");
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const moveToNextLesson = () => {
    if (!course || !activeLesson) return;
    
    let foundCurrent = false;
    for (const module of course.modules || []) {
      for (const lesson of module.lessons || []) {
        if (foundCurrent) {
          setActiveLesson(lesson);
          if (!expandedModules.has(module.id)) {
            toggleModule(module.id);
          }
          return;
        }
        if (lesson.id === activeLesson.id) {
          foundCurrent = true;
        }
      }
    }
    
    // If we reach here, it was the last lesson
    toast.success("Congratulations! You've finished the course content.");
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#1c1d1f] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-400 font-medium">Preparing your classroom...</p>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Focused Header */}
      <header className="h-14 bg-[#1c1d1f] border-b border-white/10 flex items-center px-4 justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/my-learning" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-white/10 hidden md:block" />
          <h1 className="text-white font-bold text-sm md:text-base line-clamp-1 max-w-md">
            {course.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-400">
             <Trophy className="w-4 h-4" />
             <span>Your Progress: {completedLessons.size} / {(course.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0)}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/10 border border-white/20"
          >
            {sidebarOpen ? <X className="w-4 h-4 mr-2" /> : <Menu className="w-4 h-4 mr-2" />}
            <span className="hidden sm:inline">Course Content</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* PLAYER AREA (Left) */}
        <div className={cn(
          "flex-1 flex flex-col overflow-y-auto transition-all duration-300",
          sidebarOpen ? "mr-0" : "mr-0"
        )}>
          {/* Content Viewer */}
          <div className="w-full bg-black aspect-video md:max-h-[70vh] flex items-center justify-center relative group">
            {activeLesson?.type === 'VIDEO' ? (
              <div className="w-full h-full relative">
                 {/* Video Player Placeholder or Actual Iframe/Video Tag */}
                 {activeLesson.videoUrl ? (
                   <video 
                     src={activeLesson.videoUrl} 
                     controls 
                     className="w-full h-full"
                     autoPlay
                   />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                      <PlayCircle className="w-16 h-16 opacity-20" />
                      <p className="font-medium">No video source provided</p>
                   </div>
                 )}
              </div>
            ) : activeLesson?.type === 'TEXT' ? (
              <div className="w-full h-full bg-white overflow-y-auto p-8 md:p-12 lg:p-20">
                 <article className="max-w-3xl mx-auto prose prose-slate lg:prose-lg editor-content">
                    <h2 className="text-3xl font-bold mb-8 text-slate-900">{activeLesson.title}</h2>
                    <div 
                      className="text-slate-700 leading-relaxed space-y-6"
                      dangerouslySetInnerHTML={{ __html: activeLesson.content || '<p>No content available.</p>' }}
                    />
                 </article>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                 <p>Select a lesson to begin</p>
              </div>
            )}
          </div>

          {/* Lesson Footer Controls */}
          <div className="border-t border-slate-100 p-4 md:p-6 bg-white shrink-0">
             <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                   <h2 className="text-lg font-bold text-slate-900">{activeLesson?.title}</h2>
                   <p className="text-sm text-slate-500">
                      Module: {course.modules?.find(m => m.lessons?.some(l => l.id === activeLesson?.id))?.title}
                   </p>
                </div>
                
                <div className="flex items-center gap-3">
                   <Button 
                     onClick={handleComplete}
                     disabled={isCompleting || !!(activeLesson && completedLessons.has(activeLesson.id))}
                     className={cn(
                       "h-12 px-8 font-bold rounded-none transition-all",
                       activeLesson && completedLessons.has(activeLesson.id) 
                       ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
                       : "bg-[#1c1d1f] text-white hover:bg-slate-800"
                     )}
                   >
                      {activeLesson && completedLessons.has(activeLesson.id) ? (
                        <><CheckCircle2 className="w-4 h-4 mr-2" /> Completed</>
                      ) : isCompleting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        "Mark as Complete"
                      )}
                   </Button>
                </div>
             </div>
          </div>

          {/* Additional Tabs (Overview, Q&A, etc.) */}
          <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-10 space-y-12 pb-32">
             <div className="border-b border-slate-200 flex gap-8">
                {['Overview', 'Notes', 'Announcements', 'Reviews'].map((tab, i) => (
                  <button key={tab} className={cn("pb-4 text-sm font-bold border-b-2 transition-all", i === 0 ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-900")}>
                    {tab}
                  </button>
                ))}
             </div>
             
             <div className="space-y-6">
                <div className="space-y-4">
                   <h3 className="text-xl font-bold text-slate-900">About this course</h3>
                   <p className="text-slate-600 leading-relaxed">{course.subtitle}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
                   <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill level</div>
                      <div className="text-sm font-medium text-slate-700">{course.level}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lectures</div>
                      <div className="text-sm font-medium text-slate-700">{(course.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0)}</div>
                   </div>
                </div>

                <div className="pt-8 prose prose-slate max-w-none">
                   <div dangerouslySetInnerHTML={{ __html: course.description || '' }} />
                </div>
             </div>
          </div>
        </div>

        {/* SIDEBAR (Right) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full md:w-80 lg:w-[350px] border-l border-slate-200 bg-white h-full flex flex-col shrink-0 absolute right-0 md:relative z-40 shadow-2xl md:shadow-none"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <h2 className="font-bold text-slate-900">Course Content</h2>
                 <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-slate-200 rounded">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                 {(course.modules || []).map((module, mIndex) => (
                   <div key={module.id} className="border-b border-slate-100">
                      <button 
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-4 flex items-start justify-between hover:bg-slate-50 transition-colors text-left group"
                      >
                         <div className="flex-1 pr-4">
                            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Section {mIndex + 1}</div>
                            <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">{module.title}</h3>
                            <div className="text-[11px] text-slate-500 mt-1 font-medium">
                               {module.lessons?.length || 0} Lectures
                            </div>
                         </div>
                         <ChevronDown className={cn("w-4 h-4 text-slate-400 mt-1 transition-transform duration-300", expandedModules.has(module.id) && "rotate-180")} />
                      </button>
                      
                      <AnimatePresence>
                        {expandedModules.has(module.id) && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-slate-50/30"
                          >
                             {(module.lessons || []).map((lesson, lIndex) => (
                               <button
                                 key={lesson.id}
                                 onClick={() => setActiveLesson(lesson)}
                                 className={cn(
                                   "w-full px-4 py-3.5 flex items-start gap-3 hover:bg-white transition-colors border-l-4",
                                   activeLesson?.id === lesson.id 
                                   ? "bg-white border-indigo-600" 
                                   : "border-transparent"
                                 )}
                               >
                                  <div className="mt-0.5 shrink-0">
                                     {completedLessons.has(lesson.id) ? (
                                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                     ) : (
                                       <div className="w-4 h-4 rounded-full border border-slate-300" />
                                     )}
                                  </div>
                                  <div className="flex-1 text-left">
                                     <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-xs text-slate-500 font-medium">{lIndex + 1}.</span>
                                        <span className={cn("text-xs font-bold", activeLesson?.id === lesson.id ? "text-indigo-600" : "text-slate-700")}>
                                           {lesson.title}
                                        </span>
                                     </div>
                                     <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                        {lesson.type === 'VIDEO' ? (
                                          <><PlayCircle className="w-3 h-3" /> Video</>
                                        ) : (
                                          <><FileText className="w-3 h-3" /> Article</>
                                        )}
                                        <span>•</span>
                                        <span>{Math.floor((lesson.durationSeconds || 0) / 60)} min</span>
                                     </div>
                                  </div>
                               </button>
                             ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                 ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .editor-content b, .editor-content strong { font-weight: bold; }
        .editor-content i, .editor-content em { font-style: italic; }
        .editor-content ul { list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .editor-content ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1rem 0; }
        .editor-content p { margin-bottom: 1rem; line-height: 1.7; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
