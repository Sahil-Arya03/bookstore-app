import { formatCurrency } from '../utils/formatCurrency';

/**
 * CartItem component displaying a single item in the shopping cart.
 * Includes quantity controls and remove button.
 */
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Book Cover */}
      <div className="w-20 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {item.coverImageUrl ? (
          <img src={item.coverImageUrl} alt={item.title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-3xl">📖</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-dark-900 truncate">{item.title}</h3>
        <p className="text-sm text-dark-500">{item.author}</p>
        <p className="text-primary-700 font-bold mt-1">{formatCurrency(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-dark-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          −
        </button>
        <span className="w-8 text-center font-semibold text-dark-800">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-dark-700 font-bold transition-colors flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[80px]">
        <p className="font-bold text-dark-900">{formatCurrency(item.price * item.quantity)}</p>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
        title="Remove item"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;
