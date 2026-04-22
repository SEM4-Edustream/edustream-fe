"use client";

import React, { useState } from 'react';
import { PlayCircle, FileText, Lock, ChevronDown, CheckCircle2, ChevronUp } from 'lucide-react';
import { CourseSummary } from '@/services/courseService';
import { cn } from '@/lib/utils';

interface CourseContentProps {
  course: CourseSummary;
}

export default function CourseContent({ course }: CourseContentProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([course.modules?.[0]?.id || '']);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedSections(course.modules?.map(m => m.id) || []);
  };

  const collapseAll = () => {
    setExpandedSections([]);
  };

  return (
    <div className="space-y-12">
      
      {/* --- WHAT YOU'LL LEARN --- */}
      {course.learningObjectives && course.learningObjectives.length > 0 && (
        <div className="border border-slate-200 rounded-xl p-8 bg-white shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">What you'll learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
             {course.learningObjectives.map((item, idx) => (
               <div key={idx} className="flex gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-600 text-[14px] font-normal leading-relaxed">{item}</span>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* --- COURSE CONTENT / SYLLABUS --- */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Course content</h2>
           <div className="flex items-center gap-4 text-sm font-bold text-indigo-600">
              <button onClick={expandAll} className="hover:text-indigo-700 transition-colors">Expand all sections</button>
              <span className="text-slate-200">•</span>
              <button onClick={collapseAll} className="hover:text-indigo-700 transition-colors">Collapse all sections</button>
           </div>
        </div>

        <div className="text-sm text-slate-500 flex items-center gap-4 font-bold uppercase tracking-wider">
           <span>{course.modules?.length || 0} sections</span>
           <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
           <span>{course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} lectures</span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 shadow-sm transition-all duration-300">
          {course.modules?.map((module, idx) => (
            <SyllabusSection 
              key={module.id}
              module={module}
              isOpen={expandedSections.includes(module.id)}
              onToggle={() => toggleSection(module.id)}
              isFirst={idx === 0}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

function SyllabusSection({ module, isOpen, onToggle, isFirst }: any) {
  return (
    <div className="group overflow-hidden">
      <div 
        onClick={onToggle}
        className={cn(
          "flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors border-l-4",
          isOpen ? "bg-white border-l-indigo-600" : "border-l-transparent"
        )}
      >
        <div className="flex items-center gap-4 min-w-0">
           {isOpen ? (
             <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-all shrink-0" />
           ) : (
             <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-all shrink-0" />
           )}
           <span className="font-bold text-slate-900 text-[15px] truncate">{module.title}</span>
        </div>
        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap ml-4">
           {module.lessons?.length || 0} lectures
        </div>
      </div>
      
      <div className={cn(
        "grid transition-all duration-300 ease-in-out",
        isOpen ? "grid-rows-[1fr] border-t border-slate-100" : "grid-rows-[0fr]"
      )}>
        <div className="overflow-hidden">
          <div className="bg-white divide-y divide-slate-100 p-2">
             {module.lessons?.map((lesson: any, idx: number) => (
               <div key={lesson.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group/row rounded-lg">
                  <div className="flex items-center gap-4 min-w-0">
                     {lesson.type === 'VIDEO' ? (
                       <PlayCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                     ) : (
                       <FileText className="w-5 h-5 text-amber-500 shrink-0" />
                     )}
                     <span className="text-slate-700 text-[14px] font-medium hover:text-indigo-600 cursor-pointer transition-colors truncate">
                        {lesson.title}
                     </span>
                  </div>
                  <div className="flex items-center gap-4 text-[13px] font-bold text-slate-400">
                     {lesson.videoUrl && (
                        <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4 hover:text-indigo-700 transition-colors cursor-pointer hidden md:block">
                           Preview
                        </span>
                     )}
                     <span className="tabular-nums">
                        {lesson.durationSeconds 
                          ? `${Math.floor(lesson.durationSeconds / 60)}:${(lesson.durationSeconds % 60).toString().padStart(2, '0')}`
                          : "3:45"
                        }
                     </span>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
