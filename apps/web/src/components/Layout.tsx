import React from 'react';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <NavBar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
