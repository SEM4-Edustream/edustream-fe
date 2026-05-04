"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Settings2, 
  HelpCircle, 
  MoreVertical,
  GripVertical,
  Pencil,
  Trash2,
  FileText,
  Video,
  Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { courseService, CourseSummary, CourseModuleResponse } from '@/services/courseService';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import LessonItem from '@/components/features/tutor-dashboard/LessonItem';

export default function CurriculumPage() {
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [addingLessonToModule, setAddingLessonToModule] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourseDetail(courseId);
      setCourse(data);
    } catch (error) {
      console.error('Failed to fetch course details', error);
      toast.error('Failed to load course curriculum');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const onDragEnd = (result: DropResult) => {
    console.log('Drag ended:', result);
    toast.info('Reordering feature is being updated with backend...');
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    
    try {
      const orderIndex = course?.modules?.length || 0;
      const newModule = await courseService.addModule(courseId, {
        title: newModuleTitle,
        orderIndex
      });
      
      setCourse((prev) => prev ? {
        ...prev,
        modules: [...(prev.modules || []), { ...newModule, lessons: [] }]
      } : null);
      
      setNewModuleTitle('');
      setIsAddingModule(false);
      toast.success('Module added successfully');
    } catch (error) {
      toast.error('Failed to add module');
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!newLessonTitle.trim()) return;

    try {
      const module = course?.modules?.find(m => m.id === moduleId);
      const orderIndex = module?.lessons?.length || 0;
      
      const newLesson = await courseService.addLesson(moduleId, {
        title: newLessonTitle,
        type: 'VIDEO', // Default type
        orderIndex
      });

      setCourse((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          modules: prev.modules?.map(m => m.id === moduleId ? {
            ...m,
            lessons: [...(m.lessons || []), newLesson]
          } : m)
        };
      });

      setNewLessonTitle('');
      setAddingLessonToModule(null);
      toast.success('Lesson added successfully');
    } catch (error) {
      toast.error('Failed to add lesson');
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-2 border-[#5624d0] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#1c1d1f]">Curriculum</h2>
            <p className="text-sm text-slate-500">Start putting together your course by creating sections, lectures and quizzes.</p>
         </div>
         <Button variant="outline" className="font-bold gap-2 self-start md:self-auto border-slate-300">
            <Plus className="w-4 h-4" /> Bulk Upload
         </Button>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg space-y-6 shadow-sm">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="modules" type="module">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                {course?.modules?.map((module, index) => (
                  <Draggable key={module.id} draggableId={module.id} index={index}>
                    {(provided) => (
                      <div 
                         ref={provided.innerRef} 
                         {...provided.draggableProps}
                         className="bg-white border border-slate-200 group rounded-sm overflow-hidden"
                      >
                        {/* Module Header */}
                        <div className="p-4 flex items-center justify-between bg-white border-b border-slate-100">
                           <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                 <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                              </div>
                              <span className="font-bold text-xs uppercase tracking-tighter text-slate-400">Section {index + 1}:</span>
                              <div className="flex items-center gap-2">
                                 <Layout className="w-4 h-4 text-slate-400" />
                                 <span className="font-bold text-[#1c1d1f]">{module.title}</span>
                                 <button className="p-1 hover:bg-slate-50 rounded transition-all opacity-0 group-hover:opacity-100">
                                    <Pencil className="w-3.5 h-3.5 text-slate-400" />
                                 </button>
                              </div>
                           </div>
                           <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4 text-slate-400" /></Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                           </div>
                        </div>

                        {/* Lessons List */}
                        <div className="p-4 space-y-4 bg-slate-50/30">
                           {module.lessons && module.lessons.length > 0 ? (
                             <div className="space-y-3">
                               {module.lessons.map((lesson, lIndex) => (
                                 <LessonItem 
                                   key={lesson.id}
                                   lesson={lesson}
                                   moduleId={module.id}
                                   index={lIndex}
                                   onRefresh={fetchCourse}
                                 />
                               ))}
                             </div>
                           ) : (
                             <div className="flex items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-md bg-white/50 text-xs font-bold text-slate-400 italic ml-8">
                                No lectures added yet.
                             </div>
                           )}

                           {addingLessonToModule === module.id ? (
                              <div className="bg-white border border-slate-200 p-5 space-y-4 mt-2 ml-8 rounded-md shadow-md animate-in slide-in-from-top-2 duration-300 border-l-4 border-l-[#1c1d1f]">
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#1c1d1f] uppercase tracking-wider">New Lecture:</label>
                                    <input 
                                      autoFocus
                                      placeholder="Enter a title"
                                      className="w-full text-sm p-2.5 border border-slate-300 rounded focus:border-[#1c1d1f] outline-none transition-colors"
                                      value={newLessonTitle}
                                      onChange={(e) => setNewLessonTitle(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleAddLesson(module.id)}
                                    />
                                 </div>
                                 <div className="flex justify-end items-center gap-4 pt-1">
                                    <Button variant="ghost" size="sm" className="font-bold hover:bg-transparent px-0 text-slate-600 hover:text-[#1c1d1f]" onClick={() => {setAddingLessonToModule(null); setNewLessonTitle('');}}>Cancel</Button>
                                    <Button size="sm" className="bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold h-10 px-6 rounded-none" onClick={() => handleAddLesson(module.id)}>Add Lecture</Button>
                                 </div>
                              </div>
                           ) : (
                             <Button 
                                onClick={() => setAddingLessonToModule(module.id)}
                                variant="outline" 
                                size="sm" 
                                className="ml-8 border-dashed font-bold gap-2 text-[#5624d0] hover:text-[#5624d0] border-[#5624d0]/30 hover:border-[#5624d0] hover:bg-[#5624d0]/5"
                             >
                                <Plus className="w-4 h-4" /> Curriculum Item
                             </Button>
                           )}
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

        {isAddingModule ? (
          <div className="bg-white border border-slate-200 p-6 space-y-4 shadow-xl rounded-md animate-in zoom-in-95 border-l-4 border-l-[#1c1d1f]">
             <div className="space-y-2">
                <label className="text-sm font-bold text-[#1c1d1f]">New Section</label>
                <input 
                  autoFocus
                  placeholder="Enter a title"
                  className="w-full text-sm p-3 border border-slate-300 rounded focus:border-[#1c1d1f] outline-none transition-colors"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                />
             </div>
             <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" className="font-bold text-slate-600" onClick={() => {setIsAddingModule(false); setNewModuleTitle('');}}>Cancel</Button>
                <Button className="bg-[#1c1d1f] hover:bg-slate-800 text-white font-bold h-11 px-8 rounded-none shadow-lg" onClick={handleAddModule}>Add Section</Button>
             </div>
          </div>
        ) : (
          <Button 
            onClick={() => setIsAddingModule(true)}
            className="flex items-center gap-2 bg-white border-2 border-dashed border-slate-300 text-[#1c1d1f] font-bold hover:bg-white hover:border-[#1c1d1f] py-7 px-8 w-full group transition-all"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
            <span>Add Section</span>
          </Button>
        )}
      </div>
      
      <div className="p-6 bg-[#f7f9fa] border border-slate-200 flex gap-5 items-start rounded-lg">
         <div className="bg-white p-3 rounded-full shadow-sm border border-slate-100">
            <HelpCircle className="w-6 h-6 text-[#1c1d1f]" />
         </div>
         <div className="space-y-1">
            <h4 className="font-bold text-[#1c1d1f]">Curriculum Guidelines</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
               Each section should have at least 1 lecture. Aim for 5-7 minutes per lecture for maximum engagement. 
               Mix video content with reading materials and quizzes to provide a well-rounded learning experience.
            </p>
         </div>
      </div>
    </div>
  );
}
