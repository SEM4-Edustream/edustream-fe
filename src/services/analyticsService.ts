import axiosInstance from "@/lib/axios";

export interface TutorAnalytics {
  totalStudents: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueGrowth: number;
  topCourseName: string;
  topCourseEnrollments: number;
  averageProgress: number;
  averageRating: number;
}

export const analyticsService = {
  getTutorAnalytics: async (): Promise<TutorAnalytics> => {
    return await axiosInstance.get<any, TutorAnalytics>(`/api/tutor/analytics`);
  }
};
