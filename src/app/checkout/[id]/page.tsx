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
      <CheckoutForm course={course} />
    </div>
  );
}
