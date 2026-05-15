'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
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
  Loader2,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { courseService, CourseSummary, LessonResponse } from '@/services/courseService';
import { noteService, NoteResponse } from '@/services/noteService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import QuizView from '@/components/features/learning/QuizView';
import AssignmentView from '@/components/features/learning/AssignmentView';
import AICoachChat from '@/components/features/learning/AICoachChat';
import StudentQASection from '@/components/features/learning/StudentQASection';
import StudentAnnouncements from '@/components/features/learning/StudentAnnouncements';
import { reviewService } from '@/services/reviewService';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function LearningPage() {
  const t = useTranslations('Learning');
  const { courseId } = useParams() as { courseId: string };
  const router = useRouter();
  
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<LessonResponse | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isCompleting, setIsCompleting] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'announcements' | 'reviews'>('overview');
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [reviewStep, setReviewStep] = useState<1 | 2>(1);
  const [courseReviews, setCourseReviews] = useState<any[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);

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
    // fetchNotes(); // Temporarily disabled
    document.title = "Learning | EduStream";
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      setIsReviewsLoading(true);
      const data = await reviewService.getCourseReviews(courseId);
      // Backend returns Page object
      setCourseReviews(data.result?.content || data.content || []);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab]);

  const fetchNotes = async () => {
    try {
      setIsNotesLoading(true);
      const data = await noteService.getMyNotesByCourse(courseId);
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes", error);
    } finally {
      setIsNotesLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim() || !activeLesson) return;
    
    try {
      setIsSubmittingNote(true);
      const newNote = await noteService.createNote({
        courseId,
        lessonId: activeLesson.id,
        content: noteContent,
        timestampSeconds: activeLesson.type === 'VIDEO' ? Math.floor(currentTime) : undefined
      });
      setNotes([newNote, ...notes]);
      setNoteContent('');
      toast.success(t('note_added'));
    } catch (error) {
      toast.error(t('note_failed'));
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await noteService.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
      toast.success(t('note_deleted'));
    } catch (error) {
      toast.error(t('note_delete_failed'));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const jumpToTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };

  const toggleModule = (moduleId: string) => {
    const newSet = new Set(expandedModules);
    if (newSet.has(moduleId)) newSet.delete(moduleId);
    else newSet.add(moduleId);
    setExpandedModules(newSet);
  };

  const handleReviewSubmit = async () => {
    if (!reviewComment.trim()) {
      toast.error("Vui lòng để lại lời bình luận nhé!");
      return;
    }
    
    try {
      setIsSubmittingReview(true);
      await reviewService.createReview(courseId, {
        rating,
        comment: reviewComment
      });
      setHasSubmittedReview(true);
      toast.success("Cảm ơn bạn đã đánh giá khóa học!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể gửi đánh giá lúc này.");
    } finally {
      setIsSubmittingReview(false);
    }
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
      
      // Check if all lessons are completed
      if (!course) return;
      
      const totalLessons = (course.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
      if (newCompleted.size === totalLessons) {
          setShowCongratulations(true);
      } else {
          // Logic to move to next lesson automatically
          moveToNextLesson();
      }
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
        <p className="text-slate-400 font-medium">{t('preparing')}</p>
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
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-400">
             <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>{t('your_progress')}: {completedLessons.size} / {(course.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0)}</span>
             </div>
             
             {completedLessons.size === (course.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0) && (
               <button 
                 onClick={() => setShowCongratulations(true)}
                 className="flex items-center gap-1.5 text-white hover:text-indigo-400 transition-colors border border-white/20 px-3 py-1 rounded-md bg-white/5"
               >
                 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                 <span>Leave a rating</span>
               </button>
             )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/10 border border-white/20"
          >
            {sidebarOpen ? <X className="w-4 h-4 mr-2" /> : <Menu className="w-4 h-4 mr-2" />}
            <span className="hidden sm:inline">{t('course_content')}</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* PLAYER AREA (Left) */}
        <div className={cn(
          "flex-1 flex flex-col overflow-y-auto no-scrollbar transition-all duration-300",
          sidebarOpen ? "mr-0" : "mr-0"
        )}>
          {/* Content Viewer */}
          <div className="w-full bg-black aspect-video md:max-h-[70vh] flex items-center justify-center relative group">
            {activeLesson?.type === 'VIDEO' ? (
              <div className="w-full h-full relative">
                 {/* Video Player Placeholder or Actual Iframe/Video Tag */}
                 {activeLesson.videoUrl ? (
                   <video 
                     ref={videoRef}
                     src={activeLesson.videoUrl} 
                     controls 
                     className="w-full h-full"
                     autoPlay
                     onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                   />
                 ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                       <PlayCircle className="w-16 h-16 opacity-20" />
                       <p className="font-medium">{t('no_video')}</p>
                    </div>
                 )}
              </div>
            ) : activeLesson?.type === 'TEXT' ? (
              <div className="w-full h-full bg-white overflow-y-auto no-scrollbar p-8 md:p-12 lg:p-20">
                 <article className="max-w-3xl mx-auto prose prose-slate lg:prose-lg editor-content">
                    <h2 className="text-3xl font-bold mb-8 text-slate-900">{activeLesson.title}</h2>
                    <div 
                      className="text-slate-700 leading-relaxed space-y-6"
                      dangerouslySetInnerHTML={{ __html: activeLesson.content || '<p>No content available.</p>' }}
                    />
                 </article>
              </div>
            ) : activeLesson?.type === 'QUIZ' ? (
              <QuizView 
                lessonId={activeLesson.id} 
                onComplete={() => {
                  const newCompleted = new Set(completedLessons);
                  newCompleted.add(activeLesson.id);
                  setCompletedLessons(newCompleted);
                  moveToNextLesson();
                }} 
              />
            ) : activeLesson?.type === 'ASSIGNMENT' ? (
              <AssignmentView 
                lesson={activeLesson} 
                onComplete={() => handleComplete()} 
              />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <p>{t('select_lesson')}</p>
               </div>
            )}
          </div>

          {/* Lesson Footer Controls */}
          <div className="border-t border-slate-100 p-4 md:p-6 bg-white shrink-0">
             <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                   <h2 className="text-lg font-bold text-slate-900">{activeLesson?.title}</h2>
                   <p className="text-sm text-slate-500">
                      {t('module')}: {course.modules?.find(m => m.lessons?.some(l => l.id === activeLesson?.id))?.title}
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
                        <><CheckCircle2 className="w-4 h-4 mr-2" /> {t('completed')}</>
                      ) : isCompleting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        t('mark_complete')
                      )}
                   </Button>
                </div>
             </div>
          </div>

          {/* Additional Tabs (Overview, Q&A, etc.) */}
          <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-10 space-y-12 pb-32">
             <div className="border-b border-slate-200 flex gap-8 overflow-x-auto">
                {[
                  { id: 'overview', label: t('tabs.overview') },
                  { id: 'qa', label: 'Q&A' },
                  { id: 'announcements', label: t('tabs.announcements') },
                  { id: 'reviews', label: t('tabs.reviews') }
                ].map((tab) => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "pb-4 text-sm font-bold border-b-2 transition-all", 
                      activeTab === tab.id ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
             </div>
             
             <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                   <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="space-y-4">
                         <h3 className="text-xl font-bold text-slate-900">{t('about_course')}</h3>
                         <p className="text-slate-600 leading-relaxed">{course.subtitle}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
                         <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('skill_level')}</div>
                            <div className="text-sm font-medium text-slate-700">{course.level}</div>
                         </div>
                         <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('lectures')}</div>
                            <div className="text-sm font-medium text-slate-700">{(course.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0)}</div>
                         </div>
                      </div>

                      <div className="pt-8 prose prose-slate max-w-none editor-content">
                         <div dangerouslySetInnerHTML={{ __html: course.description || '' }} />
                      </div>
                   </div>
                )}

                {/* Notes tab content temporarily removed */}

                {activeTab === 'qa' && (
                   <div className="animate-in fade-in duration-500">
                     <StudentQASection
                       courseId={courseId}
                       activeLessonId={activeLesson?.id}
                       activeLessonTitle={activeLesson?.title}
                     />
                   </div>
                )}

                {activeTab === 'announcements' && (
                   <div className="animate-in fade-in duration-500">
                      <StudentAnnouncements courseId={courseId} />
                   </div>
                )}

                {activeTab === 'reviews' && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                      {/* Review Summary Header */}
                      <div className="flex flex-col md:flex-row gap-10 items-center bg-slate-50/50 rounded-3xl p-8 border border-slate-100">
                         <div className="text-center space-y-2">
                            <div className="text-6xl font-black text-slate-900 tracking-tighter">
                               {course.averageRating?.toFixed(1) || '0.0'}
                            </div>
                            <div className="flex justify-center gap-1">
                               {[1, 2, 3, 4, 5].map((s) => (
                                  <Star 
                                    key={s} 
                                    className={cn(
                                      "w-5 h-5", 
                                      s <= Math.round(course.averageRating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-200"
                                    )} 
                                  />
                               ))}
                            </div>
                            <p className="text-sm font-bold text-amber-600 uppercase tracking-widest">{t('course_rating')}</p>
                         </div>

                         <div className="flex-1 space-y-3 w-full">
                            {[5, 4, 3, 2, 1].map((s) => (
                               <div key={s} className="flex items-center gap-4 group">
                                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                     <motion.div 
                                       initial={{ width: 0 }}
                                       animate={{ width: `${s === 5 ? 70 : s === 4 ? 20 : 5}%` }}
                                       transition={{ duration: 1, ease: "easeOut" }}
                                       className="h-full bg-slate-900" 
                                     />
                                  </div>
                                  <div className="flex items-center gap-1 min-w-[60px] justify-end">
                                     <div className="flex">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                          <Star key={i} className={cn("w-3 h-3", i <= s ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                                        ))}
                                     </div>
                                     <span className="text-xs font-bold text-slate-400">{s === 5 ? '70' : s === 4 ? '20' : '5'}%</span>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      {/* Review List */}
                      <div className="space-y-8">
                         <h3 className="text-xl font-bold text-slate-900">Student Feedback</h3>
                         
                         {isReviewsLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                               <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                               <p className="text-slate-400 font-medium">Loading reviews...</p>
                            </div>
                         ) : courseReviews.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                               <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                               <p className="text-slate-400 font-medium">Chưa có đánh giá nào cho khóa học này.</p>
                            </div>
                         ) : (
                            <div className="grid gap-6">
                               {courseReviews.map((review) => (
                                  <motion.div 
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
                                  >
                                     <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-50 group-hover:border-indigo-100 transition-colors">
                                              <img 
                                                src={review.studentAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${review.studentName}`} 
                                                alt={review.studentName} 
                                                className="w-full h-full object-cover" 
                                              />
                                           </div>
                                           <div>
                                              <h4 className="font-bold text-slate-900">{review.studentName}</h4>
                                              <div className="flex gap-0.5 mt-1">
                                                 {[1, 2, 3, 4, 5].map((s) => (
                                                   <Star 
                                                     key={s} 
                                                     className={cn(
                                                       "w-3 h-3", 
                                                       s <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-100"
                                                     )} 
                                                   />
                                                 ))}
                                              </div>
                                           </div>
                                        </div>
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                           {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: vi })}
                                        </div>
                                     </div>
                                     <p className="text-slate-600 leading-relaxed pl-16">
                                        {review.comment}
                                     </p>
                                  </motion.div>
                               ))}
                            </div>
                         )}
                      </div>
                   </div>
                )}
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
                 <h2 className="font-bold text-slate-900">{t('course_content')}</h2>
                 <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-slate-200 rounded">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar">
                 {(course.modules || []).map((module, mIndex) => (
                   <div key={module.id} className="border-b border-slate-100">
                      <button 
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-4 flex items-start justify-between hover:bg-slate-50 transition-colors text-left group"
                      >
                         <div className="flex-1 pr-4">
                            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{t('section')} {mIndex + 1}</div>
                            <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">{module.title}</h3>
                            <div className="text-[11px] text-slate-500 mt-1 font-medium">
                               {module.lessons?.length || 0} {t('lectures')}
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
                                          <><PlayCircle className="w-3 h-3" /> {t('video')}</>
                                        ) : lesson.type === 'QUIZ' ? (
                                          <><CheckCircle2 className="w-3 h-3" /> Quiz</>
                                        ) : lesson.type === 'ASSIGNMENT' ? (
                                          <><FileText className="w-3 h-3" /> Assignment</>
                                        ) : (
                                          <><FileText className="w-3 h-3" /> {t('article')}</>
                                        )}
                                        <span>•</span>
                                        <span>{Math.floor((lesson.durationSeconds || 0) / 60)} {t('min')}</span>
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
      {/* AI Coach Assistant */}
      {/* Congratulations Modal */}
      <AnimatePresence>
        {showCongratulations && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCongratulations(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              <div className="bg-indigo-600 p-12 text-center text-white relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                   <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                   <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
                </div>
                
                <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md ring-1 ring-white/30 animate-bounce">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tight">Congratulations!</h2>
                <p className="text-indigo-100 text-lg font-medium max-w-md mx-auto">
                   Bạn đã xuất sắc hoàn thành tất cả các bài học trong khóa học này!
                </p>
              </div>

              <div className="p-10 md:p-12 space-y-10">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest text-center">A message from your instructor</h3>
                  <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 relative italic text-slate-700 leading-loose text-center text-lg font-medium">
                     <span className="text-6xl text-slate-200 absolute -top-4 -left-2 select-none font-serif">"</span>
                     {course.congratulationsMessage || "Chúc mừng bạn đã hoàn thành khóa học! Hy vọng những kiến thức này sẽ giúp ích cho sự nghiệp của bạn."}
                     <span className="text-6xl text-slate-200 absolute -bottom-12 -right-2 select-none font-serif">"</span>
                  </div>
                </div>

                {/* REVIEW FORM SECTION */}
                {!hasSubmittedReview ? (
                   <div className="space-y-8 pt-6 border-t border-slate-100">
                      <AnimatePresence mode="wait">
                        {reviewStep === 1 ? (
                          <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                          >
                            <div className="text-center">
                              <h3 className="text-xl font-bold text-slate-900 mb-2">Bạn đánh giá khóa học này thế nào?</h3>
                              <p className="text-slate-500 text-sm">Chọn số sao tương ứng với trải nghiệm của bạn</p>
                            </div>

                            <div className="flex justify-center gap-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => {
                                    setRating(star);
                                    setReviewStep(2);
                                  }}
                                  onMouseEnter={() => setRating(star)}
                                  className="transition-transform active:scale-90"
                                >
                                  <Star 
                                    className={cn(
                                      "w-14 h-14 transition-all duration-300",
                                      star <= rating 
                                      ? "text-amber-400 fill-amber-400 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.4)] scale-110" 
                                      : "text-slate-200 hover:text-slate-300"
                                    )} 
                                  />
                                </button>
                              ))}
                            </div>
                            
                            <div className="text-center h-6">
                               <span className="text-sm font-black text-amber-500 uppercase tracking-widest">
                                 {rating > 0 && (rating === 5 ? "Tuyệt vời!" : rating === 4 ? "Rất tốt" : rating === 3 ? "Bình thường" : rating === 2 ? "Kém" : "Rất kém")}
                               </span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <button 
                              onClick={() => setReviewStep(1)}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                            >
                               <ChevronLeft className="w-3 h-3" /> Quay lại
                            </button>

                            <div className="text-center">
                              <h3 className="text-xl font-bold text-slate-900 mb-1">Tại sao bạn đánh giá {rating} sao?</h3>
                              <p className="text-amber-500 font-black text-xs uppercase tracking-widest">
                                 {rating === 5 ? "Amazing, above expectations!" : rating === 4 ? "Good, met expectations" : "Could be better"}
                              </p>
                            </div>

                            <div className="flex justify-center gap-1.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  className={cn(
                                    "w-6 h-6",
                                    star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                                  )} 
                                />
                              ))}
                            </div>

                            <div className="space-y-2">
                              <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Hãy chia sẻ thêm về trải nghiệm của bạn... Điều gì làm bạn hài lòng hoặc chưa hài lòng?"
                                className="w-full h-40 p-6 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400 bg-slate-50/50"
                              />
                            </div>

                            <Button
                              onClick={handleReviewSubmit}
                              disabled={isSubmittingReview}
                              className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-lg shadow-2xl shadow-slate-200 transition-all active:scale-[0.98]"
                            >
                              {isSubmittingReview ? (
                                 <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Đang lưu...
                                 </span>
                              ) : "Lưu và Hoàn thành"}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                ) : (
                   <div className="pt-6 border-t border-slate-100 text-center animate-in zoom-in duration-500">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Đánh giá thành công!</h3>
                      <p className="text-slate-500">Cảm ơn bạn rất nhiều vì những ý kiến quý báu này.</p>
                   </div>
                )}

                <div className="flex items-center justify-between p-6 bg-slate-100 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                       <img 
                         src={course.tutorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${course.tutorName}`} 
                         alt={course.tutorName} 
                         className="w-full h-full object-cover" 
                       />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900">{course.tutorName}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Course Instructor</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    onClick={() => router.push('/my-learning')}
                    className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-indigo-100"
                  >
                    Go to My Learning
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => setShowCongratulations(false)}
                    className="flex-1 h-14 text-slate-500 font-bold rounded-xl text-lg hover:bg-slate-50"
                  >
                    Keep Exploring
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AICoachChat 
        courseId={courseId} 
        courseTitle={course?.title || ""} 
      />
    </div>
  );
}
