import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

/**
 * Main navigation bar component with responsive design.
 * Shows different links based on authentication state and user role.
 */
const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl">📚</span>
              <span className="text-xl font-bold gradient-text">Bookstore</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/books" className="text-dark-700 hover:text-primary-600 font-medium transition-colors">
              Browse Books
            </Link>

            {isAuthenticated() ? (
              <>
                <Link to="/cart" className="text-dark-700 hover:text-primary-600 font-medium transition-colors relative">
                  🛒 Cart
                </Link>
                <Link to="/orders" className="text-dark-700 hover:text-primary-600 font-medium transition-colors">
                  My Orders
                </Link>

                {isAdmin() && (
                  <Link to="/admin" className="text-primary-700 hover:text-primary-800 font-semibold bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">
                    ⚡ Admin
                  </Link>
                )}

                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <span className="text-sm text-dark-600">
                    Hi, <span className="font-semibold">{user?.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-dark-700 hover:text-primary-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-dark-700 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 py-3 space-y-2">
            <Link to="/books" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-dark-700 hover:bg-primary-50 rounded-lg">Browse Books</Link>
            {isAuthenticated() ? (
              <>
                <Link to="/cart" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-dark-700 hover:bg-primary-50 rounded-lg">🛒 Cart</Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-dark-700 hover:bg-primary-50 rounded-lg">My Orders</Link>
                {isAdmin() && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-primary-700 bg-primary-50 rounded-lg font-semibold">⚡ Admin</Link>}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-dark-700 hover:bg-primary-50 rounded-lg">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 bg-primary-600 text-white rounded-lg text-center font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
