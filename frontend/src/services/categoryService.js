import axiosInstance from '../utils/axiosInstance';

const categoryService = {

  getCategories: () => axiosInstance.get('/api/categories'),

  getCategoryById: (id) => axiosInstance.get(`/api/categories/${id}`),

  createCategory: (data) => axiosInstance.post('/api/categories', data),

  updateCategory: (id, data) => axiosInstance.put(`/api/categories/${id}`, data),

  deleteCategory: (id) => axiosInstance.delete(`/api/categories/${id}`),
};

export default categoryService;
