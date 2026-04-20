"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuthLogic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading, error } = useLogin();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-white font-sans pt-20 lg:pt-0 flex items-center justify-center">
      
      <div className="max-w-[1200px] w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-8 sm:px-12">
        
        {/* LEFT: ILLUSTRATION SECTION - Hidden on Mobile */}
        <div className="hidden lg:flex flex-1 items-center justify-end">
          <div className="max-w-[480px] w-full">
            <img 
              src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-1-x1.webp" 
              alt="Login Illustration" 
              className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* RIGHT: LOGIN FORM SECTION */}
        <div className="flex-1 flex flex-col items-center lg:items-start justify-center py-12">
          <div className="w-full max-w-[400px] space-y-8">
            
            <div className="space-y-2">
               <h2 className="text-2xl font-bold text-[#1c1d1f] tracking-tight">Log in to your account</h2>
            </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-bold px-4 py-3 border border-red-100 flex items-start gap-3 rounded-lg">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-1">
              <Label htmlFor="username" className="text-sm font-bold text-[#1c1d1f] ml-1">Email or Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="email@example.com" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-14 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0] text-base placeholder:text-slate-400 shadow-sm transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-sm font-bold text-[#1c1d1f]">Password</Label>
                <Link href="#" className="text-xs font-bold text-[#5624d0] hover:underline">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0] text-base placeholder:text-slate-400 shadow-sm transition-all"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#5624d0] hover:bg-[#401b9c] text-white text-base font-bold rounded-lg mt-2 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </Button>
          </form>

          <div className="text-center space-y-6">
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                   <span className="w-full border-t border-slate-200"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                   <span className="bg-white px-2 text-slate-500 font-bold uppercase tracking-wider">Other log in options</span>
                </div>
             </div>

             <div className="flex items-center justify-center gap-4">
                <button className="w-14 h-14 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                   <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                </button>
                <button className="w-14 h-14 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                   <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-6 h-6" alt="Facebook" />
                </button>
                <button className="w-14 h-14 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                   <img src="https://www.svgrepo.com/show/475638/apple-color.svg" className="w-6 h-6" alt="Apple" />
                </button>
             </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center">
             <p className="text-sm text-slate-600 font-medium">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#5624d0] hover:underline font-bold">
                   Sign up
                </Link>
             </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
