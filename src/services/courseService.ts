import api from '@/lib/api';

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subCategories?: CategoryResponse[];
}

export interface CourseModuleResponse {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  lessons?: LessonResponse[];
}

export interface LessonResponse {
  id: string;
  title: string;
  content?: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ';
  videoUrl?: string;
  durationSeconds?: number;
  orderIndex: number;
}

export interface CourseSummary {
  id: string;
  tutorProfileId?: string;
  tutorName?: string;
  title: string;
  subtitle?: string;
  description?: string;
  language?: string;
  level?: string;
  category?: CategoryResponse;
  learningObjectives?: string[];
  prerequisites?: string[];
  targetAudiences?: string[];
  thumbnailUrl?: string;
  price?: number;
  status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'SUSPENDED';
  averageRating?: number;
  reviewCount?: number;
  modules?: CourseModuleResponse[];
}

export interface PageMeta<T> {
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  content: T[];
}

type ApiResponse<T> = {
  code?: number;
  message?: string;
  result?: T;
};

function unwrapResult<T>(payload: T | ApiResponse<T>) {
  if (payload && typeof payload === 'object' && 'result' in payload) {
    return (payload as ApiResponse<T>).result;
  }
  return payload as T;
}

function normalizeCourse(course: CourseSummary): CourseSummary {
  if (!course) return course;
  
  const DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
  const INVALID_DEMO_URL = "https://link-anh-bia-demo.com";

  return {
    ...course,
    thumbnailUrl: (course.thumbnailUrl === INVALID_DEMO_URL || !course.thumbnailUrl) 
      ? DEFAULT_THUMBNAIL 
      : course.thumbnailUrl
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
  const INVALID_DEMO_URL = "https://link-anh-bia-demo.com";
  
  return {
    ...enrollment,
    courseThumbnail: (enrollment.courseThumbnail === INVALID_DEMO_URL || !enrollment.courseThumbnail)
      ? DEFAULT_THUMBNAIL
      : enrollment.courseThumbnail
  };
}

export const courseService = {
  getPublishedCourses: async (params?: { keyword?: string; page?: number; size?: number; sort?: string[] }): Promise<PageMeta<CourseSummary>> => {
    const response = await api.get<any>('/api/courses', { params });
    const data = (unwrapResult(response) as any) ?? {
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 0,
      first: true,
      last: true,
      empty: true,
      content: [],
    };
    return normalizePage(data);
  },

  getPublishedCourseDetail: async (id: string): Promise<CourseSummary | null> => {
    try {
      const response = await api.get<any>(`/api/courses/${id}`);
      const course = unwrapResult(response) as any;
      return course ? normalizeCourse(course) : null;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getMyTutorCourses: async (params?: { status?: string; page?: number; size?: number; sort?: string }): Promise<PageMeta<CourseSummary>> => {
    const response = await api.get<any>('/api/tutor-courses', { params });
    return normalizePage(unwrapResult(response) as any);
  },

  getCourseDetail: async (id: string): Promise<CourseSummary> => {
    const response = await api.get<any>(`/api/tutor-courses/${id}`);
    return normalizeCourse(unwrapResult(response) as any);
  },

  getCategories: async (): Promise<CategoryResponse[]> => {
    const response = await api.get<any>('/api/categories');
    return (unwrapResult(response) as any) ?? [];
  },

  createCourse: async (payload: any): Promise<CourseSummary> => {
    const response = await api.post<any>('/api/tutor-courses', payload);
    return unwrapResult(response) as any;
  },

  updateCourse: async (id: string, payload: any): Promise<CourseSummary> => {
    const response = await api.put<any>(`/api/tutor-courses/${id}`, payload);
    return unwrapResult(response) as any;
  },

  addModule: async (courseId: string, payload: { title: string; orderIndex: number }): Promise<CourseModuleResponse> => {
    const response = await api.post<any>(`/api/tutor-courses/${courseId}/modules`, payload);
    return unwrapResult(response) as any;
  },

  addLesson: async (moduleId: string, payload: any): Promise<LessonResponse> => {
    const response = await api.post<any>(`/api/tutor-courses/modules/${moduleId}/lessons`, payload);
    return unwrapResult(response) as any;
  },

  updateLesson: async (moduleId: string, lessonId: string, payload: any): Promise<LessonResponse> => {
    const response = await api.put<any>(`/api/tutor-courses/modules/${moduleId}/lessons/${lessonId}`, payload);
    return unwrapResult(response) as any;
  },

  deleteLesson: async (moduleId: string, lessonId: string): Promise<void | any> => {
    const response = await api.delete<any>(`/api/tutor-courses/modules/${moduleId}/lessons/${lessonId}`);
    return unwrapResult(response) as any;
  },

  submitCourse: async (id: string): Promise<CourseSummary> => {
    const response = await api.post<any>(`/api/tutor-courses/${id}/submit`);
    return unwrapResult(response) as any;
  },

  checkEnrollment: async (courseId: string): Promise<boolean> => {
    try {
      const response = await api.get<any>('/api/student/enrollments/my-courses');
      const enrollments = unwrapResult(response) as unknown as any[];
      return enrollments.some(e => e.courseId === courseId);
    } catch (error) {
      return false;
    }
  },

  getMyEnrollments: async (): Promise<any[]> => {
    const response = await api.get<any>('/api/student/enrollments/my-courses');
    const data = unwrapResult(response) as unknown as any[];
    return (data || []).map(normalizeEnrollment);
  },

  completeLesson: async (lessonId: string): Promise<void> => {
    const response = await api.post<any>(`/api/progress/lessons/${lessonId}/complete`);
    return unwrapResult(response) as any;
  },

  getCompletedLessons: async (courseId: string): Promise<string[]> => {
    const response = await api.get<any>(`/api/progress/courses/${courseId}`);
    return unwrapResult(response) as unknown as string[];
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
