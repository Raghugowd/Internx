import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Briefcase, Home, Search, Info } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-green-600 p-2 rounded-lg">
              <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">InternX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm xl:text-base">Home</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              <Info className="h-4 w-4" />
              <span className="text-sm xl:text-base">About</span>
            </Link>
            <Link
              to="/internships"
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm xl:text-base">Find Internships</span>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-3 xl:space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm xl:text-base">Dashboard</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-sm xl:text-base max-w-32 truncate">
                    Hi, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 xl:px-4 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm xl:text-base">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 xl:space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-200 text-sm xl:text-base"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 xl:px-6 rounded-lg transition-colors duration-200 text-sm xl:text-base"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Tablet Navigation (md to lg) */}
          <div className="hidden md:flex lg:hidden items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 transition-colors duration-200"
              title="Home"
            >
              <Home className="h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-green-600 transition-colors duration-200"
              title="About"
            >
              <Info className="h-5 w-5" />
            </Link>
            <Link
              to="/internships"
              className="text-gray-700 hover:text-green-600 transition-colors duration-200"
              title="Find Internships"
            >
              <Search className="h-5 w-5" />
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-200"
                  title="Dashboard"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors duration-200 px-2 py-1"
              >
                <Home className="h-5 w-5" />
                <span className="text-base">Home</span>
              </Link>
              <Link
                to="/about"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors duration-200 px-2 py-1"
              >
                <Info className="h-5 w-5" />
                <span className="text-base">About</span>
              </Link>
              <Link
                to="/internships"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors duration-200 px-2 py-1"
              >
                <Search className="h-5 w-5" />
                <span className="text-base">Find Internships</span>
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors duration-200 px-2 py-1"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-base">Dashboard</span>
                  </Link>
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <p className="text-gray-700 mb-3 px-2 text-base">
                      Hi, <span className="font-medium">{user.name}</span>
                    </p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 w-full mx-2"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="text-base">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-3 mt-3 border-t border-gray-200">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-green-600 transition-colors duration-200 px-2 py-1 text-base"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-center mx-2 text-base"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;