import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';
import { formatCurrency } from '../utils/formatCurrency';
import Spinner from '../components/Spinner';

/**
 * BookDetail page showing full book information and Add to Cart button.
 */
const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    bookService.getBookById(id)
      .then(res => setBook(res.data))
      .catch(() => navigate('/books'))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === book.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        coverImageUrl: book.coverImageUrl,
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) return <Spinner />;
  if (!book) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-primary-600 hover:text-primary-700 font-medium mb-6 flex items-center gap-1">
        ← Back to Books
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-12 min-h-[400px]">
            {book.coverImageUrl ? (
              <img src={book.coverImageUrl} alt={book.title} className="max-h-96 rounded-lg shadow-xl" />
            ) : (
              <div className="text-center text-primary-400">
                <span className="text-8xl block mb-4">📖</span>
                <span className="text-lg font-medium">{book.categoryName}</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 lg:p-12">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
              {book.categoryName}
            </span>

            <h1 className="text-3xl font-bold text-dark-900 mt-4 mb-2">{book.title}</h1>
            <p className="text-lg text-dark-500 mb-6">by {book.author}</p>

            <div className="text-4xl font-extrabold text-primary-700 mb-6">
              {formatCurrency(book.price)}
            </div>

            {book.description && (
              <p className="text-dark-600 mb-6 leading-relaxed">{book.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              {book.isbn && <div><span className="text-dark-400">ISBN:</span> <span className="font-medium">{book.isbn}</span></div>}
              {book.publisher && <div><span className="text-dark-400">Publisher:</span> <span className="font-medium">{book.publisher}</span></div>}
              {book.publicationYear && <div><span className="text-dark-400">Year:</span> <span className="font-medium">{book.publicationYear}</span></div>}
              {book.language && <div><span className="text-dark-400">Language:</span> <span className="font-medium">{book.language}</span></div>}
              {book.pageCount && <div><span className="text-dark-400">Pages:</span> <span className="font-medium">{book.pageCount}</span></div>}
              <div>
                <span className="text-dark-400">Stock:</span>{' '}
                <span className={`font-semibold ${book.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {book.stockQuantity > 0 ? `${book.stockQuantity} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            {book.stockQuantity > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-dark-600 hover:bg-gray-50 rounded-l-lg font-bold">−</button>
                  <span className="px-4 py-2 font-semibold text-dark-800 border-x border-gray-200">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(book.stockQuantity, quantity + 1))}
                    className="px-3 py-2 text-dark-600 hover:bg-gray-50 rounded-r-lg font-bold">+</button>
                </div>

                <button onClick={addToCart}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all shadow-md ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                  }`}>
                  {addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
