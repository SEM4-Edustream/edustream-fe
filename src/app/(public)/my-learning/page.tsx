'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlayCircle, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Trophy,
  MoreVertical,
  ChevronRight,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { courseService } from '@/services/courseService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Enrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  progressPercentage: number;
  enrolledAt: string;
}

export default function MyLearningPage() {
  const { isAuthenticated, user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all-courses');

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        const data = await courseService.getMyEnrollments();
        setEnrollments(data);
      } catch (error) {
        console.error('Failed to fetch enrollments', error);
        toast.error('Could not load your courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
    document.title = "My learning | EduStream";
  }, [isAuthenticated]);

  const tabs = [
    { id: 'all-courses', label: 'All courses' },
    { id: 'wishlist', label: 'Wishlist' }
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-12 pt-8 space-y-8">
        
        {/* Streak & Schedule Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
           {/* Weekly Streak Card */}
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow cursor-default"
           >
              <div className="flex flex-col gap-1">
                 <h3 className="text-xl font-bold text-[#1c1d1f]">Start a weekly streak</h3>
                 <p className="text-sm text-slate-600">Let's chip away at your learning goals.</p>
              </div>
              
              <div className="flex items-center gap-10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center">
                       <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                       <div className="text-lg font-bold text-[#1c1d1f]">0 <span className="text-sm font-normal text-slate-500">weeks</span></div>
                       <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current streak</div>
                    </div>
                 </div>
                 
                 <div className="relative flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90">
                       <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                       <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175" strokeDashoffset="175" className="text-emerald-500" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <Target className="w-5 h-5 text-emerald-500" />
                    </div>
                 </div>
                 
                 <div className="hidden md:block space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium">
                       <div className="w-2 h-2 rounded-full bg-orange-400" />
                       <span>0/30 course min</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                       <span>1/1 visit</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold ml-4">MAY 3 – 9</div>
                 </div>
              </div>
           </motion.div>

           {/* Schedule Card */}
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="border border-slate-200 p-6 flex items-start gap-4"
           >
              <div className="mt-1">
                 <Calendar className="w-6 h-6 text-[#1c1d1f]" />
              </div>
              <div className="space-y-4">
                 <div>
                    <h4 className="font-bold text-[#1c1d1f]">Schedule learning time</h4>
                    <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                       Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals. Set time aside to learn and get reminders using your learning scheduler.
                    </p>
                 </div>
                 <div className="flex items-center gap-4">
                    <Button variant="outline" className="border-[#1c1d1f] text-[#1c1d1f] font-bold h-10 px-6 hover:bg-slate-50 rounded-none">
                       Get started
                    </Button>
                    <button className="text-sm font-bold text-[#1c1d1f] hover:text-slate-600">Dismiss</button>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Course Grid - Custom Udemy Card style */}
        <div className="pt-4">
           {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="space-y-3 animate-pulse">
                    <div className="aspect-video bg-slate-100" />
                    <div className="h-4 bg-slate-100 w-full" />
                    <div className="h-4 bg-slate-100 w-2/3" />
                 </div>
               ))}
             </div>
           ) : enrollments.length > 0 ? (
             <motion.div 
               initial="hidden"
               animate="visible"
               variants={{
                 hidden: { opacity: 0 },
                 visible: {
                   opacity: 1,
                   transition: { staggerChildren: 0.05 }
                 }
               }}
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10"
             >
               {enrollments.map((course) => (
                 <motion.div 
                   key={course.id}
                   variants={{
                     hidden: { opacity: 0, y: 10 },
                     visible: { opacity: 1, y: 0 }
                   }}
                   className="group flex flex-col space-y-2 cursor-pointer"
                 >
                   <Link href={`/learning/${course.courseId}`} className="block relative aspect-video bg-slate-100 border border-slate-200 overflow-hidden">
                      <Image 
                        src={course.courseThumbnail || "/images/course-placeholder.jpg"} 
                        alt={course.courseTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                         <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300" />
                      </div>
                      <div className="absolute top-2 right-2">
                         <button className="w-8 h-8 bg-white shadow-md flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4 text-slate-700" />
                         </button>
                      </div>
                   </Link>
                   
                   <div className="space-y-1">
                      <h3 className="font-bold text-[#1c1d1f] text-[15px] leading-[1.2] line-clamp-2 min-h-[36px]">
                        {course.courseTitle}
                      </h3>
                      <div className="text-[12px] text-slate-500 font-medium">EduStream Team</div>
                      
                      <div className="pt-2 pb-1">
                         <div className="h-1 w-full bg-slate-100 relative">
                            <div 
                              className="h-full bg-indigo-600" 
                              style={{ width: `${course.progressPercentage}%` }}
                            />
                         </div>
                         <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[12px] font-medium text-slate-600">{course.progressPercentage}% complete</span>
                         </div>
                      </div>
                      
                      <Link 
                        href={`/learning/${course.courseId}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c1d1f] uppercase tracking-tighter hover:text-indigo-600 transition-colors pt-2"
                      >
                         {course.progressPercentage > 0 ? 'Continue' : 'Start course'}
                         <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                   </div>
                 </motion.div>
               ))}
             </motion.div>
           ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                   <PlayCircle className="w-10 h-10 text-slate-300" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-slate-900">Start learning today</h3>
                   <p className="text-slate-500 max-w-sm mx-auto">Explore thousands of courses and find the perfect one for you.</p>
                </div>
                <Link href="/courses">
                   <Button className="bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold h-12 px-8 rounded-none">
                      Browse courses
                   </Button>
                </Link>
             </div>
           )}
        </div>
      </div>
  );
}
