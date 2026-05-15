export * from '@/types/course';

import api from '@/lib/api';
import { 
  CategoryResponse, 
  CourseModuleResponse, 
  LessonResponse, 
  CourseSummary, 
  PageMeta
} from '@/types/course';


function normalizeCourse(course: CourseSummary): CourseSummary {
  if (!course) return course;
  
  const DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

  // Kiểm tra nếu thumbnailUrl trống hoặc chứa link demo không tồn tại
  const isInvalidThumbnail = !course.thumbnailUrl || course.thumbnailUrl.includes('link-anh-bia-demo.com');

  return {
    ...course,
    thumbnailUrl: isInvalidThumbnail ? DEFAULT_THUMBNAIL : course.thumbnailUrl
  };
}

function normalizePage(page: PageMeta<CourseSummary>): PageMeta<CourseSummary> {
  if (!page || !page.content) return page;
  return {
    ...page,
    content: page.content.map(normalizeCourse)
  };
}

function normalizeEnrollment(enrollment: any): any {
  if (!enrollment) return enrollment;
  const DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
  
  const isInvalidThumbnail = !enrollment.courseThumbnail || enrollment.courseThumbnail.includes('link-anh-bia-demo.com');

  return {
    ...enrollment,
    courseThumbnail: isInvalidThumbnail ? DEFAULT_THUMBNAIL : enrollment.courseThumbnail
  };
}

export const courseService = {
  getPublishedCourses: async (params?: { keyword?: string; page?: number; size?: number; sort?: string[] }): Promise<PageMeta<CourseSummary>> => {
    const data = await api.get<any>('/api/courses', { params }) as any;
    const normalizedData = data ?? {
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 0,
      first: true,
      last: true,
      empty: true,
      content: [],
    };
    return normalizePage(normalizedData);
  },

  getPublishedCourseDetail: async (id: string): Promise<CourseSummary | null> => {
    try {
      const course = await api.get<any>(`/api/courses/${id}`) as any;
      return course ? normalizeCourse(course) : null;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getMyTutorCourses: async (params?: { status?: string; page?: number; size?: number; sort?: string }): Promise<PageMeta<CourseSummary>> => {
    const response = await api.get<any>('/api/tutor-courses', { params }) as any;
    return normalizePage(response);
  },

  getCourseDetail: async (id: string): Promise<CourseSummary> => {
    const response = await api.get<any>(`/api/tutor-courses/${id}`) as any;
    return normalizeCourse(response);
  },

  getCategories: async (): Promise<CategoryResponse[]> => {
    const response = await api.get<any>('/api/categories') as any;
    return response ?? [];
  },

  createCourse: async (payload: any): Promise<CourseSummary> => {
    return await api.post<any>('/api/tutor-courses', payload) as any;
  },

  updateCourse: async (id: string, payload: any): Promise<CourseSummary> => {
    return await api.put<any>(`/api/tutor-courses/${id}`, payload) as any;
  },

  addModule: async (courseId: string, payload: { title: string; orderIndex: number }): Promise<CourseModuleResponse> => {
    return await api.post<any>(`/api/tutor-courses/${courseId}/modules`, payload) as any;
  },

  updateModule: async (courseId: string, moduleId: string, payload: { title: string; orderIndex?: number }): Promise<CourseModuleResponse> => {
    return await api.put<any>(`/api/tutor-courses/${courseId}/modules/${moduleId}`, payload) as any;
  },

  deleteModule: async (courseId: string, moduleId: string): Promise<void> => {
    return await api.delete<any>(`/api/tutor-courses/${courseId}/modules/${moduleId}`) as any;
  },

  addLesson: async (moduleId: string, payload: any): Promise<LessonResponse> => {
    return await api.post<any>(`/api/tutor-courses/modules/${moduleId}/lessons`, payload) as any;
  },

  updateLesson: async (moduleId: string, lessonId: string, payload: any): Promise<LessonResponse> => {
    return await api.put<any>(`/api/tutor-courses/modules/${moduleId}/lessons/${lessonId}`, payload) as any;
  },

  deleteLesson: async (moduleId: string, lessonId: string): Promise<void | any> => {
    return await api.delete<any>(`/api/tutor-courses/modules/${moduleId}/lessons/${lessonId}`) as any;
  },

  reorderModules: async (courseId: string, requests: { id: string; orderIndex: number }[]): Promise<void> => {
    await api.put(`/api/tutor-courses/${courseId}/modules/reorder`, requests);
  },

  reorderLessons: async (moduleId: string, requests: { id: string; orderIndex: number }[]): Promise<void> => {
    await api.put(`/api/tutor-courses/modules/${moduleId}/lessons/reorder`, requests);
  },

  submitCourse: async (id: string): Promise<CourseSummary> => {
    return await api.post<any>(`/api/tutor-courses/${id}/submit`) as any;
  },

  checkEnrollment: async (courseId: string): Promise<boolean> => {
    try {
      const enrollments = await api.get<any[]>('/api/student/enrollments/my-courses') as any;
      return (enrollments || []).some((e: any) => e.courseId === courseId);
    } catch (error) {
      return false;
    }
  },

  getMyEnrollments: async (): Promise<any[]> => {
    const data = await api.get<any[]>('/api/student/enrollments/my-courses') as any;
    return (data || []).map((enrollment: any) => normalizeEnrollment(enrollment));
  },

  completeLesson: async (lessonId: string): Promise<void> => {
    return await api.post<any>(`/api/progress/lessons/${lessonId}/complete`) as any;
  },

  getCompletedLessons: async (courseId: string): Promise<string[]> => {
    return await api.get<string[]>(`/api/progress/courses/${courseId}`) as any;
  },
};

export async function getPublicCourses(size = 6): Promise<CourseSummary[]> {
  const page = await courseService.getPublishedCourses({ size });
  return page.content ?? [];
}

export async function searchCourses(searchParams: { keyword?: string; page?: string; size?: string; sort?: string }) {
  const params: { keyword?: string; page?: number; size?: number; sort?: string[] } = {};

  if (searchParams.keyword) params.keyword = searchParams.keyword;
  if (searchParams.page) params.page = Number(searchParams.page) || 0;
  if (searchParams.size) params.size = Number(searchParams.size) || 12;
  if (!searchParams.size) params.size = 12;

  if (searchParams.sort) {
    if (searchParams.sort === 'price_asc') params.sort = ['price,asc'];
    if (searchParams.sort === 'price_desc') params.sort = ['price,desc'];
  }

  return courseService.getPublishedCourses(params);
}

export async function getCourseById(id: string): Promise<CourseSummary | null> {
  return courseService.getPublishedCourseDetail(id);
}
