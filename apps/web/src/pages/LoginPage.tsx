import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { login } from '../api/authApi';
import { authFailure, authStart, authSuccess } from '../features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const data = await login(formData);

      const decodedUser: any = jwtDecode(data.token);
      dispatch(authSuccess({ user: decodedUser, token: data.token }));
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to login';
      dispatch(authFailure(errorMessage));
    }
  };
  return (
    <div className="login-container">
      <div className="logo">
        <img src="" alt="" />
      </div>
      <form onSubmit={handleSubmit}>
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
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
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
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
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
          {isLoading ? 'Logging in...' : 'Login'}
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
