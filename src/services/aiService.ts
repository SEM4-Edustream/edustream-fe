import axiosInstance from "@/lib/axios";

export interface AIChatResponse {
  answer: string;
}

export const aiService = {
  chat: async (courseId: string, message: string): Promise<AIChatResponse> => {
    // Note: In our project axiosInstance might wrap data in 'result' 
    // depending on the backend response structure
    const res: any = await axiosInstance.post("/api/ai/coach/chat", {
      courseId,
      message,
    });
    return res.result || res.data || res;
  },
};
