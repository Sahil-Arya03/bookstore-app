import { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext provides global authentication state management.
 * Stores JWT token and user info in localStorage for persistence.
 */
const AuthContext = createContext(null);

/**
 * Custom hook to access the auth context.
 * @returns {Object} auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider wrapping component providing authentication state to the app.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore auth state from localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Login: store token and user in state + localStorage.
   * @param {Object} authResponse - response from login/register API
   */
  const login = (authResponse) => {
    const { token, id, name, email, role } = authResponse;
    const userData = { id, name, email, role };
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Logout: clear token and user from state + localStorage.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  };

  /**
   * Check if the current user has the ADMIN role.
   * @returns {boolean}
   */
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  /**
   * Check if a user is authenticated.
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
