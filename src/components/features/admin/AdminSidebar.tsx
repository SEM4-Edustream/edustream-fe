"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  CheckSquare, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ShieldCheck,
  BarChart3, 
  PlaySquare,
  CalendarDays,
  FileStack,
  FileClock,
  GraduationCap,
  ChevronDown,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface SubMenuItem {
  title: string;
  href: string;
}

interface MenuItem {
  title: string;
  href?: string;
  icon: any;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Tutor Monthly Stats", href: "/admin/tutor-stats", icon: BarChart3 },
  { 
    title: "Course", 
    icon: PlaySquare,
    subItems: [
      { title: "All Course", href: "/admin/courses" },
      { title: "Course Verification", href: "/admin/courses/verification" },
    ]
  },
  { title: "User", href: "/admin/users", icon: Users },
  { title: "Tutor Verification", href: "/admin/tutor-verification", icon: CheckSquare },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { title: "Material", href: "/admin/materials", icon: FileStack },
  { title: "Leave Request", href: "/admin/leave-requests", icon: FileClock },
  { title: "Schedule Changes", href: "/admin/schedules", icon: CalendarDays },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // State for expanded menus
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title) 
        : [...prev, title]
    );
  };

  const isItemActive = (item: MenuItem) => {
    if (item.href) {
      return pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
    }
    if (item.subItems) {
      return item.subItems.some(sub => pathname === sub.href);
    }
    return false;
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#fcfdff] text-slate-600 z-50 transition-all duration-300 ease-in-out border-r border-slate-100 shadow-sm w-64"
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        
        {/* Logo Section */}
        <div className="px-6 h-20 flex items-center mb-4">
          <Link href="/" className="flex items-center gap-2 group/logo">
             <img src="/images/icon.png" alt="EduStream" className="h-12 w-auto" />
             <span className="text-xl font-bold tracking-tight text-slate-800">
               EduStream
             </span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isItemActive(item);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus.includes(item.title) || (active && hasSubItems);

              return (
                <li key={item.title}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group/item",
                        active 
                          ? "bg-indigo-50 text-indigo-600 font-bold" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn(
                          "w-5 h-5 transition-colors",
                          active ? "text-indigo-600" : "text-slate-400 group-hover/item:text-slate-600"
                        )} />
                        <span className="text-[14px] leading-none">{item.title}</span>
                      </div>
                    </Link>
                  ) : (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleMenu(item.title)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group/item",
                          active && !isExpanded
                            ? "bg-indigo-50 text-indigo-600 font-bold" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={cn(
                            "w-5 h-5 transition-colors",
                            active ? "text-indigo-600" : "text-slate-400 group-hover/item:text-slate-600"
                          )} />
                          <span className="text-[14px] leading-none">{item.title}</span>
                        </div>
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isExpanded ? "transform rotate-180" : "opacity-40"
                        )} />
                      </button>

                      {/* Submenu rendering */}
                      {isExpanded && (
                        <ul className="ml-4 pl-3 border-l border-slate-100 space-y-1 animate-in slide-in-from-top-2 duration-200">
                          {item.subItems?.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <li key={sub.title}>
                                <Link
                                  href={sub.href}
                                  className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-all",
                                    isSubActive
                                      ? "text-indigo-600 font-bold bg-indigo-50/50"
                                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                  )}
                                >
                                  <Circle className={cn(
                                    "w-1.5 h-1.5",
                                    isSubActive ? "fill-indigo-600 text-indigo-600" : "text-slate-300"
                                  )} />
                                  {sub.title}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer User Section */}
        <div className="p-4 mt-auto border-t border-slate-50">
           <div className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-3 overflow-hidden">
                 <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 ring-4 ring-white shadow-sm shrink-0">
                    {user?.username?.substring(0, 2).toUpperCase() || "LB"}
                 </div>
                 <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-800 truncate">{user?.username || "Admin"}</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Admin</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </aside>
  );
}
