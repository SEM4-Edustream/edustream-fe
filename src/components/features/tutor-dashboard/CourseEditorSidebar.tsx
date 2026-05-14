"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Target, 
  ListTree, 
  LayoutDashboard, 
  BadgeDollarSign, 
  Settings,
  CircleCheck,
  Circle,
  AlertTriangle,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { courseService } from '@/services/courseService';
import { toast } from 'sonner';
import { useState } from 'react';

interface CourseEditorSidebarProps {
  courseId: string;
  completionStatus?: {
    goals: boolean;
    curriculum: boolean;
    basics: boolean;
    pricing: boolean;
  };
  status?: string;
}

export default function CourseEditorSidebar({ courseId, completionStatus, status }: CourseEditorSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      group: 'Plan your course',
      items: [
        { name: 'Intended learners', href: `/tutor/course/${courseId}/goals`, icon: Target, key: 'goals' },
      ]
    },
    {
      group: 'Create your content',
      items: [
        { name: 'Curriculum', href: `/tutor/course/${courseId}/curriculum`, icon: ListTree, key: 'curriculum' },
      ]
    },
    {
      group: 'Publish your course',
      items: [
        { name: 'Course landing page', href: `/tutor/course/${courseId}/basics`, icon: LayoutDashboard, key: 'basics' },
        { name: 'Pricing', href: `/tutor/course/${courseId}/pricing`, icon: BadgeDollarSign, key: 'pricing' },
        { name: 'Course messages', href: `/tutor/course/${courseId}/messages`, icon: Settings, key: 'messages' },
      ]
    }
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmitForReview = async () => {
    try {
      setIsSubmitting(true);
      await courseService.submitCourse(courseId);
      toast.success("Course submitted successfully!");
      setShowConfirmModal(false);
      window.dispatchEvent(new Event('course-updated'));
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to submit course for review. Ensure you have added at least one lesson.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-72px)] py-6 flex flex-col">
      <nav className="flex-1 space-y-8 px-4">
        {menuItems.map((group) => (
          <div key={group.group}>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
              {group.group}
            </h4>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const isComplete = completionStatus?.[item.key as keyof typeof completionStatus];
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md transition-all",
                        isActive 
                          ? "bg-slate-900 text-white" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                        <span>{item.name}</span>
                      </div>
                      {isComplete ? (
                        <CircleCheck className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        item.key !== 'messages' && <Circle className="w-4 h-4 text-slate-200 shrink-0" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      
      {(status === 'DRAFT' || status === 'REJECTED') && (
        <div className="px-6 pt-6 mt-6 border-t border-slate-100">
           <Button 
             onClick={() => setShowConfirmModal(true)}
             disabled={isSubmitting}
             className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold py-6 rounded-none shadow-lg shadow-purple-200 transition-all active:scale-[0.98]"
           >
              Submit for Review
           </Button>
        </div>
      )}
    </aside>

    {/* Custom Premium Confirmation Modal */}
    {showConfirmModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
          onClick={() => !isSubmitting && setShowConfirmModal(false)}
        />
        
        {/* Modal Card */}
        <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center ring-1 ring-purple-100 shadow-sm">
                <Send className="w-6 h-6" />
              </div>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">Submit course for review?</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Bạn có chắc chắn muốn gửi khóa học này để Admin xét duyệt không? 
            </p>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Sau khi gửi, khóa học của bạn sẽ bị **KHÓA CHỈ ĐỌC** cho đến khi quá trình duyệt hoàn tất. Bạn sẽ không thể thay đổi nội dung trong thời gian này.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleSubmitForReview}
                disabled={isSubmitting}
                className="w-full bg-[#1c1d1f] hover:bg-slate-800 text-white h-12 font-bold rounded-xl transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending to Admin...
                  </span>
                ) : "Yes, Submit for Review"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="w-full text-slate-500 font-bold h-12 hover:bg-slate-50 rounded-xl"
              >
                Cancel & Review Again
              </Button>
            </div>
          </div>
          
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center gap-2">
             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
             <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">EduStream QA Verification System</span>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
