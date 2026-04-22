"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const faqItems = [
  {
    question: "How do I enroll in a course?",
    answer: "Simply browse our Most Popular Courses or search by category. Once you find a course you're interested in, click 'View Details' and then 'Enroll Now' to get started immediately."
  },
  {
    question: "Do I get a certificate after completion?",
    answer: "Yes! Every course on EduStream comes with a professional certificate of completion that you can share on LinkedIn or with your employer to showcase your new skills."
  },
  {
    question: "Can I teach on EduStream?",
    answer: "Absolutely. We are always looking for experts to share their knowledge. If you're interested in teaching, click the 'Become a Tutor' button above to start the onboarding process."
  },
  {
    question: "How long do I have access to a course?",
    answer: "Once you enroll in a course, you have lifetime access to the content. You can learn at your own pace and revisit the material whenever you need a refresher."
  },
  {
    question: "What payment methods do you support?",
    answer: "We support a variety of secure payment options, including major Credit Cards, VNPAY, and automated bank transfers via PayOS for your convenience."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-[1000px] mx-auto px-4 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Everything you need to know about starting your learning journey at EduStream.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/30 hover:bg-white hover:border-indigo-100 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className="text-lg font-medium text-slate-800">{item.question}</span>
                <div className={`p-1.5 rounded-full bg-slate-100/50 transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}>
                   {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-slate-600 leading-relaxed text-[16px]">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
