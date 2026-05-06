"use client";

import { Suspense } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SuccessLogic() {
  const t = useTranslations('Payment');
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 text-center max-w-lg w-full">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">{t('success_title')}</h1>
      <p className="text-slate-600 mb-8 leading-relaxed">
        {t('success_subtitle')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {courseId ? (
          <Button 
            onClick={() => router.push(`/courses/${courseId}`)}
            className="h-12 px-8 font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center"
          >
            {t('go_to_course')} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={() => router.push('/')}
            className="h-12 px-8 font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center"
          >
            {t('view_my_learning')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 text-center max-w-lg w-full animate-pulse">
          <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-6"></div>
          <div className="h-8 bg-slate-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-full mx-auto mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6 mx-auto mb-8"></div>
          <div className="h-12 bg-slate-200 rounded-xl w-40 mx-auto"></div>
        </div>
      }>
        <SuccessLogic />
      </Suspense>
    </div>
  );
}
