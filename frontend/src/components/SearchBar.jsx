import { useState } from 'react';

/**
 * SearchBar component with search input and optional category filter.
 */
const SearchBar = ({ onSearch, categories, selectedCategory, onCategoryChange }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm"
            id="search-input"
          />
        </div>

        {categories && (
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm text-dark-600 bg-white"
            id="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-md hover:shadow-lg text-sm"
          id="search-button"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
