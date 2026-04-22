import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, PlayCircle } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface HeroSectionProps {}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section 
      className="relative w-full overflow-x-clip overflow-y-visible py-16 md:py-24"
      aria-label="Hero Section"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-12%] left-[-10%] h-[520px] w-[520px] rounded-full bg-gradient-to-br from-blue-400/30 via-indigo-400/20 to-transparent blur-3xl" />
        <div className="absolute top-[8%] right-[-12%] h-[580px] w-[580px] rounded-full bg-gradient-to-br from-violet-500/25 via-fuchsia-400/20 to-transparent blur-3xl" />
        <div className="absolute bottom-[-18%] left-[18%] h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-rose-400/20 via-orange-300/15 to-transparent blur-3xl" />
      </div>
      <div className="w-full px-0">
        <div className="grid min-w-0 grid-cols-1 items-center gap-y-12 lg:grid-cols-12 lg:gap-0">

          {/* Left Column: Content */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-6 px-4 sm:px-6 lg:pl-8 lg:pr-4 xl:pl-12 xl:pr-6">
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">🚀</span>
              <span className="text-[#754FFE] font-semibold">
                Empower Your Learning Journey Today
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-[40px] md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                The #1 Courses Learning Platform
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Hands-on training, and certifications to help you get the most from Geeks Learning.
              </p>

              <ul className="flex flex-col gap-3 mt-2" aria-label="Feature list">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" stroke="white" aria-hidden="true" />
                  <span className="text-slate-800 font-medium">Expert Tutors</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" stroke="white" aria-hidden="true" />
                  <span className="text-slate-800 font-medium">Flexible Learning</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" stroke="white" aria-hidden="true" />
                  <span className="text-slate-800 font-medium">Supportive Community</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                className="bg-[#754FFE] hover:bg-[#6340db] text-white rounded-md px-6 py-6 text-base font-semibold shadow-md"
                aria-label="Join For Free"
              >
                Join For Free
              </Button>
              <Button 
                variant="outline" 
                className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md px-6 py-6 text-base font-semibold transition-colors"
                aria-label="Explore Courses"
              >
                Explore Courses
              </Button>
            </div>
          </div>

          {/* Right Column: Image Collage */}
          <div className="lg:col-span-7 xl:col-span-7 relative mt-16 md:mt-10 lg:mt-0 lg:-mr-8 xl:-mr-12 lg:-ml-4 xl:-ml-8 flex justify-center lg:justify-end">
            
            <div className="relative w-full max-w-none lg:w-[calc(100%+5rem)] xl:w-[calc(100%+8rem)]">
              {/* Floating Badges */}
              <div className="absolute -left-2 sm:-left-8 lg:-left-16 top-[15%] flex flex-col gap-4 z-40 items-start max-w-[calc(100vw-2rem)]">
                <div className="ml-8 bg-white rounded-full py-3 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex items-center gap-3 max-w-full">
                  <div className="bg-orange-100 p-2 rounded-full" aria-hidden="true">
                    <BookOpen className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-slate-900 font-semibold text-sm lg:text-[15px]">50+ Courses</span>
                </div>

                <div className="ml-0 bg-white rounded-full py-3 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full" aria-hidden="true">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-slate-900 font-semibold text-sm lg:text-[15px]">Certified Courses</span>
                </div>

                <div className="ml-8 bg-white rounded-full py-3 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full" aria-hidden="true">
                    <PlayCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-slate-900 font-bold text-sm lg:text-[15px]">Online Project</span>
                </div>
              </div>

              {/* CSS Grid for the 4 shapes */}
              <div className="grid grid-cols-2 gap-4 lg:gap-6 relative z-10 w-full" aria-hidden="true">
                
                {/* 1. Top Left Green Block */}
                <div className="bg-[#1BA079] rounded-3xl rounded-tl-[80px] lg:rounded-tl-[100px] shadow-sm relative h-[160px] sm:h-[200px] lg:h-[260px] w-full"></div>
                
                {/* 2. Top Right Yellow Block + Girl */}
                <div className="bg-[#EFA836] rounded-3xl shadow-sm relative h-[160px] sm:h-[200px] lg:h-[260px] w-full flex justify-center items-end overflow-visible">
                  <img 
                    src="/images/hero/girl.png" 
                    alt="Student with laptop" 
                    className="absolute bottom-0 left-1/2 -translate-x-[52%] w-[150%] max-w-none origin-bottom object-contain z-20 drop-shadow-xl pointer-events-none" 
                  />
                </div>
                
                {/* 3. Bottom Left Purple Block + Boy */}
                <div className="bg-[#754FFE] rounded-[30px] shadow-sm relative h-[160px] sm:h-[200px] lg:h-[260px] w-full flex justify-center items-end lg:mt-4 overflow-visible">
                  <img 
                    src="/images/hero/boy.png" 
                    alt="Student with bag" 
                    className="absolute bottom-0 left-1/2 -translate-x-[50%] w-[106%] lg:w-[110%] max-w-none origin-bottom object-contain z-30 drop-shadow-xl pointer-events-none" 
                  />
                </div>
                
                {/* 4. Bottom Right Peach Block */}
                <div className="bg-[#EE8B68] rounded-3xl rounded-br-[80px] lg:rounded-br-[100px] shadow-sm relative h-[160px] sm:h-[200px] lg:h-[260px] w-full lg:mb-4 lg:-ml-2 overflow-visible">
                  {/* Floating Students Card */}
                  <div className="absolute -bottom-8 lg:-bottom-12 -right-2 lg:-right-12 z-40 bg-white rounded-3xl p-5 lg:p-6 shadow-[0_20px_50px_rgb(0,0,0,0.12)] border border-slate-50 min-w-[220px] max-w-[calc(100vw-2rem)]">
                    <div className="flex -space-x-3 mb-3">
                      <Avatar className="w-10 h-10 border-2 border-white shadow-sm"><AvatarImage src="/images/hero/ava1.jpg" alt="Student avatar 1" /></Avatar>
                      <Avatar className="w-10 h-10 border-2 border-white shadow-sm"><AvatarImage src="/images/hero/ava2.jpg" alt="Student avatar 2" /></Avatar>
                      <Avatar className="w-10 h-10 border-2 border-white shadow-sm"><AvatarImage src="/images/hero/ava3.jpg" alt="Student avatar 3" /></Avatar>
                      <Avatar className="w-10 h-10 border-2 border-white shadow-sm"><AvatarImage src="/images/hero/ava4.jpg" alt="Student avatar 4" /></Avatar>
                    </div>
                    <div className="text-slate-900 font-bold text-2xl tracking-tight mb-0.5">70,324+</div>
                    <div className="text-slate-600 text-[13.5px] font-medium leading-tight">Students Preparing<br/>with us</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
