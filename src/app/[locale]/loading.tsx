import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        {/* Outer Ring */}
        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin shadow-lg"></div>
        
        {/* Logo or Text in Center */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <img src="/images/icon.png" alt="EduStream" className="h-10 w-auto animate-pulse" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">EduStream</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500 tracking-wide uppercase">Đang tải dữ liệu...</p>
        </div>
      </div>
    </div>
  );
}
