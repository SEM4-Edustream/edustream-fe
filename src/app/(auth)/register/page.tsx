"use client";

import React from 'react';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuthLogic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

export default function RegisterPage() {
  const { submitRegistration, isPending, success, error } = useRegister();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const firstName = form.get('firstName') as string;
    const lastName = form.get('lastName') as string;
    
    submitRegistration({
      username: form.get('username') as string,
      email: form.get('email') as string,
      password: form.get('password') as string,
      fullName: `${firstName} ${lastName}`.trim()
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans pt-20 lg:pt-0 flex items-center justify-center">
      
      <div className="max-w-[1240px] w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-8 sm:px-12">
        
        {/* LEFT: ILLUSTRATION SECTION - Hidden on Mobile */}
        <div className="hidden lg:flex flex-1 items-center justify-end">
          <div className="max-w-[480px] w-full">
            <img 
              src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-1-x1.webp" 
              alt="Register Illustration" 
              className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* RIGHT: REGISTER FORM SECTION */}
        <div className="flex-1 flex flex-col items-center lg:items-start justify-center py-12">
          <div className="w-full max-w-[440px] space-y-8 py-12">
            
            <div className="space-y-2">
               <h2 className="text-2xl font-semibold text-[#1c1d1f] tracking-tight">Sign up and start learning</h2>
            </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-bold px-4 py-3 border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 text-sm font-bold px-4 py-3 border border-green-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p>{success}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Input 
                  id="firstName" 
                  name="firstName"
                  type="text" 
                  placeholder="First name" 
                  required
                  className="h-12 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0] text-base placeholder:text-slate-400 shadow-sm transition-all"
                />
              </div>
              <div className="space-y-1">
                <Input 
                  id="lastName" 
                  name="lastName"
                  type="text" 
                  placeholder="Last name" 
                  required
                  className="h-12 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0] text-base placeholder:text-slate-400 shadow-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Input 
                id="username" 
                name="username"
                type="text" 
                placeholder="Username" 
                required
                className="h-12 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0] text-base placeholder:text-slate-400 shadow-sm transition-all"
              />
            </div>

            <div className="space-y-1">
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="Email address" 
                required
                className="h-12 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0] text-base placeholder:text-slate-400 shadow-sm transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <Input 
                id="password" 
                name="password"
                type="password" 
                placeholder="Password" 
                required
                className="h-12 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0] text-base placeholder:text-slate-400 shadow-sm transition-all"
              />
            </div>

            <div className="flex items-start gap-3 py-2">
               <input type="checkbox" id="offers" className="mt-1 accent-[#5624d0]" />
               <label htmlFor="offers" className="text-xs text-slate-600 leading-tight">
                  Send me special offers, personalized recommendations, and learning tips.
               </label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#5624d0] hover:bg-[#401b9c] text-white text-base font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 active:scale-[0.98]"
              disabled={isPending || !!success}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </Button>
            
            <p className="text-[10px] text-slate-600 text-center px-4 leading-relaxed">
               By signing up, you agree to our <Link href="#" className="underline">Terms of Use</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
            </p>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center">
             <p className="text-sm text-slate-600 font-medium">
                Already have an account?{' '}
                <Link href="/login" className="text-[#5624d0] hover:underline font-semibold">
                   Log in
                </Link>
             </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
