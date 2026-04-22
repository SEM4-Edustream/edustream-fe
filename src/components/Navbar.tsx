"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingCart,
  Bell,
  ChevronDown,
  User,
  Globe
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, tutorStatus } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white border-b border-gray-200 shadow-sm'
        : 'bg-white border-b border-gray-100'
        }`}
    >
      <div className="px-4 h-18 lg:px-6 flex items-center h-16 lg:h-[72px] gap-4 lg:gap-8">

        {/* LEFT: LOGO & EXPLORE */}
        <div className="flex items-center gap-1 lg:gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-1">
            <img src="/images/icon.png" alt="EduStream" className="h-14 w-auto" />
            <span className="hidden sm:block text-xl font-semibold tracking-tight text-slate-900">EduStream</span>
          </Link>
          <Link href="/courses" className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-[#5624d0] transition-colors">
            Explore
          </Link>
        </div>

        {/* CENTER: SEARCH BAR - Expanded to fill space */}
        <div className="flex-1 hidden md:block mx-2 lg:mx-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-[18px] w-[18px] text-slate-500 group-focus-within:text-[#5624d0] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for anything"
              className="w-full bg-[#f7f9fa] border-[1.5px] border-[#1c1d1f]/20 rounded-full py-[10px] pl-12 pr-4 text-[15px] focus:bg-white focus:border-[#1c1d1f] focus:ring-0 transition-all outline-none placeholder:text-slate-500 shadow-sm"
            />
          </div>
        </div>

        {/* RIGHT: NAVIGATION & AUTH */}
        <div className="flex items-center gap-1 lg:gap-4 ml-auto shrink-0">

          {/* Roles Links */}
          <nav className="hidden lg:flex items-center gap-4">
            {!mounted ? (
              <div className="h-4 w-32 bg-slate-100 animate-pulse rounded-md" />
            ) : isAuthenticated ? (
              <>
                {(user?.role === 'TUTOR' || user?.role === 'ADMIN') ? (
                  <Link href="/tutor/dashboard" className="text-sm font-medium text-slate-600 hover:text-[#5624d0] transition-colors">Tutor</Link>
                ) : tutorStatus === 'PENDING' ? (
                  <Link href="/tutor/application" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    Application Pending
                  </Link>
                ) : (
                  <Link href="/teaching" className="text-sm font-medium text-slate-600 hover:text-[#5624d0] transition-colors">Teach on Edustream</Link>
                )}
                {user?.role === 'STUDENT' && (
                  <Link href="/my-learning" className="text-sm font-medium text-slate-600 hover:text-[#5624d0] transition-colors">My learning</Link>
                )}
              </>
            ) : (
              <Link href="/teaching" className="text-sm font-medium text-slate-600 hover:text-[#5624d0] transition-colors">Teach on EduStream</Link>
            )}
          </nav>

          {/* Icons & Profile */}
          <div className="flex items-center gap-0.5 lg:gap-2">
            {!mounted ? (
              <div className="w-32 h-9 bg-slate-100 animate-pulse rounded-md" />
            ) : isAuthenticated ? (
              <>
                <button className="p-2.5 text-slate-600 hover:text-[#5624d0] transition-colors hidden sm:block">
                  <Heart className="h-5 w-5" />
                </button>
                <Link href="/cart" className="p-2.5 text-slate-600 hover:text-[#5624d0] transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                <button className="p-2.5 text-slate-600 hover:text-[#5624d0] transition-colors hidden sm:block">
                  <Bell className="h-5 w-5" />
                </button>
                
                {/* Profile Avatar with Dropdown */}
                <div className="relative ml-2 shrink-0">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-9 h-9 rounded-full bg-slate-900 overflow-hidden text-white flex items-center justify-center text-sm font-semibold relative border-2 border-transparent hover:border-slate-200 transition-all"
                  >
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      user?.username?.substring(0, 2).toUpperCase() || 'ES'
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#a435f0] border-2 border-white rounded-full"></span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 shadow-xl rounded-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 overflow-hidden text-white flex items-center justify-center font-bold">
                          {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            user?.username?.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 truncate">{user?.username}</span>
                          <span className="text-xs text-slate-600 truncate">{user?.email || 'user@edustream.com'}</span>
                        </div>
                      </div>
                      <div className="py-2">
                        {user?.role === 'ADMIN' && (
                          <Link href="/admin" className="block px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">Admin Panel</Link>
                        )}
                        <Link href="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Profile</Link>
                        <Link href="/my-learning" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">My learning</Link>
                        <Link href="/cart" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cart</Link>
                        <Link href="/wishlist" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Wishlist</Link>
                        <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          <span>Language</span>
                          <div className="flex items-center gap-1 text-slate-500">
                             <Globe className="h-4 w-4" />
                             <span>English</span>
                          </div>
                        </button>
                      </div>
                      <div className="border-t border-slate-100 pt-2">
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 lg:gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-900 font-semibold hover:text-[#5624d0]">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5">Sign up</Button>
                </Link>
                <button className="p-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors hidden sm:flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Mobile Nav Button */}
            <button
              className="lg:hidden p-2.5 text-slate-600 hover:text-[#5624d0]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 w-full animate-in slide-in-from-top duration-300 shadow-xl overflow-y-auto max-h-[calc(100vh-72px)]">
          <div className="px-6 py-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search for anything" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-sm" />
            </div>

            <nav className="flex flex-col gap-4">
              <Link href="/courses" className="text-slate-900 font-bold text-lg border-b border-slate-100 pb-2">Browse Courses</Link>
              {isAuthenticated ? (
                <>
                  <Link href="/my-learning" className="text-slate-600 font-medium">My learning</Link>
                  <Link href="/tutor/dashboard" className="text-slate-600 font-medium">Tutor Dashboard</Link>
                </>
              ) : (
                <>
                  {tutorStatus === 'PENDING' ? (
                    <Link href="/tutor/application" className="text-amber-600 font-medium">Application Status</Link>
                  ) : (
                    <Link href="/teaching" className="text-slate-600 font-medium">Teach on Edustream</Link>
                  )}
                  <button className="flex items-center gap-2 text-slate-600 font-medium pt-2">
                    <Globe className="h-4 w-4" /> Change Language
                  </button>
                </>
              )}
            </nav>

            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Link href="/login" className="w-full"><Button variant="outline" className="w-full font-bold">Log in</Button></Link>
                <Link href="/register" className="w-full"><Button className="w-full bg-[#1c1d1f] font-bold">Sign up</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;