"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { courseService, CategoryResponse } from '@/services/courseService';
import { toast } from 'sonner';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  subtitle: z.string().max(160, 'Subtitle is too long').optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Please select a category'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT', 'ALL_LEVELS'] as const, {
    message: 'Please select a level',
  }),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      categoryId: '',
      level: 'BEGINNER',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await courseService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (values: CourseFormValues) => {
    try {
      setIsSubmitting(true);
      const newCourse = await courseService.createCourse({
        title: values.title,
        subtitle: values.subtitle,
        categoryId: values.categoryId,
        level: values.level,
        price: 0, // Default price
        description: '', // Initial empty description
      });

      if (newCourse && newCourse.id) {
        toast.success('Course created successfully!');
        // Redirect to the new full-screen editor page
        router.push(`/tutor/course/${newCourse.id}/curriculum`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 flex items-center px-8 justify-between">
        <Link href="/tutor/dashboard" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#5624d0] transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="text-sm font-medium text-slate-400">Step 1 of 2</div>
      </header>

      <main className="max-w-2xl mx-auto pt-16 px-6 pb-20">
        <div className="space-y-2 mb-10 text-center">
            <h1 className="text-3xl font-bold text-[#1c1d1f]">How about a working title?</h1>
            <p className="text-slate-600">It's ok if you can't think of a good title now. You can change it later.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Course Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Learn React from Scratch" 
                      className="h-14 text-lg border-slate-400 focus:border-black rounded-none transition-all placeholder:text-slate-300"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500">
                    Your title should be catchy and informative.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Course Subtitle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Build production-ready apps with React and Next.js"
                      className="h-14 text-lg border-slate-400 focus:border-black rounded-none transition-all placeholder:text-slate-300"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500">
                    Short summary shown below your course title in listings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">What category best fits the knowledge you'll share?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 text-lg border-slate-400 focus:border-black rounded-none transition-all">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-slate-500">
                    If you're not sure, you can change it later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Target student level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 text-lg border-slate-400 focus:border-black rounded-none transition-all">
                        <SelectValue placeholder="Choose a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="EXPERT">Expert</SelectItem>
                      <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-slate-500">
                    Who is this course for?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-8 flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="h-14 px-10 bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold text-lg rounded-none transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-16 p-6 bg-slate-50 border border-slate-100 flex gap-4 items-start rounded-lg">
           <Info className="w-6 h-6 text-[#5624d0] shrink-0 mt-0.5" />
           <div className="space-y-1">
              <h4 className="font-bold text-[#1c1d1f]">Not sure where to start?</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                 Check out our <Link href="#" className="text-[#5624d0] underline font-medium">Tutor Guide</Link> for tips on how to create a high-quality course that students will love.
              </p>
           </div>
        </div>
      </main>
    </div>
  );
}
