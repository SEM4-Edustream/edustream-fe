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
      const message = err?.response?.data?.message || err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
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
        setSuccess('Đăng ký thành công… chuyển đến trang đăng nhập.');

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    });
  };

  return { submitRegistration, isPending, success, error };
}
