import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookService from '../services/bookService';
import BookCard from '../components/BookCard';
import Spinner from '../components/Spinner';

/**
 * Home page showing featured books and hero section.
 */
const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookService.getBooks(0, 8)
      .then(res => setBooks(res.data.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Discover Your
              <span className="block text-yellow-300">Next Great Read</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Explore our curated collection of books across fiction, science, technology, history, and self-help. Find your next favorite book today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/books" className="bg-white text-primary-700 hover:bg-yellow-300 hover:text-primary-900 px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Browse Books →
              </Link>
              <Link to="/register" className="border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-3 rounded-xl font-bold text-lg transition-all">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📚', label: 'Books', value: '10,000+' },
            { icon: '👥', label: 'Readers', value: '50,000+' },
            { icon: '📦', label: 'Orders', value: '100,000+' },
            { icon: '⭐', label: 'Reviews', value: '4.9/5' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-5 text-center border border-gray-100 hover:shadow-xl transition-shadow">
              <span className="text-3xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-dark-900 mt-2">{stat.value}</p>
              <p className="text-sm text-dark-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-dark-900">Featured Books</h2>
            <p className="text-dark-500 mt-1">Handpicked selections for you</p>
          </div>
          <Link to="/books" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
            View All →
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-dark-800 to-dark-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Reading?</h2>
          <p className="text-dark-300 text-lg mb-8">Join thousands of book lovers. Create your free account today.</p>
          <Link to="/register" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-all shadow-lg inline-block">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
