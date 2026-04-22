"use client";

import React from "react";
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
  BookOpen,
  CalendarDays,
  FileStack,
  FileClock,
  GraduationCap,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Tutor Monthly Stats", href: "/admin/tutor-stats", icon: BarChart3 },
  { title: "Course", href: "/admin/courses", icon: BookOpen },
  { title: "User", href: "/admin/users", icon: Users },
  { title: "Tutor Verification", href: "/admin/tutor-verification", icon: CheckSquare },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { title: "Material", href: "/admin/materials", icon: FileStack, hasSubmenu: true },
  { title: "Leave Request", href: "/admin/leave-requests", icon: FileClock },
  { title: "Schedule Changes", href: "/admin/schedules", icon: CalendarDays },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#fcfdff] text-slate-600 z-50 transition-all duration-300 ease-in-out group border-r border-slate-100 shadow-sm",
        "w-64"
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        
        {/* Logo Section - Match image logo */}
        <div className="px-6 h-20 flex items-center mb-4">
          <Link href="/" className="flex items-center gap-2 group/logo">
             <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 ring-1 ring-orange-200 shadow-sm">
                <GraduationCap className="w-5 h-5 fill-orange-600/10" />
             </div>
             <span className="text-xl font-bold tracking-tight text-slate-800">
               Educonnect
             </span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group/item",
                      isActive 
                        ? "bg-blue-50 text-blue-600 font-bold" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-blue-600" : "text-slate-400 group-hover/item:text-slate-600"
                      )} />
                      <span className="text-[14px] leading-none">{item.title}</span>
                    </div>

                    {item.hasSubmenu && (
                      <ChevronDown className="w-4 h-4 opacity-40" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer User Section - Match image bottom part */}
        <div className="p-4 mt-auto border-t border-slate-50">
           <div className="flex items-center justify-between group-hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-3 overflow-hidden">
                 <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 ring-4 ring-white shadow-sm shrink-0">
                    {user?.username?.substring(0, 2).toUpperCase() || "LB"}
                 </div>
                 <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-800 truncate">{user?.username || "Demo Tutor"}</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Admin</span>
                 </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-300 transform rotate-180 md:rotate-0" />
           </div>
        </div>
      </div>
    </aside>
  );
}
