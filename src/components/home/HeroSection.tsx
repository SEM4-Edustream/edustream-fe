"use client";

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/context/AuthContext';

const slides = [
  {
    id: 1,
    title: "Learning that gets you",
    description: "Skills for your present (and your future). Get started with us today and master relevant tech skills.",
    buttonText: "Explore Courses",
    buttonLink: "/courses",
    image: "/images/hero/Gemini_Generated_Image_lu6g2wlu6g2wlu6g.png",
    badge: "Limited Time Offer"
  },
  {
    id: 2,
    title: "Become a Tutor",
    description: "Tutors from around the world teach millions of learners on EduStream. We provide the tools and platform to teach what you love.",
    buttonText: "Become a Tutor",
    buttonLink: "/tutor/register", // Fallback
    image: "/images/hero/Gemini_Generated_Image_lu6g2wlu6g2wlu6g.png",
    badge: "Teach the World"
  }
];

export default function HeroSection() {
  const t = useTranslations('Hero');
  const { user, isAuthenticated } = useAuth();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  // Dynamic redirection logic for tutor slide
  const getTutorHref = () => {
    if (!isAuthenticated) return '/register';
    if (user?.role === 'TUTOR') return '/tutor/dashboard';
    return '/tutor/onboarding';
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // Determine current button link
  const currentButtonLink = current === 1 ? getTutorHref() : slides[current].buttonLink;

  return (
    <section className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden bg-white">
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={slides[current].image}
                alt={slides[current].title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
            </div>

            {/* Content Box */}
            <div className="absolute inset-0 flex items-center px-4 md:px-16 lg:px-24">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-[440px] bg-white p-8 md:p-10 shadow-xl"
              >
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-800 leading-tight tracking-tight">
                    {current === 0 ? t('title') : t('tutor_title')}
                  </h2>
                  <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                    {current === 0 ? t('subtitle') : t('tutor_subtitle')}
                  </p>
                  <div className="pt-2">
                    <Link href={currentButtonLink}>
                      <Button size="lg" className="h-12 px-6 text-base font-bold bg-[#1c1d1f] hover:bg-slate-800 text-white rounded-lg transition-all">
                        {current === 0 ? t('cta') : t('tutor_cta')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-slate-900/50 text-white hover:bg-slate-900 transition-all opacity-0 md:opacity-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-slate-900/50 text-white hover:bg-slate-900 transition-all opacity-0 md:opacity-100"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                current === idx ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
