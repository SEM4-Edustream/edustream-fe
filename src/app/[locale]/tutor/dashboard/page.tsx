"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { courseService, CourseSummary, PageMeta } from "@/services/courseService";
import CourseItem from "@/components/features/tutor-dashboard/CourseItem";
import DashboardResources from "@/components/features/tutor-dashboard/DashboardResources";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TutorDashboardCourses() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMeta<CourseSummary> | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState("createdAt,desc");
  const [currentPage, setCurrentPage] = useState(0);

  const fetchCourses = async () => {
    if (authLoading || !isAuthenticated) return;

    try {
      setLoading(true);
      const data = await courseService.getMyTutorCourses({
        status: statusFilter,
        page: currentPage,
        size: 5,
        sort: sortOrder
      });
      setCourses(data.content || []);
      setPageMeta(data);
    } catch (error: any) {
      console.error("Failed to fetch tutor courses", error);
      if (error.response?.status !== 401) {
        toast.error("Failed to load your courses.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [isAuthenticated, authLoading, statusFilter, sortOrder, currentPage]);

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus === 'all' ? undefined : newStatus);
    setCurrentPage(0); // Reset to first page
  };

  const handleSortChange = (newSort: string) => {
    setSortOrder(newSort);
    setCurrentPage(0);
  };

  return (
    <div className="max-w-[1600px] mx-auto pt-8 pb-10 px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 1. instructor-main-heading */}
      <h1 className="text-3xl font-bold text-[#1c1d1f] tracking-tight">Courses</h1>

      {/* 2. tabs-module--tabs-container */}
      <Tabs defaultValue="courses" className="w-full">
        <div className="border-b border-slate-200">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            <TabsTrigger
              value="courses"
              className="px-0 py-3 text-sm font-bold border-b-2 border-black data-[state=active]:text-[#5624d0] data-[state=active]:border-[#5624d0] hover:border-[#5624d0] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none relative transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none shadow-none border-x-0 border-t-0"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="cloning"
              disabled
              className="px-0 py-3 text-sm font-bold border-b-2 border-transparent rounded-none opacity-60 flex items-center gap-2 relative transition-all cursor-not-allowed focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none shadow-none border-x-0 border-t-0"
            >
              Course cloning
              <span className="bg-slate-100 text-[#1c1d1f] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight">Coming soon</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="courses" className="pt-8 space-y-8 outline-none">
          {/* 3. courses--search-row (Search + Sort + New Course) */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-2">
            <div className="flex flex-wrap items-center gap-4 w-full">
              {/* Status Filters */}
              <div className="flex items-center bg-slate-100/50 p-1 rounded-lg border border-slate-200">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Published', value: 'PUBLISHED' },
                  { label: 'Draft', value: 'DRAFT' },
                  { label: 'Pending', value: 'PENDING' }
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => handleStatusChange(s.value)}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                      (statusFilter === s.value || (!statusFilter && s.value === 'all'))
                        ? "bg-white text-[#5624d0] shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Search Wrapper */}
              <div className="flex items-center gap-0 group flex-1 max-w-sm">
                <Input
                  placeholder="Search your courses"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 rounded-r-none border-slate-300 focus-visible:ring-0 focus:border-[#5624d0]"
                />
                <Button className="h-11 w-11 bg-[#5624d0] hover:bg-[#401b9c] rounded-l-none shrink-0">
                  <Search className="w-5 h-5 text-white" />
                </Button>
              </div>

              {/* Sort Select */}
              <select 
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                className="h-11 px-4 bg-white border border-slate-300 rounded-md text-sm font-bold text-slate-700 focus:border-[#5624d0] outline-none cursor-pointer"
              >
                <option value="createdAt,desc">Newest First</option>
                <option value="createdAt,asc">Oldest First</option>
                <option value="title,asc">Title (A-Z)</option>
                <option value="price,desc">Price (High-Low)</option>
              </select>
            </div>

            {/* desktop-new-course-button */}
            <Link href="/tutor/dashboard/manage/create" className="w-full lg:w-auto">
              <Button className="h-11 px-8 bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold rounded-md w-full lg:w-auto shadow-md transition-all active:scale-95">
                New course
              </Button>
            </Link>
          </div>

          {/* 4. Course List (view-type-light) */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-[#5624d0] border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 font-bold text-sm">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="py-20 text-center bg-white border-2 border-dashed border-slate-100 rounded-xl">
                <p className="text-slate-400 font-bold">You haven't created any courses yet.</p>
              </div>
            ) : (
              <>
                {courses.map((course) => (
                  <CourseItem key={course.id} course={course} />
                ))}
                
                {/* Pagination Controls */}
                {pageMeta && pageMeta.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-10 pb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pageMeta.first}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="h-10 px-4 font-bold rounded-lg border-slate-300"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1.5 px-4 font-bold text-sm">
                      <span className="text-[#5624d0]">Page {pageMeta.number + 1}</span>
                      <span className="text-slate-400">of</span>
                      <span className="text-slate-700">{pageMeta.totalPages}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pageMeta.last}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="h-10 px-4 font-bold rounded-lg border-slate-300"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 5. Resource Footer Line */}
          <div className="text-center pt-8">
            <p className="text-sm text-slate-500 font-medium italic">
              Based on your experience, we think these resources will be helpful.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Instructor Resources Section */}
      <DashboardResources />
    </div>
  );
}
