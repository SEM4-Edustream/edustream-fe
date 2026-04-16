import axiosInstance from '@/lib/axios';

export interface LoginResponse {
  token: string;
}

export interface RegisterDTO {
  username: string;
  password?: string;
  email: string;
  fullName: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    // Note: Ensuring we hit exactly the Spring Boot Auth endpoint
    // Standard OAuth2/JWT setup generally uses /api/auth/token
    const response = await axiosInstance.post('/api/auth/token', {
      username,
      password
    });
    
    if (!response.result || !response.result.token) {
       throw new Error('Invalid credentials');
    }
    
    return response.result;
  },

  register: async (data: RegisterDTO) => {
    // Note: User registration usually creates an entity in /api/users
    const response = await axiosInstance.post('/api/users', data);
    return response.result;
  }
};
