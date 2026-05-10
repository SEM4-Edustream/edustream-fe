"use client";

import React from 'react';
import { 
  ChevronDown, 
  Search, 
  Mail, 
  Filter,
  LayoutGrid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QAPage() {
  return (
    <div className="p-10 space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-[#1c1d1f]">Q&A</h1>
          <button className="flex items-center gap-1 text-2xl font-bold text-[#1c1d1f] hover:text-slate-700 transition-colors">
            All courses <ChevronDown className="w-6 h-6 mt-1" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
        <div className="relative">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
              <img 
                src="https://s.udemycdn.com/communication/empty-mailbox-v2.svg" 
                alt="Empty mailbox" 
                className="w-20 h-20"
              />
           </div>
        </div>
        <div className="space-y-2 max-w-md">
           <h3 className="text-xl font-bold text-[#1c1d1f]">No questions yet</h3>
           <p className="text-slate-500 text-sm leading-relaxed">
             Q&A is a forum where your students can ask questions, hear your responses, and respond to one another. Here's where you'll see your courses' Q&A threads
           </p>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
              <span className="text-sm font-medium text-slate-700 group-hover:text-[#1c1d1f]">Unread (0)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-[#1c1d1f]">No top answer (0)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-[#1c1d1f]">No answers (0)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-[#1c1d1f]">No instructor answer (0)</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-bold">Sort by:</span>
              <button className="font-bold text-[#1c1d1f] flex items-center gap-1">
                Newest first <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="flex border border-slate-200 rounded overflow-hidden">
               <button className="p-2 bg-indigo-600 text-white"><LayoutGrid className="w-4 h-4" /></button>
               <button className="p-2 bg-white text-slate-400 hover:text-slate-600"><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
