import { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';
import Spinner from '../components/Spinner';

/**
 * Admin page for managing book categories (CRUD).
 */
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setLoading(true);
    categoryService.getCategories()
      .then(res => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await categoryService.updateCategory(editing.id, formData);
      } else {
        await categoryService.createCategory(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', description: '' });
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will also delete all books in this category.')) return;
    try {
      await categoryService.deleteCategory(id);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Manage Categories</h1>
          <p className="text-dark-500 mt-1">{categories.length} categories</p>
        </div>
        <button onClick={() => { setEditing(null); setFormData({ name: '', description: '' }); setShowForm(true); }}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md">
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 animate-slide-up">
          <h2 className="text-xl font-semibold text-dark-900 mb-4">{editing ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                placeholder="Category name" id="category-name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                placeholder="Category description" id="category-description" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-dark-600 hover:bg-gray-50 font-medium text-sm">Cancel</button>
              <button type="submit" disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm disabled:opacity-50">
                {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-dark-900 text-lg">{cat.name}</h3>
              {cat.description && <p className="text-sm text-dark-500 mt-1">{cat.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(cat)}
                className="text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Edit</button>
              <button onClick={() => handleDelete(cat.id)}
                className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
