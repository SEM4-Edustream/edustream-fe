"use client";

import React from "react";
import { CourseSummary } from "@/services/courseService";
import { Link } from "next-view-transitions";

interface CourseItemProps {
  course: CourseSummary;
}

export default function CourseItem({ course }: CourseItemProps) {
  // Mock scale for progress (meter)
  const progressScale = course.status === 'DRAFT' ? 0.02 : 1;
  const progressPercent = Math.round(progressScale * 100);

  return (
    <div className="group relative bg-white border border-[#d1d7dc] flex flex-col md:flex-row min-h-[118px] transition-all cursor-pointer overflow-hidden">

      {/* Container mờ đi khi hover (bao gồm cả ảnh và nội dung) */}
      <div className="flex-1 flex flex-col md:flex-row transition-all duration-300 group-hover:opacity-5 group-hover:blur-[1.5px]">

        {/* 1. courses--card-image-wrapper */}
        <div className="w-[118px] h-[118px] bg-[#f7f9fa] border-r border-[#d1d7dc] shrink-0 overflow-hidden flex items-center justify-center">
          <img
            src={course.thumbnailUrl || "https://s.udemycdn.com/course/200_H/placeholder.jpg"}
            alt={course.title}
            className="object-cover w-full h-full"
          />
        </div>

        {/* 2. courses--card-body */}
        <div className="flex-1 flex flex-col md:flex-row items-center p-4">

          {/* courses--card-details */}
          <div className="flex-1 min-w-[300px] lg:min-w-[500px] flex flex-col justify-between py-2 min-h-[80px] mb-4 md:mb-0 ml-6 text-left">
            <div className="text-base font-semibold text-[#1c1d1f] line-clamp-1 leading-tight mt-1">
              {course.title || "Learn Java"}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#1c1d1f] mb-1">
              <span className="font-bold uppercase tracking-widest">{course.status || "Draft"}</span>
              <span className="text-slate-500">Public</span>
            </div>
          </div>

          {/* courses--card-tile (Progress) - NẰM NGANG TRÊN CÙNG MỘT DÒNG */}
          <div className="flex-[1.5] px-4 lg:px-8">
            <div className="flex flex-row items-center gap-16 w-full">
              <div className="text-sm font-bold text-[#1c1d1f] whitespace-nowrap">Finish your course</div>
              {/* ud-meter */}
              <div className="relative h-2 flex-1 bg-[#d1d7dc] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-[#5624d0]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lớp phủ EDIT / MANAGE COURSE (HIỆN RA GIỮA KHI HOVER) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none group-hover:pointer-events-auto">
        <Link
          href={`/tutor/course/${course.id}`}
          className="text-xl font-bold text-[#5624d0] hover:text-[#401b9c] transition-colors"
        >
          Edit / manage course
        </Link>
      </div>

    </div>
  );
}
