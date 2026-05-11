import axiosInstance from "@/lib/axios";
import { TutorProfileResponse } from "@/services/tutorService";

export interface VerificationReviewRequest {
  action: 'APPROVED' | 'REJECTED';
  reviewComment: string;
}

const adminService = {
  getTutorProfiles: async (status: string = 'PENDING') => {
    // Backend: GET /api/admin/tutor-profiles?status=PENDING
    return await axiosInstance.get(`/api/admin/tutor-profiles`, {
      params: { status }
    });
  },

  getAllCourses: async (params: { status?: string; page?: number; size?: number; sort?: string } = {}) => {
    // Backend: GET /api/admin/courses?status=...&page=...&size=...&sort=...
    return await axiosInstance.get(`/api/admin/courses`, { params });
  },

  getTutorDetail: async (id: string) => {
    // Backend: GET /api/admin/tutor-profiles/{id}
    return await axiosInstance.get(`/api/admin/tutor-profiles/${id}`);
  },

  reviewTutor: async (id: string, data: VerificationReviewRequest) => {
    // Backend: POST /api/admin/tutor-profiles/{id}/verify
    return await axiosInstance.post(`/api/admin/tutor-profiles/${id}/verify`, data);
  },

  getPendingCourses: async () => {
    // Backend: GET /api/admin/courses/pending
    return await axiosInstance.get(`/api/admin/courses/pending`);
  },

  getCourseDetail: async (id: string) => {
    // Backend: GET /api/admin/courses/{id}
    return await axiosInstance.get(`/api/admin/courses/${id}`);
  },

  verifyCourse: async (id: string, isApprove: boolean) => {
    // Backend: POST /api/admin/courses/{id}/verify?isApprove=true/false
    return await axiosInstance.post(`/api/admin/courses/${id}/verify`, null, {
      params: { isApprove }
    });
  }
};

export default adminService;
