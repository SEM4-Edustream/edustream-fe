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
    // axiosInstance returns response.data directly due to interceptor
    return response.result;
  },

  // Step 2: Upload file directly to S3
  uploadFileToS3: async (uploadUrl: string, file: File) => {
    // Use raw axios for S3 to avoid injecting Bearer token which S3 will reject
    const response = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    return response;
  }
};

export default fileService;
