// src/services/tutorService.ts
import axiosInstance from "@/lib/axios";

export interface TutorProfileRequest {
  headline: string;
  bio: string;
  videoIntroduction?: string;
}

export interface TutorDocumentRequest {
  type: "ID_CARD" | "DEGREE" | "CERTIFICATE";
  fileUrl: string;
}

export interface TutorDocumentResponse {
  id: string;
  documentType: string;
  documentUrl: string;
  isVerified: boolean;
}

export interface TutorProfileResponse {
  id: string;
  tutorName: string;
  headline: string;
  bio: string;
  videoIntroduction: string;
  status: string;
  verificationStartDate?: string;
  verifiedAt?: string;
  documents: TutorDocumentResponse[];
}

const tutorService = {
  // Step 1: Create initial profile
  createProfile: async (data: TutorProfileRequest) => {
    const response: any = await axiosInstance.post(`/api/tutor-profiles`, data);
    return response;
  },

  // Step 2: Add essential documents
  addDocument: async (data: TutorDocumentRequest) => {
    const response: any = await axiosInstance.post(`/api/tutor-profiles/documents`, data);
    return response;
  },

  // Step 3: Trigger verification process
  submitForVerification: async () => {
    const response: any = await axiosInstance.post(`/api/tutor-profiles/submit-verification`, {});
    return response;
  },

  // Fetch current status
  getMyProfileStatus: async () => {
    const response: any = await axiosInstance.get(`/api/tutor-profiles/my-profile`);
    return response;
  }
};

export default tutorService;
