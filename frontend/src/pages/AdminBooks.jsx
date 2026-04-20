import { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';
import { formatCurrency } from '../utils/formatCurrency';
import BookForm from '../components/BookForm';

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    bookService.getBooks(0, 100).then(res => setBooks(res.data.content));
    categoryService.getCategories().then(res => setCategories(res.data));
  };

  const handleSave = async (data) => {
    try {
      if (editingBook) await bookService.updateBook(editingBook.id, data);
      else await bookService.createBook(data);
      setShowForm(false);
      setEditingBook(null);
      loadData();
    } catch (err) {
      alert('Failed to save book');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try { await bookService.deleteBook(id); loadData(); } catch (err) { alert('Failed to delete'); }
  };

  const handleEdit = (book) => { setEditingBook(book); setShowForm(true); };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Books</h1>
        <button onClick={() => { setEditingBook(null); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Book</button>
      </div>

      {showForm && (
        <div className="bg-white p-6 border rounded mb-8">
          <BookForm book={editingBook} categories={categories} onSubmit={handleSave} onCancel={() => { setShowForm(false); setEditingBook(null); }} />
        </div>
      )}

      <div className="bg-white border rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 border-b">Title</th>
              <th className="p-4 border-b">Author</th>
              <th className="p-4 border-b">Price</th>
              <th className="p-4 border-b">Stock</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{book.title}</td>
                <td className="p-4">{book.author}</td>
                <td className="p-4">{formatCurrency(book.price)}</td>
                <td className="p-4">{book.stockQuantity}</td>
                <td className="p-4 space-x-2">
                  <button onClick={() => handleEdit(book)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBooks;
