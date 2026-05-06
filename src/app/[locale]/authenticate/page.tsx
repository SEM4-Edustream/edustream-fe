"use client";

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function AuthenticatePage() {
  const t = useTranslations('Authenticate');
  const router = useRouter();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'syncing' | 'success' | 'error'>('loading');

  useEffect(() => {
    let handled = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'session:', !!session);

      if (handled) return;
      
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        handled = true;
        const supabaseToken = session.access_token;
        const user = session.user;

        console.log('User authenticated:', user.email);
        setStatus('syncing');
        
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
          
          const response = await axios.post(`${apiUrl}/auth/outbound/authentication`, 
            {
              token: supabaseToken,
              email: user.email,
              fullName: user.user_metadata?.full_name || user.user_metadata?.name || '',
              avatarUrl: user.user_metadata?.avatar_url || '',
            }, 
            { timeout: 5000 }
          );

          // Get the INTERNAL JWT from backend (HS512 format our backend understands)
          const internalToken = response.data?.result?.token;
          const isNewUser = response.data?.result?.isNewUser;
          
          if (internalToken) {
            console.log('Got internal JWT from backend. isNewUser:', isNewUser);
            
            // Use AuthContext.login() so the entire app state updates immediately
            // This avoids needing a page reload for the profile icon to appear
            await login(internalToken, {
              id: '',
              username: user.email?.split('@')[0] || '',
              role: 'STUDENT',
              email: user.email || '',
              avatarUrl: user.user_metadata?.avatar_url || '',
            });
            
            setStatus('success');

            // login() already calls router.push('/') internally,
            // but for new users we override that redirect
            if (isNewUser) {
              router.push('/profile?setup=true');
            }
          } else {
            throw new Error('Backend did not return an internal token');
          }
          
        } catch (err) {
          console.error('Backend sync error:', err);
          setStatus('error');
          setTimeout(() => {
            router.push(`/login?error=${t('auth_failed')}`);
          }, 1500);
        }
      }
    });

    // Timeout fallback
    const timeout = setTimeout(async () => {
      if (handled) return;
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.error('Session timeout - redirecting to login');
        router.push(`/login?error=${t('session_timeout')}`);
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-sm w-full mx-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: status === 'error' ? '#fee2e2' : '#ede9ff' }}>
          {status === 'success' ? (
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          ) : status === 'error' ? (
            <span className="text-2xl">✕</span>
          ) : (
            <Loader2 className="w-8 h-8 text-[#5624d0] animate-spin" />
          )}
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-800">
            {status === 'loading' && t('status.loading')}
            {status === 'syncing' && t('status.syncing')}
            {status === 'success' && t('status.success')}
            {status === 'error' && t('status.error')}
          </h1>
          <p className="text-slate-500 text-sm">
            {status === 'loading' && t('status.loading_sub')}
            {status === 'syncing' && t('status.syncing_sub')}
            {status === 'success' && t('status.success_sub')}
            {status === 'error' && t('status.error_sub')}
          </p>
        </div>
      </div>
    </div>
  );
}
