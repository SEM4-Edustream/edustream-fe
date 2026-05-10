"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { courseService, CourseResponse } from '@/services/courseService';
import { Loader2, ArrowLeft, FileText, ChevronRight, Users } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { toast } from 'sonner';

export default function CourseAssignmentsPage() {
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetail();
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourseDetail(courseId);
      setCourse(data);
    } catch (error) {
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  // Flatten all modules and filter for assignments
  const assignments = course?.modules?.flatMap((m: any) => 
    (m.lessons || []).filter((l: any) => l.type === 'ASSIGNMENT').map((l: any) => ({
      ...l,
      moduleTitle: m.title
    }))
  ) || [];

  return (
    <div className="p-10 space-y-8 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/tutor/dashboard/communication/assignments">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#1c1d1f]">{course?.title}</h1>
          <p className="text-sm text-slate-500">Select an assignment to review and grade submissions.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#1c1d1f] border-b pb-2">Course Assignments ({assignments.length})</h2>
        
        {assignments.length === 0 ? (
          <div className="p-12 text-center border border-slate-200 rounded-lg bg-slate-50">
             <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <p className="text-slate-500 font-medium">This course doesn't have any assignments yet.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {assignments.map((assignment: any) => (
              <Link 
                key={assignment.id}
                href={`/tutor/dashboard/communication/assignments/${courseId}/submissions/${assignment.id}`}
                className="flex items-center gap-4 p-5 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/30 transition-all bg-white group"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1c1d1f] truncate">{assignment.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">{assignment.moduleTitle}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded text-slate-600">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">Review Submissions</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
