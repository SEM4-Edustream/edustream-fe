import React from 'react';
import { PlayCircle, FileText, Lock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Course } from '@/types/course';

interface CourseContentProps {
  course: Course;
}

export default function CourseContent({ course }: CourseContentProps) {
  return (
    <div className="space-y-12">
      
      {/* --- WHAT YOU'LL LEARN --- */}
      <div className="border border-slate-200 rounded-xl p-8 bg-white shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 font-serif tracking-tight">What you'll learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             "Master core principles of industry-standard tools",
             "Build a professional-grade project from scratch",
             "Understand advanced architecture and patterns",
             "Learn best practices for performance and SEO",
             "Develop a deep understanding of the ecosystem",
             "Access curated resources and community support"
           ].map((item, idx) => (
             <div key={idx} className="flex gap-3 group">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-slate-600 text-[15px] font-medium leading-relaxed">{item}</span>
             </div>
           ))}
        </div>
      </div>

      {/* --- COURSE CONTENT / SYLLABUS --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-bold text-slate-900 font-serif tracking-tight">Course content</h2>
           <div className="text-sm font-bold text-indigo-600 cursor-pointer hover:text-indigo-700">
              Expand all sections
           </div>
        </div>

        <div className="text-sm text-slate-500 flex gap-4 font-medium">
           <span>15 sections</span>
           <span>•</span>
           <span>145 lectures</span>
           <span>•</span>
           <span>24h 32m total length</span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 shadow-sm">
          <SyllabusSection 
            title="Section 1: Core Fundamentals" 
            lectures={8} 
            duration="1h 45m" 
            isDefaultOpen 
          />
          <SyllabusSection 
            title="Section 2: Deep Dive into Architecture" 
            lectures={12} 
            duration="3h 20m" 
          />
          <SyllabusSection 
            title="Section 3: Real-world Application Building" 
            lectures={25} 
            duration="6h 15m" 
          />
          <SyllabusSection 
            title="Section 4: Advanced Patterns & Optimization" 
            lectures={15} 
            duration="4h 10m" 
          />
        </div>
      </div>

      {/* --- REQUIREMENTS --- */}
      <div className="space-y-4">
         <h2 className="text-2xl font-bold text-slate-900 font-serif tracking-tight">Requirements</h2>
         <ul className="list-disc list-outside ml-5 space-y-2 text-slate-600 font-medium">
            <li>Basic understanding of the subject matter is recommended</li>
            <li>A stable internet connection for video streaming</li>
            <li>No advanced prior setup required; we build everything from scratch</li>
         </ul>
      </div>

    </div>
  );
}

function SyllabusSection({ title, lectures, duration, isDefaultOpen = false }: any) {
  return (
    <div className="group">
      <div className="flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
        <div className="flex items-center gap-4">
           <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
           <span className="font-bold text-slate-800 text-[15px]">{title}</span>
        </div>
        <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
           {lectures} lectures • {duration}
        </div>
      </div>
      
      {isDefaultOpen && (
        <div className="p-2 bg-white divide-y divide-slate-100">
           {[...Array(3)].map((_, idx) => (
             <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors group/row">
                <div className="flex items-center gap-4">
                   <PlayCircle className="w-5 h-5 text-indigo-500" />
                   <span className="text-slate-700 text-sm font-medium hover:text-indigo-600 cursor-pointer transition-colors">
                      Lesson {idx + 1}: Introduction to the ecosystem
                   </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                   <span className="group-hover/row:text-indigo-600 transition-colors">Preview</span>
                   <span>12:45</span>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
