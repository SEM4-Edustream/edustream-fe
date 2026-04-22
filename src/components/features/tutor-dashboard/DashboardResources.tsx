"use client";

import React from "react";
import { Link } from "next-view-transitions";
import { ExternalLink, PlayCircle, MessageSquare, GraduationCap, BarChart, HelpCircle } from "lucide-react";

const mainResources = [
  {
    title: "Create an Engaging Course",
    description: "Whether you've been teaching for years or are teaching for the first time, you can make an engaging course. We've compiled resources and best practices to help you get to the next level, no matter where you're starting.",
    linkText: "Get Started",
    image: "https://s.udemycdn.com/instructor/dashboard/engaging-course.jpg",
    href: "#"
  },
  {
    title: "Get Started with Video",
    description: "Quality video lectures can set your course apart. Use our resources to learn the basics.",
    linkText: "Get Started",
    image: "https://s.udemycdn.com/instructor/dashboard/video-creation.jpg",
    href: "#"
  },
  {
    title: "Build Your Audience",
    description: "Set your course up for success by building your audience.",
    linkText: "Get Started",
    image: "https://s.udemycdn.com/instructor/dashboard/build-audience.jpg",
    href: "#"
  }
];

const smallResources = [
  { title: "Test Video", description: "Send us a sample video and get expert feedback.", icon: PlayCircle, href: "#" },
  { title: "Tutor Community", description: "Connect with experienced tutors. Ask questions, browse discussions, and more.", icon: MessageSquare, href: "#" },
  { title: "Teaching Center", description: "Learn about best practices for teaching on EduStream.", icon: GraduationCap, href: "#" },
  { title: "Marketplace Insights", description: "Validate your course topic by exploring our marketplace supply and demand.", icon: BarChart, href: "#" },
  { title: "Help and Support", description: "Browse our Help Center or contact our support team.", icon: HelpCircle, href: "#" },
];

export default function DashboardResources() {
  return (
    <div className="space-y-20 mt-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* 1. Main Resources Section */}
      <section>
        <h2 className="text-2xl font-bold text-[#1c1d1f] mb-10 text-center">
          Based on your experience, we think these resources will be helpful.
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {mainResources.map((res, index) => (
            <div key={index} className="flex flex-col md:flex-row bg-white border border-[#d1d7dc] overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="md:w-[240px] shrink-0 overflow-hidden">
                <img 
                  src={res.image} 
                  alt={res.title} 
                  className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="p-8 flex flex-col justify-center gap-3">
                <h3 className="text-xl font-bold text-[#1c1d1f] group-hover:text-[#5624d0] transition-colors">{res.title}</h3>
                <p className="text-sm text-[#1c1d1f] leading-relaxed max-w-2xl opacity-80">{res.description}</p>
                <Link href={res.href} className="text-[#5624d0] text-sm font-bold underline underline-offset-4 hover:text-[#401b9c] transition-colors inline-flex items-center gap-2 mt-2">
                  {res.linkText}
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Smaller Resource Units */}
      <section className="bg-slate-50/50 py-16 px-8 rounded-3xl">
        <h2 className="text-2xl font-bold text-[#1c1d1f] mb-12 text-center">
          Have questions? Here are our most popular tutor resources.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {smallResources.map((unit, index) => (
            <Link key={index} href={unit.href} className="group flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center transition-all group-hover:shadow-md group-hover:-translate-y-1 duration-300">
                <unit.icon className="w-8 h-8 text-[#5624d0]" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#1c1d1f] underline underline-offset-4 group-hover:text-[#5624d0] transition-colors">
                  {unit.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed px-1">
                  {unit.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
