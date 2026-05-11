export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subCategories?: CategoryResponse[];
}

export interface LessonResponse {
  id: string;
  title: string;
  content?: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT';
  videoUrl?: string;
  durationSeconds?: number;
  orderIndex: number;
}

export interface CourseModuleResponse {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  lessons?: LessonResponse[];
}

export interface CourseSummary {
  id: string;
  tutorProfileId?: string;
  tutorName?: string;
  tutorAvatar?: string;
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

export type CourseResponse = CourseSummary;

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

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  result?: T;
}
