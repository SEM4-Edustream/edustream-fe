"use client";

import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen, 
  Search,
  ExternalLink,
  ShieldAlert,
  Loader2,
  X,
  Target,
  FileText,
  Video,
  MonitorPlay,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import adminService from '@/services/adminService';
import { toast } from 'sonner';
import { CourseSummary } from '@/services/courseService';
import { cn } from '@/lib/utils';

export default function AdminCourseVerificationPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review Modal States
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courseDetail, setCourseDetail] = useState<CourseSummary | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPendingCourses = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPendingCourses();
      setCourses(data || []);
    } catch (error) {
      toast.error('Failed to load pending courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const openReviewModal = async (id: string) => {
    setSelectedCourseId(id);
    setLoadingDetail(true);
    try {
      const data = await adminService.getCourseDetail(id);
      setCourseDetail(data);
    } catch (error) {
      toast.error("Failed to load course details for review");
      setSelectedCourseId(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleReviewAction = async (isApprove: boolean) => {
    if (!selectedCourseId) return;
    
    try {
      setIsProcessing(true);
      await adminService.verifyCourse(selectedCourseId, isApprove);
      toast.success(isApprove ? "Course approved and live!" : "Course rejected");
      
      // Update lists
      setCourses(prev => prev.filter(c => c.id !== selectedCourseId));
      setSelectedCourseId(null);
      setCourseDetail(null);
    } catch (error) {
      toast.error('Failed to process review action');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Course Verification</h1>
          <p className="text-slate-500 font-medium mt-1">Review and verify tutor content before it reaches students</p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden p-1 shadow-sm">
          <div className="flex items-center px-4 gap-2 text-slate-400">
             <Search className="w-4 h-4" />
             <input type="text" placeholder="Search submissions..." className="border-none outline-none text-sm w-48 text-slate-800 placeholder-slate-400 py-1.5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <Clock className="w-5 h-5 text-amber-500" />
               Pending Reviews
               <span className="bg-amber-100 text-amber-700 py-0.5 px-3 rounded-full text-xs font-bold ml-2">
                 {courses.length}
               </span>
            </h3>
         </div>

         {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
               <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
               <p className="font-bold text-xs uppercase tracking-widest">Gathering Submissions...</p>
            </div>
         ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 ring-1 ring-slate-100">
                  <ShieldAlert className="w-10 h-10" />
               </div>
               <h4 className="text-xl font-bold text-slate-900 mb-2">Inbox Empty!</h4>
               <p className="text-slate-500 text-sm max-w-sm font-medium">There are no courses waiting for review. Why not check other administrative tasks?</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100">
                     <tr>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">Course</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">Instructor</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">Price</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">Created</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px] text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {courses.map((course) => (
                        <tr key={course.id} className="hover:bg-slate-50/50 transition-all group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-5">
                                 <div className="relative w-24 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                                    {course.thumbnailUrl ? (
                                       <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center">
                                          <BookOpen className="w-6 h-6 text-slate-300" />
                                       </div>
                                    )}
                                 </div>
                                 <div className="flex flex-col gap-1">
                                    <span className="font-bold text-slate-900 leading-none">{course.title}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-tighter">
                                        {course.category?.name || 'Academic'}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-bold">• {course.modules?.length || 0} SECTIONS</span>
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                                    {course.tutorName?.substring(0, 2).toUpperCase() || 'TT'}
                                 </div>
                                 <span className="font-bold text-slate-700 text-xs">{course.tutorName}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="font-bold text-slate-900">${course.price || 0}</span>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-xs font-bold text-slate-400">Just moments ago</span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <Button 
                                onClick={() => openReviewModal(course.id)}
                                className="bg-[#1c1d1f] hover:bg-indigo-600 text-white font-bold h-10 px-6 rounded-xl transition-all shadow-md hover:shadow-indigo-100"
                              >
                                Review Submission
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>

      {/* PREMIUM REVIEW MODAL */}
      {selectedCourseId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => !isProcessing && setSelectedCourseId(null)}
          />
          
          <div className="relative bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm ring-1 ring-indigo-100">
                     <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Education Quality Review</h2>
                    <p className="text-xs text-slate-500 font-medium">Evaluate course integrity and content standards</p>
                  </div>
               </div>
               <button 
                  onClick={() => setSelectedCourseId(null)}
                  className="p-2.5 hover:bg-slate-100 rounded-full transition-colors"
                  disabled={isProcessing}
               >
                  <X className="w-5 h-5 text-slate-400" />
               </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
               {loadingDetail ? (
                 <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Fetching Full Course Schema...</p>
                 </div>
               ) : courseDetail && (
                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    
                    {/* Left Panel: Course Info */}
                    <div className="lg:col-span-3 space-y-12">
                       <section className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Overview</label>
                          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">{courseDetail.title}</h1>
                          <p className="text-slate-600 leading-relaxed font-medium">{courseDetail.subtitle || 'No subtitle available for this course yet.'}</p>
                       </section>

                       <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-100">
                          <div className="space-y-1">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intended Learners</span>
                             <div className="flex flex-wrap gap-2 pt-2">
                               {courseDetail.targetAudiences?.map((t, idx) => (
                                 <span key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm">{t}</span>
                               ))}
                               {!courseDetail.targetAudiences?.length && <span className="text-xs italic text-slate-400">None specified</span>}
                             </div>
                          </div>
                          <div className="space-y-1">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prerequisites</span>
                             <div className="flex flex-wrap gap-2 pt-2">
                               {courseDetail.prerequisites?.map((p, idx) => (
                                 <span key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm">{p}</span>
                               ))}
                               {!courseDetail.prerequisites?.length && <span className="text-xs italic text-slate-400">None specified</span>}
                             </div>
                          </div>
                       </div>

                       <section className="space-y-6">
                          <div className="flex items-center justify-between">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Curriculum Content</label>
                             <span className="text-[10px] font-bold text-slate-400">{courseDetail.modules?.length} Sections Total</span>
                          </div>
                          
                          <div className="space-y-4">
                             {courseDetail.modules?.map((module, mIdx) => (
                               <div key={module.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                  <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900 text-xs">
                                           {mIdx + 1}
                                        </div>
                                        <span className="font-bold text-slate-800">{module.title}</span>
                                     </div>
                                     <span className="text-[10px] font-bold text-slate-400 uppercase">{module.lessons?.length || 0} LECTURES</span>
                                  </div>
                                  <div className="px-4 py-2 divide-y divide-slate-50">
                                     {module.lessons?.map((lesson, lIdx) => (
                                       <div key={lesson.id} className="py-3 flex items-center justify-between group/lesson">
                                          <div className="flex items-center gap-3">
                                             {lesson.type === 'VIDEO' ? <MonitorPlay className="w-4 h-4 text-slate-400" /> : <FileText className="w-4 h-4 text-slate-400" />}
                                             <span className="text-xs font-semibold text-slate-600">{lesson.title}</span>
                                          </div>
                                          {lesson.videoUrl && <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded opacity-0 group-hover/lesson:opacity-100 transition-opacity">HAS VIDEO</span>}
                                       </div>
                                     ))}
                                  </div>
                               </div>
                             ))}
                          </div>
                       </section>
                    </div>

                    {/* Right Panel: Side Stats & Final Choice */}
                    <div className="lg:col-span-2 space-y-8">
                       <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl sticky top-0">
                          <div className="aspect-video relative overflow-hidden bg-slate-900">
                             {courseDetail.thumbnailUrl ? (
                               <img src={courseDetail.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-90" />
                             ) : (
                               <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                                  <BookOpen className="w-12 h-12 opacity-20" />
                                  <span className="text-xs font-bold uppercase tracking-tighter">No Preview Image</span>
                               </div>
                             )}
                             <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-900 shadow-sm">
                                   ${courseDetail.price} USD
                                </span>
                             </div>
                          </div>
                          
                          <div className="p-8 space-y-8">
                             <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                      <MonitorPlay className="w-6 h-6" />
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Content Delivery</p>
                                      <p className="text-sm font-bold text-slate-900 mt-1">Video & Audio Optimized</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shadow-sm">
                                      <Layers className="w-6 h-6" />
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Modules</p>
                                      <p className="text-sm font-bold text-slate-900 mt-1">{courseDetail.modules?.length} Structured Units</p>
                                   </div>
                                </div>
                             </div>

                             <div className="p-5 bg-indigo-50/50 rounded-2xl ring-1 ring-indigo-100 flex gap-4">
                                <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                   <h4 className="text-xs font-bold text-indigo-900">Verification Guideline</h4>
                                   <p className="text-[11px] text-indigo-700 leading-relaxed">
                                      Ensure the course follows community standards. Check video audio quality and accuracy of intended learners.
                                   </p>
                                </div>
                             </div>

                             <div className="pt-4 flex flex-col gap-3">
                                <Button 
                                   onClick={() => handleReviewAction(true)}
                                   disabled={isProcessing}
                                   className="w-full bg-green-600 hover:bg-green-700 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                                >
                                   {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                   Approve and Publish
                                </Button>
                                <Button 
                                   onClick={() => handleReviewAction(false)}
                                   disabled={isProcessing}
                                   variant="outline"
                                   className="w-full h-14 border-slate-200 rounded-2xl font-bold text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                                >
                                   Reject Course
                                </Button>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
            
            {/* Modal Progress Footer */}
            <div className="px-10 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Awaiting Decision</span>
               </div>
               <span className="text-[10px] font-bold text-slate-400">ID: {selectedCourseId}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
