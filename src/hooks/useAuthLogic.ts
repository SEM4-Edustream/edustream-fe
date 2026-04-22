import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authService, RegisterDTO } from '@/services/authService';

function decodeJwtPayload(token: string) {
  const base64Url = token.split('.')[1];
  if (!base64Url) return null;

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  try {
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(username, password);
      const decoded = decodeJwtPayload(result.token);

      if (!decoded?.sub) {
        throw new Error('Đăng nhập thành công nhưng token không hợp lệ.');
      }

      login(result.token, {
        id: decoded.sub,
        username: decoded.sub,
        role: decoded.scope || 'USER'
      });
    } catch (err: any) {
      console.error(err);
      let message = 'Login failed. Please try again later.';
      
      const status = err?.response?.status;
      const backendMessage = err?.response?.data?.message;

      if (status === 401 || backendMessage?.includes('identities')) {
        message = 'Invalid username or password. Please check your credentials.';
      } else if (backendMessage) {
        message = backendMessage;
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}

export function useRegister() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitRegistration = (data: RegisterDTO) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        await authService.register(data);
        setSuccess('Registration successful! Redirecting to login...');

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || 'Registration failed. Please try again.');
      }
    });
  };

  return { submitRegistration, isPending, success, error };
}
