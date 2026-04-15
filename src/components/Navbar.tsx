"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen, GraduationCap } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrolled = false;
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== lastScrolled) {
        setIsScrolled(isScrolled);
        lastScrolled = isScrolled;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm' 
          : 'bg-transparent'
      }`}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              EduStream
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-gray-600 hover:text-primary font-medium transition-colors">Courses</Link>
            <Link href="/about" className="text-gray-600 hover:text-primary font-medium transition-colors">About Us</Link>
            <Link href="/instructors" className="text-gray-600 hover:text-primary font-medium transition-colors">Instructors</Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Hi, {user.username}</span>
                <Button variant="outline" onClick={logout} className="border-gray-300">
                  Logout
                </Button>
                {user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="default">Dashboard</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-600 font-semibold hover:text-primary">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 shadow-md">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 hover:text-primary p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full">
          <div className="flex flex-col px-4 py-6 space-y-4">
            <Link href="/courses" className="text-gray-700 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
            <Link href="/about" className="text-gray-700 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <hr className="border-gray-100" />
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-3">
                <span className="text-gray-500 text-sm">Signed in as <span className="font-bold text-gray-900">{user.username}</span></span>
                <Button variant="outline" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full justify-center">Logout</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">Sign In</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
