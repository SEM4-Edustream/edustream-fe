import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authService, RegisterDTO } from '@/services/authService';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  
  const handleLogin = async (username: string, password: string) => {
    setError('');
    setLoading(true);
    
    try {
      const result = await authService.login(username, password);
      
      // Decode JWT Payload to introspect user info
      const base64Url = result.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      const userScope = decoded.scope || 'USER';

      login(result.token, {
        id: decoded.sub, 
        username: decoded.sub,
        role: userScope
      });
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
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
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    });
  };

  return { submitRegistration, isPending, success, error };
}
