import api from '@/lib/api';

export interface CourseReviewRequest {
  rating: number;
  comment: string;
}

export interface CourseReviewResponse {
  id: string;
  rating: number;
  comment: string;
  studentName: string;
  studentAvatar: string;
  createdAt: string;
}

export const reviewService = {
  getCourseReviews: async (courseId: string, params?: { page?: number; size?: number }): Promise<any> => {
    return await api.get(`/api/reviews/courses/${courseId}`, { params });
  },

  createReview: async (courseId: string, payload: CourseReviewRequest): Promise<CourseReviewResponse> => {
    const response = await api.post(`/api/reviews/courses/${courseId}`, payload) as any;
    return response.result || response;
  }
};
