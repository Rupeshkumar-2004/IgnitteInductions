import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🔥 IGNITE
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
              About
            </Link>
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition transform hover:scale-105"
                >
                  Join Us
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}