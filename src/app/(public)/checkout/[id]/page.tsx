import React from 'react';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/services/courseService';
import { Metadata } from 'next';
import CheckoutForm from '@/components/features/checkout/CheckoutForm';

interface CheckoutPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) return { title: 'Checkout - EduStream' };
  
  return {
    title: `Checkout - ${course.title} | EduStream`,
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="font-extrabold text-2xl tracking-tighter text-indigo-600">
            Edu<span className="text-slate-900">Stream</span>
          </a>
          <a href={`/courses/${course.id}`} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            Cancel
          </a>
        </div>
      </div>
      <CheckoutForm course={course} />
    </div>
  );
}
