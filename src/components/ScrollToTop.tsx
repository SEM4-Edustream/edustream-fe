'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top coordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 right-8 z-[60]",
            "flex h-12 w-12 items-center justify-center rounded-full",
            "bg-indigo-600 text-white shadow-2xl shadow-indigo-200",
            "hover:bg-indigo-700 hover:scale-110 transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          )}
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6 stroke-[2.5px]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
