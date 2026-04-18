import { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';
import BookForm from '../components/BookForm';
import Spinner from '../components/Spinner';
import { formatCurrency } from '../utils/formatCurrency';

/**
 * Admin page for managing books (CRUD operations).
 */
const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([bookService.getBooks(0, 100), categoryService.getCategories()])
      .then(([booksRes, catRes]) => {
        setBooks(booksRes.data.content);
        setCategories(catRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.id, data);
      } else {
        await bookService.createBook(data);
      }
      setShowForm(false);
      setEditingBook(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await bookService.deleteBook(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Manage Books</h1>
          <p className="text-dark-500 mt-1">{books.length} books in inventory</p>
        </div>
        <button onClick={() => { setEditingBook(null); setShowForm(true); }}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md">
          + Add Book
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 animate-slide-up">
          <h2 className="text-xl font-semibold text-dark-900 mb-4">
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </h2>
          <BookForm
            book={editingBook}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingBook(null); }}
            loading={saving}
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-dark-500 border-b border-gray-200">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">ISBN</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-dark-900 max-w-[200px] truncate">{book.title}</td>
                  <td className="px-4 py-3 text-dark-600">{book.author}</td>
                  <td className="px-4 py-3 text-dark-500 text-xs font-mono">{book.isbn}</td>
                  <td className="px-4 py-3"><span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full text-xs font-medium">{book.categoryName}</span></td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(book.price)}</td>
                  <td className="px-4 py-3"><span className={`font-semibold ${book.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>{book.stockQuantity}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(book)}
                        className="text-primary-600 hover:bg-primary-50 px-2 py-1 rounded text-xs font-medium transition-colors">Edit</button>
                      <button onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs font-medium transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBooks;
