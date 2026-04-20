import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Bookstore
        </Link>

        <div className="flex gap-4 items-center">
          <Link to="/books" className="text-gray-600 hover:text-blue-600">Browse Books</Link>

          {isAuthenticated() ? (
            <>
              <Link to="/cart" className="text-gray-600 hover:text-blue-600">Cart</Link>
              <Link to="/orders" className="text-gray-600 hover:text-blue-600">My Orders</Link>
              
              {isAdmin() && (
                <Link to="/admin" className="text-blue-600 font-medium">Admin</Link>
              )}
              
              <span className="text-gray-500 text-sm ml-4 border-l pl-4">
                {user?.name}
              </span>
              <button onClick={handleLogout} className="text-red-500 hover:underline text-sm ml-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
