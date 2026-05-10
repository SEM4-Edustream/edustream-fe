"use client";

import React from 'react';
import CommunicationSidebar from '@/components/features/tutor-dashboard/CommunicationSidebar';

export default function CommunicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-112px)] -m-6 overflow-hidden">
      <CommunicationSidebar />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
        {children}
      </div>
    </div>
  );
}
