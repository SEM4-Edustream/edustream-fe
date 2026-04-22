"use client";

import React from "react";
import { 
  Search, 
  Bell, 
  ChevronRight, 
  User as UserIcon,
  Search as SearchIcon
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function DashboardHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      const isLast = index === parts.length - 1;
      return (
        <React.Fragment key={href}>
          <span className={cn(
            "capitalize transition-colors",
            isLast ? "text-slate-900 font-bold" : "text-slate-400"
          )}>
            {part.replace("-", " ")}
          </span>
          {!isLast && <ChevronRight className="w-4 h-4 text-slate-300" />}
        </React.Fragment>
      );
    });
  };

  return (
    <header className="h-16 bg-white sticky top-0 z-30 px-8 flex items-center justify-end border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-6">
        {/* Student Switcher Link */}
        <button className="text-sm font-medium text-[#1c1d1f] hover:text-[#5624d0] transition-colors">
          Student
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-[#1c1d1f]" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#5624d0] rounded-full border-2 border-white" />
        </button>

        {/* User Profile */}
        <Avatar className="w-8 h-8 cursor-pointer ring-1 ring-slate-200">
           <AvatarImage src="" />
           <AvatarFallback className="bg-[#1c1d1f] text-white font-bold text-[10px] tracking-tighter uppercase">
             {user?.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2) || "LB"}
           </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
