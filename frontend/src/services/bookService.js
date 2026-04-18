import axiosInstance from '../utils/axiosInstance';

/**
 * Book API service.
 */
const bookService = {
  /** Get paginated books with optional category filter */
  getBooks: (page = 0, size = 10, categoryId) => {
    let url = `/api/books?page=${page}&size=${size}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    return axiosInstance.get(url);
  },

  /** Get a book by ID */
  getBookById: (id) => axiosInstance.get(`/api/books/${id}`),

  /** Search books by query */
  searchBooks: (query, page = 0, size = 10) =>
    axiosInstance.get(`/api/books/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`),

  /** Create a new book (ADMIN) */
  createBook: (data) => axiosInstance.post('/api/books', data),

  /** Update a book (ADMIN) */
  updateBook: (id, data) => axiosInstance.put(`/api/books/${id}`, data),

  /** Delete a book (ADMIN) */
  deleteBook: (id) => axiosInstance.delete(`/api/books/${id}`),
};

export default bookService;
