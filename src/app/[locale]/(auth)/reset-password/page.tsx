"use client";

import React, { useState, Suspense } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useResetPassword } from '@/hooks/useAuthLogic';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
  const t = useTranslations('Auth');
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { submitResetPassword, isPending, error, success } = useResetPassword();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    submitResetPassword(token, password);
  };

  return (
    <div className="w-full max-w-[400px] space-y-8">
      <div className="space-y-2">
         <h2 className="text-2xl font-semibold text-[#1c1d1f] tracking-tight">{t('reset_password_title')}</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {(error || validationError) && (
          <div className="bg-red-50 text-red-600 text-sm font-bold px-4 py-3 border border-red-100 flex items-start gap-3 rounded-lg">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{validationError || error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-600 text-sm font-bold px-4 py-3 border border-emerald-100 flex items-start gap-3 rounded-lg">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="password" className="text-sm font-semibold text-[#1c1d1f] ml-1">{t('new_password')}</Label>
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

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[#1c1d1f] ml-1">{t('confirm_new_password')}</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            placeholder="********" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-14 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0] text-base placeholder:text-slate-400 shadow-sm transition-all"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-[#5624d0] hover:bg-[#401b9c] text-white text-base font-semibold rounded-lg mt-2 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 active:scale-[0.98]"
          disabled={isPending || !token}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ...
            </>
          ) : (
            t('reset_btn')
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
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white font-sans pt-20 lg:pt-0 flex items-center justify-center">
      <div className="max-w-[1200px] w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-8 sm:px-12">
        <div className="hidden lg:flex flex-1 items-center justify-end">
          <div className="max-w-[480px] w-full">
            <img 
              src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x1.webp" 
              alt="Reset Password Illustration" 
              className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center lg:items-start justify-center py-12">
          <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#5624d0]" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
