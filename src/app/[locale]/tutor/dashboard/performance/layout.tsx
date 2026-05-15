"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  interface NavItem {
    title: string;
    href: string;
    badge?: string;
    subItems?: boolean;
  }

  const navItems: NavItem[] = [
    { title: "Overview", href: "/tutor/dashboard/performance" },
    { title: "Revenue", href: "/tutor/dashboard/performance/revenue" },
    { title: "Students", href: "/tutor/dashboard/performance/students" },
    { title: "Reviews", href: "/tutor/dashboard/performance/reviews" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] -mx-4 -my-6">
      {/* Sub-sidebar for Performance */}
      <aside className="w-64 border-r border-slate-200 bg-white shrink-0">
        <div className="py-8 px-6">
          <h2 className="text-xl font-bold text-slate-900 mb-8 px-2">Performance</h2>
          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href === "/tutor/dashboard/performance" && (pathname.endsWith("/performance") || pathname.endsWith("/performance/")));
                return (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 text-sm font-bold transition-colors rounded-md",
                        isActive 
                          ? "bg-slate-100 text-slate-900" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {item.title}
                        {item.badge && (
                          <span className="bg-[#a435f0] text-white text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subItems && (
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 min-w-0 bg-white">
        {children}
      </main>
    </div>
  );
}
