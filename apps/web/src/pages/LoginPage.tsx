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
    <div className="login-container">
      <div className="logo">
        <img src="" alt="" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Enter email"
          style={{
            paddingLeft: '12px',
            marginBottom: '12px',
            fontSize: '15px',
            color: 'black',
            width: '307px',
            height: '46.53px',
            border: '0px',
            borderRadius: '15px',
            backgroundColor: '#FFFFFF',
            fontWeight: 'Bold',
          }}
          type="email"
          id="email"
          {...register('email')}
          required
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email?.message}</p>}
        <input
          placeholder="Enter Password"
          style={{
            paddingLeft: '12px',
            marginBottom: '12px',
            fontSize: '15px',
            color: 'black',
            width: '307px',
            height: '46.53px',
            border: '0px',
            borderRadius: '15px',
            backgroundColor: '#FFFFFF',
            fontWeight: 'Bold',
          }}
          type="password"
          id="password"
          {...register('password')}
          required
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password?.message}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '307px',
            height: '46.53px',
            border: '0px',
            borderRadius: '15px',
            //   backgroundColor: isHovered ? '#35b8ffff' : '#62C8FF',
            transition: 'background-color 0.3s ease',
            fontWeight: 'Bold',
          }}
          // onMouseEnter={() => setIsHovered(true)}
          // onMouseLeave={() => setIsHovered(false)}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        {/* <Link to="/login">Are You A Staff Member</Link> */}
      </form>
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
