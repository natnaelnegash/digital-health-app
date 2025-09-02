import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerApi } from '../api/authApi';
import { registerSchema, type RegisterFormValues } from '../features/auth/authValidation';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register('email')} required />
        </div>
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register('password')} required />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
