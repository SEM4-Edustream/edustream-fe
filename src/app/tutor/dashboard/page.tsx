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
import { courseService, CourseSummary } from "@/services/courseService";
import CourseItem from "@/components/features/tutor-dashboard/CourseItem";
import DashboardResources from "@/components/features/tutor-dashboard/DashboardResources";
import { toast } from "sonner";

export default function TutorDashboardCourses() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (authLoading || !isAuthenticated) return;

      try {
        setLoading(true);
        const data = await courseService.getMyTutorCourses();
        setCourses(data);
      } catch (error: any) {
        console.error("Failed to fetch tutor courses", error);
        // Only show toast if not a 401 (handled by interceptor)
        if (error.response?.status !== 401) {
          toast.error("Failed to load your courses.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, authLoading]);

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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* courses--search-wrapper */}
              <div className="flex items-center gap-0 group">
                <Input
                  placeholder="Search your courses"
                  className="h-12 w-full md:w-64 rounded-r-none border-slate-300 focus-visible:ring-0 focus:border-[#5624d0] transition-colors"
                />
                <Button className="h-12 w-12 bg-[#5624d0] hover:bg-[#401b9c] rounded-l-none shrink-0">
                  <Search className="w-5 h-5 text-white" />
                </Button>
              </div>

              {/* Sort Dropdown (popper-module) */}
              <Button variant="outline" className="h-12 px-6 border-slate-300 font-bold flex items-center gap-2 grow md:grow-0 justify-between">
                Newest
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </div>

            {/* desktop-new-course-button */}
            <Link href="/tutor/dashboard/manage/create">
              <Button className="h-12 px-6 bg-[#5624d0] hover:bg-[#401b9c] text-white font-bold rounded-md shrink-0">
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
              courses.map((course) => (
                <CourseItem key={course.id} course={course} />
              ))
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
