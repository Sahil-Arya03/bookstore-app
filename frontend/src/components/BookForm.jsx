import { useState, useEffect } from 'react';
import { validateBook } from '../utils/validators';

const BookForm = ({ book, categories, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', description: '', price: '',
    stockQuantity: '', coverImageUrl: '', publicationYear: '',
    publisher: '', language: 'English', pageCount: '', categoryId: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        description: book.description || '',
        price: book.price || '',
        stockQuantity: book.stockQuantity || '',
        coverImageUrl: book.coverImageUrl || '',
        publicationYear: book.publicationYear || '',
        publisher: book.publisher || '',
        language: book.language || 'English',
        pageCount: book.pageCount || '',
        categoryId: book.categoryId || '',
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateBook(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : null,
      pageCount: formData.pageCount ? parseInt(formData.pageCount) : null,
      categoryId: parseInt(formData.categoryId),
    });
  };

  const fields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'author', label: 'Author', type: 'text', required: true },
    { name: 'isbn', label: 'ISBN', type: 'text', required: true },
    { name: 'price', label: 'Price ($)', type: 'number', step: '0.01', required: true },
    { name: 'stockQuantity', label: 'Stock Quantity', type: 'number', required: true },
    { name: 'publicationYear', label: 'Publication Year', type: 'number' },
    { name: 'publisher', label: 'Publisher', type: 'text' },
    { name: 'language', label: 'Language', type: 'text' },
    { name: 'pageCount', label: 'Page Count', type: 'number' },
    { name: 'coverImageUrl', label: 'Cover Image URL', type: 'text' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-dark-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              step={field.step}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm"
              id={`book-${field.name}`}
            />
            {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm bg-white"
            id="book-categoryId"
          >
            <option value="">Select Category</option>
            {categories?.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm"
          id="book-description"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-2 border border-gray-200 rounded-lg text-dark-600 hover:bg-gray-50 font-medium text-sm transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" disabled={loading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm transition-colors shadow-md disabled:opacity-50">
          {loading ? 'Saving...' : (book ? 'Update Book' : 'Create Book')}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
