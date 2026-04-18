import axiosInstance from '../utils/axiosInstance';

/**
 * Authentication API service.
 */
const authService = {
  /**
   * Register a new user.
   * @param {Object} data - { name, email, password, phone }
   * @returns {Promise} API response with JWT token
   */
  register: (data) => axiosInstance.post('/api/auth/register', data),

  /**
   * Login with email and password.
   * @param {Object} data - { email, password }
   * @returns {Promise} API response with JWT token
   */
  login: (data) => axiosInstance.post('/api/auth/login', data),
};

export default authService;
