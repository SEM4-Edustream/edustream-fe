"use client";

import React from "react";
import { 
  MoreVertical, 
  ExternalLink, 
  Edit3, 
  Eye, 
  Trash2,
  Users,
  Star as StarIcon,
  PlayCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseSummary } from "@/services/courseService";
import { Link } from "next-view-transitions";
import { cn } from "@/lib/utils";

interface CourseListTableProps {
  courses: CourseSummary[];
}

export default function CourseListTable({ courses }: CourseListTableProps) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Course</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Stats</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Price</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                   <div className="space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                         <PlayCircle className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-bold">No courses found. Start by creating your first course!</p>
                      <Link href="/tutor/dashboard/courses/new">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-11 px-8">
                           Create Course
                        </Button>
                      </Link>
                   </div>
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                         {course.thumbnailUrl ? (
                           <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-200">
                              <BookOpenIcon className="w-4 h-4" />
                           </div>
                         )}
                      </div>
                      <div className="max-w-[200px] sm:max-w-[300px]">
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium truncate italic">
                          {course.category} • Updated 3 days ago
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <StatusBadge status={course.status || 'DRAFT'} />
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 text-slate-600">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-bold text-slate-900">124</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-slate-600">
                          <StarIcon className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="text-sm font-bold text-slate-900">{course.averageRating || '0.0'}</span>
                       </div>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <span className="text-sm font-black text-slate-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price || 0)}
                    </span>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link href={`/courses/${course.id}`} target="_blank">
                         <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600">
                            <Eye className="w-4 h-4" />
                         </Button>
                       </Link>
                       <Link href={`/tutor/dashboard/courses/${course.id}/edit`}>
                         <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-emerald-50 hover:text-emerald-600">
                            <Edit3 className="w-4 h-4" />
                         </Button>
                       </Link>
                       <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-pink-50 hover:text-pink-600">
                          <MoreVertical className="w-4 h-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PUBLISHED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
    REJECTED: "bg-pink-100 text-pink-700 border-pink-200",
    SUSPENDED: "bg-slate-900 text-white border-slate-700",
  };

  return (
    <Badge className={cn("rounded-lg border font-black text-[10px] px-2 py-0.5 uppercase tracking-widest", styles[status])}>
      {status}
    </Badge>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
   return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M4 19.5V5C4 3.89543 4.89543 3 6 3H20V21H6C4.89543 21 4 20.1046 4 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
         <path d="M12 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
   );
}
