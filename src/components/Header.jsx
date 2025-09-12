import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Digital Health System - Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select className="p-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none">
            <option>English</option>
            <option>Amharic</option>
          </select>
          <button
            onClick={handleLogout}
            className="py-2 px-4 rounded-md text-white font-semibold transition-colors duration-200 bg-red-600 hover:bg-red-700 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
