import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { RootState, AppDispatch } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={clsx(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-gray-900 text-white' // Active styles
          : 'text-gray-300 hover:bg-gray-700 hover:text-white', // Inactive styles
      )}
    >
      {children}
    </Link>
  );
};

const NavBar = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 rounded-t-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white font-bold">HealthApp</div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/providers">Find a Provider</NavLink>
                {token && user?.role === 'PROVIDER' && (
                  <NavLink to="/my-patients">My Patients</NavLink>
                )}
                {token && <NavLink to="/dashboard">Dashboard</NavLink>}
              </div>
            </div>
          </div>

          {/* Auth Buttons on the right */}
          <div className="hidden md:block">
            {token ? (
              // We can create a dropdown for profile/logout here later
              <div className="flex items-center space-x-4">
                <NavLink to="/my-profile">Profile</NavLink>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink to="/login">Sign In</NavLink>
                <Link to="/register">
                  <Button variant="secondary">Create Account</Button>
                </Link>
              </div>
            )}
          </div>
          {/* Mobile menu button can be added here later */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
