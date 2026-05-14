"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { courseService, CourseSummary, CategoryResponse } from '@/services/courseService';
import fileService from '@/services/fileService';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const basicsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(2000, 'Description is too long').optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  thumbnailUrl: z.string().optional().or(z.literal('')),
});

type BasicsFormValues = z.infer<typeof basicsSchema>;

export default function CourseBasicsPage() {
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const isLocked = course?.status && course.status !== 'DRAFT';

  const form = useForm<BasicsFormValues>({
    resolver: zodResolver(basicsSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      price: 0,
      thumbnailUrl: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, catData] = await Promise.all([
          courseService.getCourseDetail(courseId),
          courseService.getCategories(),
        ]);
        
        setCourse(courseData);
        setCategories(catData);
        setThumbnailPreview(courseData.thumbnailUrl || null);
        
        form.reset({
          title: courseData.title || '',
          description: courseData.description || '',
          categoryId: courseData.category?.id || '',
          price: courseData.price || 0,
          thumbnailUrl: courseData.thumbnailUrl || '',
        });
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const onThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
    }

    try {
        setIsUploading(true);
        toast.info('Uploading thumbnail to cloud...');
        
        const ext = file.name.split('.').pop();
        const randomName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

        // Get pre-signed URL from backend using VIDEO bucket for public images
        const presigned = await fileService.getPresignedUrl(randomName, file.type, "VIDEO");

        // Upload directly to S3 using fetch instead of axios to avoid unwanted header injections
        const response = await fetch(presigned.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("S3 Upload Failed:", response.status, errorText);
            throw new Error(`S3 Upload Failed: ${response.status} - ${errorText}`);
        }
        
        setThumbnailPreview(presigned.fileUrl);
        form.setValue('thumbnailUrl', presigned.fileUrl);
        toast.success('Thumbnail uploaded successfully');
    } catch (error: any) {
        console.error("Upload error details:", error);
        toast.error('Failed to upload image. Vui lòng kiểm tra console.');
    } finally {
        setIsUploading(false);
    }
  };

  const onSubmit = async (values: BasicsFormValues) => {
    try {
      console.log("Submitting course updates:", values);
      setIsSaving(true);
      await courseService.updateCourse(courseId, values);
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error("Save error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to save settings. Vui lòng kiểm tra lại thông tin.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
      <div className="space-y-1 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-[#1c1d1f]">Course landing page</h2>
        <p className="text-slate-500">Your course landing page is crucial to your success on EduStream. If it's done right, it can also help you gain visibility in search engines like Google.</p>
      </div>

      {/* DEBUG INFO - Will be removed later */}
      <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200 text-xs font-mono whitespace-pre-wrap break-all">
        <strong>DEBUG INFO (Please send this back to AI):</strong><br/>
        - courseData.category: {JSON.stringify(course?.category)}<br/>
        - categories length: {categories.length}<br/>
        - form categoryId value: {form.watch('categoryId')}<br/>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-[#1c1d1f]">Course Title</h3>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} className="h-12 border-slate-300 font-medium focus-visible:ring-[#1c1d1f]" />
                  </FormControl>
                  <FormDescription>Your title should be catchy and informative.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-6">
            <h3 className="text-lg font-bold text-[#1c1d1f]">Course Description</h3>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-[200px] border-slate-300 focus-visible:ring-[#1c1d1f]" 
                      placeholder="Insert your course description" 
                    />
                  </FormControl>
                  <FormDescription>Describe what students will learn and why they should take your course.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="grid lg:grid-cols-2 gap-12 pb-10 border-b border-slate-100">
             <div className="space-y-8">
                <h3 className="text-lg font-bold text-[#1c1d1f]">Basic Info</h3>
                
                <div className="space-y-6">
                   <FormField
                     control={form.control}
                     name="categoryId"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="font-bold text-xs uppercase tracking-wider text-slate-500">Category</FormLabel>
                         <Select 
                           key={categories.length}
                           onValueChange={field.onChange} 
                           value={field.value || undefined}
                         >
                           <FormControl>
                             <SelectTrigger className="h-12 border-slate-300 focus:ring-[#1c1d1f]">
                               <SelectValue placeholder="Select a category" />
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
                         <FormMessage />
                       </FormItem>
                     )}
                   />

                   <FormField
                     control={form.control}
                     name="price"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="font-bold text-xs uppercase tracking-wider text-slate-500">Tier Price (USD)</FormLabel>
                         <FormControl>
                           <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                              <Input type="number" {...field} className="h-12 border-slate-300 pl-8 focus-visible:ring-[#1c1d1f]" />
                           </div>
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#1c1d1f]">Course Image</h3>
                <div className="border border-slate-200 p-1 bg-white shadow-sm relative group aspect-video flex items-center justify-center overflow-hidden rounded-sm">
                   {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   ) : (
                      <div className="bg-slate-50 w-full h-full flex flex-col items-center justify-center gap-3">
                        <ImageIcon className="w-12 h-12 text-slate-200" />
                        <span className="text-xs font-medium text-slate-400">No image uploaded</span>
                      </div>
                   )}
                   <label 
                     onClick={(e) => e.stopPropagation()}
                     className={cn(
                       "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]",
                       isLocked ? "cursor-not-allowed opacity-40 group-hover:opacity-40" : "cursor-pointer"
                    )}>
                       <div className="bg-white text-[#1c1d1f] px-6 py-2.5 text-sm font-bold flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                         {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                         {isUploading ? 'Uploading...' : 'Update Image'}
                       </div>
                       {!isLocked && <input type="file" className="hidden" accept="image/*" onChange={onThumbnailChange} disabled={isUploading} />}
                    </label>
                </div>
                <div className="bg-slate-50 p-4 border-l-4 border-slate-200">
                   <p className="text-xs text-slate-600 leading-relaxed italic">
                      Upload your course image here. It must meet our course image quality standards to be accepted. 
                      Important guidelines: 750x422 pixels; .jpg, .jpeg, .gif, or .png; no text on the image.
                   </p>
                </div>
             </div>
          </section>

          {/* Fixed Footer with layout context awareness */}
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
                  className="bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold h-12 px-10 rounded-none transition-all shadow-lg active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                   {isSaving ? (
                     <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                     </span>
                   ) : 'Save Updates'}
                </Button>
             </div>
          </footer>
        </form>
      </Form>
    </div>
  );
}

