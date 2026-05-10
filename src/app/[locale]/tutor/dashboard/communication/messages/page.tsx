"use client";

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-center p-10">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <MessageSquare className="w-10 h-10 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-[#1c1d1f] mb-2">Messages</h2>
      <p className="text-slate-500 max-w-md">
        This feature is coming soon. You'll be able to communicate directly with your students here.
      </p>
    </div>
  );
}
