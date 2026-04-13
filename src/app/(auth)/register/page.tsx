"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // API call to User registration endpoint
      const response = await axiosInstance.post('/api/users', formData);
      
      if (response.result) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      </div>

      <Card className="w-full max-w-[500px] z-10 shadow-2xl border-none">
        <CardHeader className="space-y-2 text-center pb-6 pt-8">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Create an Account</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Join the EduStream community today
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-5">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-800 text-sm font-medium px-4 py-3 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</Label>
                <Input 
                  id="firstName" 
                  type="text" 
                  placeholder="John" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="h-11 border-gray-200 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</Label>
                <Input 
                  id="lastName" 
                  type="text" 
                  placeholder="Doe" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="h-11 border-gray-200 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="johndoe123" 
                value={formData.username}
                onChange={handleChange}
                required
                className="h-11 border-gray-200 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11 border-gray-200 shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                className="h-11 border-gray-200 shadow-sm"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all"
              disabled={loading || !!success}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <div className="text-center text-sm font-medium text-gray-500 flex items-center justify-center gap-1">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-bold">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
