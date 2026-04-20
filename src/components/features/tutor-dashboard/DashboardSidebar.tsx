"use client";

import React from "react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { 
  PlaySquare, 
  MessageSquare, 
  BarChart3, 
  Wrench, 
  HelpCircle,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Courses", href: "/tutor/dashboard", icon: PlaySquare, active: true },
  { title: "Communication", href: "/tutor/dashboard/communication", icon: MessageSquare },
  { title: "Performance", href: "/tutor/dashboard/performance", icon: BarChart3 },
  { title: "Tools", href: "/tutor/dashboard/tools", icon: Wrench },
  { title: "Resources", href: "/tutor/dashboard/resources", icon: HelpCircle },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#1c1d1f] text-white z-50 transition-all duration-300 ease-in-out group border-r border-white/5 shadow-2xl",
        "w-[72px] hover:w-64"
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        
        {/* Logo Section - Match Udemy Layout but with EduStream */}
        <div className="px-6 h-20 flex items-center mb-2">
          <Link href="/" className="flex items-center gap-3 overflow-hidden min-w-[200px]">
             <img 
               src="/icon.png" 
               alt="EduStream" 
               className="w-10 h-10 shrink-0 brightness-110"
             />
             <span className="text-2xl font-semibold tracking-tighter transition-opacity duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap text-white">
               EduStream
             </span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1">
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = item.active || pathname === item.href;
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 py-3.5 transition-all duration-200 overflow-hidden min-w-[256px] relative",
                      isActive 
                        ? "text-white font-medium" 
                        : "text-white/70 hover:bg-[#3e3f40] hover:text-white font-normal"
                    )}
                  >
                    {/* Active Left Indicator - Purple Bar from Image */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#a435f0] transition-all" />
                    )}
                    
                    {/* Icon - Always centered in 72px width */}
                    <div className="w-[72px] flex items-center justify-center shrink-0">
                      <item.icon className={cn(
                        "w-6 h-6 transition-transform duration-300",
                        isActive ? "scale-110" : ""
                      )} />
                    </div>

                    {/* Text - Appear on hover */}
                    <span className={cn(
                      "font-bold text-[15px] transition-all duration-300 whitespace-nowrap",
                      "opacity-0 group-hover:opacity-100"
                    )}>
                      {item.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
