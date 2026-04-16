import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Play, CheckCircle2, TrendingUp, Users, Star } from 'lucide-react';

export default function HeroSection() {
  return (
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full relative z-10 py-16">
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
              <Image className="w-12 h-12 rounded-full border-4 border-white" src="https://i.pravatar.cc/100?img=1" alt="Student" width={48} height={48} />
              <Image className="w-12 h-12 rounded-full border-4 border-white" src="https://i.pravatar.cc/100?img=2" alt="Student" width={48} height={48} />
              <Image className="w-12 h-12 rounded-full border-4 border-white" src="https://i.pravatar.cc/100?img=3" alt="Student" width={48} height={48} />
              <Image className="w-12 h-12 rounded-full border-4 border-white" src="https://i.pravatar.cc/100?img=4" alt="Student" width={48} height={48} />
              <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 z-10">1M+</div>
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

        {/* Right Geometric Collage */}
        <div className="relative hidden lg:block h-[600px] w-full">
          <div className="absolute top-[10%] right-[5%] w-[80%] h-[80%] rounded-[3rem] overflow-hidden shadow-2xl z-10 border-8 border-white/50 backdrop-blur-sm relative">
            <Image 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Students learning" 
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="eager"
            />
          </div>
          
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
  );
}
