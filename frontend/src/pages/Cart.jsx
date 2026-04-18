import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { formatCurrency } from '../utils/formatCurrency';

/**
 * Cart page displaying items stored in localStorage.
 * Supports quantity update and item removal.
 */
const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (bookId, newQty) => {
    if (newQty < 1) return;
    const updated = cart.map(item =>
      item.id === bookId ? { ...item, quantity: newQty } : item
    );
    updateCart(updated);
  };

  const removeItem = (bookId) => {
    updateCart(cart.filter(item => item.id !== bookId));
  };

  const clearCart = () => updateCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-dark-900 mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-6xl">🛒</span>
          <h3 className="text-xl font-semibold text-dark-700 mt-4">Your cart is empty</h3>
          <p className="text-dark-500 mt-2">Add some books to get started!</p>
          <Link to="/books" className="inline-block mt-6 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors">
            Browse Books
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {cart.map(item => (
              <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-dark-600">Items ({cart.reduce((sum, i) => sum + i.quantity, 0)})</span>
              <span className="text-2xl font-bold text-dark-900">{formatCurrency(total)}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={clearCart}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-dark-600 hover:bg-gray-50 font-medium transition-colors">
                Clear Cart
              </button>
              <button onClick={() => navigate('/checkout')}
                className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg">
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
