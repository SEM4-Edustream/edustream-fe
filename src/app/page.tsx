"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Play, CheckCircle2, TrendingUp, Users, Star } from 'lucide-react';
import axiosInstance from '@/lib/axios';

// DTO from backend
interface Course {
  id: string;
  title: string;
  description: string;
  price: number | null;
  thumbnailUrl: string;
  averageRating: number | null;
  reviewCount: number;
  tutorName: string;
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top public courses from VPS Backend
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/api/courses?size=6');
        if (response.result && response.result.content) {
          setCourses(response.result.content);
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <main className="flex-1 w-full flex flex-col items-center">
      
      {/* ----------------- VIBRANT HERO SECTION ----------------- */}
      <section className="relative w-full max-w-[1400px] min-h-[600px] md:min-h-[750px] mx-auto px-4 lg:px-8 mt-12 mb-20 overflow-hidden flex items-center bg-gray-50/50 rounded-3xl">
        {/* Dynamic Abstract Shapes (Glassmorphism & Gradients) */}
        <div 
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-400/30 to-purple-500/30 blur-2xl rounded-full mix-blend-multiply animate-pulse" 
          style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
        />
        <div 
          className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-gradient-to-tr from-pink-400/20 to-orange-400/20 blur-2xl rounded-full mix-blend-multiply animate-pulse" 
          style={{ animationDelay: '2s', willChange: 'transform, opacity', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full relative z-10 z-[1] py-16">
          {/* Left Text Column */}
          <div className="flex flex-col gap-8 justify-center max-w-xl">
            <div className="inline-flex">
              <Badge variant="secondary" className="px-3 py-1 font-semibold text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-default border-none">
                #1 Premium Learning Platform
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight">
              Master the Skills to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Drive your Career</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Get certified, master modern tech skills, and level up your career — whether you’re starting out or a seasoned pro. Over 1,200+ online courses available.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform">
                  Explore Courses
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-2 border-gray-200 hover:bg-gray-50 flex gap-2">
                <Play className="h-4 w-4 text-blue-600 fill-current" /> Watch Video
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-6">
              <div className="flex -space-x-4">
                <img className="w-12 h-12 rounded-full border-4 border-white" src="https://i.pravatar.cc/100?img=1" alt="Student" />
                <img className="w-12 h-12 rounded-full border-4 border-white" src="https://i.pravatar.cc/100?img=2" alt="Student" />
                <img className="w-12 h-12 rounded-full border-4 border-white" src="https://i.pravatar.cc/100?img=3" alt="Student" />
                <img className="w-12 h-12 rounded-full border-4 border-white" src="https://i.pravatar.cc/100?img=4" alt="Student" />
                <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">1M+</div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-400">
                  <Star className="fill-current w-4 h-4"/>
                  <Star className="fill-current w-4 h-4"/>
                  <Star className="fill-current w-4 h-4"/>
                  <Star className="fill-current w-4 h-4"/>
                  <Star className="fill-current w-4 h-4"/>
                </div>
                <span className="text-sm font-semibold text-gray-600 mt-1">4.9/5 from 1M+ learners</span>
              </div>
            </div>
          </div>

          {/* Right Geometric Collage (Geeks UI Inspired) */}
          <div className="relative hidden lg:block h-[600px] w-full">
            {/* Main Collage Image */}
            <div className="absolute top-[10%] right-[5%] w-[80%] h-[80%] rounded-[3rem] overflow-hidden shadow-2xl z-10 border-8 border-white/50 backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Students learning" 
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
            
            {/* Floating Badges / Micro-animations */}
            <Card 
              className="absolute top-[15%] left-0 z-20 w-48 shadow-2xl xl:scale-110 lg:scale-100 animate-bounce duration-[3000ms]"
              style={{ willChange: 'transform', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">250+</p>
                  <p className="text-xs text-gray-500 font-semibold">Tutors Available</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="absolute bottom-[20%] right-[-5%] z-20 w-56 shadow-2xl xl:scale-110 lg:scale-100 animate-bounce duration-[4000ms]"
              style={{ willChange: 'transform', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">In-Demand</p>
                  <p className="text-xs text-gray-500 font-semibold">Tech Skills 2024</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="absolute bottom-[5%] left-[10%] z-20 w-40 shadow-2xl xl:scale-110 lg:scale-100 animate-bounce duration-[5000ms]"
              style={{ willChange: 'transform', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
            >
              <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">Community</p>
                  <p className="text-xs text-gray-500 font-semibold">Support 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ----------------- COURSE MARKETPLACE SECTION ----------------- */}
      <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Most Popular Courses</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              These are the most popular courses among EduStream learners. Start learning today and unlock your potential.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="ghost" className="text-blue-600 font-semibold hover:text-blue-700 hover:bg-blue-50">View all courses &rarr;</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="w-full h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Link href={`/courses/${course.id}`} key={course.id}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 rounded-2xl group cursor-pointer h-full flex flex-col">
                    <div className="relative h-[220px] w-full overflow-hidden">
                      <img 
                        src={course.thumbnailUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge className="absolute top-4 left-4 bg-white/90 text-black shadow-sm font-semibold hover:bg-white backdrop-blur-sm">
                        Best Seller
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-xl line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-medium text-gray-700">By</span>
                          <span className="text-sm font-semibold text-gray-900">{course.tutorName || 'EduStream Tutor'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-4 h-4 ${(course.averageRating || 0) >= star ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{course.averageRating ? course.averageRating.toFixed(1) : 'New'}</span>
                          <span className="text-sm text-gray-500">({course.reviewCount || 0} reviews)</span>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-2xl font-black text-gray-900">
                            ${course.price?.toLocaleString() || '0'}
                          </span>
                          <span className="text-sm font-bold text-blue-600 group-hover:underline">View Course</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <Play className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No courses available yet</h3>
                <p className="text-gray-500">Check back later for new premium content!</p>
              </div>
            )}
          </div>
        )}
      </section>

    </main>
  );
}