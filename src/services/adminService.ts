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

  getTutorDetail: async (id: string) => {
    // Backend: GET /api/admin/tutor-profiles/{id}
    const response = await axiosInstance.get(`/api/admin/tutor-profiles/${id}`);
    return response.result;
  },

  reviewTutor: async (id: string, data: VerificationReviewRequest) => {
    // Backend: POST /api/admin/tutor-profiles/{id}/verify
    const response = await axiosInstance.post(`/api/admin/tutor-profiles/${id}/verify`, data);
    return response.result;
  }
};

export default adminService;
