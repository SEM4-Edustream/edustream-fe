// src/services/courseService.ts
import { ApiResponse, Course, PaginatedResponse } from '@/types/course';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Service specifically designed to be called from Server Components
 * Native fetch is used here to respect Next.js caching algorithms.
 */
export async function getPublicCourses(size: number = 6): Promise<Course[]> {
  try {
    const res = await fetch(`${API_URL}/api/courses?size=${size}`, {
      // next: { revalidate: 60 } // Optional: Re-fetch every 60s (ISR)
      cache: 'no-store', // Always fetch fresh data for dynamic catalog
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch courses. Status: ${res.status}`);
    }

    const data: ApiResponse<PaginatedResponse<Course>> = await res.json();
    
    if (data.result && data.result.content) {
      return data.result.content;
    }
    
    return [];
  } catch (error) {
    console.error('[CourseService] Error fetching public courses:', error);
    return [];
  }
}

/**
 * Service to Search and Paginate courses dynamically via URL params
 * Used for the Marketplace page to perform Server-Side Filtering.
 */
export async function searchCourses(searchParams: { keyword?: string, page?: string, size?: string, sort?: string }): Promise<PaginatedResponse<Course> | null> {
  try {
    const params = new URLSearchParams();
    if (searchParams.keyword) params.append('keyword', searchParams.keyword);
    if (searchParams.page) params.append('page', searchParams.page);
    params.append('size', searchParams.size || '12');
    
    // Sort logic mapping to backend
    if (searchParams.sort) {
      if (searchParams.sort === 'price_asc') params.append('sort', 'price,asc');
      if (searchParams.sort === 'price_desc') params.append('sort', 'price,desc');
    }

    const res = await fetch(`${API_URL}/api/courses?${params.toString()}`, {
      cache: 'no-store', // Crucial for dynamic filters
    });

    if (!res.ok) {
        throw new Error(`Search failed. Status: ${res.status}`);
    }

    const data: ApiResponse<PaginatedResponse<Course>> = await res.json();
    return data.result || null;
  } catch (error) {
    console.error('[CourseService] Error searching courses:', error);
    return null;
  }
}
