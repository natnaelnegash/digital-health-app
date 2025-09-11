/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { login as loginApi } from '../api/authApi';
import { authFailure, authStart, authSuccess } from '../features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './login.css';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { type LoginFormValues, loginSchema } from '../features/auth/authValidation';
import { zodResolver } from '@hookform/resolvers/zod';
// import { Button } from '../components/Button';
import { KeyRound, Loader2, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    dispatch(authStart());
    try {
      const response = await loginApi(data);
      const decodedUser: any = jwtDecode(response.token);
      dispatch(authSuccess({ user: decodedUser, token: response.token }));
      toast.success(`Login successfull...Welcome ${decodedUser?.firstname}`);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login');
      dispatch(authFailure(error.response?.data?.message));
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                id="email"
                placeholder="name@example.com"
                {...register('email')}
                className="pl-10" // Add padding for the icon
              />
            </div>
            {errors.email && (
              <p className="text-sm font-medium text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                {...register('password')}
                className="pl-10"
              />
            </div>
            {errors.password && (
              <p className="text-sm font-medium text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* {authError && <p className="text-sm font-medium text-red-500">{authError}</p>} */}

          <div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
    // <div>
    //   <h2>Login</h2>
    //   <form onSubmit={handleSubmit}>
    //     <div>
    //       <label htmlFor="email">Email</label>
    //       <input
    //         type="email"
    //         id="email"
    //         name="email"
    //         value={formData.email}
    //         onChange={handleChange}
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="password">Password</label>
    //       <input
    //         type="password"
    //         id="password"
    //         name="password"
    //         value={formData.password}
    //         onChange={handleChange}
    //         required
    //       />
    //     </div>
    //     {error && <p style={{ color: 'red' }}>{error}</p>}
    //     <button type="submit" disabled={isLoading}>
    //       {isLoading ? 'Logging in...' : 'Login'}
    //     </button>
    //   </form>
    // </div>
  );
};

export default LoginPage;
