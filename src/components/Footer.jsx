import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white shadow-inner mt-auto">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between text-xs text-gray-500">
        <p>© 2025 Digital Health System. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
