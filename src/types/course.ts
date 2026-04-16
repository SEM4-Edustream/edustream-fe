// src/types/course.ts

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number | null;
  thumbnailUrl: string;
  averageRating: number | null;
  reviewCount: number;
  tutorName: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
}
