"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, Info, Trash2, GripVertical } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { courseService, CourseSummary } from '@/services/courseService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const stringObjectSchema = z.object({ value: z.string().max(300, 'Keep it concise (max 300 chars)') });

const goalsSchema = z.object({
  learningObjectives: z.array(stringObjectSchema).min(4, 'You must provide at least 4 learning objectives.'),
  prerequisites: z.array(stringObjectSchema),
  targetAudiences: z.array(stringObjectSchema),
});

type GoalsFormValues = z.infer<typeof goalsSchema>;

function DraggableFieldList({ 
  name, 
  control, 
  register, 
  errors,
  title,
  description,
  placeholder,
  minItems = 0,
  minInitialFields = 1,
}: { 
  name: 'learningObjectives' | 'prerequisites' | 'targetAudiences';
  control: any;
  register: any;
  errors: any;
  title: string;
  description: string;
  placeholder: string;
  minItems?: number;
  minInitialFields?: number;
}) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name,
  });

  useEffect(() => {
    // If fewer than minInitialFields exist, pad them out
    if (fields.length < minInitialFields) {
      const needed = minInitialFields - fields.length;
      Array.from({ length: needed }).forEach(() => append({ value: '' }, { shouldFocus: false }));
    }
  }, [fields.length, minInitialFields, append]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#1c1d1f] mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={name}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.draggableProps}
                      className={cn(
                        "flex items-start gap-3 bg-white p-1 transition-all rounded",
                        snapshot.isDragging && "shadow-lg ring-2 ring-indigo-500/20 z-50"
                      )}
                    >
                      <div className="flex items-center gap-1 w-full relative">
                        <div 
                          {...provided.dragHandleProps} 
                          className="h-10 px-1 flex items-center justify-center cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1">
                          <Input 
                            {...register(`${name}.${index}.value` as const)}
                            placeholder={placeholder}
                            className={cn(
                              "h-10 text-sm border-slate-300 focus-visible:ring-[#1c1d1f]",
                              errors?.[name]?.[index] && "border-red-500 focus-visible:ring-red-500"
                            )}
                            maxLength={300}
                          />
                          {errors?.[name]?.[index]?.value?.message && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors[name][index].value.message}</p>
                          )}
                        </div>

                        {/* Always show delete, but disable if minimum required */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={fields.length <= minItems}
                          className="h-10 w-10 shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 mx-1"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        type="button"
        variant="ghost"
        className="font-bold text-[#5624d0] hover:text-[#401b9c] hover:bg-[#5624d0]/5 flex gap-2 pl-2"
        onClick={() => append({ value: '' })}
      >
        <Plus className="w-4 h-4" /> Add more to your response
      </Button>
      {errors?.[name] && !Array.isArray(errors[name]) && typeof errors[name] === 'object' && errors[name]?.message && (
        <p className="text-red-500 text-sm font-bold mt-2">{errors[name].message}</p>
      )}
    </div>
  );
}

export default function CourseGoalsPage() {
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<GoalsFormValues>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      learningObjectives: [],
      prerequisites: [],
      targetAudiences: [],
    },
    mode: "onBlur"
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const data = await courseService.getCourseDetail(courseId);
        setCourse(data);
        
        // Map the flat strings from backend to our react-hook-form object array structure
        const mapStringsToObjects = (arr?: string[]) => 
          Array.isArray(arr) && arr.length > 0 
            ? arr.map(str => ({ value: str })) 
            : [];
            
        form.reset({
          learningObjectives: mapStringsToObjects(data.learningObjectives),
          prerequisites: mapStringsToObjects(data.prerequisites),
          targetAudiences: mapStringsToObjects(data.targetAudiences),
        });
      } catch (error) {
        console.error('Failed to fetch goals', error);
        toast.error('Could not load course intended learners data.');
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId, form]);

  const onSubmit = async (values: GoalsFormValues) => {
    try {
      setIsSaving(true);
      
      // Filter out empty lines before saving
      const formatPayload = (arr: { value: string }[]) => 
         arr.map(item => item.value.trim()).filter(val => val.length > 0);

      const payload = {
        title: course?.title, // Backend might expect title/category to not be overwritten conditionally
        categoryId: course?.category?.id,
        price: course?.price,
        description: course?.description,
        thumbnailUrl: course?.thumbnailUrl,
        learningObjectives: formatPayload(values.learningObjectives),
        prerequisites: formatPayload(values.prerequisites),
        targetAudiences: formatPayload(values.targetAudiences),
      };

      await courseService.updateCourse(courseId, payload);
      window.dispatchEvent(new Event('course-updated'));
      toast.success('Course goals updated successfully.');
    } catch (error: any) {
      console.error(error);
      const isLocked = error.response?.status === 400 && error.response?.data?.message?.includes('Action not allowed');
      if (isLocked) {
         toast.error("Khóa học đã khóa (đang chờ duyệt hoặc đã xuất bản), vui lòng liên hệ Admin để thay đổi.");
      } else {
         toast.error(error.response?.data?.message || 'Failed to save intended learners changes.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="p-8 flex justify-center items-center h-[200px]">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
      <div className="space-y-4 border-b border-slate-100 pb-8">
        <h2 className="text-2xl font-bold text-[#1c1d1f]">Intended learners</h2>
        <p className="text-slate-600 leading-relaxed text-sm max-w-3xl">
          The following descriptions will be publicly visible on your Course Landing Page and will have a direct impact on your course performance. These descriptions will help learners decide if your course is right for them.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          
          <DraggableFieldList
            name="learningObjectives"
            control={form.control}
            register={form.register}
            errors={form.formState.errors}
            minItems={4}
            minInitialFields={4}
            title="What will students learn in your course?"
            description="You must enter at least 4 learning objectives or outcomes that learners can expect to achieve after completing your course."
            placeholder="e.g. Build modern web applications using React"
          />

          <DraggableFieldList
            name="prerequisites"
            control={form.control}
            register={form.register}
            errors={form.formState.errors}
            minItems={0}
            minInitialFields={1}
            title="What are the requirements or prerequisites for taking your course?"
            description="List the required skills, experience, tools or equipment learners should have prior to taking your course. If there are no requirements, use this space as an opportunity to lower the barrier for beginners."
            placeholder="e.g. Basic understanding of HTML and CSS"
          />

          <DraggableFieldList
            name="targetAudiences"
            control={form.control}
            register={form.register}
            errors={form.formState.errors}
            minItems={0}
            minInitialFields={1}
            title="Who is this course for?"
            description="Write a clear description of the intended learners for your course who will find your course content valuable. This will help you attract the right learners to your course."
            placeholder="e.g. Beginners looking to start a career in frontend development"
          />

          {/* Fixed Footer without Dashboard overlap */}
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
                  disabled={isSaving}
                  className="bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold h-12 px-10 rounded-none transition-all shadow-lg active:scale-[0.98]"
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
