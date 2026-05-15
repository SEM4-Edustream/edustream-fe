"use client";

import React, { useEffect, useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Users,
  Filter,
  MoreHorizontal,
  Mail,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  analyticsService, 
  TutorStudent, 
  PageMeta 
} from '@/services/analyticsService';
import { courseService, CourseSummary } from '@/services/courseService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function TutorStudentsPerformancePage() {
  const [students, setStudents] = useState<TutorStudent[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageMeta, setPageMeta] = useState<PageMeta<TutorStudent> | null>(null);
  
  // Filters
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch students
      const studentData = await analyticsService.getTutorStudents({
        courseId: selectedCourseId === "all" ? undefined : selectedCourseId,
        page: currentPage,
        size: 10
      });
      setStudents(studentData.content);
      setPageMeta(studentData);

      // Fetch courses for dropdown (only once)
      if (courses.length === 0) {
        const courseData = await courseService.getMyTutorCourses({ size: 100 });
        setCourses(courseData.content);
      }
    } catch (error) {
      toast.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCourseId, currentPage]);

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Students</h1>
        </div>
        <p className="text-sm text-slate-500 font-medium">Monitor student progress and engagement across your courses</p>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Course Filter */}
          <div className="relative group min-w-[240px]">
            <select 
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full h-11 pl-10 pr-10 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer transition-all"
            >
              <option value="all">All courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1 md:w-80">
             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <Input 
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-10 border-slate-200 rounded-lg focus-visible:ring-indigo-500"
             />
          </div>
        </div>

        <Button variant="outline" className="h-11 gap-2 font-bold border-slate-200 rounded-lg">
           <Filter className="w-4 h-4" />
           Advanced Filter
        </Button>
      </div>

      {/* Students Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Student</th>
              <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Course</th>
              <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Enrollment Date</th>
              <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Progress</th>
              <th className="px-6 py-4 uppercase tracking-wider text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-8">
                    <div className="h-10 bg-slate-50 rounded-lg" />
                  </td>
                </tr>
              ))
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center gap-2">
                      <Users className="w-10 h-10 text-slate-200" />
                      <p className="font-bold text-slate-400">No students found matching your criteria</p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.enrollmentId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 rounded-xl ring-2 ring-slate-50 group-hover:ring-indigo-100 transition-all">
                        <AvatarImage src={student.avatarUrl} />
                        <AvatarFallback className="bg-[#1c1d1f] text-white font-bold text-xs uppercase">
                          {student.fullName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{student.fullName}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="max-w-[200px]">
                      <p className="font-bold text-slate-700 text-xs truncate">{student.courseTitle}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-400">
                      {new Date(student.enrolledAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-900">{student.progressPercentage}%</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Complete</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000 ease-out rounded-full",
                            student.progressPercentage === 100 ? "bg-green-500" : "bg-indigo-600"
                          )}
                          style={{ width: `${student.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-indigo-50 hover:text-indigo-600">
                          <Mail className="w-4 h-4" />
                       </Button>
                       <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                          <MoreHorizontal className="w-4 h-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pageMeta && pageMeta.totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400">
              Showing <span className="text-slate-900">{filteredStudents.length}</span> of <span className="text-slate-900">{pageMeta.totalElements}</span> students
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pageMeta.first}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="h-8 px-4 font-bold rounded-lg border-slate-200"
              >
                Previous
              </Button>
              <div className="px-4 text-xs font-bold text-slate-900 bg-white border border-slate-200 h-8 flex items-center rounded-lg">
                Page {pageMeta.number + 1} of {pageMeta.totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pageMeta.last}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="h-8 px-4 font-bold rounded-lg border-slate-200"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
