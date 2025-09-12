import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const Login = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'admin') {
      navigate('/dashboard');
    } else {
      alert('Only admin login is supported in this demo.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex items-center justify-center bg-gray-900" style={{
        backgroundImage: `url('https://placehold.co/1920x1080/0d1a2d/f5f5f5?text=Medical+Background')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700 text-white">
          <h2 className="text-2xl font-semibold text-white mb-2 text-center">Welcome, Bob!</h2>
          <p className="text-sm text-gray-400 mb-6 text-center">Email: bob@example.com</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <label htmlFor="role-select" className="block text-sm font-medium text-gray-300">
              Select Your Role
            </label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select a role</option>
              <option value="admin">Administrator</option>
              <option value="provider" disabled>Provider (Coming Soon)</option>
              <option value="patient" disabled>Patient (Coming Soon)</option>
            </select>
            <button
              type="submit"
              className="w-full mt-8 py-3 px-4 rounded-xl text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg"
              disabled={!role}
            >
              Confirm Role
            </button>
          </form>
          <p className="mt-4 text-xs text-center text-gray-400">
            Once selected, your role will determine the features you can access.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
