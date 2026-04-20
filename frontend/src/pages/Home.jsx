import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookService from '../services/bookService';
import BookCard from '../components/BookCard';

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookService.getBooks(0, 8)
      .then(res => setBooks(res.data.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to our Bookstore</h1>
        <p className="text-xl text-gray-600 mb-8">Discover your next favorite book today.</p>
        <Link to="/books" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
          Browse Books
        </Link>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Books</h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading books...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
