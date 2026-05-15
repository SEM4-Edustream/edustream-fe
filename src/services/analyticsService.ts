import axiosInstance from "@/lib/axios";

export interface TutorAnalytics {
  totalStudents: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueGrowth: number;
  totalLifetimeRevenue: number;
  averageProgress: number;
  averageRating: number;
  topCourses: CourseStat[];
  recentActivities: ActivityLog[];
  revenueByCourse: CourseRevenue[];
}

export interface CourseStat {
  courseId: string;
  title: string;
  enrollmentCount: number;
  averageRating: number;
}

export interface ActivityLog {
  type: 'ENROLLMENT' | 'REVIEW';
  studentName: string;
  courseTitle: string;
  detail: string;
  timestamp: string;
}

export interface CourseRevenue {
  courseId: string;
  title: string;
  totalRevenue: number;
  totalSales: number;
}

export interface TutorStudent {
  enrollmentId: string;
  studentId: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  courseId: string;
  courseTitle: string;
  progressPercentage: number;
  enrolledAt: string;
}

export interface PageMeta<T> {
  content: T[];
  pageSize: number;
  totalElements: number;
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const analyticsService = {
  getTutorAnalytics: async (): Promise<TutorAnalytics> => {
    return await axiosInstance.get<any, TutorAnalytics>(`/api/tutor/analytics`);
  },

  getTutorStudents: async (params: { courseId?: string; page?: number; size?: number } = {}): Promise<PageMeta<TutorStudent>> => {
    return await axiosInstance.get<any, PageMeta<TutorStudent>>(`/api/tutor/analytics/students`, { params });
  }
};
