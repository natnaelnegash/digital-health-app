import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import UserManagement from '../components/UserManagement.jsx';
import Reports from '../components/Reports.jsx';
import AppointmentConfig from '../components/AppointmentConfig.jsx';

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState('User Management');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
          <nav className="space-y-2">
            <SidebarButton
              label="User Management"
              active={activeContent === 'User Management'}
              onClick={() => setActiveContent('User Management')}
            />
            <SidebarButton
              label="Reports"
              active={activeContent === 'Reports'}
              onClick={() => setActiveContent('Reports')}
            />
            <SidebarButton
              label="Appointment Config"
              active={activeContent === 'Appointment Config'}
              onClick={() => setActiveContent('Appointment Config')}
            />
          </nav>
        </div>
        {/* Main Content Area */}
        <div className="flex-1 p-8 bg-gray-100 overflow-y-auto">
          {activeContent === 'User Management' && <UserManagement />}
          {activeContent === 'Reports' && <Reports />}
          {activeContent === 'Appointment Config' && <AppointmentConfig />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const SidebarButton = ({ label, active, onClick }) => {
  const baseClasses = "flex items-center space-x-3 py-3 px-4 rounded-xl font-medium transition-colors duration-200";
  const activeClasses = "bg-white text-gray-800 shadow-md";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700";
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      <span>{label}</span>
    </button>
  );
};

export default Dashboard;
