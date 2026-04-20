import { useState } from 'react';

function SearchBar({ onSearch, categories, selectedCategory, onCategoryChange }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="mb-6 border rounded-lg p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
          className="flex-1 border rounded px-4 py-2"
        />
        
        {categories && (
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="border rounded px-4 py-2 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
