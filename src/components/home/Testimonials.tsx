"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import Image from 'next/image';

const mockReviews = [
  {
    id: 1,
    name: "Alvaro P.",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    text: "EduStream is a life-changer. I was able to transition from a non-tech role into a Junior Developer position in just 6 months. The React and Spring Boot courses are absolute top-tier.",
    course: "Spring Boot Enterprise Development",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah M.",
    role: "Project Manager",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    text: "The quality of the instructors is what sets this platform apart. They aren't just teaching theory; they are sharing real-world industry experience that is immediately applicable.",
    course: "Agile Leadership Mastery",
    rating: 5
  },
  {
    id: 3,
    name: "James L.",
    role: "UX Designer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    text: "I love the interactive nature of the assignments. The feedback from tutors helped me polish my portfolio and land my dream job at a top tech company. Highly recommended!",
    course: "Advanced UI/UX Principles",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 lg:px-12 py-20 bg-white">
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4 tracking-tight">
          How learners like you are achieving their goals
        </h2>
        <div className="w-20 h-1.5 bg-indigo-600 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockReviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="p-8 border border-slate-100 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 relative flex flex-col h-full"
          >
            <div className="absolute top-6 right-8 text-indigo-100 italic">
              <Quote className="w-12 h-12 rotate-180" />
            </div>

            <div className="flex items-center gap-1 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <p className="text-slate-700 text-lg leading-relaxed mb-8 flex-1 italic">
              "{review.text}"
            </p>

            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image 
                  src={review.avatar} 
                  alt={review.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 leading-tight">{review.name}</h4>
                <p className="text-sm text-slate-500">{review.role}</p>
              </div>
            </div>
            
            <div className="mt-4 inline-flex items-center gap-2 text-indigo-600">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              <span className="text-xs font-bold truncate max-w-full">
                Course: {review.course}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
