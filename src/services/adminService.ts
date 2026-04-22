import axiosInstance from "@/lib/axios";
import { TutorProfileResponse } from "@/services/tutorService";

export interface VerificationReviewRequest {
  action: 'APPROVED' | 'REJECTED';
  reviewComment: string;
}

const adminService = {
  getTutorProfiles: async (status: string = 'PENDING') => {
    // Backend: GET /api/admin/tutor-profiles?status=PENDING
    const response = await axiosInstance.get(`/api/admin/tutor-profiles`, {
      params: { status }
    });
    return response.result;
  },

  getAllCourses: async (params: { status?: string; page?: number; size?: number; sort?: string } = {}) => {
    // Backend: GET /api/admin/courses?status=...&page=...&size=...&sort=...
    const response = await axiosInstance.get(`/api/admin/courses`, { params });
    return response.result;
  },

  getTutorDetail: async (id: string) => {
    // Backend: GET /api/admin/tutor-profiles/{id}
    const response = await axiosInstance.get(`/api/admin/tutor-profiles/${id}`);
    return response.result;
  },

  reviewTutor: async (id: string, data: VerificationReviewRequest) => {
    // Backend: POST /api/admin/tutor-profiles/{id}/verify
    const response = await axiosInstance.post(`/api/admin/tutor-profiles/${id}/verify`, data);
    return response.result;
  },

  getPendingCourses: async () => {
    // Backend: GET /api/admin/courses/pending
    const response = await axiosInstance.get(`/api/admin/courses/pending`);
    return response.result;
  },

  getCourseDetail: async (id: string) => {
    // Backend: GET /api/admin/courses/{id}
    const response = await axiosInstance.get(`/api/admin/courses/${id}`);
    return response.result;
  },

  verifyCourse: async (id: string, isApprove: boolean) => {
    // Backend: POST /api/admin/courses/{id}/verify?isApprove=true/false
    const response = await axiosInstance.post(`/api/admin/courses/${id}/verify`, null, {
      params: { isApprove }
    });
    return response.result;
  }
};

export default adminService;
