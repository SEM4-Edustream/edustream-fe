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
  type: 'VIDEO' | 'READING' | 'QUIZ';
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

export const courseService = {
  getPublishedCourses: async (params?: { keyword?: string; page?: number; size?: number; sort?: string[] }) => {
    const response = await api.get<ApiResponse<PageMeta<CourseSummary>> | PageMeta<CourseSummary>>('/api/courses', {
      params,
    });

    return unwrapResult(response) ?? {
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 0,
      first: true,
      last: true,
      empty: true,
      content: [],
    };
  },

  getPublishedCourseDetail: async (id: string) => {
    try {
      const response = await api.get<ApiResponse<CourseSummary> | CourseSummary>(`/api/courses/${id}`);
      return unwrapResult(response);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getMyTutorCourses: async (params?: { status?: string; page?: number; size?: number; sort?: string }) => {
    const response = await api.get<ApiResponse<PageMeta<CourseSummary>> | PageMeta<CourseSummary>>('/api/tutor-courses', { params });
    return unwrapResult(response);
  },

  getCourseDetail: async (id: string) => {
    const response = await api.get<ApiResponse<CourseSummary> | CourseSummary>(`/api/tutor-courses/${id}`);
    return unwrapResult(response);
  },

  getCategories: async () => {
    const response = await api.get<ApiResponse<CategoryResponse[]> | CategoryResponse[]>('/api/categories');
    return unwrapResult(response) ?? [];
  },

  createCourse: async (payload: any) => {
    const response = await api.post<ApiResponse<CourseSummary> | CourseSummary>('/api/tutor-courses', payload);
    return unwrapResult(response);
  },

  updateCourse: async (id: string, payload: any) => {
    const response = await api.put<ApiResponse<CourseSummary> | CourseSummary>(`/api/tutor-courses/${id}`, payload);
    return unwrapResult(response);
  },

  addModule: async (courseId: string, payload: { title: string; orderIndex: number }) => {
    const response = await api.post<ApiResponse<CourseModuleResponse> | CourseModuleResponse>(`/api/tutor-courses/${courseId}/modules`, payload);
    return unwrapResult(response);
  },

  addLesson: async (moduleId: string, payload: any) => {
    const response = await api.post<ApiResponse<LessonResponse> | LessonResponse>(`/api/tutor-courses/modules/${moduleId}/lessons`, payload);
    return unwrapResult(response);
  },

  updateLesson: async (moduleId: string, lessonId: string, payload: any) => {
    const response = await api.put<ApiResponse<LessonResponse> | LessonResponse>(`/api/tutor-courses/modules/${moduleId}/lessons/${lessonId}`, payload);
    return unwrapResult(response);
  },

  deleteLesson: async (moduleId: string, lessonId: string) => {
    const response = await api.delete<ApiResponse<void> | void>(`/api/tutor-courses/modules/${moduleId}/lessons/${lessonId}`);
    return unwrapResult(response);
  },

  submitCourse: async (id: string) => {
    const response = await api.post<ApiResponse<CourseSummary> | CourseSummary>(`/api/tutor-courses/${id}/submit`);
    return unwrapResult(response);
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
