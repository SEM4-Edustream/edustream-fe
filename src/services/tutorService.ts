// src/services/tutorService.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface TutorProfileRequest {
  bio: string;
  specialization: string;
  experienceYears: number;
}

export interface TutorDocumentRequest {
  documentType: "ID_CARD" | "DEGREE" | "CERTIFICATE";
  documentUrl: string;
}

const tutorService = {
  // Step 1: Create initial profile
  createProfile: async (data: TutorProfileRequest) => {
    const response = await axios.post(`${API_URL}/api/tutor-profiles`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  // Step 2: Add essential documents
  addDocument: async (data: TutorDocumentRequest) => {
    const response = await axios.post(`${API_URL}/api/tutor-profiles/documents`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  // Step 3: Trigger verification process
  submitForVerification: async () => {
    const response = await axios.post(`${API_URL}/api/tutor-profiles/submit`, {}, {
      withCredentials: true,
    });
    return response.data;
  },

  // Fetch current status
  getMyProfileStatus: async () => {
    const response = await axios.get(`${API_URL}/api/tutor-profiles/my-profile`, {
      withCredentials: true,
    });
    return response.data;
  }
};

export default tutorService;
