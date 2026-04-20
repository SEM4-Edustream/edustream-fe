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
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CourseEditorSidebarProps {
  courseId: string;
  completionStatus?: {
    goals: boolean;
    curriculum: boolean;
    basics: boolean;
    pricing: boolean;
  };
}

export default function CourseEditorSidebar({ courseId, completionStatus }: CourseEditorSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      group: 'Plan your course',
      items: [
        { name: 'Intended learners', href: `/tutor/dashboard/manage/${courseId}/goals`, icon: Target, key: 'goals' },
      ]
    },
    {
      group: 'Create your content',
      items: [
        { name: 'Curriculum', href: `/tutor/dashboard/manage/${courseId}/curriculum`, icon: ListTree, key: 'curriculum' },
      ]
    },
    {
      group: 'Publish your course',
      items: [
        { name: 'Course landing page', href: `/tutor/dashboard/manage/${courseId}/basics`, icon: LayoutDashboard, key: 'basics' },
        { name: 'Pricing', href: `/tutor/dashboard/manage/${courseId}/pricing`, icon: BadgeDollarSign, key: 'pricing' },
        { name: 'Course messages', href: `/tutor/dashboard/manage/${courseId}/messages`, icon: Settings, key: 'messages' },
      ]
    }
  ];

  return (
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
      
      <div className="px-6 pt-6 mt-6 border-t border-slate-100">
         <Button className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold py-6 rounded-none">
            Submit for Review
         </Button>
      </div>
    </aside>
  );
}
