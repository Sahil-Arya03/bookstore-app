import axiosInstance from '../utils/axiosInstance';

/**
 * Category API service.
 */
const categoryService = {
  /** Get all categories */
  getCategories: () => axiosInstance.get('/api/categories'),

  /** Get a category by ID with its books */
  getCategoryById: (id) => axiosInstance.get(`/api/categories/${id}`),

  /** Create a new category (ADMIN) */
  createCategory: (data) => axiosInstance.post('/api/categories', data),

  /** Update a category (ADMIN) */
  updateCategory: (id, data) => axiosInstance.put(`/api/categories/${id}`, data),

  /** Delete a category (ADMIN) */
  deleteCategory: (id) => axiosInstance.delete(`/api/categories/${id}`),
};

export default categoryService;
