"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, PartyPopper } from 'lucide-react';
import { courseService, CourseSummary } from '@/services/courseService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const messagesSchema = z.object({
  welcomeMessage: z.string().max(2000, 'Message is too long').optional().or(z.literal('')),
  congratulationsMessage: z.string().max(2000, 'Message is too long').optional().or(z.literal('')),
});

type MessagesFormValues = z.infer<typeof messagesSchema>;

export default function CourseMessagesPage() {
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isLocked = course?.status && course.status !== 'DRAFT';

  const form = useForm<MessagesFormValues>({
    resolver: zodResolver(messagesSchema) as any,
    defaultValues: {
      welcomeMessage: '',
      congratulationsMessage: '',
    },
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseDetail(courseId);
        setCourse(data);
        form.reset({
          welcomeMessage: data.welcomeMessage || '',
          congratulationsMessage: data.congratulationsMessage || '',
        });
      } catch (error) {
        console.error('Failed to fetch course detail', error);
      }
    };
    fetchCourse();
  }, [courseId, form]);

  const onSubmit = async (values: MessagesFormValues) => {
    try {
      setIsSaving(true);
      await courseService.updateCourse(courseId, {
        ...values,
        title: course?.title || '', // Keep existing title
      });
      toast.success('Course messages updated successfully');
      window.dispatchEvent(new Event('course-updated'));
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || 'Failed to save messages');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
      <div className="space-y-1 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-[#1c1d1f]">Course Messages</h2>
        <p className="text-slate-500">Write messages to your students (optional) that will be sent automatically when they join or complete your course.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1c1d1f]">Welcome Message</h3>
                <p className="text-sm text-slate-500">Sent to students when they enroll in your course.</p>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="welcomeMessage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-[150px] border-slate-300 focus-visible:ring-[#1c1d1f] rounded-none resize-none" 
                      placeholder="e.g. Welcome to the course! I'm excited to have you here..." 
                      disabled={isLocked}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1c1d1f]">Congratulations Message</h3>
                <p className="text-sm text-slate-500">Sent to students when they complete your course.</p>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="congratulationsMessage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-[150px] border-slate-300 focus-visible:ring-[#1c1d1f] rounded-none resize-none" 
                      placeholder="e.g. Congratulations on finishing the course! You've made great progress..." 
                      disabled={isLocked}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          {/* Footer Save Button */}
          <footer className="fixed bottom-0 left-0 lg:left-64 right-0 h-20 bg-white border-t border-slate-200 z-40">
            <div className="max-w-4xl mx-auto h-full px-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  isSaving ? "bg-amber-400" : "bg-slate-300"
                )} />
                <span className="text-sm font-bold text-slate-500">
                  {isSaving ? 'Saving changes...' : 'All changes saved'}
                </span>
              </div>
              <Button 
                type="submit" 
                disabled={isSaving || isLocked}
                className="bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold h-12 px-10 rounded-none transition-all shadow-lg active:scale-[0.98] disabled:bg-slate-300"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </span>
                ) : 'Save Changes'}
              </Button>
            </div>
          </footer>
        </form>
      </Form>
    </div>
  );
}
