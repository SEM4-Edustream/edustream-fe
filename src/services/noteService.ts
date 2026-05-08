import axiosInstance from "@/lib/axios";

export interface NoteRequest {
    courseId: string;
    lessonId: string;
    content: string;
    timestampSeconds?: number;
}

export interface NoteResponse {
    id: string;
    lessonId: string;
    lessonTitle: string;
    content: string;
    timestampSeconds: number | null;
    createdDate: string;
}

export const noteService = {
    createNote: async (request: NoteRequest): Promise<NoteResponse> => {
        const response: any = await axiosInstance.post('/api/courses/notes', request);
        return response.result;
    },

    getMyNotesByCourse: async (courseId: string): Promise<NoteResponse[]> => {
        const response: any = await axiosInstance.get(`/api/courses/notes/${courseId}`);
        return response.result;
    },

    deleteNote: async (noteId: string): Promise<void> => {
        await axiosInstance.delete(`/api/courses/notes/${noteId}`);
    }
};
