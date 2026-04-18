import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';

/**
 * BookCard component displaying a book in a grid layout.
 * Shows cover image, title, author, price, and stock status.
 */
const BookCard = ({ book }) => {
  return (
    <Link to={`/books/${book.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative h-56 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center overflow-hidden">
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div className={`${book.coverImageUrl ? 'hidden' : 'flex'} flex-col items-center justify-center text-primary-400`}>
            <span className="text-5xl mb-2">📖</span>
            <span className="text-xs font-medium">{book.categoryName}</span>
          </div>

          {/* Stock Badge */}
          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
            book.stockQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {book.stockQuantity > 0 ? `${book.stockQuantity} in stock` : 'Out of stock'}
          </div>
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="mb-1">
            <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">{book.categoryName}</span>
          </div>
          <h3 className="text-lg font-semibold text-dark-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-dark-500 mb-3">{book.author}</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-primary-700">{formatCurrency(book.price)}</span>
            <span className="text-xs text-dark-400">{book.publicationYear}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
