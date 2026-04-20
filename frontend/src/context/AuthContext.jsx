import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Think of this context as the bouncer for our application. 
 * It keeps track of who is currently logged in, what their role is,
 * and holds onto their JWT "entry pass" so they don't have to log in every time they refresh the page.
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
   * Called when a user successfully passes the login screen.
   * We take their new credentials and stash them safely in the browser's local storage
   * so they stay logged in even if they close the tab.
   * 
   * @param {Object} authResponse - The personalized data packet sent back from our backend
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
   * When a user wants to leave, this function wipes the slate clean,
   * removing all traces of their session credentials and their shopping cart
   * from the browser's memory.
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
