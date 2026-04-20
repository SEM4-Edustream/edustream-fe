import React from 'react';
import { PlayCircle, ShieldCheck, Monitor, Smartphone, Award, Infinity, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course';
import { Link } from 'next-view-transitions';

interface CourseCheckoutCardProps {
  course: Course;
}

export default function CourseCheckoutCard({ course }: CourseCheckoutCardProps) {
  return (
    <div className="bg-white border border-slate-200 lg:shadow-2xl rounded-2xl overflow-hidden lg:sticky lg:top-24 z-20">
      
      {/* Video Preview / Image Thumbnail */}
      <div className="relative aspect-video bg-slate-900 flex items-center justify-center group cursor-pointer">
        <img 
          src={course.thumbnailUrl || "/images/course-placeholder.jpg"} 
          alt={course.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
        />
        <div className="relative z-10 flex flex-col items-center gap-3">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
             <PlayCircle className="w-8 h-8 text-slate-900 fill-current" />
           </div>
           <span className="text-white font-bold text-lg drop-shadow-md">Preview this course</span>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        
        {/* Pricing */}
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-slate-900">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price || 0)}
          </span>
          <span className="text-lg text-slate-400 line-through font-medium">
             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((course.price || 0) * 1.5)}
          </span>
          <span className="text-slate-600 font-bold">33% off</span>
        </div>

        <div className="flex flex-col gap-3">
          <Link href={`/checkout/${course.id}`}>
             <Button className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200">
                Buy now
             </Button>
          </Link>
          <Button variant="outline" className="w-full h-12 text-base font-bold border-2 border-slate-200 hover:bg-slate-50 rounded-xl">
             Add to cart
          </Button>
        </div>

        <div className="text-center">
           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
              30-Day Money-Back Guarantee
           </span>
        </div>

        {/* Course Features List */}
        <div className="space-y-4 pt-4">
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
             <ShieldCheck className="w-5 h-5 text-indigo-500" />
             This course includes:
          </h4>
          <ul className="space-y-3 text-[14px] text-slate-600 font-medium">
             <FeatureItem icon={<Monitor className="w-4 h-4" />} text="24.5 hours on-demand video" />
             <FeatureItem icon={<Infinity className="w-4 h-4" />} text="Full lifetime access" />
             <FeatureItem icon={<Smartphone className="w-4 h-4" />} text="Access on mobile and TV" />
             <FeatureItem icon={<Award className="w-4 h-4" />} text="Certificate of completion" />
          </ul>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
           <button className="text-sm font-bold text-slate-900 underline underline-offset-4 hover:text-indigo-600 transition-colors">
              Share
           </button>
           <button className="text-sm font-bold text-slate-900 underline underline-offset-4 hover:text-indigo-600 transition-colors">
              Gift this course
           </button>
           <button className="text-sm font-bold text-slate-900 underline underline-offset-4 hover:text-indigo-600 transition-colors">
              Apply Coupon
           </button>
        </div>

      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center gap-3">
       <span className="text-slate-400">{icon}</span>
       <span>{text}</span>
    </li>
  );
}
