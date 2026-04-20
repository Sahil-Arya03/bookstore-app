import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';
import { formatCurrency } from '../utils/formatCurrency';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    bookService.getBookById(id)
      .then(res => setBook(res.data))
      .catch(() => navigate('/books'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === book.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: book.id, title: book.title, author: book.author, price: book.price, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!book) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 hover:underline">
        &larr; Back
      </button>

      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 border rounded shadow-sm">
        <div className="w-full md:w-1/3 bg-gray-100 min-h-[300px] flex items-center justify-center rounded">
          {book.coverImageUrl ? <img src={book.coverImageUrl} alt={book.title} className="max-w-full" /> : <span>No Cover</span>}
        </div>

        <div className="w-full md:w-2/3">
          <span className="text-sm text-gray-500 uppercase tracking-widest">{book.categoryName}</span>
          <h1 className="text-3xl font-bold mt-1 mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-4">by {book.author}</p>
          <div className="text-3xl font-bold text-gray-900 mb-6">{formatCurrency(book.price)}</div>
          
          <p className="text-gray-700 mb-6">{book.description || 'No description available for this book.'}</p>
          
          <div className="text-sm text-gray-600 mb-6 grid grid-cols-2 gap-2">
            <div><span className="font-bold">ISBN:</span> {book.isbn || 'N/A'}</div>
            <div><span className="font-bold">Year:</span> {book.publicationYear || 'N/A'}</div>
            <div>
              <span className="font-bold">Stock:</span>{' '}
              <span className={book.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}>
                {book.stockQuantity > 0 ? `${book.stockQuantity} available` : 'Out of stock'}
              </span>
            </div>
          </div>

          {book.stockQuantity > 0 && (
            <div className="flex gap-4">
              <input 
                type="number" 
                min="1" 
                max={book.stockQuantity} 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="border rounded w-20 px-3 py-2 text-center" 
              />
              <button 
                onClick={addToCart}
                className={`px-6 py-2 rounded text-white font-bold ${added ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
