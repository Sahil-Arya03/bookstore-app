import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';

function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="block border rounded p-4 hover:shadow-lg bg-white">
      <div className="h-48 bg-gray-100 flex items-center justify-center mb-4 overflow-hidden rounded">
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.title} className="max-h-full object-cover" />
        ) : (
          <span className="text-gray-400">No Cover</span>
        )}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2 truncate">{book.author}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-blue-600">{formatCurrency(book.price)}</span>
          <span className={`text-xs px-2 py-1 rounded ${book.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {book.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
