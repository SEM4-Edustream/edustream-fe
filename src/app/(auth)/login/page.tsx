"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/token', {
        username,
        password
      });

      if (response.result && response.result.token) {
        // Introspect token payload simply by decoding JWT (or getting from backend endpoint optionally)
        // Since backend doesn't return full user object in `/api/auth/token` (only string token & auth status)
        // We can do a quick decode or hit `/api/users/my-info` (Need to implement that, or decode JWT in local).
        
        // Let's decode very quickly to extract role and username (JWT Payload)
        const base64Url = response.result.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decoded = JSON.parse(jsonPayload);
        const userScope = decoded.scope || 'USER';

        login(response.result.token, {
          id: decoded.sub, 
          username: decoded.sub,
          role: userScope
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <Card className="w-full max-w-[420px] z-10 shadow-2xl border-none">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Ex: student01" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                <Link href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <div className="text-center text-sm font-medium text-gray-500">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline font-bold">
                Create one now
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
