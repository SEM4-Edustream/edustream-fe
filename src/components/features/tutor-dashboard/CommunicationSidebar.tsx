"use client";

import React from 'react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CommunicationSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { title: 'Q&A', href: '/tutor/dashboard/communication/qa' },
    { title: 'Messages', href: '/tutor/dashboard/communication/messages' },
    { title: 'Assignments', href: '/tutor/dashboard/communication/assignments' },
    { title: 'Announcements', href: '/tutor/dashboard/communication/announcements' },
  ];

  return (
    <div className="w-64 flex flex-col h-full border-r border-slate-200 bg-white">
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            // Check if current path includes the menu item href (ignoring locale)
            const isActive = pathname.includes(item.href);
            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-6 py-3 text-sm transition-all relative",
                    isActive 
                      ? "text-[#1c1d1f] font-bold bg-slate-50" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#1c1d1f]"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#1c1d1f]" />
                  )}
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
