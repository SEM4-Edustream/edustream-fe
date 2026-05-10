"use client";

import React, { useEffect, useState } from 'react';
import { courseService, CourseResponse } from '@/services/courseService';
import { Loader2, Search, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { toast } from 'sonner';

export default function AssignmentCourseSelection() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Fetch all tutor courses (published or draft) to manage assignments
      const res = await courseService.getMyTutorCourses({});
      setCourses(res.content || []);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="p-10 space-y-8 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-[#1c1d1f]">Assignments</h1>
        <p className="text-slate-500">Select a course to manage student submissions and grading.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search your courses..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded focus:border-indigo-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
             <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <p className="text-slate-500 font-medium">No courses found matching your search.</p>
          </div>
        ) : (
          filteredCourses.map(course => (
            <Link 
              key={course.id}
              href={`/tutor/dashboard/communication/assignments/${course.id}`}
              className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all bg-white group"
            >
              <div className="w-24 aspect-video bg-slate-100 rounded overflow-hidden shrink-0">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-6 h-6 text-slate-300" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#1c1d1f] truncate group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${course.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {course.status}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
