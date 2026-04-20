import { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    categoryService.getCategories()
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [page, selectedCategory]);

  const fetchBooks = () => {
    setLoading(true);
    const request = searchQuery
      ? bookService.searchBooks(searchQuery, page, 10)
      : bookService.getBooks(page, 10, selectedCategory);

    request
      .then(res => {
        setBooks(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(0);
    setLoading(true);

    if (query.trim()) {
      bookService.searchBooks(query, 0, 10)
        .then(res => {
          setBooks(res.data.content);
          setTotalPages(res.data.totalPages);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSearchQuery('');
      bookService.getBooks(0, 10, selectedCategory)
        .then(res => {
          setBooks(res.data.content);
          setTotalPages(res.data.totalPages);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setPage(0);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark-900">Browse Books</h1>
        <p className="text-dark-500 mt-1">Discover your next favorite read</p>
      </div>

      <SearchBar
        onSearch={handleSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {loading ? (
        <Spinner />
      ) : books.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl">📚</span>
          <h3 className="text-xl font-semibold text-dark-700 mt-4">No books found</h3>
          <p className="text-dark-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default BookList;
