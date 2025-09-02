/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { fetchMyProfile } from '../api/userApi';
import { jwtDecode } from 'jwt-decode';
import { authSuccess, logout } from '../features/auth/authSlice';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userProfile = await fetchMyProfile();
          const decodedUser: any = jwtDecode(token);
          dispatch(authSuccess({ user: { ...userProfile, decodedUser }, token }));
        } catch (error: any) {
          console.error('Auth initialization failed, token might be invalid.', error);
          dispatch(logout());
        }
      }
      setIsInitializing(false);
    };
    initializeAuth();
  }, [token, dispatch]);

  if (isInitializing) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Loading Application
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
