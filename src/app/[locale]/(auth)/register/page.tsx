"use client";

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useRegister } from '@/hooks/useAuthLogic';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateEmail, validateUsername, validatePassword, isPasswordSecure } from '@/lib/validation';
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const { submitRegistration, isPending, success, error: apiError } = useRegister();
  
  // Local state for form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/${locale}/authenticate`,
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const pwdValidation = validatePassword(formData.password);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      errors.username = 'Minimum 4 characters, letters and numbers only';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isPasswordSecure(formData.password)) {
      errors.password = 'Password does not meet requirements';
    }

    return errors;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouched({
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        password: true
      });
      return;
    }
    
    submitRegistration({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      fullName: `${formData.firstName} ${formData.lastName}`.trim()
    });
  };

  const PasswordRequirement = ({ label, met }: { label: string; met: boolean }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
      {met ? <Check className="w-3.5 h-3.5" /> : <div className="w-1 h-1 rounded-full bg-slate-300 ml-1.5 mr-1" />}
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans pt-12 lg:pt-0 flex items-center justify-center">
      <div className="max-w-[1240px] w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-6 sm:px-12">
        
        {/* LEFT: ILLUSTRATION SECTION */}
        <div className="hidden lg:flex flex-1 items-center justify-end">
          <div className="max-w-[480px] w-full">
            <img 
              src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-1-x1.webp" 
              alt="Register Illustration" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* RIGHT: REGISTER FORM SECTION */}
        <div className="flex-1 flex flex-col items-center lg:items-start justify-center py-10">
          <div className="w-full max-w-[440px] space-y-6">
            
            <div className="space-y-1">
               <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">{t('register_title')}</h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {(apiError || Object.keys(fieldErrors).length > 0) && !success && (
                <div className="bg-red-50 text-red-600 text-sm font-semibold px-4 py-3 border border-red-100 flex items-start gap-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{apiError || "Please fix the errors below."}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-700 text-sm font-semibold px-4 py-3 border border-green-100 flex items-start gap-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>{success}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Input 
                    name="firstName"
                    placeholder={t('first_name')} 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`h-12 border-slate-200 rounded-lg focus-visible:ring-1 ${fieldErrors.firstName && touched.firstName ? 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-100' : 'focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0]'}`}
                  />
                  {fieldErrors.firstName && touched.firstName && <p className="text-[11px] text-red-500 font-medium ml-1">{fieldErrors.firstName}</p>}
                </div>
                <div className="space-y-1">
                  <Input 
                    name="lastName"
                    placeholder={t('last_name')} 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`h-12 border-slate-200 rounded-lg focus-visible:ring-1 ${fieldErrors.lastName && touched.lastName ? 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-100' : 'focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0]'}`}
                  />
                  {fieldErrors.lastName && touched.lastName && <p className="text-[11px] text-red-500 font-medium ml-1">{fieldErrors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <Input 
                  name="username"
                  placeholder={t('username')} 
                  value={formData.username}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`h-12 border-slate-200 rounded-lg focus-visible:ring-1 ${fieldErrors.username && touched.username ? 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-100' : 'focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0]'}`}
                />
                {fieldErrors.username && touched.username && <p className="text-[11px] text-red-500 font-medium ml-1">{fieldErrors.username}</p>}
              </div>

              <div className="space-y-1">
                <Input 
                  name="email"
                  type="email" 
                  placeholder={t('email')} 
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`h-12 border-slate-200 rounded-lg focus-visible:ring-1 ${fieldErrors.email && touched.email ? 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-100' : 'focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0]'}`}
                />
                {fieldErrors.email && touched.email && <p className="text-[11px] text-red-500 font-medium ml-1">{fieldErrors.email}</p>}
              </div>
              
              <div className="space-y-1 relative">
                <Input 
                  name="password"
                  type={showPassword ? 'text' : 'password'} 
                  placeholder={t('password')} 
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`h-12 border-slate-200 pr-10 rounded-lg focus-visible:ring-1 ${fieldErrors.password && touched.password ? 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-100' : 'focus-visible:ring-[#5624d0]/20 focus-visible:border-[#5624d0]'}`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[14px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {fieldErrors.password && touched.password && <p className="text-[11px] text-red-500 font-medium ml-1">{fieldErrors.password}</p>}
              </div>

              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{t('password_requirements')}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                   <PasswordRequirement label={t('pwd_min_chars')} met={pwdValidation.length} />
                   <PasswordRequirement label={t('pwd_upper')} met={pwdValidation.hasUpper} />
                   <PasswordRequirement label={t('pwd_number')} met={pwdValidation.hasNumber} />
                   <PasswordRequirement label={t('pwd_special')} met={pwdValidation.hasSpecial} />
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                 <input type="checkbox" id="offers" className="mt-1 accent-[#5624d0] w-4 h-4 rounded cursor-pointer" />
                 <label htmlFor="offers" className="text-[11px] text-slate-500 leading-tight cursor-pointer">
                    I want to receive special offers, personalized recommendations, and learning tips from EduStream.
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
                    {t('creating_account')}
                  </>
                ) : (
                  t('register_btn')
                )}
              </Button>
              
              <p className="text-[10px] text-slate-500 text-center px-4 leading-relaxed">
                 By signing up, you agree to our <Link href="#" className="underline hover:text-indigo-600 transition-colors">Terms of Use</Link> and <Link href="#" className="underline hover:text-indigo-600 transition-colors">Privacy Policy</Link>.
              </p>
            </form>

            <div className="text-center space-y-6 pt-2">
               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                     <span className="w-full border-t border-slate-100"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                     <span className="bg-white px-2 text-slate-400 font-bold uppercase tracking-wider">{t('other_signup')}</span>
                  </div>
               </div>

               <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={handleGoogleLogin}
                    className="w-14 h-14 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                  >
                     <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                  </button>
                  <button className="w-14 h-14 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                     <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-6 h-6" alt="Facebook" />
                  </button>
               </div>
            </div>


            <div className="pt-6 border-t border-slate-100 text-center">
               <p className="text-sm text-slate-600 font-medium">
                  {t('have_account')}{' '}
                  <Link href="/login" className="text-[#5624d0] hover:underline font-semibold transition-all">
                     {t('login_btn')}
                  </Link>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

