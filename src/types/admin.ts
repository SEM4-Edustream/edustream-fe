export interface AdminEnrollmentDetailResponse {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  tutorName: string;
  progressPercentage: number;
  enrolledAt: string;
}

export interface AdminCourseMetricResponse {
  courseTitle: string;
  tutorName: string;
  totalStudents: number;
  averageProgress: number;
}
