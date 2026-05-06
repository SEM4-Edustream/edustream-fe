"use client";

import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Target, Cpu, LayoutGrid } from 'lucide-react';
import { courseService, CategoryResponse } from '@/services/courseService';
import { cn } from '@/lib/utils';

export default function CategoryShowcase() {
  const t = useTranslations('Home.CategoryShowcase');
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  useEffect(() => {
    setMounted(true);
    const fetchCats = async () => {
      try {
        const data = await courseService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCats();
  }, []);

  if (!mounted) return null;

  const next = () => {
    if (currentIndex + 3 < categories.length) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const visibleCategories = categories.slice(currentIndex, currentIndex + 3);

  const getCategoryStyle = (name: string, index: number) => {
    const lowerName = name.toLowerCase();
    
    // Specific image mapping
    if (lowerName.includes('it') || lowerName.includes('software')) {
      return { image: '/images/showcasecategory/it-software-2560x800px-dark.jpg', bg: 'bg-slate-900' };
    }
    if (lowerName.includes('dev')) {
      return { image: '/images/showcasecategory/developer-là-gì.jpg', bg: 'bg-indigo-900' };
    }
    if (lowerName.includes('business')) {
      return { image: '/images/showcasecategory/business-camera-coffee-1509428.jpg', bg: 'bg-amber-900' };
    }

    // Default styles for others
    const styles = [
      { bg: "bg-[#e9f1ff]", icon: <Cpu className="w-20 h-20 text-blue-500/40" /> },
      { bg: "bg-[#fff4e6]", icon: <Zap className="w-20 h-20 text-orange-500/40" /> },
      { bg: "bg-[#f0fdf4]", icon: <Target className="w-20 h-20 text-emerald-500/40" /> },
      { bg: "bg-[#f5f3ff]", icon: <LayoutGrid className="w-20 h-20 text-indigo-500/40" /> }
    ];
    return styles[index % styles.length];
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <section className="w-full pt-16 pb-8 bg-white overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side: Content */}
        <div className="lg:w-1/3 xl:w-1/4 space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight leading-[1.2]">
            {t('title')}
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="pt-2 flex gap-3">
            <button 
              onClick={prev}
              disabled={currentIndex === 0}
              className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                currentIndex === 0 ? "border-slate-100 text-slate-200" : "border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={next}
              disabled={currentIndex + 3 >= categories.length}
              className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                currentIndex + 3 >= categories.length ? "border-slate-100 text-slate-200" : "border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Category Cards Carousel */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[450px]">
             <AnimatePresence custom={direction} mode="popLayout" initial={false}>
                {visibleCategories.length > 0 ? (
                  visibleCategories.map((cat, idx) => {
                    const style = getCategoryStyle(cat.name, currentIndex + idx);

                    return (
                      <motion.div
                        key={cat.id}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 }
                        }}
                        className="w-full"
                      >
                        <CategoryCard 
                          title={cat.name} 
                          bgColor={style.bg} 
                          icon={'icon' in style ? style.icon : null}
                          imageSrc={'image' in style ? style.image : null}
                          href={`/courses?category=${cat.slug}`}
                        />
                      </motion.div>
                    );
                  })
                ) : (
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-[1/1.2] rounded-[2rem] bg-slate-50 animate-pulse" />
                  ))
                )}
             </AnimatePresence>
          </div>
          
          {/* Pagination Dots */}
          <div className="mt-12 flex justify-center gap-2.5">
             {Array.from({ length: Math.max(0, categories.length - 2) }).map((_, i) => (
               <div 
                 key={i} 
                 className={cn(
                   "transition-all duration-300 rounded-full",
                   i === currentIndex ? "w-8 h-2.5 bg-indigo-600" : "w-2.5 h-2.5 bg-slate-200"
                 )} 
               />
             ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function CategoryCard({ title, bgColor, icon, imageSrc, href }: { title: string, bgColor: string, icon?: React.ReactNode, imageSrc?: string | null, href: string }) {
  return (
    <div className="w-full">
      <Link href={href} className="group block relative aspect-[1/1.5] rounded-[3rem] overflow-hidden">
        <div className={`absolute inset-0 ${bgColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-700`}>
          
          {imageSrc ? (
            <Image 
              src={imageSrc}
              alt={title}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          ) : (
            <>
              <div className="relative z-10 filter blur-[0.5px] group-hover:blur-0 transition-all duration-500">
                {icon}
              </div>
              <div className="absolute w-32 h-32 bg-white/40 rounded-full blur-3xl" />
            </>
          )}

          {/* Gradient Overlay for Images */}
          {imageSrc && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          )}
        </div>

        {/* Bottom Label Section */}
        <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
          <span className="font-semibold text-[15px] text-slate-800 leading-tight pr-4">
            {title}
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </div>
  );
}

