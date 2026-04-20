import axiosInstance from '../utils/axiosInstance';

const bookService = {

  getBooks: (page = 0, size = 10, categoryId) => {
    let url = `/api/books?page=${page}&size=${size}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    return axiosInstance.get(url);
  },

  getBookById: (id) => axiosInstance.get(`/api/books/${id}`),

  searchBooks: (query, page = 0, size = 10) =>
    axiosInstance.get(`/api/books/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`),

  createBook: (data) => axiosInstance.post('/api/books', data),

  updateBook: (id, data) => axiosInstance.put(`/api/books/${id}`, data),

  deleteBook: (id) => axiosInstance.delete(`/api/books/${id}`),
};

export default bookService;
