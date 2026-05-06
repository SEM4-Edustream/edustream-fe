"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Globe,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { courseService, CategoryResponse } from '@/services/courseService';
import { cartService } from '@/services/cartService';
import { wishlistService } from '@/services/wishlistService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, isAuthenticated, logout, tutorStatus } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [wishlistDropdownOpen, setWishlistDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isCheckoutPage = pathname?.startsWith('/checkout') || pathname?.startsWith('/payment');
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  const isMyLearningPage = pathname?.startsWith('/my-learning');
  const isLearningPage = pathname?.startsWith('/learning');
  
  const courseIdMatch = pathname?.match(/\/checkout\/([^/]+)/);
  const checkoutCancelUrl = courseIdMatch ? `/courses/${courseIdMatch[1]}` : "/";

  const fetchCartData = async () => {
    try {
      const items = await cartService.getCartItems();
      setCartItems(items);
      setCartCount(items.length);
    } catch { /* ignore if not logged in */ }
  };

  const fetchWishlistData = async () => {
    try {
      const items = await wishlistService.getWishlistItems();
      setWishlistItems(items);
      setWishlistCount(items.length);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Fetch categories for Explore menu
    const fetchCats = async () => {
      try {
        const data = await courseService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCats();
    if (isAuthenticated) {
      fetchCartData();
      fetchWishlistData();
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('cart-updated', fetchCartData);
    window.addEventListener('wishlist-updated', fetchWishlistData);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cart-updated', fetchCartData);
      window.removeEventListener('wishlist-updated', fetchWishlistData);
    };
  }, [isAuthenticated]);

  if (isLearningPage) return null;

  if (isCheckoutPage) {
    return (
      <header className="w-full z-50 bg-white border-b border-gray-200 shadow-sm relative">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <img src="/images/icon.png" alt="EduStream" className="h-14 w-auto" />
            <span className="hidden sm:block text-xl font-bold tracking-tight text-slate-900">EduStream</span>
          </Link>
          <Link href={checkoutCancelUrl} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            Cancel
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
    <header
      className={`w-full z-50 transition-all duration-300 relative ${isScrolled
        ? 'bg-white border-b border-gray-200 shadow-sm'
        : 'bg-white border-b border-gray-100'
        }`}
    >
      <div className="px-4 h-18 lg:px-6 flex items-center h-16 lg:h-[72px] gap-4 lg:gap-8">

        {/* LEFT: LOGO & EXPLORE */}
        <div className="flex items-center gap-1 lg:gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-1">
            <img src="/images/icon.png" alt="EduStream" className="h-14 w-auto" />
            <span className="hidden sm:block text-xl font-bold tracking-tight text-slate-900">EduStream</span>
          </Link>
          
          {/* Explore Dropdown */}
          <div 
            className="relative hidden lg:block"
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button className="flex items-center gap-1 text-[14px] font-medium text-slate-600 hover:text-[#5624d0] transition-colors py-4">
              Explore
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", exploreOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full w-64 bg-white border border-slate-200 shadow-2xl rounded-xl py-3 z-50"
                >
                  <div className="px-4 py-2 border-b border-slate-50 mb-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Categories</span>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link 
                          key={cat.id}
                          href={`/courses/category/${cat.slug}`}
                          className="flex items-center justify-between px-4 py-2.5 text-[14px] text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <LayoutGrid className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                            <span className="font-medium">{cat.name}</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-center">
                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <span className="text-xs text-slate-400">Loading...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                <div 
                  className="relative"
                  onMouseEnter={() => setWishlistDropdownOpen(true)}
                  onMouseLeave={() => setWishlistDropdownOpen(false)}
                >
                  <Link href="/my-learning/wishlist" className="p-2 text-slate-600 hover:text-[#5624d0] transition-colors hidden sm:block relative flex items-center justify-center">
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-[18px] h-[18px] bg-[#a435f0] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {wishlistCount > 9 ? '9+' : wishlistCount}
                      </span>
                    )}
                  </Link>

                  <AnimatePresence>
                    {wishlistDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full w-[300px] bg-white border border-slate-200 shadow-2xl z-50 pt-2"
                      >
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                          {wishlistItems.length > 0 ? (
                            <div className="flex flex-col">
                              {wishlistItems.map((item) => (
                                <div key={item.id} className="p-3 border-b border-slate-100 flex gap-3 hover:bg-slate-50 transition-colors group">
                                  <div className="w-16 h-16 shrink-0 bg-slate-100 overflow-hidden">
                                    <img src={item.courseThumbnail || '/images/course-placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-[14px] font-bold text-slate-900 line-clamp-2 leading-tight mb-1 group-hover:text-[#5624d0]">
                                      {item.courseTitle}
                                    </h4>
                                    <p className="text-[12px] text-slate-500 mb-1">{item.tutorName}</p>
                                    <div className="font-bold text-[14px] text-slate-900">
                                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.coursePrice || 0)}
                                    </div>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="w-full mt-2 h-8 text-xs font-bold border-[#1c1d1f] rounded-xl hover:bg-slate-50"
                                      onClick={async (e) => {
                                        e.preventDefault();
                                        try {
                                          await cartService.addToCart(item.courseId);
                                          toast.success('Added to cart!');
                                          window.dispatchEvent(new Event('cart-updated'));
                                        } catch (err: any) {
                                          toast.error(err?.response?.data?.message || 'Failed to add to cart');
                                        }
                                      }}
                                    >
                                      Add to cart
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-8 text-center">
                              <p className="text-slate-500 text-sm font-medium mb-4">Your wishlist is empty.</p>
                              <Link href="/courses" className="text-[#5624d0] font-bold text-sm hover:underline">Explore courses</Link>
                            </div>
                          )}
                        </div>
                        {wishlistItems.length > 0 && (
                          <div className="p-3">
                            <Link href="/my-learning/wishlist">
                              <Button className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded-xl h-11">
                                Go to wishlist
                              </Button>
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div 
                  className="relative"
                  onMouseEnter={() => setCartDropdownOpen(true)}
                  onMouseLeave={() => setCartDropdownOpen(false)}
                >
                  <Link href="/cart" className="p-2 text-slate-600 hover:text-[#5624d0] transition-colors relative flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-[18px] h-[18px] bg-[#a435f0] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>

                  <AnimatePresence>
                    {cartDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full w-[300px] bg-white border border-slate-200 shadow-2xl z-50 pt-2"
                      >
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                          {cartItems.length > 0 ? (
                            <div className="flex flex-col">
                              {cartItems.map((item) => (
                                <div key={item.id} className="p-3 border-b border-slate-100 flex gap-3 hover:bg-slate-50 transition-colors group">
                                  <div className="w-16 h-16 shrink-0 bg-slate-100 overflow-hidden">
                                    <img src={item.courseThumbnail || '/images/course-placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-[14px] font-bold text-slate-900 line-clamp-2 leading-tight mb-1 group-hover:text-[#5624d0]">
                                      {item.courseTitle}
                                    </h4>
                                    <p className="text-[12px] text-slate-500 mb-1">{item.tutorName}</p>
                                    <div className="font-bold text-[14px] text-slate-900">
                                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.coursePrice || 0)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-8 text-center">
                              <p className="text-slate-500 text-sm font-medium mb-4">Your cart is empty.</p>
                              <Link href="/courses" className="text-[#5624d0] font-bold text-sm hover:underline">Keep shopping</Link>
                            </div>
                          )}
                        </div>
                        {cartItems.length > 0 && (
                          <div className="p-4 bg-white">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-lg font-bold text-slate-900">Total:</span>
                              <span className="text-lg font-extrabold text-[#1c1d1f]">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                  cartItems.reduce((acc, item) => acc + (item.coursePrice || 0), 0)
                                )}
                              </span>
                            </div>
                            <Link href="/cart">
                              <Button className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded-xl h-11">
                                Go to cart
                              </Button>
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
                        <Link href="/my-learning/wishlist" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Wishlist</Link>
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

    </header>

    {/* SECONDARY CATEGORY BAR (Desktop Only) - Udemy Style */}
    {!isAuthPage && !isMyLearningPage && (
      <div className="hidden lg:flex items-center justify-center gap-8 px-6 py-3 border-b border-slate-200 bg-white w-full shadow-sm overflow-x-auto relative z-40" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.slice(0, 10).map((cat) => (
           <Link key={cat.id} href={`/courses/category/${cat.slug}`} className="text-[14px] text-[#2d2f31] hover:text-[#5624d0] font-normal whitespace-nowrap transition-colors">
             {cat.name}
           </Link>
        ))}
      </div>
    )}

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 w-full animate-in slide-in-from-top duration-300 shadow-xl overflow-y-auto max-h-[calc(100vh-72px)]">
          <div className="px-6 py-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search for anything" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-sm" />
            </div>

            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => setMobileCatsOpen(!mobileCatsOpen)}
                className="flex items-center justify-between text-slate-900 font-bold text-lg border-b border-slate-100 pb-2 text-left"
              >
                <span>Categories</span>
                <ChevronDown className={cn("w-5 h-5 transition-transform", mobileCatsOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {mobileCatsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-3 pl-2"
                  >
                    {categories.length > 0 ? (
                      categories.map(cat => (
                        <Link 
                          key={cat.id} 
                          href={`/courses?category=${cat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-slate-600 font-medium py-1"
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">Loading...</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <Link href="/courses" className="text-slate-600 font-medium pt-2">Browse All Courses</Link>
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
    </>
  );
};

export default Navbar;