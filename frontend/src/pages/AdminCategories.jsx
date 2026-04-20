import { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = () => categoryService.getCategories().then(res => setCategories(res.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoryService.updateCategory(editingId, { name, description });
      } else {
        await categoryService.createCategory({ name, description });
      }
      setName(''); setDescription(''); setEditingId(null);
      loadCategories();
    } catch (err) {
      alert('Failed to save category');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await categoryService.deleteCategory(id); loadCategories(); }
    catch (err) { alert('Failed to delete'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 border rounded mb-8 space-y-4">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Category' : 'Add Category'}</h2>
        <div><label className="block font-medium mb-1">Name</label> <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" required /></div>
        <div><label className="block font-medium mb-1">Description</label> <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded" rows="2"></textarea></div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setName(''); setDescription(''); }} className="px-4 py-2 border rounded">Cancel</button>}
        </div>
      </form>

      <div className="bg-white border rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr><th className="p-4 border-b">Name</th><th className="p-4 border-b">Description</th><th className="p-4 border-b">Actions</th></tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4">{cat.description}</td>
                <td className="p-4 space-x-2">
                  <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategories;
