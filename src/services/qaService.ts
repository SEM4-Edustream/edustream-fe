import api from '@/lib/api';

export interface QuestionResponse {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  title: string;
  body: string;
  isResolved: boolean;
  answerCount: number;
  answers?: AnswerResponse[];
  createdAt: string;
}

export interface AnswerResponse {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isInstructor: boolean;
  body: string;
  isTopAnswer: boolean;
  isInstructorAnswer: boolean;
  createdAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export type QAFilter = 'ALL' | 'NO_ANSWER' | 'NO_INSTRUCTOR_ANSWER';

export const qaService = {
  // Tutor: lấy Q&A của các khóa học mình dạy
  getTutorQuestions: async (params?: {
    courseId?: string;
    filter?: QAFilter;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<QuestionResponse>> => {
    const queryParams: Record<string, string | number> = {
      page: params?.page ?? 0,
      size: params?.size ?? 20,
      sort: 'createdAt,desc',
    };
    if (params?.courseId) queryParams.courseId = params.courseId;
    if (params?.filter && params.filter !== 'ALL') queryParams.filter = params.filter;

    return await api.get<PagedResponse<QuestionResponse>>('/api/qa/tutor', {
      params: queryParams,
    }) as any;
  },

  // Chi tiết câu hỏi kèm tất cả câu trả lời
  getQuestionDetail: async (questionId: string): Promise<QuestionResponse> => {
    return await api.get<QuestionResponse>(`/api/qa/${questionId}`) as any;
  },

  // Học viên đặt câu hỏi
  createQuestion: async (
    courseId: string,
    data: { title: string; body: string; lessonId?: string }
  ): Promise<QuestionResponse> => {
    return await api.post<QuestionResponse>(`/api/qa/courses/${courseId}`, data) as any;
  },

  // Trả lời câu hỏi
  createAnswer: async (
    questionId: string,
    body: string
  ): Promise<AnswerResponse> => {
    return await api.post<AnswerResponse>(`/api/qa/${questionId}/answers`, { body }) as any;
  },

  // Tutor: toggle Top Answer
  markTopAnswer: async (answerId: string): Promise<AnswerResponse> => {
    return await api.patch<AnswerResponse>(`/api/qa/answers/${answerId}/top`) as any;
  },

  // Toggle Resolved
  resolveQuestion: async (questionId: string): Promise<QuestionResponse> => {
    return await api.patch<QuestionResponse>(`/api/qa/${questionId}/resolve`) as any;
  },
};
