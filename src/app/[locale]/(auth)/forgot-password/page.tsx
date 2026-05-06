"use client";

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useForgotPassword } from '@/hooks/useAuthLogic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth');
  const [email, setEmail] = useState('');
  const { submitForgotPassword, isPending, error, success } = useForgotPassword();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitForgotPassword(email);
  };

  return (
    <div className="min-h-screen bg-white font-sans pt-20 lg:pt-0 flex items-center justify-center">
      <div className="max-w-[1200px] w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-8 sm:px-12">
        <div className="hidden lg:flex flex-1 items-center justify-end">
          <div className="max-w-[480px] w-full">
            <img 
              src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-1-x1.webp" 
              alt="Forgot Password Illustration" 
              className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center lg:items-start justify-center py-12">
          <div className="w-full max-w-[400px] space-y-8">
            <div className="space-y-2">
               <h2 className="text-2xl font-semibold text-[#1c1d1f] tracking-tight">{t('forgot_password_title')}</h2>
               <p className="text-sm text-slate-600">{t('forgot_password_desc')}</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm font-bold px-4 py-3 border border-red-100 flex items-start gap-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 text-emerald-600 text-sm font-bold px-4 py-3 border border-emerald-100 flex items-start gap-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-semibold text-[#1c1d1f] ml-1">{t('email')}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0] text-base placeholder:text-slate-400 shadow-sm transition-all"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#5624d0] hover:bg-[#401b9c] text-white text-base font-semibold rounded-lg mt-2 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 active:scale-[0.98]"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ...
                  </>
                ) : (
                  t('reset_password_btn')
                )}
              </Button>
            </form>

            <div className="pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600 font-medium">
                  <Link href="/login" className="text-[#5624d0] hover:underline font-semibold">
                    {t('back_to_login')}
                  </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
