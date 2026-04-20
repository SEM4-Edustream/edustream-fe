// src/types/course.ts

export interface Course {
  id: string;
  tutorProfileId?: string;
  tutorName?: string;
  title: string;
  subtitle?: string;
  description?: string;
  language?: string;
  level?: string;
  category?: string;
  learningObjectives?: string[];
  prerequisites?: string[];
  targetAudiences?: string[];
  price?: number;
  thumbnailUrl?: string;
  status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'SUSPENDED';
  averageRating?: number;
  reviewCount?: number;
}

export interface PaginatedResponse<T> {
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
