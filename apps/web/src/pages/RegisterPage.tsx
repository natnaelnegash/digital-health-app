import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, KeyRound, Loader2 } from 'lucide-react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerApi } from '../api/authApi';
import { registerSchema, type RegisterFormValues } from '../features/auth/authValidation';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerApi(data);
      toast.success('Registration successfull...Please login');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a new account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                id="email"
                placeholder="name@example.com"
                {...register('email')}
                className="pl-10" // Add padding for the icon
              />
            </div>
            {/* <input type="email" id="email" {...register('email')} required /> */}
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          {/* {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>} */}
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                {...register('password')}
                className="pl-10"
              />
            </div>
            {/* <input type="password" id="password" {...register('password')} required /> */}
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Registering' : 'Register'}
          </Button>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?{' '}
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
