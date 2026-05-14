// src/services/fileService.ts
import axiosInstance from "@/lib/axios";
import axios from "axios"; // Still needed for the direct S3 PUT request to avoid interceptors

export interface FileUploadResponse {
  uploadUrl: string;
  fileUrl: string;
}

const fileService = {
  // Step 1: Get presigned URL from backend
  getPresignedUrl: async (fileName: string, contentType: string, type: "VIDEO" | "DOCUMENT" = "VIDEO"): Promise<FileUploadResponse> => {
    // Mapping back to what Backend expects for ApiResponse structure
    const response: any = await axiosInstance.get(`/api/files/presigned-url`, {
      params: { fileName, contentType, type },
    });
    return response?.result || response;
  },

  // Step 2: Upload file directly to S3
  uploadFileToS3: async (uploadUrl: string, file: File) => {
    // Use fetch for S3 to avoid injecting Bearer token or unwanted default headers from Axios
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`S3 Upload Failed: ${response.status} - ${errorText}`);
    }

    return response;
  }
};

export default fileService;
