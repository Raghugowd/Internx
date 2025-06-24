import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">InternX</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium transition-colors">
              About Us
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium transition-colors">
              Browse Internships
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block text-gray-700 hover:text-green-600 px-3 py-2 font-medium">
                Home
              </Link>
              <Link to="/about" className="block text-gray-700 hover:text-green-600 px-3 py-2 font-medium">
                About Us
              </Link>
              <Link to="/jobs" className="block text-gray-700 hover:text-green-600 px-3 py-2 font-medium">
                Browse Internships
              </Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="block text-gray-700 hover:text-green-600 px-3 py-2 font-medium">
                    Dashboard
                  </Link>
                  <div className="px-3 py-2 text-gray-700 font-medium">
                    Welcome, {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-gray-700 hover:text-green-600 px-3 py-2 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="block bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium mx-3">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;