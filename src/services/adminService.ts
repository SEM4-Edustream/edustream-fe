import axiosInstance from "@/lib/axios";
import { TutorProfileResponse } from "@/services/tutorService";
import { CourseSummary, PageMeta } from "@/types/course";

export interface VerificationReviewRequest {
  action: 'APPROVED' | 'REJECTED';
  reviewComment: string;
}

const adminService = {
  getTutorProfiles: async (status: string = 'PENDING'): Promise<TutorProfileResponse[]> => {
    // Backend: GET /api/admin/tutor-profiles?status=PENDING
    return await axiosInstance.get<any, TutorProfileResponse[]>(`/api/admin/tutor-profiles`, {
      params: { status }
    });
  },

  getAllCourses: async (params: { status?: string; page?: number; size?: number; sort?: string } = {}): Promise<PageMeta<CourseSummary>> => {
    // Backend: GET /api/admin/courses?status=...&page=...&size=...&sort=...
    return await axiosInstance.get<any, PageMeta<CourseSummary>>(`/api/admin/courses`, { params });
  },

  getTutorDetail: async (id: string): Promise<TutorProfileResponse> => {
    // Backend: GET /api/admin/tutor-profiles/{id}
    return await axiosInstance.get<any, TutorProfileResponse>(`/api/admin/tutor-profiles/${id}`);
  },

  reviewTutor: async (id: string, data: VerificationReviewRequest): Promise<any> => {
    // Backend: POST /api/admin/tutor-profiles/{id}/verify
    return await axiosInstance.post(`/api/admin/tutor-profiles/${id}/verify`, data);
  },

  getPendingCourses: async (): Promise<CourseSummary[]> => {
    // Backend: GET /api/admin/courses/pending
    return await axiosInstance.get<any, CourseSummary[]>(`/api/admin/courses/pending`);
  },

  getCourseDetail: async (id: string): Promise<CourseSummary> => {
    // Backend: GET /api/admin/courses/{id}
    return await axiosInstance.get<any, CourseSummary>(`/api/admin/courses/${id}`);
  },

  verifyCourse: async (id: string, isApprove: boolean): Promise<CourseSummary> => {
    // Backend: POST /api/admin/courses/{id}/verify?isApprove=true/false
    return await axiosInstance.post<any, CourseSummary>(`/api/admin/courses/${id}/verify`, null, {
      params: { isApprove }
    });
  },

  getUsers: async (role: string): Promise<any[]> => {
    // Backend: GET /api/admin/users?role=...
    const response = await axiosInstance.get<any, any>(`/api/admin/users`, {
      params: { role }
    });
    return response.result || response;
  },

  getAnalyticsOverview: async (): Promise<any> => {
    return await axiosInstance.get<any, any>(`/api/admin/analytics/overview`);
  },

  getRevenueChart: async (days: number = 30): Promise<any[]> => {
    return await axiosInstance.get<any, any[]>(`/api/admin/analytics/revenue-chart`, {
      params: { days }
    });
  },

  getAuditLogs: async (page: number = 0, size: number = 10): Promise<PageMeta<any>> => {
    return await axiosInstance.get<any, PageMeta<any>>(`/api/admin/audit-logs`, {
      params: { page, size }
    });
  },

  getEnrollments: async (page: number = 0, size: number = 10): Promise<PageMeta<import('@/types/admin').AdminEnrollmentDetailResponse>> => {
    return await axiosInstance.get<any, PageMeta<import('@/types/admin').AdminEnrollmentDetailResponse>>(`/api/admin/analytics/enrollments`, {
      params: { page, size }
    });
  },

  getCourseMetrics: async (page: number = 0, size: number = 10): Promise<PageMeta<import('@/types/admin').AdminCourseMetricResponse>> => {
    return await axiosInstance.get<any, PageMeta<import('@/types/admin').AdminCourseMetricResponse>>(`/api/admin/analytics/course-metrics`, {
      params: { page, size }
    });
  }
};

export default adminService;
